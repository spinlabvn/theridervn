import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { BodyNode } from "@/lib/content/types";
import { headingsOf } from "@/lib/content/text";

type Figure = { url: string; alt?: string; caption?: string };

export function ArticleBody({ body }: { body: BodyNode[] }) {
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
      figure: ({ value }: { value: Figure }) =>
        value?.url ? (
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
              <Image
                src={`${value.url}${value.url.includes("?") ? "" : "?auto=format&w=1600&q=80"}`}
                alt={value.alt ?? ""}
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                className="object-cover"
              />
            </div>
            {value.caption ? <figcaption>{value.caption}</figcaption> : null}
          </figure>
        ) : null,
    },
  };

  return (
    <div className="prose-article">
      <PortableText value={body as never} components={components} />
    </div>
  );
}
