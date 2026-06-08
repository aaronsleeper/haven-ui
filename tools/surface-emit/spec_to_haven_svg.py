#!/usr/bin/env python3
"""spec_to_haven_svg.py — emit haven-primitive rendered-diagram.html from a use-case spec.

Inputs (per use-case directory):
  manifest.md + diagram.md + fragments/NN-*.md  (parsed via spec_from_markdown.py)

Outputs (default):
  <use-case-dir>/rendered-diagram-auto.html   (use --inplace to overwrite rendered-diagram.html)

Visual contract (the renderer enforces these by construction):
  - Orthogonal-only edge routing — segments are horizontal or vertical; no diagonals
  - Corner arcs at direction changes (radius 24 — iter #3 locked geometry)
  - Stroked chevron arrowheads (M 0 0 L 13 7 L 0 14, stroke-based with round caps; iter #3 marker direction)
  - Per-variant text-color family matching (sand-text on sand surfaces; teal-text only on teal surfaces)
  - Same inline candidate-modifier-class block pattern as hand-authored bundles (Tier 1 PL promotion still pending)

Honest limits (first cut):
  - Edge routing uses a simple Manhattan algorithm: pick the exit/enter sides by relative
    position, route via a single elbow when needed, two elbows for backward edges. Routes
    don't try to avoid node-collisions; for the 6 shipped use cases the source layouts
    were authored to leave routing space, so this is sufficient.
  - Caption position is hard-coded to bottom-center of viewbox; long-desc block reuses the
    hand-authored structure.
  - Watcher annotation renders as a small label inside the box (same as hand-authored).
"""

import sys
from pathlib import Path

import yaml

# Local import of the existing parser
sys.path.insert(0, str(Path(__file__).resolve().parent))
from spec_from_markdown import spec_from_use_case, _parse_yaml_doc


def _load_diagram_overrides(use_case_dir):
    """Read diagram.md directly to extract hand-tuned overrides that spec_from_markdown
    doesn't surface: uncertainty_visualization (callout text + modifier per node),
    watcher_annotations (per-node watcher label), emphasis_treatment (per-emphasis-tier
    modifier table). These are authored intent the renderer should honor over derived.
    """
    diagram = _parse_yaml_doc(Path(use_case_dir) / "diagram.md")
    callouts = {}
    for entry in diagram.get("uncertainty_visualization") or []:
        target = entry.get("target")
        if not target:
            continue
        callouts[target] = {
            "text": entry.get("callout"),
            "modifier_class": entry.get("modifier"),  # full class name like "diagram-box--uncertain-tbd"
        }
    watchers = {}
    for entry in diagram.get("watcher_annotations") or []:
        target = entry.get("target")
        if not target:
            continue
        watchers[target] = entry.get("label") or f"▲ watches: {entry.get('watcher_role', '')}"
    emphasis_table = {}
    for tier, treatment in (diagram.get("emphasis_treatment") or {}).items():
        emphasis_table[tier] = {
            "modifier_class": treatment.get("modifier"),
            "typography": treatment.get("typography"),
        }
    return {
        "callouts": callouts,
        "watchers": watchers,
        "emphasis_table": emphasis_table,
    }


def _apply_overrides(spec, overrides, use_case_dir):
    """Merge diagram.md hand-tuned content into the spec dict, preferring hand-tuned
    over derived. Also picks up emphasis: low → ghost modifier mapping that
    spec_from_markdown.py doesn't surface.
    """
    # Re-derive modifier per node when emphasis_treatment specifies one
    diagram = _parse_yaml_doc(Path(use_case_dir) / "diagram.md")
    placement = diagram.get("node_placement") or {}
    emphasis_per_node = {nid: p.get("emphasis", "default") for nid, p in placement.items()}

    for node in spec["nodes"]:
        nid = node["id"]

        # Callout: prefer diagram.md's hand-tuned text
        callout_override = overrides["callouts"].get(nid)
        if callout_override and callout_override["text"]:
            # Derive callout type from the modifier class for color routing
            mc = callout_override.get("modifier_class") or ""
            if "tbd" in mc.lower():
                ctype = "critical" if "critical" in callout_override["text"].lower() else "tbd"
            elif "gap" in mc.lower():
                ctype = "gap"
            elif "assumption" in mc.lower():
                ctype = "assumption"
            else:
                ctype = "tbd"
            node["callout"] = {"text": callout_override["text"], "type": ctype}

        # Watcher: prefer diagram.md's hand-tuned label
        watcher_override = overrides["watchers"].get(nid)
        if watcher_override:
            node["_watcher_label"] = watcher_override  # raw label string with arrow
        elif node.get("watcher"):
            node["_watcher_label"] = f"▲ watches: {node['watcher']}"

        # Emphasis-derived modifier (closes the ghost gap)
        emp = emphasis_per_node.get(nid, "default")
        if emp == "low":
            node["modifier"] = "ghost"
        # emp == "high" → spec_from_markdown already set modifier = "attestation-gate"
        # emp == "default" → spec_from_markdown set modifier from uncertainty

    return spec


