# CHG-025: Gôm chung mục tìm kiếm và bộ lọc bảng tin

- ID: `CHG-025`
- Trạng thái: `done`
- Ngày tạo: `2026-10-03`
- Người phụ trách: `Nguyễn Thế Anh`
- Dependency: `CHG-016` (bảng tin, tìm kiếm và chi tiết tin)
- File/module dự kiến sửa/tạo: `src/components/reports/feed-filters.tsx`, `src/lib/reports/catalog.ts`, `src/components/reports/report-form.tsx` (type `CatalogOption`), `src/lib/reports/query.ts`, `src/lib/reports/query.test.ts`, `src/app/globals.css`, `tests/e2e/search-filters.spec.ts`
- Branch: `feat/chg-025`

## Kết quả người dùng

Người dùng có một khu vực tìm kiếm và lọc đồ thất lạc thống nhất, gọn gàng ngay trên bảng tin. Mọi thao tác tìm từ khóa và lọc (danh mục, trường, khu vực, khoảng ngày) nằm trong một thanh tìm kiếm liền mạch, dùng tốt trên máy tính, điện thoại và dark mode.

## Phạm vi

### Bao gồm

- **T1. Thanh tìm kiếm pill 4 phân đoạn:** Tìm kiếm (`q`) / **Danh mục** (`category`, không dùng nhãn “Đồ vật”) / Vị trí (Trường → Khu vực, `school`, `location`, khu vực lọc theo trường đã chọn) / Thời gian (`from`, `to`). Bỏ dải icon danh mục cũ và các ô trùng lặp.
- **T2. Hành vi popover:** chỉ một popover mở tại một thời điểm (đóng khi click ngoài hoặc nhấn Esc); các phân đoạn khác mờ đi khi có một phân đoạn active; thanh tìm kiếm sticky khi cuộn trang (nền mờ kính, bóng nhẹ).
- **T3. Giữ cơ chế hiện có:** form GET / URL searchParams (kết quả chia sẻ được qua liên kết); chip bộ lọc đang áp dụng kèm nút xóa từng chip và “Xóa tất cả”; tương thích full-text search `reports.searchVector` và `feedConditions`; mobile (`max-[744px]`) không ẩn mất tiêu chí nào.
- **T4. Không có gợi ý tìm kiếm** sau khi gõ (cả native của trình duyệt lẫn danh sách tự dựng): `type="text"`, `autoComplete="off"`.
- **T5. Catalog:** mỗi khu vực mang `schoolId` để lọc phân cấp Trường → Khu vực (chọn trường thì chỉ hiện khu vực của trường đó, địa điểm dùng chung ẩn). Danh sách trường và danh mục lấy từ DB do admin quản lý (CHG-022); không hard-code lại 3 trường hay gộp mục “Bình nước” vào “Khác” trong code.
- **T6. Tìm không dấu:** gõ “vi” tìm ra “ví”, “the” ra “thẻ”, “khoa” ra “khóa” (tiêu đề và mô tả) trong `query.ts` (kết hợp với full-text hiện có), có unit test.
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

- [x] T1: Thanh tìm kiếm 4 phân đoạn gôm chung, không phân mảnh hay trùng lặp; nhãn phân đoạn 2 là “Danh mục”.
- [x] T2: Chỉ một popover mở một lúc; click ngoài/Esc đóng; thanh tìm kiếm sticky khi cuộn.
- [x] T3: Kết hợp từ khóa + danh mục + trường + khu vực + khoảng ngày cho kết quả đúng; URL chia sẻ được; chip và nút xóa lọc hoạt động; mobile và desktop hiển thị đúng.
- [x] T4: Không có dropdown gợi ý nào sau khi gõ từ khóa.
- [x] T5: Chọn trường chỉ hiện khu vực thuộc trường đó.
- [x] T6: Tìm không dấu ra đúng đồ vật có dấu.
- [x] T7: Ở dark mode thanh tìm kiếm đọc được rõ chữ và icon.
- [x] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đều pass.
- [x] Kiểm tra giao diện: Playwright (desktop, mobile 320/390px, dark) và người dùng tự xem trên điện thoại; chưa dùng Playwright MCP chụp screenshot.

## AI Log

### AI-1 — Hiện thực thanh tìm kiếm 4 phân đoạn, tìm không dấu, token dark mode

- Nhiệm vụ (Task): Làm T1–T7 của CHG-025.
- Công cụ AI (AI Tool): Claude Sonnet 5.5
- Đầu vào / Ngữ cảnh (Input/Context): CHG-025, `feed-filters.tsx`, `query.ts`, `catalog.ts`, `globals.css`, seed DB.
- Kết quả AI (AI Output): `FeedFilters` viết lại thành client component (4 phân đoạn, một popover mở một lúc, sticky, chip + “Xóa tất cả”, khu vực lọc theo trường); `catalog.ts` trả thêm `schoolId` cho địa điểm; `query.ts` thêm `removeTones` và điều kiện `translate(...) ilike` hợp với full-text bằng `or`; `globals.css` thêm token `html.dark`; viết `tests/e2e/search-filters.spec.ts` (7 test) và 2 unit test trong `query.test.ts`.
- Quyết định của nhóm (Human Decision): Accepted (người dùng xác nhận hoàn thành)
- Kiểm tra / Xác minh (Verification): `npm run lint`, `npm run typecheck` (0 lỗi), `npm test` (74/74), `npm run build` pass, Playwright 7/7; chạy thử câu `translate()` trên DB dev: “vi” khớp “Mất ví da màu nâu” và “Nhặt được thẻ sinh viên”. Chưa kiểm tra bằng mắt qua Playwright MCP; chưa chạy `/ponytail-review`.
- Ứng viên đưa vào báo cáo: không

