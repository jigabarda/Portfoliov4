/**
 * Sent with every response. A full Content-Security-Policy is left out on purpose: the theme
 * boot script and JSON-LD are inline, and a static site with no logins gains little from it.
 * HTTPS-only (Strict-Transport-Security) is already added by Vercel.
 */
export const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];
