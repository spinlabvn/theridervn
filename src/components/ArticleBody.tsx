import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { BodyNode, FigureNode, GalleryNode, SpecTableNode, YoutubeNode } from "@/lib/content/types";
import { headingsOf } from "@/lib/content/text";

/** Ảnh Sanity cần tham số resize; ảnh nội bộ (/media/...) để next/image tự tối ưu. */
function src(url: string, w = 1600) {
  return url.startsWith("https://cdn.sanity.io") && !url.includes("?") ? `${url}?auto=format&w=${w}&q=80` : url;
}

export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/);
  return m ? m[1] : null;
}

export function ArticleBody({ body, videoTitle }: { body: BodyNode[]; videoTitle: string }) {
  const ids = new Map(headingsOf(body).map((h) => [h.key, h.id]));

  const components: PortableTextComponents = {
    block: {
      h2: ({ children, value }) => <h2 id={ids.get(value._key)}>{children}</h2>,
      h3: ({ children, value }) => <h3 id={ids.get(value._key)}>{children}</h3>,
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    marks: {
      link: ({ children, value }) => {
        const url: string = value?.href ?? "#";
        const external = /^https?:\/\//.test(url);
        return (
          <a href={url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {children}
          </a>
        );
      },
    },
    types: {
      figure: ({ value }: { value: FigureNode }) =>
        value?.url ? (
          <figure>
            <Image
              src={src(value.url)}
              alt={value.alt ?? ""}
              width={1600}
              height={1067}
              sizes="(min-width: 768px) 720px, 100vw"
              className="h-auto w-full bg-surface-2"
            />
            {value.caption ? <figcaption>{value.caption}</figcaption> : null}
          </figure>
        ) : null,

      youtube: ({ value }: { value: YoutubeNode }) => {
        const id = youtubeId(value?.url ?? "");
        if (!id) return null;
        return (
          <figure className="not-prose">
            <div className="relative aspect-video overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                title={videoTitle}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            </div>
          </figure>
        );
      },

      specTable: ({ value }: { value: SpecTableNode }) => {
        const rows = value?.rows ?? [];
        if (!rows.length) return null;
        const [head, ...rest] = value.hasHeader ? rows : [null, ...rows];
        return (
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[34rem] border-collapse font-sans text-[0.9375rem] leading-snug">
              {head ? (
                <thead>
                  <tr>
                    {head.cells.map((c, i) => (
                      <th key={i} scope="col" className="eyebrow border-b-2 border-ink px-3 py-3 text-left text-ink-2 first:pl-0">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {rest.map((r) =>
                  r ? (
                    <tr key={r._key} className="border-b border-line">
                      {r.cells.map((c, i) =>
                        i === 0 ? (
                          <th key={i} scope="row" className="px-3 py-2.5 text-left font-semibold first:pl-0">
                            {c}
                          </th>
                        ) : (
                          <td key={i} className={`px-3 py-2.5 ${i === 1 ? "text-ink-2" : ""}`}>
                            {c || "–"}
                          </td>
                        ),
                      )}
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
        );
      },

      gallery: ({ value }: { value: GalleryNode }) =>
        value?.images?.length ? (
          <div className={`grid gap-3 ${value.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {value.images.map((img) => (
              <div key={img._key} className="relative aspect-[3/2] overflow-hidden bg-surface-2">
                <Image src={src(img.url, 1200)} alt={img.alt ?? ""} fill sizes="(min-width: 768px) 360px, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        ) : null,
    },
  };

  return (
    <div className="prose-article">
      <PortableText value={body as never} components={components} />
    </div>
  );
}
