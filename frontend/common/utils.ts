export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export type Environment = 'development' | 'staging' | 'production';

export const env: Environment = (process.env.NODE_ENV || 'development') as Environment;

export function getDomain () {
  const domain = window.location.host;
  switch (env) {
    case "production":
    case "staging":
      return `https://${domain}`
    case "development":
      return `http://${domain}`
  }
}
