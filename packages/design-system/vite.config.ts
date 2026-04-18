import { resolve } from 'path';
import { defineConfig } from 'vite';
import { glob } from 'glob';
import htmlInject from 'vite-plugin-html-inject';
import tailwindcss from '@tailwindcss/vite';

// Auto-discover all HTML entry points under pattern-library/ and the root index.
// The design-system dev server serves the pattern library as the authoritative
// spec. React apps consume the tokens via CSS import and mirror the pattern-
// library HTML class-for-class in their own components.
function getHtmlEntries(): Record<string, string> {
  const files = glob.sync([
    'index.html',
    'pattern-library/**/*.html',
  ]);

  return Object.fromEntries(
    files.map((file) => {
      const key = file.replace(/\.html$/, '').replace(/\//g, '-');
      return [key, resolve(__dirname, file)];
    }),
  );
}

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
  },
  plugins: [
    htmlInject(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        entryFileNames: 'assets/haven-ui.js',
        assetFileNames: 'assets/haven-ui.[ext]',
      },
    },
  },
});
