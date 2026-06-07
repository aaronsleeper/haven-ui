import { defineConfig } from 'vite';
import { themeEditorMiddleware } from './server-middleware';

export default defineConfig({
  server: {
    port: 5178,
    strictPort: true,
  },
  plugins: [
    {
      name: 'theme-editor-fs',
      configureServer(server) {
        themeEditorMiddleware(server);
      },
    },
  ],
});
