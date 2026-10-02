# CHG-016: Bảng tin, tìm kiếm và chi tiết tin

- ID: `CHG-016`
- Trạng thái: `done`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-015`
- File/module dự kiến sửa/tạo: `src/app/page.tsx`, `src/app/reports/[id]`, `src/lib/reports/query.ts`, `src/components/reports/*` (card, filter, pagination), `src/db/schema.ts` + migration (cột `tsvector` + index GIN)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

## Kết quả người dùng

Mọi người (kể cả khách) xem bảng tin hai tab Mất đồ / Nhặt được, tìm từ khóa, lọc, phân trang và mở chi tiết tin. Tin hết hạn hoặc bị ẩn không hiện; đáp án xác minh và liên hệ không lộ.

## Phạm vi

### Bao gồm

- S01: feed hai tab, thẻ tin (ảnh, tiêu đề, địa điểm, thời gian, badge loại/trạng thái), phân trang, nút "Đăng tin".
- FR06: lọc theo loại, danh mục, trường/khu vực, khoảng thời gian.
- FR07: tìm từ khóa full-text PostgreSQL trên `title` + `description` (cột `tsvector` + GIN qua Drizzle migration).
- S04: chi tiết tin công khai (ảnh, mô tả, địa điểm, thời gian, trạng thái); FOUND chỉ hiện câu hỏi xác minh ở bước claim sau này, không hiện đáp án/liên hệ.
- Điều kiện truy vấn: `expires_at > now()`, loại `HIDDEN`; `RETURNED/CLOSED` hiển thị nhãn hoặc theo quy ước ghi trong CHG.
- Loading, empty, lỗi; layout mobile; tải feed < 3 giây với dữ liệu seed.

### Các lưu ý

- Nút hành động ("Đây là đồ của tôi", báo cáo, sửa/xóa) chỉ để chỗ trống hoặc ẩn; được làm ở CHG-017/019/021.
- Không đưa `verify_answer` vào bất kỳ query công khai nào.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR06, FR07, S01, S04, quy tắc nghiệp vụ)
- `docs/02_reports/03_development.md` (mục 6 Tìm kiếm, Hết hạn)

## Acceptance criteria

- [ ] Feed hiển thị đúng hai tab; khách xem được không cần đăng nhập.
- [ ] Lọc loại/danh mục/trường/thời gian và tìm từ khóa cho kết quả đúng; kết hợp được nhiều bộ lọc.
- [ ] Phân trang hoạt động; có empty state khi không có kết quả.
- [ ] Tin quá `expires_at` hoặc `HIDDEN` không hiện trong feed.
- [ ] Chi tiết tin không trả về `verify_answer` và contact_info.
- [ ] Migration full-text search được sinh bằng Drizzle và áp dụng thành công.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## Ghi chú triển khai

- Full-text search: cột generated `reports.search_vector = to_tsvector('simple', title || ' ' || description)` + index GIN, sinh bằng `drizzle-kit generate` (`drizzle/0004_report_search_vector.sql`). Truy vấn dùng `websearch_to_tsquery('simple', q)`. Dùng cấu hình `simple` vì Postgres không có từ điển tiếng Việt; giới hạn: tìm "vi" (không dấu) không ra "ví" — cần `unaccent` nếu muốn.
- Quy ước trạng thái trên feed: hiện `OPEN`, `IN_PROGRESS` (nhãn "Đang bàn giao"), `RETURNED` (nhãn "Đã trả"); ẩn `CLOSED`, `HIDDEN` và tin quá `expires_at`.
- Chi tiết tin: tin hết hạn vẫn xem được kèm nhãn "Đã hết hạn"; `HIDDEN` chỉ chủ tin/ADMIN xem được, người khác nhận 404.
- Chỉ select danh sách cột công khai `publicReportColumns` (không có `verify_answer`); không join thông tin liên hệ. Câu hỏi xác minh không hiện ở chi tiết (để dành cho bước gửi yêu cầu CHG-019). "Nơi đang giữ" của tin FOUND hiện công khai.
- Bộ lọc là form GET (chạy không cần JS, URL chia sẻ được); "Trường" lọc theo trường của địa điểm, "Địa điểm" lọc chính xác; "Đến ngày" tính hết ngày theo giờ Việt Nam.
- Nút hành động (gửi yêu cầu, báo cáo, sửa/xóa) chưa có, làm ở CHG-017/019/021.

### Cập nhật 2026-10-01: bố cục theo mockup

- Bảng tin có thêm tab **Tất cả** (mặc định, cả hai loại) theo mockup; Mất đồ / Nhặt được vẫn lọc riêng. Tab nằm ở header (điện thoại: hàng pill dưới ô tìm kiếm).
- Ô tìm kiếm dạng pill ba ô (Tìm gì / Danh mục / Khu vực); hàng icon danh mục; "Bộ lọc" (trường, khoảng ngày) mở popover; bộ lọc đang bật hiện thành chip có nút bỏ. Vẫn là form GET.
- Trang chi tiết theo mockup: ảnh/banner trên cùng, cột nội dung (Thông tin, Mô tả, Người đăng) và cột hành động cố định bên phải. Người đăng hiện dạng rút gọn ("Lan N.") và không hiện email/điện thoại.
- Kiểm tra lại cuối cùng: `parseFeedParams` mặc định `ALL`, test điều kiện ALL không lọc loại.

## AI Log

### AI-1 — Tìm kiếm full-text và truy vấn feed

- Nhiệm vụ (Task): Cột `tsvector` + GIN qua Drizzle, hàm parse tham số và điều kiện lọc dùng chung cho feed và test.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Supabase MCP (kiểm tra `search_vector` bằng select), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): FR06, FR07, S01, S04, `03_development.md` mục 6.
- Kết quả AI (AI Output): `src/lib/reports/query.ts` (`parseFeedParams`, `feedConditions`, `getFeed`, `getReport`), migration 0004, `src/app/page.tsx`, `src/app/reports/[id]/page.tsx`.
- Quyết định của nhóm (Human Decision): Accepted (2026-10-02: chủ dự án ủy quyền AI khảo sát và xác nhận; đã đối chiếu `02_requirements_design.md`, code và test hiện có).
- Kiểm tra / Xác minh (Verification): Vitest dịch điều kiện sang SQL bằng `PgDialect` và kiểm tra từng mệnh đề/tham số; Playwright trên dữ liệu seed; đo thời gian tải trên bản build production.
- Ứng viên đưa vào báo cáo: có

## Bug

### BUG-1 — Nghi lỗi lọc kết hợp + từ khóa ra rỗng (không tái hiện)

- Biểu hiện: Lần chạy script đầu, `FOUND + danh mục Ví/giấy tờ + trường UIT + q=ví` ra 0 kết quả.
- Các bước tái hiện: Gọi lại đúng URL bằng curl và kiểm tra `search_vector @@ websearch_to_tsquery('simple','ví')` bằng Supabase MCP (select).
- Kết quả mong đợi / thực tế: Mong đợi ra "Nhặt được ví vải xanh rêu" / gọi lại thì ra đúng tin này.
- Nguyên nhân gốc: Lần chạy đầu trùng lúc dev server bị dừng do hết thời gian chạy nền; không phải lỗi truy vấn.
- Fix: Không cần sửa code.
- Verification: curl URL kết hợp → 1 kết quả đúng; DB `m = true`.
- Commit/issue: không có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-016-01 | Vitest: builder điều kiện lọc (loại, danh mục, thời gian) | Điều kiện đúng | SQL có đủ mệnh đề loại, danh mục, `event_time >=/<`, `websearch_to_tsquery`; "đến 30/09" → `< 2026-09-30T17:00Z`; giá trị lạ bị bỏ qua | Passed | `src/lib/reports/query.test.ts` |
| TC-016-02 | Vitest: kiểm tra hết hạn / HIDDEN | Loại bỏ đúng | Feed luôn có `expires_at > now` và `status in (OPEN, IN_PROGRESS, RETURNED)`; `HIDDEN` không công khai; cột công khai không có `verifyAnswer` | Passed | `src/lib/reports/query.test.ts`, `reports.test.ts` (ranh giới hết hạn) |
| TC-016-03 | Tìm "ví" / "thẻ sinh viên" trên dữ liệu seed | Ra tin liên quan | "ví" (Mất đồ) → 2 tin ví; "thẻ sinh viên" (Nhặt được) → "Nhặt được thẻ sinh viên" | Passed | Playwright, `016_search.png` |
| TC-016-04 | Kết hợp lọc + tìm kiếm + đổi trang | Kết quả nhất quán | Danh mục + trường → 1 tin; thêm từ khóa giữ nguyên bộ lọc trong URL, curl xác nhận ra đúng tin. Phân trang: dữ liệu seed chưa đủ 12 tin/tab nên chưa thấy trang 2 trên UI; link phân trang giữ tham số lọc (`feedHref`) | Passed (phân trang kiểm lại khi đủ dữ liệu ở CHG-023) | Playwright + curl |
| TC-016-05 | Tin hết hạn/ẩn (sửa dữ liệu test) | Không hiện trong feed | Đã kiểm trên giao diện thật (2026-10-02, chủ dự án cho phép ghi DB): đặt `expires_at` của một tin E2E về quá khứ → khách tìm theo tiêu đề không thấy tin trong feed (0 liên kết); mở chi tiết vẫn 200 nhưng hiện nhãn "Đã hết hạn", không nhận yêu cầu. Khôi phục đúng `expires_at` cũ → tin hiện lại trong feed (đối chứng). Tin `CLOSED` ở TC-017-04, `HIDDEN` ở TC-021-04 | Passed | Playwright (script tạm), Supabase MCP `execute_sql`; dữ liệu đã khôi phục |
| TC-016-06 | Mở chi tiết FOUND, xem response/HTML | Không có đáp án xác minh, không có liên hệ | HTML chi tiết tin FOUND không chứa đáp án, câu hỏi xác minh hay số liên hệ | Passed | Playwright (`page.content()`), `016_detail_desktop.png` |
| TC-016-07 | Đo tải feed (Playwright MCP) | < 3 giây | Bản build (`next start`): `loadEventEnd` 564–598 ms, curl 0,56 s khi đã chạy, 2,5 s lần đầu (khởi động lạnh). Dev mode 8–11 s do biên dịch, không dùng làm kết quả | Passed | Playwright `performance` navigation timing (thư viện Playwright, không có Playwright MCP trong phiên) |
| TC-016-08 | Feed ở mobile và empty state | Không vỡ layout | iPhone 13: feed và chi tiết không tràn ngang; từ khóa không có kết quả → empty state "Không có tin khớp bộ lọc" + nút xóa bộ lọc | Passed | `016_feed_mobile.png`, `016_detail_mobile.png`, `016_empty.png` |

## Hướng dẫn tự chạy

```
npm run db:migrate
npm run db:seed
npm run typecheck
npm test
npm run build
npm run dev
```

1. Mở `/` khi chưa đăng nhập, đổi tab, lọc, tìm từ khóa, chuyển trang.
2. Mở một tin FOUND, kiểm tra không lộ đáp án (xem tab Network).
3. Thu nhỏ về mobile kiểm tra layout.

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- Tìm thử trên dữ liệu seed: tab Mất đồ "ví", tab Nhặt được "thẻ sinh viên".
