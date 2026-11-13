import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  /**
   * Hosting dùng chung (Hostinger) báo số CPU của cả máy chủ nhưng giới hạn tiến trình/bộ nhớ mỗi tài khoản.
   * Build bằng webpack (script "build") và chỉ dùng 2 tiến trình để không bị chặn giữa chừng.
   */
  experimental: {
    cpus: 2,
    webpackMemoryOptimizations: true,
  },
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
      // Trang "Tất cả bài viết" đã gộp vào trang chủ (có phân trang)
      { source: "/:locale(vi|en)/blog", destination: "/:locale", permanent: true },
      { source: "/:locale(vi|en)/blog/page/:page", destination: "/:locale/page/:page", permanent: true },
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