# ─────────────────────────────────────────────────────────────────────────────
# Color & style tables — derived from the existing rendered-diagram.html corpus
# and Aaron's 2026-06-06 finding #5 (color-family rule)
# ─────────────────────────────────────────────────────────────────────────────

# Per-modifier visual treatment. Background + border are CSS-driven (the inline
# candidate-modifier-class block applies them); text fill is computed here so
# the family-match rule is enforced regardless of CSS drift.
MODIFIER_TEXT_FILL = {
    "default": "var(--color-text-normal, #0d322d)",
    "attestation-gate": "var(--color-text-normal, #0d322d)",  # title uses teal; body uses sand
    "uncertain-tbd": "var(--color-warm-amber-900, #4a3514)",  # amber family
    "uncertain-assumption": "var(--color-warm-sand-900, #2d2820)",  # sand family
    "uncertain-gap": "var(--color-red-900, #5a1d1c)",  # red family
    "ghost": "var(--color-text-muted, #555)",
}

# Inline styling for ghost variant (per diagram.md emphasis_treatment.low) — muted
# serif-italic, subtle border. Not yet a registered modifier class; inlined here.
GHOST_BOX_FILL = "var(--color-surface-subtle, #faf6ee)"
GHOST_BOX_STROKE = "var(--color-border-muted, #d6cdbe)"

CALLOUT_CLASS_BY_TYPE = {
    "tbd": "diagram-tbd-callout",
    "critical": "diagram-tbd-callout diagram-tbd-callout--critical",
    "gap": "diagram-tbd-callout diagram-tbd-callout--gap",
    "assumption": "diagram-tbd-callout diagram-tbd-callout--assumption",
}

EDGE_STROKE = {
    "default": ("var(--color-arrow-default, #8c7c5e)", 1.5, None),
    "emphasis": ("var(--color-primary-700, #1e5149)", 2.0, None),
    "muted": ("var(--color-arrow-muted, #b8a988)", 1.0, "4 3"),
}

CORNER_RADIUS = 24  # iter #3 locked


# ─────────────────────────────────────────────────────────────────────────────
# Orthogonal routing
# ─────────────────────────────────────────────────────────────────────────────

def _side_centers(node):
    """Return (top, right, bottom, left) midpoint coords for a node bbox."""
    x, y, w, h = node["x"], node["y"], node["w"], node["h"]
    return {
        "top":    (x + w / 2, y),
        "right":  (x + w,     y + h / 2),
        "bottom": (x + w / 2, y + h),
        "left":   (x,         y + h / 2),
    }


def _pick_sides(src, tgt):
    """Pick exit side of src + enter side of tgt based on relative position.

    Swim-lane convention: prefer horizontal flow within lane (right→left) and
    vertical flow across lanes (bottom→top going down; top→bottom going up).
    Backward edges (target.cx < source.cx) route via bottom→bottom-with-U-bend.
    """
    src_cx = src["x"] + src["w"] / 2
    src_cy = src["y"] + src["h"] / 2
    tgt_cx = tgt["x"] + tgt["w"] / 2
    tgt_cy = tgt["y"] + tgt["h"] / 2

    # Same lane (roughly same y), target to right → horizontal flow
    if abs(src_cy - tgt_cy) < 30 and tgt_cx > src_cx:
        return "right", "left"

    # Backward edge: target is to the left → U-bend below
    if tgt_cx < src_cx:
        # Source exits bottom (or top if target above), routes around, enters
        # target from same side. Picked bottom-bend as the convention.
        if tgt_cy < src_cy:
            return "top", "right"  # backwards + up → exit top, enter right
        return "bottom", "right"   # backwards + down or same → exit bottom, enter right

    # Cross-lane: vertical-then-horizontal
    if tgt_cy > src_cy:  # target below
        return "bottom", "left" if tgt_cx > src_cx else "right"
    else:  # target above
        return "top", "left" if tgt_cx > src_cx else "right"


