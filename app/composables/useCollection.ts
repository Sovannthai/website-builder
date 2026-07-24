import { ref, watch, toValue, onMounted, type MaybeRefOrGetter, type Ref } from "vue";
import { get } from "~/utils/api";

/**
 * Fetch a list block's rows from the backend instead of the page schema.
 *
 * Blocks that show a list (posts, features, testimonials…) can either carry
 * static content saved in the page, or name a collection to pull live. This
 * keeps that switch in one place: pass the collection key from the block and
 * get back normalised rows plus loading/error state.
 *
 * Requests go through `get()`, i.e. `{BACKEND_ADDR}/items/{collection}`.
 */
export interface UseCollectionOptions<T> {
  /** Rows used when no collection is configured (the block's static content). */
  fallback?: MaybeRefOrGetter<T[] | undefined>;
  limit?: MaybeRefOrGetter<number | string | undefined>;
  /** Directus-style sort, e.g. "-date_created". */
  sort?: MaybeRefOrGetter<string | undefined>;
  /** Shape one API row into what the component expects. */
  map: (row: Record<string, any>) => T;
}

export function useCollection<T>(
  collection: MaybeRefOrGetter<string | undefined>,
  options: UseCollectionOptions<T>
): { items: Ref<T[]>; loading: Ref<boolean>; error: Ref<string | null> } {
  const items = ref([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<string | null>(null);

  const staticRows = () => (toValue(options.fallback) ?? []) as T[];

  async function load() {
    const key = (toValue(collection) ?? "").trim();

    // No collection configured — this block is using its static content.
    if (!key) {
      items.value = staticRows();
      error.value = null;
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const params: Record<string, any> = {};
      const limit = toValue(options.limit);
      const sort = toValue(options.sort);
      if (limit) params.limit = Number(limit);
      if (sort) params.sort = sort;

      const res: any = await get(key, params);
      // Directus returns { data: [...] }; tolerate a bare array too.
      const rows: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      items.value = rows.map(options.map);
    } catch (e: any) {
      error.value = e?.message || "Could not load content";
      // Fall back to whatever was saved so the page still renders something.
      items.value = staticRows();
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);
  watch(
    () => [toValue(collection), toValue(options.limit), toValue(options.sort)],
    load
  );
  // Keep static blocks in sync while editing in the builder.
  watch(
    () => toValue(options.fallback),
    () => {
      if (!(toValue(collection) ?? "").trim()) items.value = staticRows();
    },
    { deep: true }
  );

  return { items, loading, error };
}

/**
 * Read a value from an API row, trying a few common field names.
 * Backends name things differently (title/name, image/thumbnail…), so this
 * avoids forcing per-field mapping config into every block.
 */
export function pick(row: Record<string, any>, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = row?.[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

/**
 * Same as `pick`, but an explicitly configured key wins.
 *
 * Blocks let you name the API field to read (e.g. map "description" to the
 * backend's `short_description`). When that's left blank we fall back to the
 * common aliases, so simple backends need no mapping at all.
 *
 * Supports dot paths ("author.name") for nested rows.
 */
export function pickWith(
  row: Record<string, any>,
  overrideKey: string | undefined,
  aliases: string[],
  fallback = ""
): string {
  const key = (overrideKey ?? "").trim();
  if (key) {
    const value = key.includes(".")
      ? key.split(".").reduce<any>((acc, part) => (acc == null ? acc : acc[part]), row)
      : row?.[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
    // Configured key missing on this row — fall through to the aliases rather
    // than rendering an empty card.
  }
  return pick(row, aliases, fallback);
}

/** One row of a block's "API field mapping" repeater. */
export interface ApiFieldMapping {
  /** Which part of the component this fills, e.g. "title". */
  key?: string;
  /** The API field to read it from, e.g. "headline_text". */
  value?: string;
}

/**
 * Turn the repeater rows into a { slot -> apiField } lookup.
 *
 * `[{ key: "title", value: "headline_text" }]` means "fill the title from the
 * row's headline_text". Leaving `value` blank reads the field of the same name,
 * so `[{ key: "title" }]` simply reads `title`.
 */
export function toFieldMap(fields?: ApiFieldMapping[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const row of fields ?? []) {
    const slot = String(row?.key ?? "").trim();
    if (!slot) continue;
    map[slot] = String(row?.value ?? "").trim() || slot;
  }
  return map;
}

export const FIELD_ALIASES = {
  title: ["title", "name", "heading", "label"],
  description: ["description", "short_description", "summary", "excerpt", "subtitle", "content"],
  image: ["image", "thumbnail", "photo", "cover", "picture", "avatar", "url"],
  path: ["path", "slug", "url", "link"],
  role: ["role", "position", "job_title"],
  message: ["message", "quote", "testimonial", "comment", "content"],
  value: ["value", "count", "number", "total"],
};
