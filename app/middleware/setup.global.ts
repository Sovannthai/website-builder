import { setBaseUrl } from "@/utils/api";

let isBaseUrlSet = false;

export default defineNuxtRouteMiddleware (async(from, to) => {
  try {
    if (!isBaseUrlSet) {
      await setBaseUrl()
      console.log('isBaseUrlSet', isBaseUrlSet)
      isBaseUrlSet = true;
    }
  } catch(e: any) {
    console.log('error', e)
  }
})