def _compute_route(src, tgt):
    """Return list of waypoints [(x, y), ...] that compose an orthogonal path."""
    sides = _side_centers(src)
    src_side, tgt_side = _pick_sides(src, tgt)
    sx, sy = sides[src_side]
    tides = _side_centers(tgt)
    tx, ty = tides[tgt_side]

    # Straight-line cases
    if abs(sy - ty) < 0.5:
        return [(sx, sy), (tx, ty)]
    if abs(sx - tx) < 0.5:
        return [(sx, sy), (tx, ty)]

    # Single-elbow cases
    # If src exits horizontally (right/left), turn at midpoint x then go vertical to target y, then to target
    if src_side in ("right", "left"):
        mid_x = (sx + tx) / 2
        return [(sx, sy), (mid_x, sy), (mid_x, ty), (tx, ty)]
    # If src exits vertically (top/bottom), turn at midpoint y then go horizontal to target x, then to target
    else:
        mid_y = (sy + ty) / 2
        return [(sx, sy), (sx, mid_y), (tx, mid_y), (tx, ty)]


def _path_with_arcs(waypoints, radius=CORNER_RADIUS):
    """Convert a sequence of orthogonal waypoints into an SVG path string with
    rounded corners at each direction change.

    For each interior corner, back off by `radius` along each adjacent segment
    and emit `A radius radius 0 0 sweep x y` between them.
    """
    if len(waypoints) < 2:
        return ""
    if len(waypoints) == 2:
        x1, y1 = waypoints[0]
        x2, y2 = waypoints[1]
        return f"M {x1:.1f} {y1:.1f} L {x2:.1f} {y2:.1f}"

    parts = []
    parts.append(f"M {waypoints[0][0]:.1f} {waypoints[0][1]:.1f}")

    for i in range(1, len(waypoints) - 1):
        prev_x, prev_y = waypoints[i - 1]
        cur_x, cur_y = waypoints[i]
        next_x, next_y = waypoints[i + 1]

        # Segment lengths
        in_len = ((cur_x - prev_x) ** 2 + (cur_y - prev_y) ** 2) ** 0.5
        out_len = ((next_x - cur_x) ** 2 + (next_y - cur_y) ** 2) ** 0.5
        r = min(radius, in_len / 2, out_len / 2)

        # Back off along incoming segment
        in_dx = (cur_x - prev_x) / max(in_len, 1)
        in_dy = (cur_y - prev_y) / max(in_len, 1)
        back_x = cur_x - in_dx * r
        back_y = cur_y - in_dy * r

        # Forward along outgoing segment
        out_dx = (next_x - cur_x) / max(out_len, 1)
        out_dy = (next_y - cur_y) / max(out_len, 1)
        fwd_x = cur_x + out_dx * r
        fwd_y = cur_y + out_dy * r

        # Determine arc sweep direction (1 = clockwise, 0 = counter)
        cross = in_dx * out_dy - in_dy * out_dx
        sweep = 1 if cross > 0 else 0

        parts.append(f"L {back_x:.1f} {back_y:.1f}")
        parts.append(f"A {r:.1f} {r:.1f} 0 0 {sweep} {fwd_x:.1f} {fwd_y:.1f}")

    # Final segment to last waypoint
    parts.append(f"L {waypoints[-1][0]:.1f} {waypoints[-1][1]:.1f}")
    return " ".join(parts)


def _label_position(waypoints):
    """Pick a midpoint along the path for the edge label."""
    # Use the longest segment's midpoint
    best_mid = None
    best_len = 0
    for i in range(len(waypoints) - 1):
        x1, y1 = waypoints[i]
        x2, y2 = waypoints[i + 1]
        length = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
        if length > best_len:
            best_len = length
            best_mid = ((x1 + x2) / 2, (y1 + y2) / 2)
    return best_mid or (waypoints[0][0], waypoints[0][1] - 8)


