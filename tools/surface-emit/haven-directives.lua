-- haven-directives.lua
-- Maps a fenced div's or bracketed span's first class to pandoc's docx
-- custom-style attribute, so the contained content gets the matching Word
-- style applied: paragraph style for divs, character style for spans.
--
-- Carve-out: container directives (currently `card` + `attestation`) wrap
-- their inner content in a single-cell OOXML table so the visual container
-- holds across nested directives + list content. Pandoc-docx's
-- custom-style-per-paragraph mechanism can't express an outer container
-- when its direct children are themselves Divs or BulletLists (style is
-- applied only to direct paragraph children). The table cell carries the
-- shading; inner paragraphs sit inside the cell. <w:cantSplit/> on the row
-- keeps the container on one page (best-effort; very long containers still
-- hit Word's hard split).
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

-- Container directives → cell bg hex (must match the directive's bg_color
-- in `apply_directive_styles` so the cell shading and inner-paragraph
-- shading appear continuous, not as nested layers).
local CONTAINER_DIRECTIVES = {
  ["card"] = "f8f4ec",          -- sand-50
  ["attestation"] = "e4dfd7",   -- sand-100
}

local function container_open_xml(bg_hex)
  return string.format([[<w:tbl>
<w:tblPr>
<w:tblW w:w="5000" w:type="pct"/>
<w:tblBorders>
<w:top w:val="nil"/>
<w:bottom w:val="nil"/>
<w:left w:val="nil"/>
<w:right w:val="nil"/>
<w:insideH w:val="nil"/>
<w:insideV w:val="nil"/>
</w:tblBorders>
<w:tblCellMar>
<w:top w:w="160" w:type="dxa"/>
<w:bottom w:w="160" w:type="dxa"/>
<w:left w:w="200" w:type="dxa"/>
<w:right w:w="200" w:type="dxa"/>
</w:tblCellMar>
</w:tblPr>
<w:tr>
<w:trPr>
<w:cantSplit w:val="true"/>
</w:trPr>
<w:tc>
<w:tcPr>
<w:tcW w:w="5000" w:type="pct"/>
<w:shd w:val="clear" w:color="auto" w:fill="%s"/>
</w:tcPr>]], bg_hex)
end

local CONTAINER_CLOSE_XML = [[</w:tc>
</w:tr>
</w:tbl>]]

function Div(div)
  if #div.classes == 0 then
    return nil
  end

  local class = div.classes[1]
  local container_bg = CONTAINER_DIRECTIVES[class]
  if container_bg then
    local result = pandoc.List({})
    result:insert(pandoc.RawBlock("openxml", container_open_xml(container_bg)))
    for _, b in ipairs(div.content) do
      result:insert(b)
    end
    result:insert(pandoc.RawBlock("openxml", CONTAINER_CLOSE_XML))
    return result
  end

  -- :::diagram{workflow="<slug>"} — pre-resolved by
  -- tools/surface-emit/resolve-diagram-directives.mjs before pandoc runs.
  -- The runner rewrites the directive's attributes inline so we have
  -- png_path + title + description here; without that pre-step the block
  -- silently degrades to nil (no-op) and stderr names the missing step.
  if class == "diagram" then
    local png_path = div.attributes["png_path"]
    local title = div.attributes["title"] or ""
    local description = div.attributes["description"] or ""
    local slug = div.attributes["workflow"] or ""
    if not png_path or png_path == "" then
      io.stderr:write("[haven-directives.lua] :::diagram missing png_path; ")
      io.stderr:write("did resolve-diagram-directives.mjs run before pandoc?\n")
      return nil
    end

    -- HTML output: raw <figure> with semantic haven classes so the haven
    -- CSS bundle styles the eyebrow + title + image + description block.
    -- Static <img> for v1 (matches what DOCX shows); interactive HTML embed
    -- (pan/zoom iframe) is deferred to a future slice when the SoP HTML
    -- surface graduates from approval-deferred.
    if FORMAT:match("html") then
      local function esc(s)
        return (s:gsub("&", "&amp;"):gsub("<", "&lt;"):gsub(">", "&gt;"):gsub("\"", "&quot;"))
      end
      local desc_block = ""
      if description ~= "" then
        desc_block = '<p class="diagram-figure-description">' .. esc(description) .. '</p>'
      end
      local html = string.format(
        '<figure class="diagram-figure" data-workflow="%s">\n' ..
        '  <figcaption class="diagram-figure-caption">\n' ..
        '    <span class="diagram-figure-eyebrow">WORKFLOW DIAGRAM</span>\n' ..
        '    <span class="diagram-figure-title">%s</span>\n' ..
        '  </figcaption>\n' ..
        '  <div class="diagram-figure-asset">\n' ..
        '    <img src="%s" alt="%s" style="display:block;max-width:100%%;height:auto;" />\n' ..
        '  </div>\n' ..
        '  %s\n' ..
        '</figure>',
        esc(slug), esc(title), esc(png_path), esc(title), desc_block
      )
      return { pandoc.RawBlock("html", html) }
    end

    -- DOCX output (and any other format): emit four paragraphs — eyebrow,
    -- title, image, description. Eyebrow + title spans carry custom-style
    -- directly in attrs (pandoc's Span filter below this Div is not invoked
    -- recursively on filter-emitted Spans on this pandoc version, so we
    -- bypass it and write the attribute ourselves). Source carries
    -- natural-case "Workflow diagram"; uppercase emission lives in the docx
    -- reference style via the caps flag (HVD Q2) so a track-changes
    -- round-trip doesn't surface SHOUTED text in markdown.
    local result = pandoc.List({})
    result:insert(pandoc.Para({
      pandoc.Span(
        { pandoc.Str("Workflow diagram") },
        pandoc.Attr("", {}, { ["custom-style"] = "diagram-figure-eyebrow" })
      ),
    }))
    if title ~= "" then
      result:insert(pandoc.Para({
        pandoc.Span(
          { pandoc.Str(title) },
          pandoc.Attr("", {}, { ["custom-style"] = "diagram-figure-title" })
        ),
      }))
    end
    result:insert(pandoc.Para({ pandoc.Image({}, png_path, "") }))
    if description ~= "" then
      result:insert(pandoc.Para({ pandoc.Emph({ pandoc.Str(description) }) }))
    end
    return result
  end

  div.attributes["custom-style"] = class
  return div
end

function Span(span)
  if #span.classes == 0 then
    return nil
  end
  span.attributes["custom-style"] = span.classes[1]
  return span
end
