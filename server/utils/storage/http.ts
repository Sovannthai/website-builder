import type { MenuItem, PageData, PageStorage } from "./types";
import { DEFAULT_SITE, sanitiseSlug } from "./types";

/**
 * Persists sites/pages through a REST backend instead of the disk — the
 * adapter to use on serverless hosts, where the filesystem is read-only.
 *
 * Assumes Directus-style collections (matching app/utils/api.ts):
 *   GET    {baseUrl}/items/{collection}?filter[site][_eq]=x&filter[slug][_eq]=y
 *   POST   {baseUrl}/items/{collection}        { site, slug, data }
 *   PATCH  {baseUrl}/items/{collection}/{id}   { data }
 *   DELETE {baseUrl}/items/{collection}/{id}
 *
 * Included mainly to keep the interface honest — an abstraction with a single
 * implementation is usually shaped by that implementation. Adjust the request
 * format to whatever backend you point it at.
 */
export function createHttpStorage(options: {
  baseUrl: string;
  collection?: string;
  menuCollection?: string;
  token?: string;
}): PageStorage {
  const baseUrl = options.baseUrl.replace(/\/+$/, "");
  const collection = options.collection ?? "pages";
  const menuCollection = options.menuCollection ?? "site_menu";

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const request = <T>(path: string, init?: RequestInit) =>
    $fetch<T>(`${baseUrl}${path}`, { headers, ...init } as any);

  const q = (site: string, page?: string) => {
    const parts = [`filter[site][_eq]=${encodeURIComponent(sanitiseSlug(site, DEFAULT_SITE))}`];
    if (page) parts.push(`filter[slug][_eq]=${encodeURIComponent(sanitiseSlug(page, "page"))}`);
    return parts.join("&");
  };

  async function findPage(site: string, page: string) {
    const res = await request<{ data?: Array<{ id: string | number; data: PageData }> }>(
      `/items/${collection}?${q(site, page)}&limit=1`
    ).catch(() => null);
    return res?.data?.[0] ?? null;
  }

  async function findMenu(site: string) {
    const res = await request<{ data?: Array<{ id: string | number; menus?: MenuItem[] }> }>(
      `/items/${menuCollection}?${q(site)}&limit=1`
    ).catch(() => null);
    return res?.data?.[0] ?? null;
  }

  return {
    name: "http",

    async listSites() {
      const res = await request<{ data?: Array<{ site: string }> }>(
        `/items/${collection}?fields=site&limit=-1`
      ).catch(() => null);
      return [...new Set((res?.data ?? []).map((r) => r.site).filter(Boolean))].sort();
    },

    async createSite(site) {
      // Sites are implied by their rows here; nothing to provision up front.
      return sanitiseSlug(site, DEFAULT_SITE);
    },

    async listPages(site) {
      const res = await request<{ data?: Array<{ slug: string }> }>(
        `/items/${collection}?${q(site)}&fields=slug&limit=-1`
      ).catch(() => null);
      return (res?.data ?? []).map((r) => r.slug).filter(Boolean).sort();
    },

    async getPage(site, page) {
      return (await findPage(site, page))?.data ?? null;
    },

    async savePage(site, page, data) {
      const existing = await findPage(site, page);
      if (existing) {
        await request(`/items/${collection}/${existing.id}`, {
          method: "PATCH",
          body: JSON.stringify({ data }),
        });
      } else {
        await request(`/items/${collection}`, {
          method: "POST",
          body: JSON.stringify({
            site: sanitiseSlug(site, DEFAULT_SITE),
            slug: sanitiseSlug(page, "page"),
            data,
          }),
        });
      }
    },

    async deletePage(site, page) {
      const existing = await findPage(site, page);
      if (existing) {
        await request(`/items/${collection}/${existing.id}`, { method: "DELETE" });
      }
    },

    async getMenu(site) {
      const record = await findMenu(site);
      return Array.isArray(record?.menus) ? record.menus : [];
    },

    async setMenu(site, menus) {
      const existing = await findMenu(site);
      if (existing) {
        await request(`/items/${menuCollection}/${existing.id}`, {
          method: "PATCH",
          body: JSON.stringify({ menus }),
        });
      } else {
        await request(`/items/${menuCollection}`, {
          method: "POST",
          body: JSON.stringify({ site: sanitiseSlug(site, DEFAULT_SITE), menus }),
        });
      }
    },
  };
}
