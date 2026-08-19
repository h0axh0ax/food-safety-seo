import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/hazards",
        destination: "/library",
        permanent: true,
      },
      {
        source: "/hazards/:slug",
        destination: "/library/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
