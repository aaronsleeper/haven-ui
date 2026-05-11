import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@haven/design-system/styles';
import 'preline';
import { App } from './App';

// Font-features gate: pairs with `:where(html.fonts-loaded) body` in
// base/font-features.css. See font-features.css comment block for full
// rationale. Prevents superscript flash during Google Fonts swap window.
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Vanilla panel-splitter — IIFE that querySelectorAll('[data-panel-splitter]')
// at script-eval time. Defer past the first React commit so the panes are in
// the DOM when the script runs. The splitter mutates `style` on the adjacent
// pane; App.tsx never sets `style` on those panes, so there is no React-vs-DOM
// race (cf. Patch C accordion completion note). Promote to a React port
// (`<PanelSplitter>` or `usePanelSplitter`) when a second consumer needs the
// behavior or we want React-controlled pane state (collapse persistence,
// layout memory).
requestAnimationFrame(() => {
  void import('@haven/design-system/scripts/components/panel-splitter.js');
});
