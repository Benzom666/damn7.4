/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.api.here.com;",
              "style-src 'self' 'unsafe-inline' https://js.api.here.com;",
              "img-src 'self' data: blob: https://*.hereapi.com;",
              "connect-src 'self' https://*.hereapi.com https://*.here.com;",
              "font-src 'self' data:;",
              "worker-src 'self' blob:;",
            ].join(" ")
          }
        ]
      }
    ];
  },
};
export default nextConfig;