# ─────────────────────────────────────────────────────────────────────────────
# SVG emission
# ─────────────────────────────────────────────────────────────────────────────

INLINE_STYLE_BLOCK = """\
<style>
/* ─────────────────────────────────────────────────────────────────────────
   CANDIDATE MODIFIER CLASSES — pending promotion to components.css.
   Pattern: small modifier additions to existing diagram-* primitives.
   Promotion path: 4-expert review panel (brand-fidelity weighted) → components.css edit.
   ──────────────────────────────────────────────────────────────────────── */
.diagram-box--attestation-gate .diagram-box-shape {
  stroke: var(--color-primary-700, #1e5149);
  stroke-width: 2.5;
  stroke-dasharray: none;
  fill: var(--color-surface-card, #ffffff);
}
.diagram-box--uncertain-tbd .diagram-box-shape {
  stroke-dasharray: 6 4;
  stroke: var(--color-warm-amber-500, #aa8232);
  fill: var(--color-warm-amber-50, #f8f1e3);
}
.diagram-box--uncertain-assumption .diagram-box-shape {
  stroke-dasharray: 3 2;
  stroke: var(--color-warm-sand-500, #7a6f5a);
  fill: var(--color-warm-sand-50, #faf6ee);
}
.diagram-box--uncertain-gap .diagram-box-shape {
  stroke-dasharray: 1 3;
  stroke: var(--color-red-500, #c13c3b);
  fill: var(--color-red-50, #ffedea);
}
.diagram-box-watcher-label {
  font-size: 9px;
  font-family: var(--font-mono, 'Source Code Pro', monospace);
  fill: var(--color-text-muted, #555);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.diagram-tbd-callout {
  font-size: 10px;
  font-family: var(--font-mono, 'Source Code Pro', monospace);
  fill: var(--color-warm-amber-700, #735311);
  letter-spacing: 0.05em;
  font-weight: 600;
}
.diagram-tbd-callout--critical { fill: var(--color-red-700, #8a2a29); }
.diagram-tbd-callout--gap { fill: var(--color-red-600, #a8332f); }
.diagram-tbd-callout--assumption { fill: var(--color-warm-sand-700, #4d4538); }

/* Page chrome (per-rendering only) */
body {
  background: var(--color-surface-page, #fbfaf8);
  padding: 32px;
  font-family: var(--font-sans, 'Source Sans 3', sans-serif);
  color: var(--color-text-normal, #0d322d);
}
.diagram-frame-wrapper { max-width: 1180px; margin: 0 auto; }
.diagram-header { margin-bottom: 24px; }
.diagram-header h1 {
  font-family: var(--font-serif, 'Lora', serif);
  font-size: 28px;
  font-weight: 500;
  margin: 0 0 6px 0;
  color: var(--color-text-normal, #0d322d);
}
.diagram-header .draft-marker {
  font-family: var(--font-mono, 'Source Code Pro', monospace);
  color: var(--color-warm-amber-700, #735311);
  font-size: 12px;
  letter-spacing: 0.05em;
}
.diagram-meta {
  font-size: 13px;
  color: var(--color-text-muted, #555);
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-muted, #e8dfca);
}
.diagram-long-desc { display: none; }
</style>"""


def _marker_defs():
    """Stroked chevron markers per iter #3."""
    return """\
  <defs class="diagram-marker-defs">
    <marker id="arrow-end" viewBox="0 0 14 14" refX="12" refY="7" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto" aria-hidden="true">
      <path d="M 0 0 L 13 7 L 0 14" fill="none" stroke="var(--color-arrow-default, #8c7c5e)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="arrow-end-emphasis" viewBox="0 0 14 14" refX="12" refY="7" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto" aria-hidden="true">
      <path d="M 0 0 L 13 7 L 0 14" fill="none" stroke="var(--color-primary-700, #1e5149)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
    <marker id="arrow-end-muted" viewBox="0 0 14 14" refX="12" refY="7" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto" aria-hidden="true">
      <path d="M 0 0 L 13 7 L 0 14" fill="none" stroke="var(--color-arrow-muted, #b8a988)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>"""


