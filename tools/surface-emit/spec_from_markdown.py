#!/usr/bin/env python3
"""spec_from_markdown.py — parse content-sot/use-cases/<name>/ → slides-emit spec dict.

Inputs (per use-case directory):
  diagram.md          # YAML frontmatter: lanes + node_placement + edge_overrides
  manifest.md         # YAML frontmatter: sequence + gaps + metadata
  fragments/NN-*.md   # YAML frontmatter per fragment + prose body

Outputs:
  spec_from_use_case(use_case_dir) → dict matching slides-emit.py's spec shape
  (lanes, nodes, edges, title, draft_marker, caption)

Mapping (derived from the existing ESCALATION_SPEC + the use-case schema):
  - emphasis: high              → modifier "attestation-gate"
  - emphasis: low               → modifier "default"
  - x_cena_uncertainty: tbd     → modifier "uncertain-tbd"     + callout {type: "tbd"}
  - x_cena_uncertainty: gap     → modifier "uncertain-gap"     + callout {type: "gap"}
  - x_cena_uncertainty: assumption → modifier "uncertain-assumption" + callout {type: "assumption"}
  - x_cena_uncertainty: resolved → no callout
  - x_cena_severity: red|yellow|critical → edge style "emphasis"
  - x_cena_severity: green             → edge style "default"
  - edge type containing "timeout"/"deferred" → edge style "muted"
  - edge type "attestation-approved"         → edge style "emphasis"
  - target starting with "out-of-scope" → edge skipped (leaves the use case)

Honest limits:
  - Callout text derived from the first item in fragment.gaps[], truncated.
    Hand-crafted callouts are tighter; iterate the gaps list ordering in source
    markdown if a different gap should surface.
  - Node title derived from the H1 heading (split on first colon).
  - Node detail lines: if fragment frontmatter declares `detail:` as a list,
    those lines are used verbatim (author-curated, 1-5 short lines, ~25-char
    visual budget per line at default box width). Otherwise falls back to the
    H1 subtitle as a single detail line. Matches the hand-authored content
    density (2-5 supporting lines per box) without forcing prose extraction.
"""

import re
import sys
from pathlib import Path

import yaml


def _yaml_preprocess(yaml_text):
    """Coerce common authoring patterns into YAML-valid forms before parsing.

    The use-case markdown is hand-authored and sometimes leaks decorative
    markdown into YAML — most commonly, list items that start with backticks
    (e.g., `- \`planning/foo.md\` — note`). YAML treats backtick as an invalid
    token start. We wrap such items in double quotes so the value survives.

    This is a pragmatic compatibility shim, not a license to invent YAML
    syntax in source. If the same pattern recurs, the right move is to clean
    the source authoring guide rather than grow the shim.
    """
    out = []
    for line in yaml_text.split("\n"):
        # Backtick-led list items: wrap whole value in quotes
        m = re.match(r"^(\s*-\s+)(`.*)$", line)
        if m:
            value = m.group(2).replace('"', '\\"')
            out.append(f'{m.group(1)}"{value}"')
            continue
        # `enum [a, b, c]` schema-description tokens: wrap as quoted scalar
        # so they don't get treated as nested flow sequences.
        line = re.sub(r'\benum \[([^\]]+)\]', r'"enum [\1]"', line)
        out.append(line)
    return "\n".join(out)


def _parse_yaml_doc(md_path):
    """Read a .md file with YAML frontmatter; return the frontmatter dict.

    Tolerates files that are pure-frontmatter (no body) and files with body.
    """
    content = Path(md_path).read_text()
    # Frontmatter starts with --- and ends with --- on its own line
    m = re.match(r"^---\s*\n(.*?)\n---\s*(?:\n|$)", content, re.DOTALL)
    if not m:
        raise ValueError(f"{md_path}: missing YAML frontmatter")
    return yaml.safe_load(_yaml_preprocess(m.group(1)))


