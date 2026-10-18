import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Tác giả",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Tên", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", title: "Vai trò", type: "localeString" }),
    defineField({ name: "avatar", title: "Ảnh đại diện", type: "image", options: { hotspot: true } }),
  ],
  preview: { select: { title: "name", subtitle: "role.vi", media: "avatar" } },
});
