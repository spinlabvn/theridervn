import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  /** Giữ link cũ của therider.vn (SEO + link đã chia sẻ) – chuyển hướng vĩnh viễn sang cấu trúc mới */
  async redirects() {
    return [
      { source: "/post/:slug", destination: "/vi/blog/:slug", permanent: true },
      { source: "/danh-muc/:slug", destination: "/vi/category/:slug", permanent: true },
      { source: "/tag/:slug", destination: "/vi/tag/:slug", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
