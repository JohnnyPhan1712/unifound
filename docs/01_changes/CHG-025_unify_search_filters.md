# CHG-025: Gôm chung mục tìm kiếm và bộ lọc bảng tin

- ID: `CHG-025`
- Trạng thái: `proposed`
- Ngày tạo: `2026-10-03`
- Người phụ trách: `Nguyễn Thế Anh`
- Dependency: `CHG-016` (bảng tin, tìm kiếm và chi tiết tin)
- File/module dự kiến sửa/tạo: `src/components/reports/feed-filters.tsx`, `src/lib/reports/catalog.ts`, `src/lib/reports/query.ts`, `src/lib/reports/query.test.ts`, `src/app/globals.css`, `tests/e2e/search-filters.spec.ts`
- Branch:

## Kết quả người dùng

Người dùng có một khu vực tìm kiếm và lọc đồ thất lạc thống nhất, gọn gàng ngay trên bảng tin. Mọi thao tác tìm từ khóa và lọc (danh mục, trường, khu vực, khoảng ngày) nằm trong một thanh tìm kiếm liền mạch, dùng tốt trên máy tính, điện thoại và dark mode.

## Phạm vi

### Bao gồm

- **T1. Thanh tìm kiếm pill 4 phân đoạn:** Tìm kiếm (`q`) / **Danh mục** (`category`, không dùng nhãn “Đồ vật”) / Trường & Khu vực (`school`, `location`, khu vực lọc theo trường đã chọn) / Thời gian (`from`, `to`). Bỏ dải icon danh mục cũ và các ô trùng lặp.
- **T2. Hành vi popover:** chỉ một popover mở tại một thời điểm (đóng khi click ngoài hoặc nhấn Esc); các phân đoạn khác mờ đi khi có một phân đoạn active; thanh tìm kiếm sticky khi cuộn trang (nền mờ kính, bóng nhẹ).
- **T3. Giữ cơ chế hiện có:** form GET / URL searchParams (kết quả chia sẻ được qua liên kết); chip bộ lọc đang áp dụng kèm nút xóa từng chip và “Xóa tất cả”; tương thích full-text search `reports.searchVector` và `feedConditions`; mobile (`max-[744px]`) không ẩn mất tiêu chí nào.
- **T4. Không có gợi ý tìm kiếm** sau khi gõ (cả native của trình duyệt lẫn danh sách tự dựng): `type="text"`, `autoComplete="off"`.
- **T5. Catalog:** giữ 3 trường liên kết (UIT, Bách khoa, KHTN); mỗi khu vực gắn `schoolId` để lọc phân cấp chính xác; vật dụng phụ gộp vào một mục “Đồ vật khác (bình nước, giấy tập, ô dù…)”, không có mục “Bình nước” riêng.
- **T6. Tìm không dấu:** gõ “vi” tìm ra “ví”, “the” ra “thẻ”, “khoa” ra “khóa” (tiêu đề, mô tả, danh mục, địa điểm) trong `query.ts`, có unit test.
- **T7. Dark mode:** thanh tìm kiếm dùng token thiết kế (`bg-surface`, `text-ink`…) thay màu cứng (`bg-white`, `bg-[#f2f2f2]`); đủ token `html.dark` trong `globals.css`; chữ/icon đủ tương phản.

### Các lưu ý (Tránh hiểu nhầm)

- Không đổi schema (`src/db/schema.ts`) hay migration.
- Không sửa logic nghiệp vụ Auth, Claims, Matching, Admin.
- Không thêm dữ liệu demo giả vào code production (không dùng `FALLBACK_REPORTS`); cần dữ liệu để xem thì dùng seed của CHG-015.
- Header, popup đăng nhập, trợ giúp, footer thuộc `CHG-026`, không làm ở đây.
- Giữ `DESIGN.md`: UniFound Blue `#2d5bd7`, font Be Vietnam Pro, bo góc chuẩn, một tầng bóng hairline.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`
- `docs/01_changes/CHG-016_feed_search_report_detail.md`
- `src/components/reports/feed-filters.tsx`, `src/app/page.tsx`, `src/lib/reports/query.ts`, `src/lib/reports/feed-url.ts`, `src/lib/reports/catalog.ts`

## Acceptance criteria

- [ ] T1: Thanh tìm kiếm 4 phân đoạn gôm chung, không phân mảnh hay trùng lặp; nhãn phân đoạn 2 là “Danh mục”.
- [ ] T2: Chỉ một popover mở một lúc; click ngoài/Esc đóng; thanh tìm kiếm sticky khi cuộn.
- [ ] T3: Kết hợp từ khóa + danh mục + trường + khu vực + khoảng ngày cho kết quả đúng; URL chia sẻ được; chip và nút xóa lọc hoạt động; mobile và desktop hiển thị đúng.
- [ ] T4: Không có dropdown gợi ý nào sau khi gõ từ khóa.
- [ ] T5: Chọn trường chỉ hiện khu vực thuộc trường đó; có “Đồ vật khác”, không có “Bình nước” riêng.
- [ ] T6: Tìm không dấu ra đúng đồ vật có dấu.
- [ ] T7: Ở dark mode thanh tìm kiếm đọc được rõ chữ và icon.
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đều pass.
- [ ] Kiểm tra giao diện bằng Playwright MCP (desktop + mobile, light + dark), screenshot ghi evidence.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
| --- | --- | --- | --- | --- | --- |
| TC-025-01 | Giao diện tìm kiếm & lọc thống nhất trên desktop (T1) | Đủ 4 phân đoạn, nhãn “Danh mục”, không trùng lặp | — | Pending | — |
| TC-025-02 | Popover mutually exclusive, click ngoài/Esc, sticky khi cuộn (T2) | Một popover mở một lúc; thanh bám đỉnh khi cuộn | — | Pending | — |
| TC-025-03 | Tìm từ khóa + lọc, chip, xóa từng chip/xóa tất cả, giao diện mobile (T3) | URL đúng tham số; chip hiện/xóa đúng; mobile đủ tiêu chí | — | Pending | — |
| TC-025-04 | Không có gợi ý tìm kiếm sau khi gõ (T4) | Không dropdown native hay custom | — | Pending | — |
| TC-025-05 | Lọc phân cấp trường → khu vực, mục “Đồ vật khác” (T5) | Khu vực khớp trường đã chọn; không có “Bình nước” riêng | — | Pending | — |
| TC-025-06 | Tìm không dấu “vi”, “the”, “khoa” (T6) | Ra “ví”, “thẻ”, “khóa” | — | Pending | — |
| TC-025-07 | Dark mode thanh tìm kiếm (T7) | Chữ/icon đủ tương phản trên nền tối | — | Pending | — |

## Hướng dẫn tự chạy

```
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test tests/e2e/search-filters.spec.ts
npm run dev
```
