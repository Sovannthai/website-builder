import { defineEventHandler } from "h3";
import { usePageStorage } from "../utils/storage";

/** Lists the websites (projects) held by this builder. */
export default defineEventHandler(async () => {
  const sites = await usePageStorage().listSites();
  return { sites };
});
