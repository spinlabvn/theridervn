import { notFound } from "next/navigation";

/** Mọi URL không khớp route nào dưới /vi hoặc /en sẽ hiển thị trang 404 đã thiết kế của TheRider. */
export default function CatchAll() {
  notFound();
}
