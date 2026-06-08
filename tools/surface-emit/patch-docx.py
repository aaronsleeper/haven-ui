#!/usr/bin/env python3
"""patch-docx.py — post-process a pandoc-emitted .docx with haven-specific fixes.

Pandoc regenerates word/numbering.xml at emit time, using its own per-level
indent defaults (level 0 = w:left="720" w:hanging="360"). The reference-docx
generator's apply_theme patch to numbering.xml is silently overwritten. Fix:
run a post-process pass on the output docx that re-patches numbering.xml.

Currently:
  - Hanging indent: shift each level's w:left LEFT by 360 twips so level-0
    marker sits at column 0 of the body text (matches the Compact style's
    hanging-indent intent that pandoc otherwise overrides).
  - Force w:hanging="360" so wrapped lines align with content, not marker.

Usage:
    python3 patch-docx.py <input.docx>            # in-place
"""
from __future__ import annotations

import shutil
import sys
import zipfile
import re
from pathlib import Path

LEFT_SHIFT = 360
HANGING = 360

IND_RE = re.compile(r'<w:ind\b[^/]*/>')
LEFT_RE = re.compile(r'(w:left=")(\d+)(")')
HANGING_RE = re.compile(r'(w:hanging=")(\d+)(")')


def patch_ind_tag(match: re.Match) -> str:
    tag = match.group(0)
    left_m = LEFT_RE.search(tag)
    if left_m:
        cur = int(left_m.group(2))
        new = max(0, cur - LEFT_SHIFT)
        tag = LEFT_RE.sub(rf'\g<1>{new}\g<3>', tag)
    if HANGING_RE.search(tag):
        tag = HANGING_RE.sub(rf'\g<1>{HANGING}\g<3>', tag)
    else:
        tag = tag.replace('/>', f' w:hanging="{HANGING}"/>')
    return tag


def patch_numbering_xml(content: str) -> str:
    return IND_RE.sub(patch_ind_tag, content)


def patch_docx(path: Path) -> None:
    tmp = path.with_suffix(path.suffix + '.tmp')
    with zipfile.ZipFile(path, 'r') as src:
        names = src.namelist()
        with zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as dst:
            for name in names:
                data = src.read(name)
                if name == 'word/numbering.xml':
                    content = data.decode('utf-8')
                    content = patch_numbering_xml(content)
                    data = content.encode('utf-8')
                dst.writestr(name, data)
    shutil.move(str(tmp), str(path))


def main() -> int:
    if len(sys.argv) != 2:
        print('Usage: patch-docx.py <input.docx>', file=sys.stderr)
        return 64
    path = Path(sys.argv[1])
    if not path.exists():
        print(f'File not found: {path}', file=sys.stderr)
        return 65
    patch_docx(path)
    print(f'  ✓ patched numbering.xml in {path.name}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
