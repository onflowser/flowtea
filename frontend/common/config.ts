const flow = {
  deploymentAccountAddress:
    (process.env.FLOW_DEPLOYMENT_ACCOUNT_ADDRESS as any) ||
    "0xf8d6e0586b0a20c7",
};

const apiHost =
  (process.env.NEXT_PUBLIC_API_HOST as any) || "http://localhost:3000";

export const config = {
  flow,
  apiHost,
};
