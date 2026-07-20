import createNextIntlPlugin from "next-intl/plugin";
import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/fa",
        permanent: false
      }
    ];
  }
};

export default createNextIntlPlugin()(nextConfig);
