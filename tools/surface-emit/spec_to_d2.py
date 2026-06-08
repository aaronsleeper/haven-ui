#!/usr/bin/env python3
"""spec_to_d2.py — emit D2 source from a slides-emit spec dict.

Consumes the output of `spec_from_markdown.py:spec_from_use_case()`. The parser
is the durable work; this adapter is the swappable renderer (per Plan B13,
Decision 2026-06-04q).

Mapping decisions:
  - Lanes → D2 containers with `direction: right` (nodes flow within lane);
    root `direction: down` stacks lanes top-to-bottom as true horizontal bands.
  - Modifier → per-node style (palette from Haven brand canon v2):
        attestation-gate  → primary-teal 3px solid border, sand-50 fill, italic
        uncertain-tbd     → amber dashed border, amber-50 fill
        uncertain-gap     → red dotted border, red-50 fill
        uncertain-assumption → sand-700 dashed border, sand-100 fill
        ghost (low emphasis) → sand-200 1px border, white fill, italic, muted text
        default           → sand-200 border, white fill
  - Edge style → stroke color + dash:
        emphasis  → primary-teal 2px solid
        muted     → sand-200 1px dashed (timeout / deferred / declined paths)
        default   → sand-700 1px solid
  - Callouts (above-node uncertainty messages) → embedded inline as the
    node label's final line in monospace-friendly brackets. D2 doesn't have
    a native above-node-callout primitive; embedding keeps the structural
    signal inside the node where the renderer's layout engine can account
    for it (vs. a separate "callout node" that fights auto-layout).
  - Watcher annotations → embedded as a final ▲ line in the node label.

Honest limits:
  - D2's auto-layout with `direction: down` + per-lane `direction: right`
    produces TRUE swim-lane structure (horizontal bands), but the flow within
    each lane may stack vertically when only 1-2 nodes are present. For dense
    workflows (4+ nodes in a lane) flow runs horizontally as intended.
  - Callouts-as-node-tail-line means a node with TBD + watcher has 4-5 lines
    of label; D2 sizes the box to fit. Trade-off vs. above-node callouts
    that would either collide with the previous lane or require manual coords.
  - No native page-chrome (title, draft marker, caption) — the renderer
    composes those into a wrapper SVG step, or the consumer wraps via HTML.

Usage:
    python3 spec_to_d2.py <use-case-dir>           # prints D2 to stdout
    python3 spec_to_d2.py <use-case-dir> out.d2    # writes D2 to file
"""

import sys
from pathlib import Path

from spec_from_markdown import spec_from_use_case


# --- style tables ---

NODE_STYLE = {
    "attestation-gate": {
        "stroke": "#0D322D",
        "stroke-width": 3,
        "fill": "#f8f4ec",
        "font-color": "#0D322D",
        "italic": True,
    },
    "uncertain-tbd": {
        "stroke": "#b8860b",
        "stroke-dash": 5,
        "stroke-width": 2,
        "fill": "#fdf6e3",
        "font-color": "#25211D",
    },
    "uncertain-gap": {
        "stroke": "#c0392b",
        "stroke-dash": 2,
        "stroke-width": 2,
        "fill": "#fadbd8",
        "font-color": "#25211D",
    },
    "uncertain-assumption": {
        "stroke": "#5a544e",
        "stroke-dash": 5,
        "stroke-width": 2,
        "fill": "#efe9da",
        "font-color": "#25211D",
    },
    "default": {
        "stroke": "#cfcac2",
        "stroke-width": 1,
        "fill": "#ffffff",
        "font-color": "#25211D",
    },
    # `low emphasis` from spec → ghost style. spec_from_markdown returns
    # "default" for emphasis: low, so we don't see this directly today.
    "ghost": {
        "stroke": "#cfcac2",
        "stroke-width": 1,
        "fill": "#ffffff",
        "italic": True,
        "font-color": "#5a544e",
    },
}

EDGE_STYLE = {
    "default":  {"stroke": "#5a544e", "stroke-width": 1},
    "emphasis": {"stroke": "#0D322D", "stroke-width": 2},
    "muted":    {"stroke": "#cfcac2", "stroke-width": 1, "stroke-dash": 4},
}


# --- helpers ---

def _esc(s):
    """Escape a string for embedding in a double-quoted D2 string."""
    return str(s).replace("\\", "\\\\").replace('"', '\\"')


def _node_label(node):
    """Compose multi-line label: title + detail + callout + watcher."""
    lines = [node["title"]]
    for d in node.get("detail") or []:
        if d:
            lines.append(d)
    callout = node.get("callout")
    if callout:
        lines.append(callout["text"])
    watcher = node.get("watcher")
    if watcher:
        lines.append(f"▲ watches: {watcher}")
    return "\\n".join(_esc(line) for line in lines)


def _emit_style_props(style_dict, indent="    "):
    out = []
    for k, v in style_dict.items():
        if isinstance(v, bool):
            out.append(f"{indent}style.{k}: {str(v).lower()}")
        elif isinstance(v, str):
            out.append(f"{indent}style.{k}: \"{v}\"")
        else:
            out.append(f"{indent}style.{k}: {v}")
    return out


