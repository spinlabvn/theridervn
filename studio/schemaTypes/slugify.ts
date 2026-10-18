/** Tạo slug không dấu cho tiếng Việt: "Đà Lạt mùa khô" → "da-lat-mua-kho" */
export function slugifyVi(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}
