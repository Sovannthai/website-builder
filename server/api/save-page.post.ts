import { writeFileSync } from "fs";
import { join } from "path";
import { defineEventHandler, readBody, createError } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body?.page || typeof body.page !== "string") {
    throw createError({ statusCode: 400, statusMessage: "Missing 'page' field" });
  }
  if (!body?.data || typeof body.data !== "object") {
    throw createError({ statusCode: 400, statusMessage: "Missing 'data' field" });
  }

  // Sanitise page name to prevent path traversal
  const safePage = body.page.replace(/[^a-z0-9_-]/gi, "_");
  const filePath = join(process.cwd(), "public", `pb-${safePage}-schema.json`);

  writeFileSync(filePath, JSON.stringify(body.data, null, 2), "utf-8");

  // The header navigation is shared across every page. Persist this page's
  // AppHeader menus to the canonical menu.json so all pages stay in sync.
  const header = Array.isArray(body.data.blocks)
    ? body.data.blocks.find((b: any) => b?.type === "AppHeader")
    : undefined;
  if (Array.isArray(header?.menus)) {
    const menuPath = join(process.cwd(), "public", "menu.json");
    writeFileSync(menuPath, JSON.stringify({ menus: header.menus }, null, 2), "utf-8");
  }

  return { ok: true, file: `pb-${safePage}-schema.json` };
});
