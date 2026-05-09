/**
 * Haven Diagram Graph — Layer 2 dagre-backed helper
 *
 * ENVIRONMENT MODULE — lives in src/scripts/env/
 * Loaded as ESM via <script type="module" src=".../diagram-graph.js"></script>
 * from any PL page or app that uses data-driven diagram authoring.
 *
 * Spec: ~/.claude/plans/haven-ui-diagram-research.md (D3 + round-3 A3 + round-4)
 *
 * Public API:
 *   - layoutGraph(spec) → { positions, edgeWaypoints, width, height }
 *   - waypointToPath(points, mode) → SVG `d` attribute string
 *   - resolveAnchor(box, hint) → { x, y } attachment point on box edge
 *   - renderDiagramGraph(svgElement, spec) → void (mutates element)
 *
 * Auto-init: any element with `data-diagram-graph` attribute on DOMContentLoaded.
 *
 * Layer 1 primitives (diagram-frame, diagram-box, diagram-arrow, etc.) handle
 * the actual rendering — this module computes positions + waypoints, then
 * builds SVG children using the same semantic class vocabulary.
 */

import dagre from '@dagrejs/dagre';

const SVG_NS = 'http://www.w3.org/2000/svg';

// =============================================================================
// Anchor resolver — round-3 A3 contract
// 12 named positions on a box's perimeter, plus 'auto' (caller resolves).
// =============================================================================

const ANCHOR_FRACTIONS = {
    'top-left':      { sx: 0.25, sy: 0,    side: 'top' },
    'top-center':    { sx: 0.5,  sy: 0,    side: 'top' },
    'top-right':     { sx: 0.75, sy: 0,    side: 'top' },
    'bottom-left':   { sx: 0.25, sy: 1,    side: 'bottom' },
    'bottom-center': { sx: 0.5,  sy: 1,    side: 'bottom' },
    'bottom-right':  { sx: 0.75, sy: 1,    side: 'bottom' },
    'left-top':      { sx: 0,    sy: 0.25, side: 'left' },
    'left-center':   { sx: 0,    sy: 0.5,  side: 'left' },
    'left-bottom':   { sx: 0,    sy: 0.75, side: 'left' },
    'right-top':     { sx: 1,    sy: 0.25, side: 'right' },
    'right-center':  { sx: 1,    sy: 0.5,  side: 'right' },
    'right-bottom':  { sx: 1,    sy: 0.75, side: 'right' },
};

export function resolveAnchor(box, hint = 'auto') {
    if (!box || typeof box.x !== 'number' || typeof box.y !== 'number') {
        throw new Error('resolveAnchor: box requires {x, y, width, height}');
    }
    if (hint === 'auto' || hint == null) {
        return null;
    }
    const fr = ANCHOR_FRACTIONS[hint];
    if (!fr) {
        throw new Error(`resolveAnchor: unknown anchor hint "${hint}"`);
    }
    return {
        x: box.x + box.width * fr.sx,
        y: box.y + box.height * fr.sy,
        side: fr.side,
    };
}

// =============================================================================
// Waypoint → SVG path d-attribute
// Round-3 A3: default polyline; opt-in smooth via Catmull-Rom→cubic Bezier.
// =============================================================================

export function waypointToPath(points, mode = 'polyline') {
    if (!Array.isArray(points) || points.length < 2) {
        throw new Error('waypointToPath: requires at least 2 points');
    }
    if (mode === 'polyline') {
        return points
            .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
            .join(' ');
    }
    if (mode === 'smooth') {
        return catmullRomToBezier(points);
    }
    throw new Error(`waypointToPath: unknown mode "${mode}"`);
}

function catmullRomToBezier(points) {
    if (points.length === 2) {
        const [a, b] = points;
        return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
    }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
}

// =============================================================================
// layoutGraph — runs dagre, returns position map + waypoint list
// Round-3 A3: rejects self-loops with build-time error.
// =============================================================================

