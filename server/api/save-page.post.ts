import { defineEventHandler, readBody, createError } from "h3";
import { usePageStorage } from "../utils/storage";
import { DEFAULT_SITE, sanitiseSlug } from "../utils/storage/types";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body?.page || typeof body.page !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing 'page' field" });
  }
  if (!body?.data || typeof body.data !== "object") {
    throw createError({ statusCode: 400, statusMessage: "Missing 'data' field" });
  }

  const storage = usePageStorage();
  const site = sanitiseSlug(String(body.site ?? ""), DEFAULT_SITE);
  const page = sanitiseSlug(body.page, "page");

  await storage.createSite(site);
  await storage.savePage(site, page, body.data);

  // The header navigation is shared across every page of a site, so persist
  // this page's AppHeader menus as that site's canonical menu.
  const header = Array.isArray(body.data.blocks)
    ? body.data.blocks.find((b: any) => b?.type === "AppHeader")
    : undefined;
  if (Array.isArray(header?.menus)) {
    await storage.setMenu(site, header.menus);
  }

  return { ok: true, site, page, storage: storage.name };
});
