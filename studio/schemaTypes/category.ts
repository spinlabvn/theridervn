import { defineField, defineType } from "sanity";
import { slugifyVi } from "./slugify";

export const category = defineType({
  name: "category",
  title: "Chuyên mục",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Tên chuyên mục", type: "localeString", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Đường dẫn (slug)",
      type: "slug",
      description: "Phần URL: therider.vn/vi/category/<slug>. Nên dùng tiếng Anh ngắn gọn: road, mtb, gravel…",
      options: { source: "title.en", slugify: slugifyVi },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", title: "Mô tả ngắn", type: "localeText" }),
    defineField({
      name: "order",
      title: "Thứ tự hiển thị trên menu",
      type: "number",
      initialValue: 10,
    }),
  ],
  orderings: [{ title: "Thứ tự menu", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title.vi", subtitle: "slug.current" } },
});
