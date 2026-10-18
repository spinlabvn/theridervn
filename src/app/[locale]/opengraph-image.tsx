import { ImageResponse } from "next/og";

export const alt = "TheRider – Performance cycling magazine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Ảnh chia sẻ mặc định (bài viết có ảnh bìa riêng sẽ dùng ảnh bìa). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0d0f",
          color: "#f3f1ec",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#a3a8b0" }}>THERIDER.VN</div>
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 168, fontWeight: 800, letterSpacing: -4 }}>
          <span>THE</span>
          <span style={{ color: "#ff5a26", margin: "0 12px" }}>/</span>
          <span>RIDER</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30 }}>
          <span>Road · MTB · Gravel · Gear · Training</span>
          <span style={{ width: 120, height: 12, background: "#ff5a26", alignSelf: "center" }} />
        </div>
      </div>
    ),
    size,
  );
}
