-- haven-directives.lua
-- Maps a fenced div's or bracketed span's first class to pandoc's docx
-- custom-style attribute, so the contained content gets the matching Word
-- style applied: paragraph style for divs, character style for spans.
--
-- Usage:
--   pandoc input.md \
--     --reference-doc=reference-cena.docx \
--     --lua-filter=haven-directives.lua \
--     -o output.docx
--
-- The reference docx must define styles named exactly after the directive
-- classes used (e.g., callout-warning, attestation as paragraph styles;
-- screen-ref as a character style).

function Div(div)
  if #div.classes == 0 then
    return nil
  end
  div.attributes["custom-style"] = div.classes[1]
  return div
end

function Span(span)
  if #span.classes == 0 then
    return nil
  end
  span.attributes["custom-style"] = span.classes[1]
  return span
end
