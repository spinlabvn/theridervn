import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("TheRider")
    .items([
      S.listItem()
        .title("Bài viết")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Bài viết").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
      S.listItem()
        .title("Bài nổi bật")
        .schemaType("post")
        .child(S.documentList().title("Bài nổi bật").filter('_type == "post" && featured == true')),
      S.divider(),
      S.documentTypeListItem("category").title("Chuyên mục"),
      S.documentTypeListItem("author").title("Tác giả"),
    ]);
