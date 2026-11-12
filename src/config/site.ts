/**
 * Cấu hình thương hiệu TheRider.
 * Đặt logo vào public/brand/ rồi khai báo đường dẫn ở `logo` (để null sẽ dùng logo chữ).
 * Màu thương hiệu nằm trong src/app/globals.css (khối "BRAND TOKENS").
 */
export const site = {
  name: "TheRider",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://therider.vn").replace(/\/$/, ""),
  /**
   * Logo lấy từ therider.vn: chữ trắng trên nền trong suốt (360×70).
   * Ở giao diện sáng, logo được tô đen bằng CSS (filter) nên chỉ cần một file.
   */
  logo: {
    src: "/brand/therider-logo.png" as string | null,
    width: 144,
    height: 28,
  },
  email: "info@therider.vn",
  social: {
    facebook: "https://www.facebook.com/therider.vn",
    instagram: "https://www.instagram.com/therider.vn/",
    youtube: "https://www.youtube.com/@theridertv",
    tiktok: "https://www.tiktok.com/@therider.vn",
  },
  postsPerPage: 12,
  /**
   * Ô quảng cáo cột trái trang chủ – cao bằng khối "Xem nhiều nhất" (~290×800px trên màn hình rộng).
   * Banner nên dọc khoảng 1:2.5 (vd. 600×1500), nội dung chính đặt giữa vì mép trên/dưới có thể bị cắt.
   * Đặt file banner vào public/ads/ rồi điền `image: "/ads/ten-file.jpg"`, `href`: trang của nhà tài trợ.
   * Để `image` trống thì hiện ô "Đặt quảng cáo tại đây" dẫn tới email liên hệ.
   */
  ad: {
    image: "" as string,
    href: "" as string,
    alt: "" as string,
  },
} as const;
