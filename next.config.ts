import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the standalone outreach PWA from public/tracker (not an App Router page).
  async rewrites() {
    return [{ source: "/tracker", destination: "/tracker/index.html" }];
  },
};

export default nextConfig;
