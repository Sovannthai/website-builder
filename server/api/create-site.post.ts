import { defineEventHandler, readBody, createError } from "h3";
import { usePageStorage } from "../utils/storage";
import { sanitiseSlug } from "../utils/storage/types";

/** Creates a new website (project) folder by name. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const slug = sanitiseSlug(String(body?.site ?? ""));
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing or invalid 'site' name" });
  }
  const site = await usePageStorage().createSite(slug);
  return { ok: true, site };
});
