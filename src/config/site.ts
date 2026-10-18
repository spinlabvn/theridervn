/**
 * Cấu hình thương hiệu TheRider.
 * Đặt logo vào public/brand/ rồi khai báo đường dẫn ở `logo` (để null sẽ dùng logo chữ).
 * Màu thương hiệu nằm trong src/app/globals.css (khối "BRAND TOKENS").
 */
export const site = {
  name: "TheRider",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://therider.vn").replace(/\/$/, ""),
  logo: {
    light: null as string | null, // ví dụ "/brand/logo-dark.svg" (logo màu tối, dùng trên nền sáng)
    dark: null as string | null, // ví dụ "/brand/logo-light.svg" (logo màu sáng, dùng trên nền tối)
    width: 148,
    height: 32,
  },
  email: "hello@therider.vn",
  social: {
    facebook: "https://facebook.com/therider.vn",
    instagram: "https://instagram.com/therider.vn",
    youtube: "https://youtube.com/@therider",
    strava: "https://www.strava.com/clubs/therider",
  },
  postsPerPage: 12,
} as const;
