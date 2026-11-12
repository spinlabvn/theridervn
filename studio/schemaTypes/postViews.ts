import { defineField, defineType } from "sanity";

/** Lượt xem do website tự ghi (POST /api/views). Chỉ để xem, không sửa tay. */
export const postViews = defineType({
  name: "postViews",
  title: "Lượt xem",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "slug", title: "Slug bài viết", type: "string" }),
    defineField({ name: "views", title: "Lượt xem", type: "number" }),
  ],
  orderings: [{ title: "Nhiều lượt xem nhất", name: "viewsDesc", by: [{ field: "views", direction: "desc" }] }],
  preview: {
    select: { title: "slug", views: "views" },
    prepare: ({ title, views }) => ({ title, subtitle: `${views ?? 0} lượt xem` }),
  },
});
