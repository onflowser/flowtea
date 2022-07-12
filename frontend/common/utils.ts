import { config } from "./config";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidWebsiteUrl(url: string) {
  const websiteRegex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return websiteRegex.test(url);
}

export function round(value: number, precision = 2) {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}

export async function uploadFile(endpoint: string, file: File, timeout = 5000) {
  let formData = new FormData();
  formData.append("file", file);

  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), timeout);

  let response = await fetch(config.apiHost + endpoint, {
    method: "POST",
    body: formData,
    signal: ctrl.signal,
  });
  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message);
  }
  return responseData;
}
