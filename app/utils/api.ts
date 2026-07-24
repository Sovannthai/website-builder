export const apiConfig = {
  baseUrl: "",
};

/**
 * Resolve the backend base URL.
 *
 * `public/env.json` is the normal way to configure this, in both the builder
 * and exported sites: it's read at runtime, so a deployed site can be pointed
 * at a different backend by editing one file — no rebuild needed.
 *
 *  1. NUXT_PUBLIC_API_BASE — optional deploy-time override, wins when set.
 *  2. /env.json — the static file; works everywhere, including `nuxt generate`.
 *  3. /env — the builder's server route, which reads the same file.
 *  4. localhost fallback.
 */
export async function setBaseUrl() {
  // 1. explicit env-var override
  try {
    const config: any = useRuntimeConfig?.();
    const configured = config?.public?.apiBase;
    if (configured) {
      apiConfig.baseUrl = String(configured).replace(/\/+$/, "");
      return;
    }
  } catch {
    // useRuntimeConfig unavailable in this context — fall through
  }

  // 2/3. the runtime config file
  if (typeof window !== "undefined") {
    for (const url of ["/env.json", "/env"]) {
      try {
        const response = (await $fetch(url)) as any;
        if (response?.BACKEND_ADDR) {
          apiConfig.baseUrl = String(response.BACKEND_ADDR).replace(/\/+$/, "");
          return;
        }
      } catch {
        // Not present on this deployment — try the next.
      }
    }
  }

  // 4. fallback for a local backend
  apiConfig.baseUrl = "http://localhost:8055";
}

/** Ensure the base URL is resolved before the first request. */
async function ensureBaseUrl() {
  if (!apiConfig.baseUrl) await setBaseUrl();
}

/**
 * Build the request URL from whatever a block was given.
 *
 * Three forms are supported so a block can point at any backend:
 *   "news"                        -> {baseUrl}/items/news   (Directus collection)
 *   "/api/products"               -> {baseUrl}/api/products (path on the backend)
 *   "https://api.example.com/x"   -> used exactly as given
 */
export function buildUrl(path: string): string {
  const value = String(path ?? "").trim();
  if (/^https?:\/\//i.test(value)) return value;

  const base = apiConfig.baseUrl.replace(/\/+$/, "");
  if (value.startsWith("/")) return `${base}${value}`;
  return `${base}/items/${value}`;
}

export async function get(path: string, params?: { [key: string]: any }) {
  await ensureBaseUrl();
  return await $fetch(buildUrl(path), {
    method: "GET",
    params,
  });
}

export async function post(path: string, body: any) {
  await ensureBaseUrl();
  return await $fetch(buildUrl(path), {
    method: "POST",
    body,
  });
}
