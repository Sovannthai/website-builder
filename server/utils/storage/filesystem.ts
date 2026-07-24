import { readFile, writeFile, readdir, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type { MenuItem, PageData, PageStorage } from "./types";
import { DEFAULT_SITE, sanitiseSlug } from "./types";

/**
 * Stores each website as its own folder under public/sites/:
 *
 *   public/sites/<site>/menu.json
 *   public/sites/<site>/pages/<page>.json
 *
 * Living under public/ means the editor and preview can fetch the JSON
 * directly as a static asset, which keeps them fast and simple.
 *
 * Requires a writable disk, so it's the local-dev driver — swap in a
 * database/API adapter on serverless hosts.
 */
export function createFilesystemStorage(options: { root?: string } = {}): PageStorage {
  const root = options.root ?? join(process.cwd(), "public", "sites");

  const siteDir = (site: string) => join(root, sanitiseSlug(site, DEFAULT_SITE));
  const pagesDir = (site: string) => join(siteDir(site), "pages");
  const pageFile = (site: string, page: string) =>
    join(pagesDir(site), `${sanitiseSlug(page, "page")}.json`);
  const menuFile = (site: string) => join(siteDir(site), "menu.json");

  async function readJson<T>(file: string): Promise<T | null> {
    try {
      return JSON.parse(await readFile(file, "utf-8")) as T;
    } catch {
      // Missing or malformed - treat both as "not there".
      return null;
    }
  }

  async function writeJson(file: string, value: unknown): Promise<void> {
    await mkdir(join(file, ".."), { recursive: true });
    await writeFile(file, JSON.stringify(value, null, 2), "utf-8");
  }

  return {
    name: "filesystem",

    async listSites() {
      try {
        const entries = await readdir(root, { withFileTypes: true });
        return entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
      } catch {
        return [];
      }
    },

    async createSite(site) {
      const slug = sanitiseSlug(site, DEFAULT_SITE);
      await mkdir(join(root, slug, "pages"), { recursive: true });
      return slug;
    },

    async listPages(site) {
      try {
        const files = await readdir(pagesDir(site));
        return files
          .filter((f) => f.endsWith(".json"))
          .map((f) => f.replace(/\.json$/, ""))
          .sort();
      } catch {
        return [];
      }
    },

    async getPage(site, page) {
      return readJson<PageData>(pageFile(site, page));
    },

    async savePage(site, page, data) {
      await writeJson(pageFile(site, page), data);
    },

    async deletePage(site, page) {
      try {
        await unlink(pageFile(site, page));
      } catch {
        // Already gone - deleting is idempotent.
      }
    },

    async getMenu(site) {
      const parsed = await readJson<{ menus?: MenuItem[] }>(menuFile(site));
      return Array.isArray(parsed?.menus) ? parsed.menus : [];
    },

    async setMenu(site, menus) {
      await writeJson(menuFile(site), { menus });
    },
  };
}