export function layoutGraph(spec) {
    if (!spec || !Array.isArray(spec.nodes) || !Array.isArray(spec.edges)) {
        throw new Error('layoutGraph: spec requires { nodes: [], edges: [] }');
    }

    for (const edge of spec.edges) {
        if (edge.from === edge.to) {
            throw new Error(
                `layoutGraph: self-loops not supported (edge ${edge.from} → ${edge.to}); extend the Layer 2 contract if needed`
            );
        }
    }

    const g = new dagre.graphlib.Graph();
    g.setGraph({
        rankdir: spec.rankdir || 'TB',
        nodesep: spec.nodesep ?? 40,
        edgesep: spec.edgesep ?? 20,
        ranksep: spec.ranksep ?? 60,
        marginx: spec.marginx ?? 20,
        marginy: spec.marginy ?? 20,
    });
    g.setDefaultEdgeLabel(() => ({}));

    for (const node of spec.nodes) {
        g.setNode(node.id, {
            width: node.width ?? 140,
            height: node.height ?? 80,
            label: node.label ?? '',
            sublabel: node.sublabel ?? '',
            kind: node.kind || 'box',
            variant: node.variant || null,
            icon: node.icon || null,
            overline: node.overline || null,
        });
    }

    for (const edge of spec.edges) {
        g.setEdge(edge.from, edge.to, {
            stroke: edge.stroke || 'default',
            markerStart: edge.markerStart || 'off',
            markerEnd: edge.markerEnd || 'end',
            route: edge.route || 'polyline',
            fromAnchor: edge.fromAnchor || 'auto',
            toAnchor: edge.toAnchor || 'auto',
            label: edge.label || null,
        });
    }

    dagre.layout(g);

    const positions = new Map();
    g.nodes().forEach((id) => {
        const n = g.node(id);
        positions.set(id, {
            x: n.x - n.width / 2,
            y: n.y - n.height / 2,
            width: n.width,
            height: n.height,
            label: n.label,
            sublabel: n.sublabel,
            kind: n.kind,
            variant: n.variant,
            icon: n.icon,
            overline: n.overline,
        });
    });

    const edgeWaypoints = g.edges().map((edgeRef) => {
        const e = g.edge(edgeRef);
        return {
            from: edgeRef.v,
            to: edgeRef.w,
            points: e.points || [],
            stroke: e.stroke,
            markerStart: e.markerStart,
            markerEnd: e.markerEnd,
            route: e.route,
            fromAnchor: e.fromAnchor,
            toAnchor: e.toAnchor,
            label: e.label,
        };
    });

    const graphLabel = g.graph();
    return {
        positions,
        edgeWaypoints,
        width: graphLabel.width || 0,
        height: graphLabel.height || 0,
    };
}

// =============================================================================
// SVG renderer — composes Layer 1 primitives at computed positions.
// =============================================================================

const MARKER_IDS = {
    end: 'diagram-graph-arrow-end',
    'end-emphasis': 'diagram-graph-arrow-end-emphasis',
    'end-bidirectional': 'diagram-graph-arrow-end-bidirectional',
    'end-open': 'diagram-graph-arrow-end-open',
    off: null,
};

function svgEl(name, attrs = {}, classes = []) {
    const el = document.createElementNS(SVG_NS, name);
    if (classes.length) el.setAttribute('class', classes.join(' '));
    for (const [k, v] of Object.entries(attrs)) {
        if (v == null) continue;
        el.setAttribute(k, String(v));
    }
    return el;
}

function buildMarkerDefs(svgElement) {
    if (svgElement.querySelector('defs.diagram-marker-defs')) return;
    const defs = svgEl('defs', {}, ['diagram-marker-defs']);
    const markerSpecs = [
        { id: MARKER_IDS.end, klass: 'diagram-marker-fill', orient: 'auto', shape: 'fill' },
        { id: MARKER_IDS['end-emphasis'], klass: 'diagram-marker-fill-emphasis', orient: 'auto', shape: 'fill' },
        { id: MARKER_IDS['end-bidirectional'], klass: 'diagram-marker-fill', orient: 'auto-start-reverse', shape: 'fill' },
        { id: MARKER_IDS['end-open'], klass: 'diagram-marker-stroke', orient: 'auto', shape: 'stroke' },
    ];
    for (const m of markerSpecs) {
        const marker = svgEl('marker', {
            id: m.id,
            viewBox: '0 0 10 10',
            refX: '9',
            refY: '5',
            markerWidth: '7',
            markerHeight: '7',
            markerUnits: 'userSpaceOnUse',
            orient: m.orient,
        });
        const path = m.shape === 'fill'
            ? svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z' }, [m.klass])
            : svgEl('path', { d: 'M 0 0 L 10 5 L 0 10', fill: 'none' }, [m.klass]);
        marker.appendChild(path);
        defs.appendChild(marker);
    }
    svgElement.insertBefore(defs, svgElement.firstChild);
}

