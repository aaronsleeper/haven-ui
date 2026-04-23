import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@haven/design-system/styles';
import 'preline';
import { App } from './App';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root not found');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