# --- main ---

def spec_to_d2(spec):
    """Render a slides-emit spec dict as D2 source string."""
    out = []

    out.append(f"# {spec.get('title', 'Haven workflow')}")
    if spec.get("draft_marker"):
        out.append(f"# {spec['draft_marker']}")
    out.append("")

    # ELK does orthogonal edge routing natively. Dagre produces diagonals
    # when nodes stack vertically across lanes, which read as suboptimal in
    # swim-lane diagrams. Self-contained in source — no CLI flag needed.
    out.append("vars: {")
    out.append("  d2-config: {")
    out.append("    layout-engine: elk")
    out.append("  }")
    out.append("}")
    out.append("")

    # Vertical-stack lanes; horizontal flow within each lane.
    out.append("direction: down")
    out.append("")

    # Map lane label → safe D2 identifier
    lane_ids = {}
    for lane in spec["lanes"]:
        ident = lane["label"].replace(" ", "_").replace("-", "_").upper()
        lane_ids[lane["label"]] = ident

    # Assign each node to its lane by y-coordinate (closest lane match).
    # The spec output from spec_from_markdown places node["y"] using the
    # lane's y_center; here we resolve which lane each node belongs to.
    lane_by_id = {}
    for lane in spec["lanes"]:
        # Each node's y was computed as lane_y - h/2; so y_center = y + h/2.
        # We round-trip by checking which lane's y is nearest.
        lane_by_id[lane["label"]] = lane["y"]

    nodes_by_lane = {lane["label"]: [] for lane in spec["lanes"]}
    for node in spec["nodes"]:
        node_y_center = node["y"] + node["h"] / 2
        nearest_lane = min(spec["lanes"], key=lambda L: abs(L["y"] - node_y_center))
        nodes_by_lane[nearest_lane["label"]].append(node)

    # Sort nodes within each lane by x so the inside-lane flow is L→R.
    for lane_label in nodes_by_lane:
        nodes_by_lane[lane_label].sort(key=lambda n: n["x"])

    # Skip empty lanes (no nodes assigned) — they're not part of THIS use case.
    populated_lanes = [L for L in spec["lanes"] if nodes_by_lane[L["label"]]]

    # Force lane ORDER (top-to-bottom = spec declaration order = AGENT first
    # by convention) via D2 grid layout. Without this, D2's auto-layout may
    # reorder containers based on edge density. grid_rows = N stacks N rows;
    # grid_gap controls inter-lane spacing.
    if len(populated_lanes) > 1:
        out.append(f"grid-rows: {len(populated_lanes)}")
        out.append(f"grid-gap: 40")
        out.append("")

    # Emit lanes in spec declaration order
    for lane in populated_lanes:
        lid = lane_ids[lane["label"]]
        out.append(f"{lid}: {{")
        out.append(f"  label: \"{_esc(lane['label'])}\"")
        out.append(f"  direction: right")
        out.append(f"  style.fill: \"#fbf8f1\"")
        out.append(f"  style.stroke: \"#cfcac2\"")
        out.append(f"  style.font-size: 14")
        out.append(f"  style.bold: true")
        out.append(f"  style.border-radius: 4")
        out.append("")
        for node in nodes_by_lane[lane["label"]]:
            nid = node["id"].replace("-", "_")
            label = _node_label(node)
            out.append(f"  {nid}: \"{label}\" {{")
            mod = node.get("modifier", "default")
            style = NODE_STYLE.get(mod, NODE_STYLE["default"])
            out.extend(_emit_style_props(style, indent="    "))
            out.append(f"    style.border-radius: 8")
            out.append("  }")
        out.append("}")
        out.append("")

    # Build a lookup from node id (slug) → fully-qualified D2 path
    node_path = {}
    for lane in spec["lanes"]:
        lid = lane_ids[lane["label"]]
        for node in nodes_by_lane[lane["label"]]:
            node_path[node["id"]] = f"{lid}.{node['id'].replace('-', '_')}"

    # Emit edges
    for edge in spec["edges"]:
        src = node_path.get(edge["from"])
        dst = node_path.get(edge["to"])
        if not src or not dst:
            continue
        label = edge.get("label") or ""
        style = EDGE_STYLE.get(edge.get("style", "default"), EDGE_STYLE["default"])
        if label:
            out.append(f"{src} -> {dst}: \"{_esc(label)}\" {{")
        else:
            out.append(f"{src} -> {dst}: {{")
        out.extend(_emit_style_props(style, indent="  "))
        out.append("}")

    return "\n".join(out) + "\n"


def main():
    if len(sys.argv) < 2:
        print("Usage: spec_to_d2.py <use-case-dir> [out.d2]", file=sys.stderr)
        sys.exit(64)
    use_case_dir = Path(sys.argv[1])
    spec = spec_from_use_case(use_case_dir)
    d2 = spec_to_d2(spec)
    if len(sys.argv) >= 3:
        Path(sys.argv[2]).write_text(d2)
        print(f"wrote {sys.argv[2]}", file=sys.stderr)
    else:
        sys.stdout.write(d2)


if __name__ == "__main__":
    main()
