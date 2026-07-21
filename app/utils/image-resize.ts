/**
 * Downscale / re-encode images before they reach the page-builder's image field.
 *
 * The field in `vue-wswg-editor` rejects anything over 10MB or outside
 * jpeg/png/gif/webp, and on rejection it returns early *leaving the previous
 * image in place* — so a rejected upload silently looks like "the preview kept
 * the old image". Its limits aren't configurable (BlockImageNode never forwards
 * fieldConfig), so we normalise the file here instead.
 *
 * Re-encoding to WebP also keeps the saved pb-*-schema.json files small, since
 * images are stored inline as base64 data URIs.
 */

/** Types the editor's image field will accept. */
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

/** The field's hard limit is 10MB; stay comfortably under it. */
const TARGET_MAX_BYTES = 6 * 1024 * 1024;

/** Longest edge, in px, after downscaling. Plenty for full-bleed hero images. */
const MAX_DIMENSION = 1920;

export interface PreparedImage {
  file: File;
  changed: boolean;
  /** Human-readable note when we could not process the file. */
  problem?: string;
}

function decodeFallback(file: File): Promise<ImageBitmap | HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode failed"));
    };
    img.src = url;
  });
}

async function decode(file: File) {
  // createImageBitmap honours EXIF orientation and handles every format the
  // browser can decode; fall back to <img> where it's unavailable.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    } catch {
      /* fall through */
    }
  }
  return decodeFallback(file);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Returns a file safe to hand to the editor's image field. If the original is
 * already small enough and of an accepted type, it is passed through untouched.
 */
export async function prepareImageForUpload(file: File): Promise<PreparedImage> {
  // Animated GIFs would lose their animation when redrawn through a canvas,
  // so leave them alone and let the field apply its own rules.
  if (file.type === "image/gif") {
    return { file, changed: false };
  }

  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await decode(file);
  } catch {
    return {
      file,
      changed: false,
      problem: `This file couldn't be read as an image (${file.type || "unknown type"}). Convert it to JPEG or PNG and try again.`,
    };
  }

  const width = "width" in source ? source.width : 0;
  const height = "height" in source ? source.height : 0;
  if (!width || !height) {
    return { file, changed: false, problem: "This image has no readable dimensions." };
  }

  const withinSize = file.size <= TARGET_MAX_BYTES;
  const withinDims = Math.max(width, height) <= MAX_DIMENSION;
  const acceptedType = ACCEPTED_TYPES.includes(file.type);
  if (withinSize && withinDims && acceptedType) {
    return { file, changed: false };
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) return { file, changed: false, problem: "Could not process this image." };
  ctx.drawImage(source as CanvasImageSource, 0, 0, canvas.width, canvas.height);
  if ("close" in source && typeof source.close === "function") source.close();

  // WebP keeps transparency and compresses well, and the field accepts it.
  // Step the quality down until we're comfortably under the size ceiling.
  let blob: Blob | null = null;
  for (const quality of [0.85, 0.7, 0.55, 0.4]) {
    blob = (await canvasToBlob(canvas, "image/webp", quality)) ?? (await canvasToBlob(canvas, "image/jpeg", quality));
    if (blob && blob.size <= TARGET_MAX_BYTES) break;
  }
  if (!blob) {
    return { file, changed: false, problem: "Could not re-encode this image." };
  }

  const baseName = file.name.replace(/\.[^./\\]+$/, "") || "image";
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  return {
    file: new File([blob], `${baseName}.${ext}`, { type: blob.type, lastModified: Date.now() }),
    changed: true,
  };
}
