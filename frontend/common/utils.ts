export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type Environment = "development" | "staging" | "production";

export const env: Environment = (process.env.NODE_ENV ||
  "development") as Environment;

export function getDomain() {
  // This function is also used on the backend (during SSR).
  const domain =
    typeof window !== "undefined"
      ? window.location.host
      : "http://localhost:3000";
  switch (env) {
    case "production":
    case "staging":
      return `https://${domain}`;
    case "development":
      return `http://${domain}`;
  }
}

export function isValidWebsiteUrl(url: string) {
  const websiteRegex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  return websiteRegex.test(url);
}
