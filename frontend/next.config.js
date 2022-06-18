/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.cdc/,
      use: "raw-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