def _render_lanes(lanes, viewbox_w):
    parts = []
    for lane in lanes:
        label = lane["label"]
        y = lane["y"]
        # Lane label at far left; horizontal divider line
        parts.append(f'''  <g class="diagram-lane">
    <text class="diagram-lane-label" x="12" y="{y:.0f}" font-family="var(--font-mono, 'Source Code Pro', monospace)" font-size="11" font-weight="600" letter-spacing="0.12em" fill="var(--color-text-muted, #555)">{label}</text>
    <line x1="80" y1="{y + 15:.0f}" x2="{viewbox_w - 20:.0f}" y2="{y + 15:.0f}" stroke="var(--color-border-muted, #e8dfca)" stroke-width="1"/>
  </g>''')
    return "\n".join(parts)


def _render_node(node):
    """Render one node as a haven diagram-box group."""
    x, y, w, h = node["x"], node["y"], node["w"], node["h"]
    cx = x + w / 2
    modifier = node.get("modifier", "default")
    title = node.get("title", "")
    detail_lines = node.get("detail", [])
    watcher_label = node.get("_watcher_label")

    classes = ["diagram-box"]
    if modifier and modifier != "default":
        classes.append(f"diagram-box--{modifier}")
    class_attr = " ".join(classes)

    text_fill = MODIFIER_TEXT_FILL.get(modifier, MODIFIER_TEXT_FILL["default"])

    parts = [f'  <g class="{class_attr}">']

    # Ghost variant: inline subtle fill + muted stroke since no PL class exists yet
    if modifier == "ghost":
        parts.append(f'    <rect class="diagram-box-shape" x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="4" ry="4" fill="{GHOST_BOX_FILL}" stroke="{GHOST_BOX_STROKE}" stroke-width="1"/>')
    else:
        parts.append(f'    <rect class="diagram-box-shape" x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" rx="4" ry="4"/>')

    # Title — Lora italic teal for attestation-gate; Lora italic muted for ghost; sans for others
    if modifier == "attestation-gate":
        title_y = y + 28
        parts.append(f'    <text x="{cx:.0f}" y="{title_y:.0f}" font-family="var(--font-serif, \'Lora\', serif)" font-size="13" font-style="italic" font-weight="500" fill="var(--color-primary-700, #1e5149)" text-anchor="middle">{title}</text>')
        text_start_y = title_y + 22
    elif modifier == "ghost":
        title_y = y + 30
        parts.append(f'    <text x="{cx:.0f}" y="{title_y:.0f}" font-family="var(--font-serif, \'Lora\', serif)" font-size="12" font-style="italic" font-weight="500" fill="{text_fill}" text-anchor="middle">{title}</text>')
        text_start_y = title_y + 18
    else:
        title_y = y + 30
        parts.append(f'    <text x="{cx:.0f}" y="{title_y:.0f}" font-family="var(--font-sans, \'Source Sans 3\', sans-serif)" font-size="13" font-weight="600" fill="{text_fill}" text-anchor="middle">{title}</text>')
        text_start_y = title_y + 18

    # Detail lines (one per detail entry, split on " — " if present for sub-line)
    line_y = text_start_y
    detail_text_fill = "var(--color-text-muted, #555)" if modifier == "ghost" else text_fill
    detail_font_size = 10 if modifier == "ghost" else 11
    for line in detail_lines:
        # Split a single detail string on " — " into multiple text rows for tighter layout
        for sub in str(line).split(" — "):
            parts.append(f'    <text x="{cx:.0f}" y="{line_y:.0f}" font-family="var(--font-sans, \'Source Sans 3\', sans-serif)" font-size="{detail_font_size}" fill="{detail_text_fill}" text-anchor="middle">{sub.strip()}</text>')
            line_y += 14

    # Watcher annotation (uses pre-merged hand-tuned label from diagram.md)
    if watcher_label:
        watcher_y = y + h - 8
        parts.append(f'    <text class="diagram-box-watcher-label" x="{cx:.0f}" y="{watcher_y:.0f}" text-anchor="middle">{watcher_label}</text>')

    parts.append("  </g>")
    return "\n".join(parts)