function buildBox(id, pos) {
    const variantClass = pos.variant ? `diagram-box--${pos.variant}` : null;
    const group = svgEl('g', { 'data-node-id': id }, ['diagram-box', variantClass].filter(Boolean));
    const rect = svgEl('rect', {
        x: pos.x,
        y: pos.y,
        width: pos.width,
        height: pos.height,
    }, ['diagram-box-shape']);
    group.appendChild(rect);

    const cx = pos.x + pos.width / 2;
    const cy = pos.y + pos.height / 2;
    const hasIcon = !!pos.icon;
    const hasSublabel = !!pos.sublabel;

    if (pos.overline) {
        // Overline baseline at y; cap-height ~10px sits comfortably 18px below box top.
        const overline = svgEl('text', { x: pos.x + 16, y: pos.y + 24 }, ['diagram-box-overline']);
        overline.textContent = pos.overline;
        group.appendChild(overline);
    }

    // Vertical layout uses baseline alignment (SVG default — no dominant-baseline
    // override on the text classes). Y values are baselines. Heuristic offset of
    // +0.30 * font-size approximates the visual center → baseline conversion for
    // Source Sans 3 / Lora at the sizes used here.
    //
    // Stack-around-cy positioning to keep all labels visually centered in the box,
    // which matters most when box height is small (e.g., 80px Hub variant).
    let iconY, labelY, sublabelY;
    if (hasIcon && hasSublabel) {
        // Icon (22px) + Label (12px) + Sublabel (10px). Stack ~52px tall.
        iconY = cy - 14;       // icon baseline (text-anchor middle puts glyph centered around baseline-ish)
        labelY = cy + 8;       // 12 * 0.3 + 4 offset down from center
        sublabelY = cy + 24;
    } else if (hasIcon) {
        // Icon (22) + Label (12). Stack ~34px tall.
        iconY = cy - 4;
        labelY = cy + 18;
    } else if (hasSublabel) {
        // Label (12) + Sublabel (10). Stack ~22px tall.
        labelY = cy;           // Label baseline at center → cap top a few px above center
        sublabelY = cy + 14;
    } else {
        labelY = cy + 4;       // single label baseline ~4px below visual center
    }

    if (hasIcon) {
        const icon = svgEl('text', { x: cx, y: iconY }, ['diagram-icon']);
        icon.textContent = pos.icon;
        group.appendChild(icon);
    }

    if (pos.label) {
        const label = svgEl('text', { x: cx, y: labelY }, ['diagram-box-label']);
        label.textContent = pos.label;
        group.appendChild(label);
    }

    if (hasSublabel) {
        const sub = svgEl('text', { x: cx, y: sublabelY }, ['diagram-box-sublabel']);
        sub.textContent = pos.sublabel;
        group.appendChild(sub);
    }

    return group;
}

function buildEdge(edge, layout) {
    const fromBox = layout.positions.get(edge.from);
    const toBox = layout.positions.get(edge.to);
    if (!fromBox || !toBox) {
        throw new Error(`renderDiagramGraph: edge references unknown node (${edge.from} → ${edge.to})`);
    }

    let points = edge.points;
    const fromAnchor = resolveAnchor(fromBox, edge.fromAnchor);
    const toAnchor = resolveAnchor(toBox, edge.toAnchor);
    if (fromAnchor) {
        points = [{ x: fromAnchor.x, y: fromAnchor.y }, ...points.slice(1)];
    }
    if (toAnchor) {
        points = [...points.slice(0, -1), { x: toAnchor.x, y: toAnchor.y }];
    }

    const d = waypointToPath(points, edge.route);

    const arrowClasses = ['diagram-arrow'];
    if (edge.stroke && edge.stroke !== 'default') {
        arrowClasses.push(`diagram-arrow--${edge.stroke}`);
    }

    const path = svgEl('path', {
        d,
        'data-edge-from': edge.from,
        'data-edge-to': edge.to,
        'aria-hidden': 'true',
    }, arrowClasses);

    const startMarkerId = MARKER_IDS[edge.markerStart];
    const endMarkerId = MARKER_IDS[edge.markerEnd];
    if (startMarkerId) path.setAttribute('marker-start', `url(#${startMarkerId})`);
    if (endMarkerId) path.setAttribute('marker-end', `url(#${endMarkerId})`);

    return path;
}

export function renderDiagramGraph(svgElement, spec) {
    const layout = layoutGraph(spec);

    if (!svgElement.hasAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${layout.width} ${layout.height}`);
    }

    buildMarkerDefs(svgElement);

    for (const [id, pos] of layout.positions) {
        if (pos.kind === 'box' || !pos.kind) {
            svgElement.appendChild(buildBox(id, pos));
        }
    }

    for (const edge of layout.edgeWaypoints) {
        svgElement.appendChild(buildEdge(edge, layout));
    }
}

// =============================================================================
// Auto-init — any [data-diagram-graph] element on DOMContentLoaded.
// Skipped when running outside a browser (e.g. unit tests via Node).
// =============================================================================

if (typeof document !== 'undefined') {
    const init = () => {
        document.querySelectorAll('[data-diagram-graph]').forEach((el) => {
            try {
                const raw = el.getAttribute('data-diagram-graph');
                const spec = JSON.parse(raw);
                renderDiagramGraph(el, spec);
            } catch (err) {
                // Surface to console; don't crash the page on a single bad spec.
                console.error('[diagram-graph] failed to render:', err, el);
            }
        });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}
