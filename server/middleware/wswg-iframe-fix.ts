import { defineEventHandler, getRequestURL, sendRedirect } from "h3";

/**
 * Fix for vue-wswg-editor in Nuxt: the iframe preview HTML generates a module
 * URL at /@id/... but in Nuxt, Vite's dev server is mounted under /_nuxt/ so
 * the correct path is /_nuxt/@id/...
 *
 * This middleware redirects /@id/ requests to /_nuxt/@id/ so the dynamic
 * import() inside the iframe can resolve the virtual module.
 */
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  if (url.pathname.startsWith("/@id/")) {
    const corrected = "/_nuxt" + url.pathname + url.search;
    return sendRedirect(event, corrected, 302);
  }
});
