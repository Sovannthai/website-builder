import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { vueWswgEditorPlugin } from "vue-wswg-editor/vite-plugin";
import { fileURLToPath, URL } from "node:url";

/**
 * Intercepts the wswg iframe virtual module (enforce:'pre' so it runs before the
 * wswg vite plugin) and wraps createIframeApp to install Vuetify into the
 * isolated Vue app before any blocks are rendered.
 */
function wswgVuetifyInjectorPlugin() {
  const VIRTUAL_ID = "virtual:wswg-iframe-app";
  const RESOLVED_ID = `\0${VIRTUAL_ID}`;
  return {
    name: "wswg-vuetify-iframe-injector",
    enforce: "pre" as const,
    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id: string) {
      if (id === RESOLVED_ID) {
        return `
import { createIframeApp as _createIframeApp } from 'vue-wswg-editor/src/components/IframePreview/iframePreviewEntry';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
      
export async function createIframeApp(container) {
  const app = await _createIframeApp(container);
  app.use(createVuetify({ components, directives }));
  return app;
}
`;
      }
    },
  };
}

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    public: {
      baseURL: process.env.BACKEND_ADDR,
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
        // @ts-expect-error
        config.plugins.push(vueWswgEditorPlugin({ rootDir: "@page-builder" }));
      });
    },
    "@vueuse/nuxt",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    resolve: {
      alias: {
        "@page-builder": fileURLToPath(new URL("./app/page-builder", import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: [
        "vue-wswg-editor",
        "vue-wswg-editor:layouts",
        "vue-wswg-editor:blocks",
        "vue-wswg-editor:fields",
        "vue-wswg-editor:thumbnails",
        "vue-wswg-editor:themes",
        "virtual:wswg-iframe-app",
      ],
    },
    plugins: [
      wswgVuetifyInjectorPlugin(),
      vuetify(),
    ],
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${fileURLToPath(new URL("./app/assets/scss/_global.scss", import.meta.url))}" as *;`,
        },
      },
    },
  },
  css: ["@mdi/font/css/materialdesignicons.css", "~/assets/main.scss"],
  app: {
    head: {
      title: "Website Builder",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css",
        },
      ],
    },
  },
});
