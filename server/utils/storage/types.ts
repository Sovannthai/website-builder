/**
 * Storage contract for page-builder content.
 *
 * The builder hosts several websites, each a "site" (project) with its own
 * pages and navigation. Everything is addressed by (site, page) so the backing
 * store stays swappable: files on disk in local dev, a database or REST API in
 * production.
 *
 * On disk this maps to:
 *   public/sites/<site>/menu.json
 *   public/sites/<site>/pages/<page>.json
 */

export interface MenuItem {
  id?: string;
  title: string;
  path: string;
  children?: MenuItem[];
}

/** A saved page: `blocks` plus the layout `settings`. */
export interface PageData {
  blocks: any[];
  settings?: Record<string, any>;
  [key: string]: any;
}

export interface PageStorage {
  /** Identifier used in errors/logs, e.g. "filesystem". */
  readonly name: string;

  /** Site (project) slugs, sorted. */
  listSites(): Promise<string[]>;

  /** Create a site if it doesn't exist. Returns the sanitised slug. */
  createSite(site: string): Promise<string>;

  /** Page slugs within a site, sorted. */
  listPages(site: string): Promise<string[]>;

  /** A page's content, or null when it doesn't exist. */
  getPage(site: string, page: string): Promise<PageData | null>;

  savePage(site: string, page: string, data: PageData): Promise<void>;

  deletePage(site: string, page: string): Promise<void>;

  /** Header navigation, shared across every page of a site. */
  getMenu(site: string): Promise<MenuItem[]>;

  setMenu(site: string, menus: MenuItem[]): Promise<void>;
}

/** Site used when a request doesn't name one. */
export const DEFAULT_SITE = "default";

/**
 * Slugs become directory names, filenames and URL segments, so constrain them
 * to a safe character set. Centralised so every adapter sanitises identically
 * and no caller can traverse out of its folder.
 */
export function sanitiseSlug(value: string, fallback = ""): string {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[^a-z0-9_-]/gi, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 100);
  return cleaned || fallback;
}

/** Back-compat alias — page names use the same rules as site names. */
export const sanitisePageName = (page: string) => sanitiseSlug(page, "page");
