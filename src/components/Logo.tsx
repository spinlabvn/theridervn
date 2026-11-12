import Image from "next/image";
import { site } from "@/config/site";

/** Logo ảnh khai báo trong src/config/site.ts; để `src: null` sẽ dùng logo chữ. */
export function Logo({ className = "" }: { className?: string }) {
  const { src, width, height } = site.logo;
  if (src) {
    return (
      <Image
        src={src}
        alt={site.name}
        width={width}
        height={height}
        priority
        unoptimized
        className={`brand-logo h-7 w-auto brightness-0 dark:brightness-100 ${className}`}
      />
    );
  }
  return (
    <span className={`display inline-flex items-baseline text-[1.75rem] leading-none ${className}`} aria-label={site.name}>
      <span aria-hidden="true" className="font-semibold">The</span>
      <span aria-hidden="true" className="mx-[0.06em] -skew-x-12 text-accent">/</span>
      <span aria-hidden="true" className="font-extrabold">Rider</span>
    </span>
  );
}
