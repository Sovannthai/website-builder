/**
 * Resolve an image value coming from either content system into a usable src.
 *
 * Values arrive in three shapes:
 *  - bare filename from the legacy schemas ("cat.jpeg")      -> served from /img/
 *  - absolute URL or root path ("https://…", "/img/x.png")   -> used as-is
 *  - base64 data URI from the page-builder image field       -> used as-is
 *
 * Blindly prefixing "/img/" corrupts the last two, producing requests like
 * "/img/data:image/png;base64,…" that fail to load.
 */
export function resolveImageSrc(value?: string | null, fallback = ""): string {
  const src = (value ?? "").trim();
  if (!src) return fallback;
  if (/^(data:|blob:|https?:\/\/|\/)/i.test(src)) return src;
  return `/img/${src}`;
}
