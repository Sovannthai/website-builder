export const apiConfig = {
  baseUrl: "",
};
export async function setBaseUrl() {
  let baseUrl = "http://localhost:8055";
  if (window?.location?.origin) {
    const currentHost = window.location.origin;
    console.log('setBaseUrl called', currentHost);
    const response = await $fetch(`${currentHost}/env`) as any;
    baseUrl = response.BACKEND_ADDR;
    console.log('currentHost', baseUrl);
  }
  apiConfig.baseUrl = baseUrl;
}

export async function get(path: string, params?: { [key: string]: any }) {
  const url = `${apiConfig.baseUrl}/items/${path}`;
  return await $fetch(url, {
    method: "GET",
    params,
  });
}

export async function post(path: string, body: any) {
  const url = `${apiConfig.baseUrl}/items/${path}`;
  return await $fetch(url, {
    method: "POST",
    body,
  });
}