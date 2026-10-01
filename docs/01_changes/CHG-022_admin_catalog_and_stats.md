# CHG-022: Quản trị danh mục, địa điểm và thống kê

- ID: `CHG-022`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-021` (khu vực /admin và guard)
- File/module dự kiến sửa/tạo: `src/app/admin/page.tsx`, `src/app/admin/catalog`, `src/lib/admin/catalog.ts`, `src/lib/admin/stats.ts`, `src/db/schema.ts` + migration (cờ ẩn `is_active` cho `categories`/`locations` nếu chưa có)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `chưa có` (ghi hash commit trên `main` sau khi push)

## Kết quả người dùng

Quản trị viên thêm, sửa, ẩn danh mục đồ vật và địa điểm (form đăng tin dùng danh sách mới), và xem bảng thống kê: số tin theo tuần, tỉ lệ đã trả, danh mục phổ biến.

## Phạm vi

### Bao gồm

- FR15/S13: CRUD (thêm/sửa/ẩn) `categories` và `locations`; không xóa cứng bản ghi đang được tin tham chiếu. Form đăng tin và bộ lọc chỉ dùng mục đang hoạt động.
- FR16/S11: tổng quan (tổng tin, tin theo tuần, tỉ lệ `RETURNED`, top danh mục) bằng truy vấn tổng hợp Postgres; biểu đồ đơn giản (CSS/SVG hoặc thư viện đã cài, ghi lý do nếu thêm).
- Zod cho form; guard ADMIN ở server.

### Các lưu ý

- Không GPS/tọa độ cho địa điểm.
- Dùng lại layout/guard `/admin` của CHG-021.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR15, FR16, S11, S13, ghi chú Category/Location)

## Acceptance criteria

- [ ] Admin thêm/sửa/ẩn danh mục và địa điểm; thay đổi phản ánh ở form đăng tin và bộ lọc.
- [ ] Mục bị ẩn không chọn được khi đăng tin nhưng tin cũ vẫn hiển thị đúng.
- [ ] Thống kê đúng với dữ liệu (đối chiếu truy vấn trực tiếp).
- [ ] `USER` không truy cập/gọi được các action này (403).
- [ ] Tên trùng/rỗng bị Zod từ chối.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-022-01 | Vitest: truy vấn/hàm thống kê (tỉ lệ đã trả, chia tuần, dữ liệu rỗng) | Số đúng, không chia 0 | | Pending | |
| TC-022-02 | Vitest: Zod danh mục/địa điểm | Từ chối tên rỗng/trùng | | Pending | |
| TC-022-03 | UI: thêm địa điểm mới | Xuất hiện ở form đăng tin | | Pending | screenshot |
| TC-022-04 | UI: ẩn danh mục đang có tin | Không chọn được, tin cũ vẫn hiện | | Pending | |
| TC-022-05 | UI: dashboard so với dữ liệu seed | Khớp | | Pending | screenshot |
| TC-022-06 | USER gọi action admin | 403 | | Pending | |

## Hướng dẫn tự chạy

```
npm test
npm run typecheck
npm run build
npm run dev
```

1. Đăng nhập ADMIN, mở `/admin` xem thống kê; mở `/admin/catalog` thêm/sửa/ẩn.
2. Đăng nhập USER, mở `/reports/new` kiểm tra danh sách mới.
