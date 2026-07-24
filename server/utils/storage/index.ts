import type { PageStorage } from "./types";
import { createFilesystemStorage } from "./filesystem";
import { createHttpStorage } from "./http";

// Note: deliberately no re-exports of ./types, ./filesystem or ./http here.
// Nitro auto-imports every named export under server/utils/**, so re-exporting
// them would register the same names twice ("Duplicated imports" warnings).
// Import them from their own modules instead.

let cached: PageStorage | null = null;

/**
 * The storage adapter for this deployment.
 *
 * Chosen by runtime config, so the driver can change per environment without
 * touching route code:
 *   NUXT_PAGE_STORAGE=filesystem   (default — local dev)
 *   NUXT_PAGE_STORAGE=http         (+ NUXT_PAGE_STORAGE_URL, e.g. serverless)
 *
 * Consumers of this as a library can also ignore both and inject their own
 * adapter with `setPageStorage()`.
 */
export function usePageStorage(): PageStorage {
  if (cached) return cached;

  const config = useRuntimeConfig();
  const driver = String((config as any).pageStorage ?? "filesystem");

  if (driver === "http") {
    const baseUrl = String((config as any).pageStorageUrl ?? "");
    if (!baseUrl) {
      // Fail loudly: silently falling back to disk would "work" in dev and
      // then lose every save in production.
      throw new Error(
        "[storage] NUXT_PAGE_STORAGE=http requires NUXT_PAGE_STORAGE_URL to be set."
      );
    }
    cached = createHttpStorage({
      baseUrl,
      collection: String((config as any).pageStorageCollection || "pages"),
      menuCollection: String((config as any).pageStorageMenuCollection || "site_menu"),
      token: String((config as any).pageStorageToken || "") || undefined,
    });
  } else {
    cached = createFilesystemStorage();
  }

  return cached;
}

/** Override the adapter (tests, or library consumers wiring their own store). */
export function setPageStorage(storage: PageStorage): void {
  cached = storage;
}
