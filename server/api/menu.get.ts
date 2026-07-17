import { readFileSync } from "fs";
import { join } from "path";
import { defineEventHandler } from "h3";

// Returns the shared header navigation menu (single source of truth for all
// page-builder pages). See server/api/save-page.post.ts, which writes it.
export default defineEventHandler(() => {
  const filePath = join(process.cwd(), "public", "menu.json");
  try {
    const contents = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(contents);
    return { menus: Array.isArray(parsed?.menus) ? parsed.menus : [] };
  } catch {
    return { menus: [] };
  }
});
