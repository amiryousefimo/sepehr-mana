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
  async headers() {
    return [{
      source: "/dashboard_2",
      headers: [
        {key: "Content-Security-Policy", value: "frame-src https://app.powerbi.com https://login.microsoftonline.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'"},
        {key: "Cache-Control", value: "private, no-store"}
      ]
    }];
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
      {
        source: "/dashboard_1",
        destination: "/dashboard_2",
        permanent: true,
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
