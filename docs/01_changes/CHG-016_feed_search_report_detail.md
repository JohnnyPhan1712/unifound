# CHG-016: Bảng tin, tìm kiếm và chi tiết tin

- ID: `CHG-016`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-015`
- File/module dự kiến sửa/tạo: `src/app/page.tsx`, `src/app/reports/[id]`, `src/lib/reports/query.ts`, `src/components/reports/*` (card, filter, pagination), `src/db/schema.ts` + migration (cột `tsvector` + index GIN)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `chưa có` (ghi hash commit trên `main` sau khi push)

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

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
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

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-016-01 | Vitest: builder điều kiện lọc (loại, danh mục, thời gian) | Điều kiện đúng | | Pending | |
| TC-016-02 | Vitest: kiểm tra hết hạn / HIDDEN | Loại bỏ đúng | | Pending | |
| TC-016-03 | Tìm "ví" / "thẻ sinh viên" trên dữ liệu seed | Ra tin liên quan | | Pending | screenshot |
| TC-016-04 | Kết hợp lọc + tìm kiếm + đổi trang | Kết quả nhất quán | | Pending | |
| TC-016-05 | Tin hết hạn/ẩn (sửa dữ liệu test) | Không hiện trong feed | | Pending | |
| TC-016-06 | Mở chi tiết FOUND, xem response/HTML | Không có đáp án xác minh, không có liên hệ | | Pending | |
| TC-016-07 | Đo tải feed (Playwright MCP) | < 3 giây | | Pending | |
| TC-016-08 | Feed ở mobile và empty state | Không vỡ layout | | Pending | screenshot |

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
