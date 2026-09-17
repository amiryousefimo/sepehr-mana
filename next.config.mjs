import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  output: "standalone",
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
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);