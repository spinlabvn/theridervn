"use client";

import { useEffect } from "react";

/** Gửi một lượt xem cho bài khi được mở; mỗi phiên trình duyệt chỉ tính một lần cho mỗi bài. */
export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Trình duyệt chặn sessionStorage: vẫn gửi, máy chủ tự lọc lượt lặp theo IP.
    }
    const body = JSON.stringify({ slug });
    const sent = navigator.sendBeacon?.("/api/views", new Blob([body], { type: "application/json" }));
    if (!sent) void fetch("/api/views", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  }, [slug]);

  return null;
}
