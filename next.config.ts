import type { NextConfig } from "next";
import { legacyRedirects } from "./src/lib/legacy-redirects";
import { securityHeaders } from "./src/lib/security-headers";

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
