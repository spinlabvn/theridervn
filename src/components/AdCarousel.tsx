"use client";

import { Children, useState } from "react";

/**
 * Banner quảng cáo xoay vòng: mỗi banner hiện `seconds` giây rồi mờ dần sang banner kế.
 * Thanh bên dưới cho biết thời gian còn lại và cho chọn banner; rê chuột hoặc focus bàn phím vào thì tạm dừng.
 * Thời gian do animation của thanh quyết định (hết thanh → sang banner kế) nên lúc dừng không bị lệch.
 */
export function AdCarousel({
  seconds,
  label,
  className,
  children,
}: {
  seconds: number;
  /** Nhãn nút chọn banner, đọc kèm số thứ tự ("Xem quảng cáo 2/3"). */
  label: string;
  /** Kích thước khung banner. */
  className: string;
  children: React.ReactNode;
}) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="flex flex-1 flex-col gap-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      // Chỉ dừng khi focus bằng bàn phím: bấm chuột vào nút chọn không giữ banner đứng yên mãi
      onFocus={(e) => setPaused(e.target.matches(":focus-visible"))}
      onBlur={() => setPaused(false)}
    >
      <div className={`relative overflow-hidden ${className}`}>
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
      {count > 1 ? (
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${label} ${i + 1}/${count}`}
              aria-current={i === active ? "true" : undefined}
              className="group grid h-6 flex-1 items-center"
            >
              <span className="block h-1 overflow-hidden rounded-full bg-line transition-colors duration-200 group-hover:bg-ink-2">
                {i === active ? (
                  <span
                    key={active}
                    className="ad-progress block h-full bg-accent"
                    style={{ animationDuration: `${seconds}s`, animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={() => setActive((active + 1) % count)}
                  />
                ) : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
