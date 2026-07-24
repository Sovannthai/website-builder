import { defineEventHandler, getQuery } from "h3";
import { usePageStorage } from "../utils/storage";
import { DEFAULT_SITE, sanitiseSlug } from "../utils/storage/types";

export default defineEventHandler(async (event) => {
  const site = sanitiseSlug(String(getQuery(event).site ?? ""), DEFAULT_SITE);
  const pages = await usePageStorage().listPages(site);
  return { site, pages };
});