def _render_callouts(nodes):
    """Render all node callouts with collision avoidance (stagger y when adjacent
    on x-axis would overlap horizontally)."""
    # Collect callouts as (node, x_center, half_width_estimate)
    items = []
    char_px = 5.5  # ~px per char at font-size 10 monospace
    for n in nodes:
        c = n.get("callout")
        if not c or not c.get("text"):
            continue
        text = c["text"]
        cx = n["x"] + n["w"] / 2
        half_w = (len(text) * char_px) / 2
        items.append({
            "node": n, "callout": c, "cx": cx, "half_w": half_w,
            "left": cx - half_w, "right": cx + half_w,
            "y_offset": 14,  # default above-box gap
        })

    # Sort by x, then push up when overlapping
    items.sort(key=lambda it: it["left"])
    for i in range(1, len(items)):
        cur = items[i]
        # Check against any previously-laid item that shares a row
        for prev in items[:i]:
            if prev["y_offset"] != cur["y_offset"]:
                continue
            # Horizontal overlap test (8px buffer)
            if cur["left"] < prev["right"] + 8:
                cur["y_offset"] = prev["y_offset"] + 14
                # Re-check vs all previous at the new row
                break

    parts = []
    for it in items:
        n = it["node"]
        c = it["callout"]
        y = n["y"] - it["y_offset"]
        cls = CALLOUT_CLASS_BY_TYPE.get(c.get("type", "tbd"), "diagram-tbd-callout")
        parts.append(f'  <text class="{cls}" x="{it["cx"]:.0f}" y="{y:.0f}" text-anchor="middle">{c["text"]}</text>')
    return "\n".join(parts)


def _render_edges(edges, node_by_id):
    """Render all edges with collision avoidance on labels (offset labels when
    multiple edges share a source or target node)."""
    # First pass: compute path + label position per edge
    edge_renders = []
    for edge in edges:
        src = node_by_id[edge["from"]]
        tgt = node_by_id[edge["to"]]
        style = edge.get("style", "default")
        waypoints = _compute_route(src, tgt)
        path_d = _path_with_arcs(waypoints, radius=CORNER_RADIUS)
        stroke, width, dash = EDGE_STROKE[style]
        marker_id = "arrow-end-emphasis" if style == "emphasis" else ("arrow-end-muted" if style == "muted" else "arrow-end")
        label = edge.get("label", "").strip()
        lx, ly = _label_position(waypoints) if label else (None, None)
        edge_renders.append({
            "edge": edge, "path_d": path_d, "stroke": stroke, "width": width,
            "dash": dash, "marker_id": marker_id, "label": label, "lx": lx, "ly": ly,
        })

    # Second pass: collision-avoid labels. Sort by (lx, ly). For each label,
    # check overlap vs prior labels; if collision, push down by 14px.
    label_items = [r for r in edge_renders if r["label"]]
    char_px = 5.5
    for r in label_items:
        r["label_half_w"] = (len(r["label"]) * char_px) / 2
        r["label_y_offset"] = 6  # default above the segment midpoint
    label_items.sort(key=lambda r: (r["lx"], r["ly"]))
    for i in range(1, len(label_items)):
        cur = label_items[i]
        cur_left = cur["lx"] - cur["label_half_w"]
        cur_right = cur["lx"] + cur["label_half_w"]
        for prev in label_items[:i]:
            if cur["label_y_offset"] != prev["label_y_offset"]:
                continue
            prev_left = prev["lx"] - prev["label_half_w"]
            prev_right = prev["lx"] + prev["label_half_w"]
            cur_y = cur["ly"] - cur["label_y_offset"]
            prev_y = prev["ly"] - prev["label_y_offset"]
            # Overlap test: x-axis bboxes overlap AND y-positions within 12px
            if cur_left < prev_right + 8 and cur_right > prev_left - 8 and abs(cur_y - prev_y) < 12:
                cur["label_y_offset"] = prev["label_y_offset"] + 14
                break

    # Emit
    parts = []
    for r in edge_renders:
        dash_attr = f' stroke-dasharray="{r["dash"]}"' if r["dash"] else ""
        parts.append(f'  <path d="{r["path_d"]}" fill="none" stroke="{r["stroke"]}" stroke-width="{r["width"]}" stroke-linecap="round" stroke-linejoin="round"{dash_attr} marker-end="url(#{r["marker_id"]})" aria-hidden="true"/>')
        if r["label"]:
            ly_final = r["ly"] - r["label_y_offset"]
            parts.append(f'  <text x="{r["lx"]:.0f}" y="{ly_final:.0f}" font-family="var(--font-mono, \'Source Code Pro\', monospace)" font-size="10" fill="var(--color-text-muted, #555)" text-anchor="middle">{r["label"]}</text>')
    return "\n".join(parts)


