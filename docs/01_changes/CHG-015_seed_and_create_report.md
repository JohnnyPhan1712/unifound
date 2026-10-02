# CHG-015: Seed dữ liệu và đăng tin Mất đồ / Nhặt được

- ID: `CHG-015`
- Trạng thái: `in_review`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-014`
- File/module dự kiến sửa/tạo: `src/db/seed.ts`, `src/db/schema.ts` (rà `reports`, `report_images`), `src/lib/reports/*` (Zod schema, create), `src/app/reports/new`, `src/components/reports/*`, cấu hình Supabase Storage bucket ảnh
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

## Kết quả người dùng

Có dữ liệu mẫu (trường, danh mục, địa điểm, vài tin). Sinh viên đăng nhập bấm "Đăng tin", chọn Mất đồ hoặc Nhặt được, điền form, tải 1–5 ảnh và lưu thành công; tin tự có hạn 60 ngày.

## Phạm vi

### Bao gồm

- Seed (`npm run db:seed`): `schools`, `categories`, `locations`, một số `reports` mẫu, không PII/secret; chạy lặp lại không lỗi.
- S03/FR03: form đăng tin (loại, tiêu đề, danh mục, mô tả, thời điểm, địa điểm, 1–5 ảnh).
- FR04: tin FOUND thêm `keeping_place`, `verify_question`, `verify_answer` (đáp án không trả về client công khai).
- Zod server-side: bắt buộc field, số ảnh 1–5, giới hạn dung lượng/định dạng ảnh, category/location tồn tại.
- Upload ảnh lên Supabase Storage, lưu đường dẫn vào `report_images`.
- `expires_at = created_at + 60 ngày`, `status = OPEN`.
- Trạng thái loading/lỗi/thành công của form; layout mobile.

### Các lưu ý

- Chưa làm feed/chi tiết (CHG-016) nên chỉ cần chuyển hướng về trang xác nhận đơn giản hoặc trang chi tiết tạm.
- Chưa chạy matching (CHG-018).
- Chỉ dùng MCP Supabase để đọc/kiểm tra; ghi/xóa dữ liệu chỉ khi CHG yêu cầu và hỏi người dùng trước.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR03, FR04, S03, mục 9 ERD)
- `docs/02_reports/03_development.md` (mục 6 Database workflow)
- Skill Supabase (Storage)

## Acceptance criteria

- [ ] `npm run db:seed` nạp dữ liệu mẫu, chạy lại không tạo trùng/lỗi.
- [ ] Đăng tin LOST hợp lệ lưu đúng `type`, `status=OPEN`, `expires_at` +60 ngày, ảnh lưu vào Storage và `report_images`.
- [ ] Đăng tin FOUND lưu thêm nơi giữ, câu hỏi, đáp án; đáp án không lộ ra client công khai.
- [ ] Thiếu field bắt buộc hoặc ảnh ngoài 1–5 → không lưu, lỗi hiện tại field.
- [ ] Khách không vào được `/reports/new`.
- [ ] Ảnh sai định dạng/quá dung lượng bị từ chối.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## Ghi chú triển khai

- Ảnh tải **thẳng từ trình duyệt** lên bucket `report-images` (Supabase Storage) vào thư mục `<user_id>/`, rồi form gửi danh sách đường dẫn. Lý do: body của server action và function Vercel giới hạn (~1 MB / 4,5 MB) không chứa nổi 5 ảnh.
- Kiểm tra phía server gồm ba lớp:
  - Bucket chặn định dạng ngoài JPG/PNG/WEBP và ảnh > 5 MB.
  - Policy chỉ cho tải vào thư mục của chính mình.
  - Server action đối chiếu từng đường dẫn với `storage.objects` (tồn tại, đúng thư mục, mime, dung lượng) trước khi lưu `report_images`.
- Bucket, policy và hàm `public.is_admin()` (security definer, vì `public.users` bật RLS không policy) nằm trong migration custom `drizzle/0003_report_images_bucket.sql`.
- Seed (`src/db/seed.ts`):
  - Nạp 2 trường, 10 danh mục, 13 địa điểm, 4 tài khoản demo và 8 tin mẫu với id cố định.
  - Chạy lại thì dùng upsert / `on conflict do nothing`.
  - Tài khoản demo được ghi vào `auth.users` ở trạng thái đã xác nhận email, vì chủ dự án giữ bật "Confirm email". Mật khẩu lấy từ `SEED_DEMO_PASSWORD` trong `.env.local` (không commit). Email demo là địa chỉ hư cấu, không gửi mail.
  - Tin seed không có ảnh; thẻ tin dùng vùng minh họa theo loại tin (DESIGN.md).
- `/reports/[id]` ở CHG này chỉ là trang xác nhận tạm; CHG-016 thay bằng chi tiết công khai.
- Đáp án xác minh không bao giờ trả về client: chi tiết tạm chỉ select `title/type/status`.
- Giới hạn đã biết: ảnh đã tải nhưng người dùng bỏ khỏi danh sách hoặc không gửi form vẫn nằm trong Storage. Đã đánh dấu `ponytail:` trong `image-picker.tsx`; cần job dọn ảnh mồ côi nếu dung lượng thành vấn đề.

## AI Log

### AI-1 — Upload ảnh trực tiếp lên Storage và kiểm tra lại phía server

- Nhiệm vụ (Task): Thiết kế luồng tải 1–5 ảnh sao cho vẫn có validation phía server.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Supabase MCP (đọc cấu trúc `auth`/`storage`), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): FR03/FR04, giới hạn body server action/Vercel, yêu cầu "Zod server-side: số ảnh 1–5, giới hạn dung lượng/định dạng".
- Kết quả AI (AI Output): Bucket có `file_size_limit`/`allowed_mime_types` + policy theo thư mục user + server đối chiếu `storage.objects`; Zod `discriminatedUnion` LOST/FOUND.
- Quyết định của nhóm (Human Decision): Accepted (2026-10-02: chủ dự án ủy quyền AI khảo sát và xác nhận; đã đối chiếu `02_requirements_design.md`, code và test hiện có).
- Kiểm tra / Xác minh (Verification): Gọi Storage API trực tiếp bằng tài khoản demo (bỏ qua kiểm tra phía client), cả ba trường hợp đều bị server từ chối:
  - Ảnh GIF → "mime type image/gif is not supported".
  - Ảnh 6 MB → "The object exceeded the maximum allowed size".
  - Tải vào thư mục user khác → "new row violates row-level security policy".
- Ứng viên đưa vào báo cáo: có

### AI-2 — Seed tài khoản demo đã xác nhận

- Nhiệm vụ (Task): Có tài khoản demo đăng nhập được khi "Confirm email" vẫn bật.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Supabase MCP (đọc cột bắt buộc của `auth.users`/`auth.identities`).
- Đầu vào / Ngữ cảnh (Input/Context): Chủ dự án yêu cầu giữ xác nhận email để luồng đăng ký đúng chuẩn.
- Kết quả AI (AI Output): Seed ghi `auth.users` (mật khẩu `extensions.crypt`, `email_confirmed_at = now()`, các token chuỗi rỗng) + `auth.identities`.
- Quyết định của nhóm (Human Decision): Accepted (chủ dự án đã đồng ý sau khi được giải thích, 2026-10-01).
- Kiểm tra / Xác minh (Verification): Đăng nhập Playwright bằng cả 4 tài khoản demo thành công; seed chạy 2 lần, số bản ghi giữ nguyên (5 users, 8 reports).
- Ứng viên đưa vào báo cáo: có

## Bug

### BUG-1 — Trang không hydrate khi mở dev server qua `127.0.0.1`

- Biểu hiện: Chọn ảnh không có gì xảy ra; submit form chạy kiểu không-JS.
- Các bước tái hiện: `npm run dev`, mở `http://127.0.0.1:3000/reports/new`, chọn ảnh.
- Kết quả mong đợi / thực tế: Mong đợi ảnh xem trước và tải lên / thực tế không có thumbnail, `images` rỗng.
- Nguyên nhân gốc: Next.js 16 chặn tài nguyên dev cho origin khác `localhost` (cảnh báo `allowedDevOrigins` trong log dev); `playwright.config.ts` cũng dùng `127.0.0.1`.
- Fix: Dùng `http://localhost:3000` (sửa `playwright.config.ts` và script kiểm tra).
- Verification: Ảnh tải lên Storage (HTTP 200) và hiện thumbnail; TC-015-04/05 pass.
- Commit/issue: `e8cdd04`.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-015-01 | Vitest: Zod schema tạo tin (thiếu title, type sai, 0 ảnh, 6 ảnh, FOUND thiếu câu hỏi) | Đúng lỗi từng trường hợp | Đúng; thêm ca thời điểm tương lai, ảnh JSON sai, ảnh ngoài thư mục user | Passed | `src/lib/reports/reports.test.ts` |
| TC-015-02 | Vitest: tính `expires_at` | Đúng +60 ngày | `2026-10-01` → `2026-11-30`, ranh giới hết hạn đúng | Passed | `src/lib/reports/reports.test.ts` |
| TC-015-03 | Chạy `db:seed` hai lần | Không lỗi, không trùng | Hai lần đều 2 schools / 10 categories / 13 locations / 8 reports | Passed | log `npm run db:seed` |
| TC-015-04 | Đăng tin LOST hợp lệ (UI) | Lưu thành công | Chuyển tới `/reports/<id>?created=1`, 2 ảnh | Passed | Playwright, `015_created.png` |
| TC-015-05 | Đăng tin FOUND hợp lệ (UI) | Lưu kèm nơi giữ/câu hỏi/đáp án | Lưu đủ 3 field; HTML trang sau khi đăng không chứa đáp án | Passed | Playwright, `015_found_form_desktop.png` |
| TC-015-06 | Submit thiếu field / ảnh 0 và 6 | Báo lỗi tại field, không lưu | Lỗi tại tiêu đề, danh mục, địa điểm, mô tả, ảnh ("Cần ít nhất 1 ảnh."); chọn 6 ảnh → giữ 5, báo "đã bỏ bớt 1 ảnh"; Zod server chặn 6 ảnh (TC-015-01) | Passed | Playwright, `015_validation_desktop.png` |
| TC-015-07 | Khách mở `/reports/new` | Chuyển về đăng nhập | `/login?next=%2Freports%2Fnew` | Passed | Playwright |
| TC-015-08 | Kiểm tra DB bằng MCP (chỉ đọc) | Có `reports`, `report_images` đúng | LOST/FOUND `OPEN`, hạn 60 ngày, FOUND có nơi giữ/câu hỏi/đáp án, số `report_images` khớp `storage.objects` | Passed | Supabase MCP `execute_sql` (select) |
| TC-015-09 | Ảnh sai định dạng / quá 5 MB / thư mục người khác (gọi Storage API trực tiếp) | Bị từ chối | Cả ba bị từ chối | Passed | script Node + supabase-js |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run typecheck
npm test
npm run build
npm run dev
```

1. Đăng nhập, mở `/reports/new`.
2. Đăng một tin Mất đồ và một tin Nhặt được (kèm ảnh); thử submit thiếu field, thử 0 và 6 ảnh.
3. Kiểm tra bản ghi trong Supabase (chỉ xem).

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- Cần `DATABASE_URL` và `SEED_DEMO_PASSWORD` (≥ 8 ký tự) trong `.env.local`; chạy `npm run db:migrate` trước `npm run db:seed`.
- Ảnh mẫu để thử: `tests/e2e/fixtures/item-1.jpg`, `item-2.png`.
