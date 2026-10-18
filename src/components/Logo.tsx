import Image from "next/image";
import { site } from "@/config/site";

/** Logo chữ mặc định; nếu khai báo file logo trong src/config/site.ts sẽ dùng ảnh. */
export function Logo({ className = "" }: { className?: string }) {
  const { light, dark, width, height } = site.logo;
  if (light && dark) {
    return (
      <span className={`inline-flex ${className}`}>
        <Image src={light} alt={site.name} width={width} height={height} priority className="dark:hidden" />
        <Image src={dark} alt={site.name} width={width} height={height} priority className="hidden dark:block" />
      </span>
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
