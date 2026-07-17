import { readdirSync } from "fs";
import { join } from "path";
import { defineEventHandler } from "h3";

export default defineEventHandler(() => {
  const publicDir = join(process.cwd(), "public");
  const files = readdirSync(publicDir);

  const pages = files
    .filter((f) => /^pb-.+-schema\.json$/.test(f))
    .map((f) => f.replace(/^pb-/, "").replace(/-schema\.json$/, ""))
    .sort();

  return { pages };
});
