// Page shell + sidebar generator.
// The shell is FIXED PLUMBING (chrome + nav walk); the brand surface is entirely
// in the haven-ui classes it references + the inherited components.css. It reuses
// the pattern-library's own <load> partials so CSS/fonts/dark-mode come for free
// from the design-system dev server.

// Walk the nav manifest -> haven-ui-styled sidebar. This is the docs.json -> sidebar
// step; the manifest is a pure data tree, exactly like Mintlify's navigation object.
function renderSidebar(manifest, currentSlug) {
  const groups = manifest.nav
    .map((group) => {
      const items = group.pages
        .map((p) => {
          const active = p.slug === currentSlug;
          const cls = active
            ? 'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
            : 'flex items-center gap-2 px-3 py-2 rounded-md text-sm text-sand-700 hover:bg-sand-100 dark:text-sand-300 dark:hover:bg-sand-800';
          const ic = p.icon ? `<i class="fa-solid fa-${p.icon} w-4 text-center"></i>` : '';
          return `<li><a href="./${p.slug}.html" class="${cls}">${ic}<span>${p.title}</span></a></li>`;
        })
        .join('\n            ');
      return `
        <li class="mb-5">
          <p class="px-3 mb-1 text-xs font-semibold uppercase tracking-wide text-sand-500">${group.group}</p>
          <ul class="space-y-0.5">
            ${items}
          </ul>
        </li>`;
    })
    .join('\n');

  return `
  <aside class="fixed inset-y-0 left-0 w-64 border-r border-sand-200 dark:border-sand-700 bg-white dark:bg-sand-900 overflow-y-auto">
    <div class="px-6 py-5 border-b border-sand-200 dark:border-sand-700">
      <a href="./${manifest.nav[0].pages[0].slug}.html" class="text-lg font-display font-semibold text-sand-900 dark:text-sand-100">
        ${manifest.title}
      </a>
      <p class="text-xs text-sand-500 mt-0.5">${manifest.subtitle || ''}</p>
    </div>
    <nav class="px-3 py-4" aria-label="Docs navigation">
      <ul>${groups}
      </ul>
    </nav>
  </aside>`;
}

export function renderPage({ manifest, slug, title, description, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <load src="../partials/pl-head.html" />
  <title>${title} — ${manifest.title}</title>
</head>
<body class="bg-sand-50 dark:bg-sand-950">
  ${renderSidebar(manifest, slug)}
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
  </main>
  <load src="../partials/pl-scripts.html" />
</body>
</html>
`;
}