def _parse_fragment(frag_path):
    """Parse a fragment file: return (frontmatter, title, subtitle).

    title and subtitle come from the first H1 in the body:
        "# Trigger: PHQ9 positive response" → title="Trigger", subtitle="PHQ9 positive response"
    """
    content = Path(frag_path).read_text()
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
    if not m:
        raise ValueError(f"{frag_path}: missing YAML frontmatter or body")
    frontmatter = yaml.safe_load(_yaml_preprocess(m.group(1)))
    body = m.group(2)
    h1 = re.search(r"^#\s+(.+?)\s*$", body, re.MULTILINE)
    if h1:
        heading = h1.group(1).strip()
        if ":" in heading:
            title, _, subtitle = heading.partition(":")
            title = title.strip()
            subtitle = subtitle.strip()
        else:
            title = heading
            subtitle = ""
    else:
        title = frontmatter.get("fragment_id", "?")
        subtitle = ""
    return frontmatter, title, subtitle


# --- field-derivation helpers ---

def _derive_modifier(emphasis, uncertainty):
    if emphasis == "high":
        return "attestation-gate"
    if emphasis == "low":
        return "default"
    if uncertainty in ("tbd", "gap", "assumption"):
        return f"uncertain-{uncertainty}"
    return "default"


def _derive_callout(uncertainty, gaps_list, callout_priority="critical_keywords"):
    """Make a callout dict from uncertainty + gaps.

    Picks the first gap as the callout text source, truncated to ~55 chars at
    a word boundary. If uncertainty is tbd and the gap contains a critical
    keyword (e.g., "Marrero", "Vanessa", "safety"), tag as 'critical' instead.
    Returns None if uncertainty resolves nothing or gaps is empty.
    """
    if not uncertainty or uncertainty == "resolved":
        return None
    if not gaps_list:
        return None
    first = str(gaps_list[0]).strip()
    # Strip parenthetical asides for tighter callouts
    first = re.sub(r"\s*\(.*?\)", "", first).strip()
    # Trim to ~55 chars at word boundary
    if len(first) > 55:
        first = first[:55].rsplit(" ", 1)[0] + "..."
    # Critical-callout escalation: tbd + clearly-critical keyword
    callout_type = uncertainty
    type_tag = uncertainty.upper()
    critical_keywords = ("safety", "suicid", "critical", "first-action")
    if uncertainty == "tbd" and any(k in first.lower() for k in critical_keywords):
        callout_type = "critical"
        type_tag = "TBD CRITICAL"
    return {"text": f"[{type_tag}] {first}", "type": callout_type}


def _derive_edge_style(edge_dict):
    severity = edge_dict.get("x_cena_severity")
    edge_type = str(edge_dict.get("type", "")).lower()
    if severity in ("red", "yellow", "critical"):
        return "emphasis"
    if severity in ("green", "low"):
        return "default"
    if "timeout" in edge_type or "deferred" in edge_type:
        return "muted"
    if edge_type == "attestation-approved":
        return "emphasis"
    return "default"


def _edge_label(edge_dict):
    """Short label suitable for the connector midpoint."""
    raw = str(edge_dict.get("label", "")).strip()
    # Trim parentheticals + cap length
    raw = re.sub(r"\s*\(.*?\)", "", raw).strip()
    if len(raw) > 32:
        raw = raw[:32].rsplit(" ", 1)[0] + "..."
    return raw


# --- main entry point ---

