"use client";

import { Children, useEffect, useState } from "react";

/**
 * Banner quảng cáo xoay vòng: mỗi banner hiện `seconds` giây rồi mờ dần sang banner kế.
 * Rê chuột hoặc focus bàn phím vào banner thì tạm dừng, để người xem kịp đọc và bấm.
 */
export function AdCarousel({
  seconds,
  className,
  children,
}: {
  seconds: number;
  /** Kích thước khung banner. */
  className: string;
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setTimeout(() => setActive((i) => (i + 1) % count), seconds * 1000);
    return () => clearTimeout(timer);
  }, [active, paused, count, seconds]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Chỉ dừng khi focus bằng bàn phím: bấm chuột vào banner (mở tab mới) không giữ banner đứng yên mãi
      onFocus={(e) => setPaused(e.target.matches(":focus-visible"))}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          inert={i !== active}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {slide}
        </div>
      ))}
    </div>
  );
}
