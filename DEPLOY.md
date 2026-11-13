# Triển khai TheRider: GitHub → Hostinger → Sanity

Thứ tự khuyến nghị: **(1) đưa code lên GitHub → (2) tạo Node.js Web App trên Hostinger → (3) kết nối Sanity → (4) trỏ tên miền therider.vn**. Website chạy được ngay sau bước 2 (với 8 bài đã chuyển từ therider.vn), nên bạn có thể kiểm tra trước khi làm bước 3.

---

## 1. Đưa code lên GitHub

**Đã xong:** code nằm ở https://github.com/spinlabvn/theridervn (nhánh `main`). Mỗi lần sửa code: `git add -A && git commit -m "mô tả thay đổi" && git push`.

Repo đang để **Public**. Muốn chuyển sang Private: GitHub → **Settings** → **Danger Zone** → **Change visibility** (Hostinger vẫn kết nối được qua tài khoản GitHub).

> File `.env.local` (chứa khoá bí mật) đã nằm trong `.gitignore`, sẽ **không** bị đẩy lên GitHub.

---

## 2. Tạo Node.js Web App trên Hostinger

Áp dụng cho gói **Business Web Hosting** hoặc **Cloud** (có mục Node.js). Giao diện hPanel có thể thay đổi đôi chút theo thời gian.

1. Đăng nhập **hPanel** → **Websites** → **Add website** → chọn **Node.js Apps**.
2. Chọn **Import Git repository** → kết nối tài khoản GitHub → chọn repo `spinlabvn/theridervn`, nhánh `main`.
3. Cấu hình build (Hostinger thường tự nhận diện Next.js; kiểm tra lại các giá trị):

| Mục | Giá trị |
| --- | --- |
| Framework | Next.js |
| Node.js version | **22.x** (tối thiểu 20.9) |
| Root directory | `/` (để mặc định) |
| Install command | `npm install` |
| Build command | `npm run build` (đã cấu hình build bằng webpack – **không** đổi thành `next build`) |
| Start command | `npm start` |

4. Mục **Environment variables** – thêm:

| Biến | Giá trị |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://therider.vn` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | *(để trống lúc đầu – điền ở bước 3)* |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_REVALIDATE_SECRET` | một chuỗi ngẫu nhiên dài, ví dụ tạo bằng `openssl rand -hex 24` |

5. Bấm **Deploy**. Sau vài phút website chạy tại tên miền tạm Hostinger cấp, với toàn bộ nội dung đã chuyển từ therider.vn.
6. Bật **auto-deploy** (nếu có tuỳ chọn) để mỗi lần `git push` lên `main`, Hostinger tự build lại.

> **Lưu ý:** biến bắt đầu bằng `NEXT_PUBLIC_` được "đóng gói" lúc build. Sau khi thêm/sửa chúng, hãy **Redeploy** để có hiệu lực.

---

## 3. Kết nối Sanity CMS (nơi biên tập viên viết bài)

### 3.1 Tạo project

1. Đăng ký miễn phí tại https://www.sanity.io (đăng nhập bằng Google/GitHub).
2. Vào https://www.sanity.io/manage → **Create new project** → đặt tên `TheRider`, dataset `production`, chế độ **Public** (bài đã xuất bản là nội dung công khai).
3. Ghi lại **Project ID** (dạng `abc123xy`).

### 3.2 Chạy và deploy Studio

```bash
cd studio
cp .env.example .env          # điền SANITY_STUDIO_PROJECT_ID=<Project ID>
npm install
npx sanity login
npm run import-therider       # đưa 8 chuyên mục, 8 bài (vi + en) và toàn bộ ảnh lên Sanity
npm run dev                   # thử tại http://localhost:3333
npm run deploy                # đưa Studio lên https://therider.sanity.studio
```

Biên tập viên chỉ cần mở **https://therider.sanity.studio**, đăng nhập và viết bài – không cần đụng tới code. Mời thêm người tại sanity.io/manage → **Members**.

### 3.3 Nối website với Sanity

1. Trên Hostinger, điền `NEXT_PUBLIC_SANITY_PROJECT_ID` = Project ID → **Redeploy**.
2. Website sẽ chuyển sang đọc bài từ Sanity. Hãy chạy `npm run import-therider` **trước** bước này, nếu không trang chủ sẽ báo chưa có bài.
3. Từ đây, viết bài mới trên Studio. Khối *Xem nhiều nhất* bên phải trang chủ tự xếp 3 bài nhiều lượt xem nhất (xem mục 3.5); khi chưa đủ lượt xem, bài đánh dấu **Bài nổi bật** được dùng để bù. Studio có sẵn khối **Video YouTube** và **Bảng thông số** cho bài Bike Check.

