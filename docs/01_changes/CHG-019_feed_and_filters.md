# CHG-019: Feed công khai và tìm/lọc (SCR-01)

- ID: `CHG-019`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-015`, `CHG-017`, `CHG-018`
- File/module dự kiến sửa/tạo: `src/app/page.tsx`, `src/lib/reports/queries.ts` (list), `src/lib/reports/search-params.ts`, `src/components/reports/{ReportCard,FeedFilters,Pagination}.tsx`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Ai cũng xem được feed Lost/Found công khai và lọc theo loại, category, location, từ khóa; có trạng thái loading, empty và lỗi.

## Phạm vi

### Bao gồm

- Query danh sách report (mới nhất trước), phân trang.
- Bộ lọc qua URL search params (chia sẻ được link): type, category, location, keyword.
- Card report: type badge, title, category, location, ngày, trạng thái.
- Loading (skeleton), empty state, error state; layout mobile theo mockup `01_home_feed.html`.

### Các lưu ý

- Feed không hiển thị bất kỳ thông tin liên hệ/xác minh nào.
- Không làm trang chi tiết (CHG-020); card chỉ link tới `/reports/[id]`.
- Code feed cũ (CHG-009 `rejected`) đã được xóa ở CHG-013; viết mới.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` FR-01, SCR-01, mục 3
- Mockup `01_home_feed.html`, `DESIGN.md`

## Acceptance criteria

- [ ] Người chưa đăng nhập xem được feed.
- [ ] Lọc theo từng tiêu chí và kết hợp nhiều tiêu chí cho kết quả đúng; giá trị param không hợp lệ bị bỏ qua an toàn.
- [ ] Từ khóa tìm trong title/description, không phân biệt hoa thường.
- [ ] Empty state khi không có kết quả, có nút xóa bộ lọc.
- [ ] Phân trang hoạt động, giữ nguyên bộ lọc.
- [ ] Không tràn ngang ở 375px.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-019-01 | Vitest parse search params (hợp lệ/sai/rỗng) | Giá trị chuẩn hóa an toàn | | Pending | |
| TC-019-02 | E2E mở `/` khi chưa đăng nhập | Thấy danh sách seed | | Pending | |
| TC-019-03 | E2E lọc type=Lost | Chỉ còn Lost | | Pending | |
| TC-019-04 | E2E lọc kết hợp category+location+keyword | Đúng kết quả | | Pending | |
| TC-019-05 | E2E keyword không tồn tại | Empty state + xóa bộ lọc | | Pending | |
| TC-019-06 | E2E viewport 375px | Không cuộn ngang | | Pending | screenshot |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run dev     # thử các bộ lọc, đổi URL param bằng tay
npm test
npm run test:e2e -- feed
```
