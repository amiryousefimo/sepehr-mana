import createNextIntlPlugin from "next-intl/plugin";

const didbanFiles = ["./didban/*.py", "./didban/bank.json", "./didban/static/**/*", "./didban/vendor/**/*"];
const nextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingIncludes: {
      "/didban/**": didbanFiles,
      "/api/admin/didban": didbanFiles,
      "/api/admin/didban/**": didbanFiles,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.mhka.cloud",
        pathname: "/api/media/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/fa",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/hackaton",
        destination: "/hackaton/index.html",
      },
      {
        source: "/hackaton/",
        destination: "/hackaton/index.html",
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
