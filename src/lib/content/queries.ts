/** Truy vấn GROQ dùng cho Sanity – tách riêng để dễ kiểm thử. */

const categoryProjection = `{ "slug": slug.current, title, description, order }`;

const summaryFields = `
  "slug": slug.current,
  title,
  excerpt,
  "cover": { "url": coverImage.asset->url, "hotspot": coverImage.hotspot },
  "coverAlt": coverImage.alt,
  "tags": coalesce(tags, []),
  publishedAt,
  "featured": coalesce(featured, false),
  "category": category->${categoryProjection},
  "author": author->{ name, role, "avatarUrl": avatar.asset->url },
  "plain": { "vi": pt::text(body.vi), "en": pt::text(body.en) },
  "hasVideo": count(body.vi[_type == "youtube"]) > 0
`;

const bodyLang = (lang: string) =>
  `"${lang}": body.${lang}[]{
    ...,
    _type == "image" => { "_type": "figure", _key, "url": asset->url, alt, caption }
  }`;

/** Chỉ lấy bài đã có slug, chuyên mục và ngày đăng không ở tương lai. */
const postsFilter = `_type == "post" && defined(slug.current) && defined(category) && publishedAt <= now()`;

export const categoriesQuery = `*[_type == "category" && defined(slug.current)] | order(order asc, title.vi asc)${categoryProjection}`;

export const postSummariesQuery = `*[${postsFilter}] | order(publishedAt desc){${summaryFields}}`;

export const postBySlugQuery = `*[${postsFilter} && slug.current == $slug][0]{
  ${summaryFields},
  "body": { ${bodyLang("vi")}, ${bodyLang("en")} }
}`;