### 3.4 Webhook – cập nhật website ngay khi xuất bản

Không có webhook, bài mới vẫn tự xuất hiện sau tối đa ~60 giây. Muốn cập nhật tức thì:

1. sanity.io/manage → project TheRider → **API** → **Webhooks** → **Create webhook**.
2. Cấu hình:
   - **URL:** `https://therider.vn/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
   - **Dataset:** `production`
   - **Trigger on:** Create, Update, Delete
   - **Filter:** `_type in ["post", "category", "author"]`
   - **HTTP method:** POST
3. Lưu và thử xuất bản một bài – website cập nhật trong vài giây.

### 3.5 Lượt xem – khối "Xem nhiều nhất"

Mỗi lần có người mở bài, website ghi một lượt xem (bỏ qua bot; cùng một người mở lại trong 30 phút chỉ tính một lần). Trang chủ cập nhật thứ hạng sau tối đa ~60 giây.

Để lượt xem **không bị mất khi deploy lại**, lưu chúng lên Sanity:

1. sanity.io/manage → project TheRider → **API** → **Tokens** → **Add API token**, tên `website-views`, quyền **Editor**.
2. Trên Hostinger thêm biến `SANITY_API_WRITE_TOKEN` = token vừa tạo → **Redeploy**.
3. Xem số liệu trong Studio ở mục **Lượt xem** (chỉ đọc).

Chưa có token thì lượt xem lưu vào file `.data/views.json` trên máy chủ – vẫn chạy, nhưng có thể về 0 sau mỗi lần Hostinger build lại.

---

## 4. Trỏ tên miền therider.vn

> **Quan trọng:** ảnh của therider.vn cũ đã được tải về `public/media/` nên không phụ thuộc vào máy chủ cũ. Đường dẫn bài viết giữ cấu trúc mới `/vi/blog/<slug>` (slug giống bản cũ); địa chỉ cũ `therider.vn/post/<slug>` và `/danh-muc/<mục>` được tự chuyển hướng sang trang mới.

1. Trên Hostinger: vào Node.js App vừa tạo → **Domains** → **Connect domain** → nhập `therider.vn`.
2. Nếu tên miền mua ở nơi khác (Mắt Bão, PA Việt Nam, iNET…): đổi **nameserver** sang nameserver Hostinger hiển thị, hoặc tạo bản ghi `A`/`CNAME` theo hướng dẫn trong hPanel.
3. Hostinger tự cấp **SSL miễn phí**. Kiểm tra https://therider.vn chạy được, rồi đảm bảo `NEXT_PUBLIC_SITE_URL=https://therider.vn`.
4. Gửi sitemap lên Google Search Console: `https://therider.vn/sitemap.xml`.

---

## Xử lý sự cố

| Hiện tượng | Cách xử lý |
| --- | --- |
| Build lỗi nội bộ Turbopack khi xử lý CSS/PostCSS (`globals.css`) | Hosting dùng chung giới hạn tiến trình/bộ nhớ nên Turbopack bị chặn. Script `build` đã chuyển sang `next build --webpack` và `next.config.ts` giới hạn 2 tiến trình (`experimental.cpus`). Đảm bảo Build command là `npm run build`, rồi Redeploy. Nếu vẫn lỗi: xoá cache build trên Hostinger (hoặc thư mục `.next`) rồi deploy lại. |
| Build lỗi `Cannot find module 'tailwindcss'` | Đảm bảo install command là `npm install` (không dùng `--omit=dev`). Các gói build đã được đặt trong `dependencies`. |
| Website chưa hiện bài mới viết trên Sanity | Chưa Redeploy sau khi thêm `NEXT_PUBLIC_SANITY_PROJECT_ID`. |
| Ảnh từ Sanity không hiện | Ảnh bìa là trường bắt buộc; kiểm tra bài đã có ảnh và đã **Publish** (không chỉ lưu nháp). |
| Bài đã publish nhưng chưa hiện | Kiểm tra *Ngày đăng* không nằm ở tương lai, bài đã chọn *Chuyên mục*. |
| Khối "Xem nhiều nhất" về lại bài nổi bật sau khi deploy | Chưa đặt `SANITY_API_WRITE_TOKEN` nên lượt xem lưu file và bị xoá khi build lại (xem 3.5). |
| Webhook trả 401 | `secret` trên URL webhook khác với `SANITY_REVALIDATE_SECRET` trên Hostinger. |
