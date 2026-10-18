import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Webhook cho Sanity: khi biên tập viên xuất bản/sửa/xoá bài, Sanity gọi
 * POST https://therider.vn/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 * để website cập nhật ngay thay vì chờ tối đa 60 giây.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const provided = request.nextUrl.searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ ok: false, message: "Invalid secret" }, { status: 401 });
  }
  revalidateTag("sanity", { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
