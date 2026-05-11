import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
