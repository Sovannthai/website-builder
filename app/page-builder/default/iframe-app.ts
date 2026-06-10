// app/page-builder/iframe-app.ts

import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import type { App } from "vue";

export default ({ app }: { app: App }) => {
  app.use(
    createVuetify({
      theme: {
        defaultTheme: "light",
      },
    }),
  );
};