import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the standalone outreach PWA from public/tracker (not an App Router page).
  async redirects() {
    return [
      {
        source: "/tracker",
        destination: "/tracker/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