### AI-2 — Sửa popover “Thời gian” bị đè trên mobile và đổi nhãn “Vị trí”

- Nhiệm vụ (Task): Fix BUG-1; đổi nhãn phân đoạn 3 cho ngắn.
- Công cụ AI (AI Tool): Claude Sonnet 5.5
- Đầu vào / Ngữ cảnh (Input/Context): Ảnh chụp iPhone do người dùng gửi; `feed-filters.tsx`.
- Kết quả AI (AI Output): Đề xuất 3 phương án (xếp dọc / ép co 2 cột / bottom sheet). Người dùng chọn xếp dọc và đổi nhãn “Trường & khu vực” → “Vị trí”. Sửa `feed-filters.tsx` (`max-[744px]:grid-cols-1`, ô ngày `w-full min-w-0`, nhãn “Vị trí”), cập nhật `search-filters.spec.ts`, thêm TC-025-08.
- Quyết định của nhóm (Human Decision): Accepted phương án A và nhãn “Vị trí” (do người dùng chọn); người dùng xác nhận hoàn thành.
- Kiểm tra / Xác minh (Verification): `npm run lint`, `npm run typecheck` pass; Playwright 8/8 pass (Chromium, viewport 320px). `npm test` 74/74 và `npm run build` pass sau sửa này; chưa thử trên iOS Safari/WebKit thật; chưa xác nhận TC-025-08 fail khi chưa sửa.
- Ứng viên đưa vào báo cáo: có

## Bug

### BUG-1 — Popover “Thời gian” bị đè nhau trên điện thoại

- Biểu hiện: Hai ô “Từ ngày” / “Đến ngày” chồng lên nhau, ô “Đến ngày” tràn ra ngoài mép popover.
- Các bước tái hiện: Mở trang chủ trên iPhone (Safari) → bấm phân đoạn “Thời gian”.
- Kết quả mong đợi / thực tế: Mong đợi hai ô nằm gọn trong popover; thực tế chồng và tràn. Nhãn “Trường & khu vực” cũng bị xuống 3 dòng làm lệch hàng.
- Nguyên nhân gốc: Popover dùng `grid-cols-2`, ô `<input type="date">` trên iOS có chiều rộng nội tại lớn hơn nửa popover và không có `min-w-0`/`w-full` nên không co lại. Nhãn dài trong cột chỉ rộng khoảng 110px.
- Fix: Mobile (≤744px) xếp hai ô theo chiều dọc, ô ngày `w-full min-w-0`; đổi nhãn thành “Vị trí”.
- Verification: Playwright TC-025-08 (viewport 320px) pass; người dùng xác nhận hoàn thành.
- Commit/issue: chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
| --- | --- | --- | --- | --- | --- |
| TC-025-01 | Giao diện tìm kiếm & lọc thống nhất trên desktop (T1) | Đủ 4 phân đoạn, nhãn “Danh mục”, không trùng lặp | Đúng kỳ vọng | Passed | Đủ 4 phân đoạn, không còn dải icon (Playwright) |
| TC-025-02 | Popover mutually exclusive, click ngoài/Esc, sticky khi cuộn (T2) | Một popover mở một lúc; thanh bám đỉnh khi cuộn | Đúng kỳ vọng | Passed | Một popover một lúc, Esc/click ngoài đóng, thanh bám đỉnh khi cuộn (Playwright) |
| TC-025-03 | Tìm từ khóa + lọc, chip, xóa từng chip/xóa tất cả, giao diện mobile (T3) | URL đúng tham số; chip hiện/xóa đúng; mobile đủ tiêu chí | Đúng kỳ vọng | Passed | URL có q/category/from, 3 chip, xóa chip và “Xóa tất cả” đúng; mobile đủ 4 tiêu chí, không tràn (Playwright TC-025-03, TC-025-06) |
| TC-025-04 | Không có gợi ý tìm kiếm sau khi gõ (T4) | Không dropdown native hay custom | Đúng kỳ vọng | Passed | `type=text`, `autocomplete=off`, không có listbox/gợi ý (Playwright) |
| TC-025-05 | Lọc phân cấp trường → khu vực (T5) | Chỉ hiện khu vực thuộc trường đã chọn | Đúng kỳ vọng | Passed | Chọn UIT thì chỉ còn khu vực UIT, không còn khu vực KHTN/KTX (Playwright) |
| TC-025-06 | Tìm không dấu “vi”, “the”, “khoa” (T6) | Ra “ví”, “thẻ”, “khóa” | Đúng kỳ vọng | Passed | `removeTones` + SQL `translate ilike` (Vitest); DB dev: “vi” khớp “ví”, “viên” |
| TC-025-07 | Dark mode thanh tìm kiếm (T7) | Chữ/icon đủ tương phản trên nền tối | Đúng kỳ vọng | Passed | Nền pill tối, chữ sáng khi thêm class `dark` (Playwright, màu tính toán) |
| TC-025-08 | Popover “Thời gian” trên mobile (BUG-1) | Hai ô ngày xếp dọc, nằm trong popover, không chồng nhau | Đúng kỳ vọng ở viewport 320px (Chromium) | Passed | Playwright TC-025-08; chưa thử iOS thật |

## Hướng dẫn tự chạy

```
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test tests/e2e/search-filters.spec.ts
npm run dev
```

Commit sau merge: chưa có (điền sau khi merge vào `main`).
