import { defineConfig } from 'wxt';
import wasm from 'vite-plugin-wasm';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  manifest: {
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    default_locale: "en",
    permissions: ["storage", "unlimitedStorage", "sidePanel", "contextMenus"],
    host_permissions: ["https://ipapi.co/*", "<all_urls>"],
    cross_origin_embedder_policy: {
      value: "require-corp"
    },
    cross_origin_opener_policy: {
      value: "same-origin"
    },
    action: {},
    side_panel: {
      default_path: "vert.html"
    },
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
    }
  },
  vite: () => ({
    plugins: [
      wasm()
    ],
    worker: {
      plugins: () => [wasm()],
      format: "es",
    },
    resolve: {
      alias: {
        $lib: '/src/lib'
      }
    },
    optimizeDeps: {
      exclude: ["@ffmpeg/core", "@ffmpeg/ffmpeg", "@ffmpeg/util", "vert-wasm"]
    },
    build: {
      target: "esnext",
      minify: false
    },
    define: {
      __COMMIT_HASH__: JSON.stringify("extension")
    }
  })
});
