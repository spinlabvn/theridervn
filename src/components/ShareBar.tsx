"use client";

import { Check, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FacebookIcon, XIcon } from "./SocialIcons";

export function ShareBar({
  url,
  title,
  labels,
}: {
  url: string;
  title: string;
  labels: { share: string; copy: string; copied: string };
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt(labels.copy, url);
    }
  }

  const btn =
    "grid size-11 place-items-center rounded-full border border-line transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper";
  const enc = encodeURIComponent;

  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow mr-1 text-ink-2">{labels.share}</span>
      <a
        className={btn}
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${labels.share}: Facebook`}
      >
        <FacebookIcon />
      </a>
      <a
        className={btn}
        href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${labels.share}: X`}
      >
        <XIcon className="size-4" />
      </a>
      <button type="button" onClick={copy} className={btn} aria-label={copied ? labels.copied : labels.copy}>
        {copied ? <Check className="size-5 text-accent-ink" aria-hidden="true" /> : <LinkIcon className="size-5" strokeWidth={1.8} aria-hidden="true" />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? labels.copied : ""}
      </span>
    </div>
  );
}
