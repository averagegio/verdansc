import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.verdansc.com",
          },
        ],
        destination: "https://verdansc.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
