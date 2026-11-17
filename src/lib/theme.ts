/**
 * Script chạy trước khi vẽ trang để áp giao diện sáng/tối đã lưu (tránh nháy sai màu).
 * Mặc định luôn là nền sáng; chỉ dùng nền tối khi người đọc đã tự bật bằng nút chuyển giao diện.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('theme')==='dark'?'dark':'light';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();`;
