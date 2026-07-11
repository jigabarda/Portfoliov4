import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // `domains` is deprecated in Next 15 — use remotePatterns.
    remotePatterns: [
      { protocol: "https", hostname: "udemy-certificate.s3.amazonaws.com" },
      { protocol: "https", hostname: "img-c.udemycdn.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "www.svgrepo.com" },
    ],
    // Stack icons are SVGs from trusted CDNs. Next refuses to optimize SVG
    // unless explicitly allowed; the CSP + attachment disposition below
    // neutralize any embedded scripts so the SVGs cannot execute.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
