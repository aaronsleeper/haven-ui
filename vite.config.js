import { resolve } from 'path';
import { defineConfig } from 'vite';
import { glob } from 'glob';
import htmlInject from 'vite-plugin-html-inject';
import tailwindcss from '@tailwindcss/vite';

// Auto-discover all HTML entry points under apps/ and pattern-library/
// No manual registration needed — new pages are picked up automatically.
function getHtmlEntries() {
  const files = glob.sync([
    'index.html',
    'apps/**/*.html',
    'pattern-library/**/*.html',
  ]);

  return Object.fromEntries(
    files.map((file) => {
      // Use the file path (minus .html) as the entry key
      const key = file.replace(/\.html$/, '').replace(/\//g, '-');
      return [key, resolve(__dirname, file)];
    })
  );
}

export default defineConfig({
  server: {
    port: 5173,
    // Fail loudly if 5173 is taken — prevents silent port drift and verification against wrong server
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