def spec_from_use_case(use_case_dir, default_w=200, default_h=90):
    """Build a slides-emit spec dict from a use-case directory."""
    use_case_dir = Path(use_case_dir)
    diagram = _parse_yaml_doc(use_case_dir / "diagram.md")
    manifest = _parse_yaml_doc(use_case_dir / "manifest.md")

    # Lane y-center lookup
    lane_y = {lane["id"]: lane["y_center"] for lane in diagram["lanes"]}
    lanes = [
        {"id": lane["id"], "label": lane["label"], "y": lane["y_center"]}
        for lane in diagram["lanes"]
    ]

    sequence = manifest["sequence"]
    node_placement = diagram.get("node_placement", {})

    nodes = []
    valid_ids = set()
    for frag_id in sequence:
        frag_path = use_case_dir / "fragments" / f"{frag_id}.md"
        if not frag_path.exists():
            raise FileNotFoundError(
                f"Fragment {frag_path} missing for use-case {use_case_dir.name}")
        fm, title, subtitle = _parse_fragment(frag_path)
        placement = node_placement.get(frag_id, {})
        lane_id = placement.get("lane")
        x_center = placement.get("x_center", 500)
        emphasis = placement.get("emphasis", "default")

        uncertainty = fm.get("x_cena_uncertainty")
        gaps = fm.get("gaps") or []
        watcher = fm.get("x_cena_watches")

        modifier = _derive_modifier(emphasis, uncertainty)
        callout = _derive_callout(uncertainty, gaps)

        if modifier == "attestation-gate":
            w, h = 210, 105
        else:
            w, h = default_w, default_h

        y_center = lane_y.get(lane_id)
        if y_center is None:
            raise ValueError(
                f"Fragment {frag_id}: lane '{lane_id}' not in diagram.md lanes")
        x = x_center - w / 2
        y = y_center - h / 2

        fm_detail = fm.get("detail")
        if isinstance(fm_detail, list) and fm_detail:
            detail = [str(line).strip() for line in fm_detail if str(line).strip()]
        elif subtitle:
            detail = [subtitle]
        else:
            detail = []
        if len(detail) > 5:
            print(
                f"warning: fragment {frag_id} declares {len(detail)} detail lines; "
                "soft cap is 5 (box height grows past visual budget).",
                file=sys.stderr,
            )

        node = {
            "id": frag_id,
            "lane": lane_id,
            "x": x, "y": y, "w": w, "h": h,
            "title": title,
            "detail": detail,
            "modifier": modifier,
        }
        if callout:
            node["callout"] = callout
        if watcher:
            node["watcher"] = watcher
        nodes.append(node)
        valid_ids.add(frag_id)

    # Edges: combine outgoing_edges + branches across all fragments
    edges = []
    for frag_id in sequence:
        frag_path = use_case_dir / "fragments" / f"{frag_id}.md"
        fm, _, _ = _parse_fragment(frag_path)
        edge_specs = []
        edge_specs.extend(fm.get("outgoing_edges") or [])
        edge_specs.extend(fm.get("branches") or [])
        for e in edge_specs:
            target = e.get("target") or e.get("to")
            if not target:
                continue
            if str(target).startswith("out-of-scope"):
                continue
            if target not in valid_ids:
                continue
            edges.append({
                "from": frag_id,
                "to": target,
                "label": _edge_label(e),
                "style": _derive_edge_style(e),
            })

    # Chrome
    title = manifest.get("title", use_case_dir.name)
    version = manifest.get("version", "0.1")
    owner = manifest.get("owner", "")
    if owner:
        draft_marker = f"DRAFT • v{version} • pending {owner} review"
    else:
        draft_marker = f"DRAFT • v{version}"

    description = (manifest.get("description") or "").strip()
    caption = description if len(description) < 280 else description[:280].rsplit(" ", 1)[0] + "..."

    return {
        "title": title,
        "draft_marker": draft_marker,
        "lanes": lanes,
        "nodes": nodes,
        "edges": edges,
        "caption": caption,
    }


if __name__ == "__main__":
    argv = sys.argv[1:]
    json_mode = False
    if argv and argv[0] == "--json":
        json_mode = True
        argv = argv[1:]
    if len(argv) != 1:
        print("Usage: spec_from_markdown.py [--json] <use-case-dir>", file=sys.stderr)
        sys.exit(64)
    spec = spec_from_use_case(argv[0])
    if json_mode:
        import json
        json.dump(spec, sys.stdout, indent=2)
        sys.stdout.write("\n")
    else:
        import pprint
        pprint.pprint(spec, width=110, sort_dicts=False)
