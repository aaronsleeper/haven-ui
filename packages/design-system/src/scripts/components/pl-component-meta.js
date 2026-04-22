(function () {
  const FIELD_WHITELIST = [
    'category',
    'classes',
    'when-to-use',
    'do-not-use-when',
    'preline-required',
    'variants',
    'notes',
  ];
  const CHIP_FIELDS = new Set(['category', 'preline-required']);
  const CODE_LIST_FIELDS = new Set(['classes']);
  const FIELD_LABELS = {
    'category': 'Category',
    'classes': 'Classes',
    'when-to-use': 'When to use',
    'do-not-use-when': 'Do not use when',
    'preline-required': 'Preline required',
    'variants': 'Variants',
    'notes': 'Notes',
  };

  const META_COMMENT_RE = /@component-meta([\s\S]*?)@end-meta/;

  function parseMeta(commentText) {
    const match = commentText.match(META_COMMENT_RE);
    if (!match) return null;

    const body = match[1];
    const lines = body.split('\n');
    const fields = {};
    const interactive = {};

    let currentKey = null;
    let currentBuf = [];
    let inInteractive = false;
    let interactiveKey = null;
    let interactiveBuf = [];

    const flush = () => {
      if (currentKey) {
        fields[currentKey] = currentBuf.join(' ').trim();
        currentKey = null;
        currentBuf = [];
      }
    };
    const flushInteractive = () => {
      if (interactiveKey) {
        interactive[interactiveKey] = interactiveBuf.join(' ').trim();
        interactiveKey = null;
        interactiveBuf = [];
      }
    };

    for (const rawLine of lines) {
      const line = rawLine.replace(/^\s*/, '');
      if (!line.trim()) {
        continue;
      }
      const indent = rawLine.match(/^\s*/)[0].length;

      if (inInteractive && indent >= 4) {
        const kv = line.match(/^([a-z][a-z0-9-]*):\s*(.*)$/i);
        if (kv) {
          flushInteractive();
          interactiveKey = kv[1];
          interactiveBuf = kv[2] ? [kv[2]] : [];
        } else if (interactiveKey) {
          interactiveBuf.push(line.trim());
        }
        continue;
      }

      if (inInteractive) {
        flushInteractive();
        inInteractive = false;
      }

      const kv = line.match(/^([a-z][a-z0-9-]*):\s*(.*)$/i);
      if (kv) {
        flush();
        const key = kv[1].toLowerCase();
        if (key === 'interactive') {
          inInteractive = true;
          continue;
        }
        currentKey = key;
        currentBuf = kv[2] ? [kv[2]] : [];
      } else if (currentKey) {
        currentBuf.push(line.trim());
      }
    }
    flush();
    flushInteractive();

    return { fields, interactive };
  }

  function makeChip(text) {
    const chip = document.createElement('span');
    chip.className = 'pl-meta-chip';
    chip.textContent = text;
    return chip;
  }

  function makeCodeList(value) {
    const frag = document.createDocumentFragment();
    const parts = value.split(',').map((s) => s.trim()).filter(Boolean);
    parts.forEach((part, i) => {
      if (i > 0) frag.appendChild(document.createTextNode(' '));
      const code = document.createElement('code');
      code.className = 'pl-meta-code';
      code.textContent = part;
      frag.appendChild(code);
    });
    return frag;
  }

  function renderField(dl, key, value) {
    const dt = document.createElement('dt');
    dt.className = 'pl-meta-term';
    dt.textContent = FIELD_LABELS[key] || key;
    dl.appendChild(dt);

    const dd = document.createElement('dd');
    dd.className = 'pl-meta-value';
    if (CHIP_FIELDS.has(key)) {
      dd.appendChild(makeChip(value));
    } else if (CODE_LIST_FIELDS.has(key)) {
      dd.appendChild(makeCodeList(value));
    } else {
      dd.textContent = value;
    }
    dl.appendChild(dd);
  }

  function renderInteractive(dl, interactive) {
    if (!Object.keys(interactive).length) return;
    const dt = document.createElement('dt');
    dt.className = 'pl-meta-term';
    dt.textContent = 'Interactive';
    dl.appendChild(dt);

    const dd = document.createElement('dd');
    dd.className = 'pl-meta-value';
    const subDl = document.createElement('dl');
    subDl.className = 'pl-meta-sublist';
    Object.entries(interactive).forEach(([k, v]) => {
      const sdt = document.createElement('dt');
      sdt.className = 'pl-meta-subterm';
      sdt.textContent = k;
      subDl.appendChild(sdt);
      const sdd = document.createElement('dd');
      sdd.className = 'pl-meta-subvalue';
      sdd.textContent = v;
      subDl.appendChild(sdd);
    });
    dd.appendChild(subDl);
    dl.appendChild(dd);
  }

  function buildPanel(parsed) {
    const details = document.createElement('details');
    details.className = 'pl-component-meta';
    details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'pl-meta-summary';
    summary.textContent = 'Component info';
    details.appendChild(summary);

    const dl = document.createElement('dl');
    dl.className = 'pl-meta-list';

    for (const key of FIELD_WHITELIST) {
      const value = parsed.fields[key];
      if (value) renderField(dl, key, value);
    }
    renderInteractive(dl, parsed.interactive);

    details.appendChild(dl);
    return details;
  }

  function processComments() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT);
    const targets = [];
    let node;
    while ((node = walker.nextNode())) {
      if (META_COMMENT_RE.test(node.nodeValue)) targets.push(node);
    }

    targets.forEach((comment) => {
      try {
        const parsed = parseMeta(comment.nodeValue);
        if (!parsed) return;
        const panel = buildPanel(parsed);
        comment.parentNode.insertBefore(panel, comment.nextSibling);
      } catch (err) {
        console.warn('[pl-component-meta] parse failed for comment:', err, comment.nodeValue);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processComments);
  } else {
    processComments();
  }
})();
