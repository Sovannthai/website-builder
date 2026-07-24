import { defineEventHandler, getQuery } from "h3";
import { usePageStorage } from "../utils/storage";
import { DEFAULT_SITE, sanitiseSlug } from "../utils/storage/types";

// The shared header navigation for a site (single source of truth for all of
// that site's pages). See save-page.post.ts, which writes it.
export default defineEventHandler(async (event) => {
  const site = sanitiseSlug(String(getQuery(event).site ?? ""), DEFAULT_SITE);
  const menus = await usePageStorage().getMenu(site);
  return { site, menus };
});
