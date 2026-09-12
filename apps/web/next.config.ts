import type { NextConfig } from "next";

const consoleOrigin = (
  process.env.NEXT_PUBLIC_VET_CONSOLE_URL ||
  process.env.VET_CONSOLE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: `frame-ancestors 'self' ${consoleOrigin} http://127.0.0.1:3000; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; base-uri 'self'; form-action 'self'`,
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@vet/schema", "@vet/sdk"],
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async redirects() {
    return [
      { source: "/pricing/self-host", destination: "/pricing", permanent: false },
      { source: "/enterprise", destination: "/self-host", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/", headers: securityHeaders },
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