def _compute_viewbox(spec):
    """Compute viewBox dimensions from the lanes + nodes extents (account for
    nodes that extend below the bottom lane's center, plus caption + callout
    padding above and below)."""
    # Width: rightmost node-end + 80 padding
    max_x = 0
    for n in spec["nodes"]:
        max_x = max(max_x, n["x"] + n["w"])
    width = int(max_x + 80)
    # Height: bottom-most node-end + 60 padding for caption
    max_node_bottom = 400
    for n in spec["nodes"]:
        max_node_bottom = max(max_node_bottom, n["y"] + n["h"])
    height = int(max_node_bottom + 60)
    return width, height


def render_haven_svg(spec):
    """Compose the full HTML document."""
    viewbox_w, viewbox_h = _compute_viewbox(spec)
    node_by_id = {n["id"]: n for n in spec["nodes"]}

    lanes_svg = _render_lanes(spec["lanes"], viewbox_w)
    nodes_svg = "\n".join(_render_node(n) for n in spec["nodes"])
    callouts_svg = _render_callouts(spec["nodes"])
    edges_svg = _render_edges(spec["edges"], node_by_id)

    caption = spec.get("caption", "")
    caption_y = viewbox_h - 20
    caption_svg = ""
    if caption:
        caption_svg = f'  <text x="{viewbox_w / 2:.0f}" y="{caption_y}" font-family="var(--font-serif, \'Lora\', serif)" font-style="italic" font-weight="500" font-size="12" fill="var(--color-text-muted, #555)" text-anchor="middle">{caption}</text>'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{spec.get('title', 'Diagram')} — auto-rendered</title>
<link rel="stylesheet" href="../../../../packages/design-system/src/styles/main.css">
{INLINE_STYLE_BLOCK}
</head>
<body>

<!-- Auto-emitted via tools/surface-emit/spec_to_haven_svg.py — DO NOT HAND-EDIT.
     Edit source: ./manifest.md + ./diagram.md + ./fragments/*.md; regenerate. -->

<div class="diagram-frame-wrapper">

<header class="diagram-header">
  <h1>{spec.get('title', '')}</h1>
  <span class="draft-marker">{spec.get('draft_marker', '')}</span>
</header>

<svg class="diagram-frame" viewBox="0 0 {viewbox_w} {viewbox_h}" role="img" aria-labelledby="diagram-title" width="100%" height="auto" style="display: block;">
  <title id="diagram-title">{spec.get('title', '')}</title>
{_marker_defs()}

  <!-- Lanes -->
{lanes_svg}

  <!-- Nodes -->
{nodes_svg}

  <!-- Callouts -->
{callouts_svg}

  <!-- Edges -->
{edges_svg}

{caption_svg}
</svg>

<div class="diagram-meta">
  <strong>Sources:</strong> <code>./manifest.md</code> + <code>./diagram.md</code> + <code>./fragments/*.md</code> in this folder. <br>
  <strong>Rendered via:</strong> <code>tools/surface-emit/spec_to_haven_svg.py</code> (auto-emit). <br>
  <strong>Visual contract:</strong> orthogonal routing with 24-unit corner arcs; stroked chevron arrowheads; per-variant text-color family matching.
</div>

</div>
</body>
</html>
"""


# ─────────────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage: spec_to_haven_svg.py <use-case-dir> [--inplace]", file=sys.stderr)
        sys.exit(64)

    use_case_dir = Path(sys.argv[1])
    inplace = "--inplace" in sys.argv[2:]

    if not use_case_dir.is_dir():
        print(f"Not a directory: {use_case_dir}", file=sys.stderr)
        sys.exit(64)

    spec = spec_from_use_case(use_case_dir)
    overrides = _load_diagram_overrides(use_case_dir)
    spec = _apply_overrides(spec, overrides, use_case_dir)
    html = render_haven_svg(spec)

    output_name = "rendered-diagram.html" if inplace else "rendered-diagram-auto.html"
    output_path = use_case_dir / output_name
    output_path.write_text(html)
    print(f"Wrote {output_path} ({len(html)} bytes, {len(spec['nodes'])} nodes, {len(spec['edges'])} edges)")


if __name__ == "__main__":
    main()
