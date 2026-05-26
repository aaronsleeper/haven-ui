// Page shell — DS-agnostic chrome strategies. The brand surface is the haven
// classes + bundle; this file is fixed plumbing (head wiring + nav walk).
// Two chrome strategies, selected per consumer surface:
//   sidebar — docs site (manifest -> left sidebar, ml-64 main)
//   surface — SoT / reasoning (banner + nav + <main class="surface">, no sidebar)

function head({ mode, title, manifest, proseCss }) {
  if (mode === 'standalone') {
    const prose = proseCss ? `\n  <link rel="stylesheet" href="./assets/${proseCss}" />` : '';
    return `  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}${manifest ? ' — ' + manifest.title : ''}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap" />
  <link rel="stylesheet" href="./assets/haven.css" />${prose}`;
  }
  return `  <load src="../partials/pl-head.html" />
  <title>${title}${manifest ? ' — ' + manifest.title : ''}</title>`;
}

// ---- chrome: sidebar (docs) ------------------------------------------------
function renderSidebar(manifest, currentSlug) {
  const groups = manifest.nav.map((group) => {
    const items = group.pages.map((p) => {
      const active = p.slug === currentSlug;
      const cls = active
        ? 'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
        : 'flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sand-700 hover:bg-sand-100 dark:text-sand-300 dark:hover:bg-sand-800';
      const ic = p.icon ? `<i class="fa-solid fa-${p.icon} w-4 text-center"></i>` : '';
      return `<li><a href="./${p.slug}.html" class="${cls}">${ic}<span>${p.title}</span></a></li>`;
    }).join('\n            ');
    return `
        <li class="mb-5">
          <p class="px-3 mb-1 text-xs font-semibold uppercase tracking-wide text-sand-500">${group.group}</p>
          <ul class="space-y-0.5">
            ${items}
          </ul>
        </li>`;
  }).join('\n');
  return `
  <aside class="fixed inset-y-0 left-0 w-64 border-r border-sand-200 dark:border-sand-700 bg-white dark:bg-sand-900 overflow-y-auto">
    <div class="px-6 py-5 border-b border-sand-200 dark:border-sand-700">
      <a href="./${manifest.nav[0].pages[0].slug}.html" class="text-lg font-display font-semibold text-sand-900 dark:text-sand-100">${manifest.title}</a>
      <p class="text-xs text-sand-500 mt-0.5">${manifest.subtitle || ''}</p>
    </div>
    <nav class="px-3 py-4" aria-label="Docs navigation"><ul>${groups}
      </ul></nav>
  </aside>`;
}

function sidebarBody({ manifest, slug, title, description, bodyHtml }) {
  return `${renderSidebar(manifest, slug)}
  <main class="ml-64 min-h-screen">
    <div class="max-w-3xl mx-auto px-10 py-12">
      <header class="mb-8 pb-6 border-b border-sand-200 dark:border-sand-700">
        <h1 class="text-3xl font-display font-bold text-sand-900 dark:text-sand-100">${title}</h1>
        ${description ? `<p class="mt-2 text-lg text-sand-600 dark:text-sand-400">${description}</p>` : ''}
      </header>
      <article class="space-y-5 text-sand-800 dark:text-sand-200 leading-relaxed">
${bodyHtml}
      </article>
    </div>
  </main>`;
}

// ---- chrome: surface (SoT / reasoning) -------------------------------------
// banner + nav + <main class="surface">. Ports the SoT _before.html chrome; the
// status-badge promotion that _after.html did in client JS is now build-time.
function surfaceBody({ chromeConfig = {}, bodyHtml }) {
  const banner = chromeConfig.banner || '';
  const nav = (chromeConfig.nav || [])
    .map((n) => `<a href="${n.href}">${n.label}</a>`).join('\n  ');
  return `<main class="surface">
${banner ? `<div class="surface-banner">${banner}</div>` : ''}
${nav ? `<nav class="surface-nav">\n  ${nav}\n</nav>` : ''}
${bodyHtml}
</main>`;
}

export function renderPage(ctx) {
  const { chrome = 'sidebar', mode = 'devserver', title, manifest, proseCss } = ctx;
  const body = chrome === 'surface' ? surfaceBody(ctx) : sidebarBody(ctx);
  const bodyClass = chrome === 'surface' ? 'bg-sand-50' : 'bg-sand-50 dark:bg-sand-950';
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
${head({ mode, title, manifest, proseCss: mode === 'standalone' ? proseCss : null })}
</head>
<body class="${bodyClass}">
  ${body}
${mode === 'standalone' ? '' : '  <load src="../partials/pl-scripts.html" />'}
</body>
</html>
`;
}
