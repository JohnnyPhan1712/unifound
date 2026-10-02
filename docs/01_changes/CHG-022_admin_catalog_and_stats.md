# CHG-022: Quản trị danh mục, địa điểm và thống kê

- ID: `CHG-022`
- Trạng thái: `in_review`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-021` (khu vực /admin và guard)
- File/module dự kiến sửa/tạo: `src/app/admin/page.tsx`, `src/app/admin/catalog`, `src/lib/admin/catalog.ts`, `src/lib/admin/stats.ts`, `src/db/schema.ts` + migration (cờ ẩn `is_active` cho `categories`/`locations` nếu chưa có)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

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

- `AGENTS.md`, `docs/00_guides/conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR15, FR16, S11, S13, ghi chú Category/Location)

## Acceptance criteria

- [ ] Admin thêm/sửa/ẩn danh mục và địa điểm; thay đổi phản ánh ở form đăng tin và bộ lọc.
- [ ] Mục bị ẩn không chọn được khi đăng tin nhưng tin cũ vẫn hiển thị đúng.
- [ ] Thống kê đúng với dữ liệu (đối chiếu truy vấn trực tiếp).
- [ ] `USER` không truy cập/gọi được các action này (403).
- [ ] Tên trùng/rỗng bị Zod từ chối.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## Ghi chú triển khai

- **Schema:** thêm cột `is_active` (mặc định `true`) cho `categories` và `locations`, sinh bằng `drizzle-kit generate` (`drizzle/0005_catalog_is_active.sql`). Không xóa cứng mục nào, nên tin cũ vẫn tham chiếu được mục đã ẩn.
- **Nơi chỉ dùng mục đang hoạt động** (`getCatalogOptions`, `checkCatalog`):
  - form đăng tin và sửa tin;
  - bộ lọc bảng tin;
  - danh sách điểm hẹn (CHG-020).
  
  Hệ quả: khi sửa một tin có danh mục/địa điểm đã bị ẩn, người dùng phải chọn mục khác mới lưu được.
- **Trang `/admin/catalog` (S13):**
  - Thêm, sửa, ẩn và hiện lại danh mục và địa điểm; mỗi mục kèm số tin đang dùng.
  - Zod kiểm tra tên 2–80 hoặc 2–120 ký tự và loại địa điểm.
  - Chặn trùng tên không phân biệt hoa/thường bằng truy vấn `lower(name)`; nếu vẫn lọt thì `UNIQUE` của DB chặn tiếp.
  - Địa điểm không gắn trường được coi là "dùng chung".
- **Trang `/admin` (S11)** — tổng quan, tính bằng truy vấn tổng hợp Postgres và không đếm tin `HIDDEN`:
  - tổng số tin (chia mất đồ / nhặt được);
  - tỉ lệ đã trả = số tin `RETURNED` / số tin `FOUND`, vì chỉ tin Nhặt được mới chuyển sang Đã trả được;
  - số tin theo tuần trong 8 tuần, tuần bắt đầu thứ Hai theo giờ Việt Nam;
  - top 5 danh mục.
- **Biểu đồ:** cột HTML/CSS (không thêm thư viện) theo skill `dataviz`:
  - một chuỗi số liệu, một màu teal, không có legend;
  - cột rộng tối đa 24px, bo 4px ở đầu cột;
  - di chuột vào cột hiện tooltip;
  - có "Xem dạng bảng" để đọc số liệu chính xác.
- Menu quản trị có 4 mục: Tổng quan, Kiểm duyệt, Danh mục & địa điểm, Tài khoản. Mục đang mở được xác định theo đường dẫn khớp dài nhất.

## AI Log

### AI-1 — Quản trị danh mục/địa điểm và thống kê

- Nhiệm vụ (Task): CRUD có ẩn mềm cho danh mục/địa điểm, trang thống kê FR16.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), skill `dataviz` (quy cách biểu đồ), Supabase MCP (select đối chiếu số liệu), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): FR15, FR16, S11, S13, ghi chú Category/Location.
- Kết quả AI (AI Output):
  - Logic: `src/lib/admin/{catalog,catalog-schemas,stats}.ts`.
  - Trang: `src/app/admin/page.tsx`, `src/app/admin/catalog/page.tsx`.
  - Migration 0005.
- Quyết định của nhóm (Human Decision): Accepted (2026-10-02, theo ủy quyền). Cách tính "tỉ lệ đã trả" trên số tin Nhặt được là đề xuất của AI.
- Kiểm tra / Xác minh (Verification):
  - Vitest TC-022-01/02.
  - Số liệu dashboard so với truy vấn SQL viết tay qua Supabase MCP → khớp toàn bộ.
  - Playwright kiểm tra thêm, ẩn, hiện lại và quyền.
- Ứng viên đưa vào báo cáo: có

## Bug

Không có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-022-01 | Vitest: truy vấn/hàm thống kê (tỉ lệ đã trả, chia tuần, dữ liệu rỗng) | Số đúng, không chia 0 | `percent(0,0)=0`; tuần theo giờ VN đúng ranh giới Chủ nhật/thứ Hai; đủ 8 tuần, tuần trống = 0, dữ liệu rỗng không lỗi | Passed | `src/lib/admin/stats.test.ts` |
| TC-022-02 | Vitest: Zod danh mục/địa điểm | Từ chối tên rỗng/trùng | Zod từ chối rỗng / < 2 / quá dài, thiếu loại địa điểm; trùng tên kiểm trên UI: "tòa a" → "Tên này đã tồn tại." | Passed | `src/lib/admin/stats.test.ts` + Playwright |
| TC-022-03 | UI: thêm địa điểm mới | Xuất hiện ở form đăng tin | Thêm "Sảnh tòa C" (UIT) → USER thấy trong danh sách địa điểm ở `/reports/new` | Passed | Playwright |
| TC-022-04 | UI: ẩn danh mục đang có tin | Không chọn được, tin cũ vẫn hiện | Ẩn "Bình nước" (3 tin) → không còn trong form đăng tin và bộ lọc; 3 tin cũ vẫn hiện tên danh mục; "Hiện lại" khôi phục | Passed | Playwright, `022_catalog_desktop.png` |
| TC-022-05 | UI: dashboard so với dữ liệu seed | Khớp | Dashboard: 15 tin (5 mất / 10 nhặt), 10% (1/10), tuần 21/09 = 4, 28/09 = 11, top: Bình nước 3, Tai nghe 3, Ví 3, Chìa khóa 1, Điện thoại 1 — trùng khớp truy vấn SQL trực tiếp | Passed | Playwright + Supabase MCP, `022_overview_desktop.png` |
| TC-022-06 | USER gọi action admin | 403 | USER mở `/admin/catalog` → 403; phát lại request "Hiện lại" của admin bằng cookie USER → phản hồi 403 | Passed | Playwright |

## Hướng dẫn tự chạy

```
npm test
npm run typecheck
npm run build
npm run dev
```

1. Đăng nhập ADMIN, mở `/admin` xem thống kê; mở `/admin/catalog` thêm/sửa/ẩn.
2. Đăng nhập USER, mở `/reports/new` kiểm tra danh sách mới.

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- Trang tổng quan ở `/admin`, danh mục & địa điểm ở `/admin/catalog`. Ẩn một danh mục rồi nhớ "Hiện lại" sau khi thử.
