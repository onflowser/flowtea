const flow = {
  deploymentAccountAddress:
    (process.env.NEXT_PUBLIC_FLOW_DEPLOYMENT_ACCOUNT_ADDRESS as any) ||
    "0xf8d6e0586b0a20c7",
};

export type Environment = "development" | "staging" | "production";

export const environment: Environment = (process.env.NODE_ENV ||
  "development") as Environment;

const apiHost =
  (process.env.NEXT_PUBLIC_API_HOST as any) || "http://localhost:3000";

export const config = {
  flow,
  apiHost,
  environment,
};

export function getDomain() {
  // This function is also used on the backend (during SSR).
  const domain =
    typeof window !== "undefined"
      ? window.location.host
      : "http://localhost:3000";
  switch (environment) {
    case "production":
    case "staging":
      return `https://${domain}`;
    case "development":
      return `http://${domain}`;
  }
}
