# CHG-020: Chi tiết report chỉ-đọc (SCR-03)

- ID: `CHG-020`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-019`
- File/module dự kiến sửa/tạo: `src/app/reports/[id]/{page,loading,not-found}.tsx`, `src/lib/reports/queries.ts` (getById), `src/components/reports/ReportDetail.tsx`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Người dùng mở một report từ feed và xem đầy đủ mô tả, category, location, ngày, trạng thái; id không tồn tại hiện trang 404.

## Phạm vi

### Bao gồm

- Trang chi tiết công khai theo mockup `03_report_detail.html`.
- Hiển thị loại (Lost/Found), trạng thái hiện tại, người đăng (tên hiển thị, không email).
- Loading, 404, error state.
- Chừa vùng (slot) cho: nút sửa/xóa (CHG-021), gợi ý match (CHG-023), form claim (CHG-024), panel claim (CHG-025). CHG này sở hữu `page.tsx`; các CHG sau chỉ thêm component riêng vào slot.

### Các lưu ý

- Không hiển thị email, thông tin liên hệ hay thông tin xác minh.
- Không làm hành động nào (sửa/xóa/claim) trong CHG này.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` FR-03, SCR-03, mục 4
- Mockup `03_report_detail.html`, `DESIGN.md`

## Acceptance criteria

- [ ] Xem được chi tiết khi chưa đăng nhập.
- [ ] Hiển thị đủ field và trạng thái đúng với DB.
- [ ] id sai định dạng hoặc không tồn tại → 404, không lỗi 500.
- [ ] Không lộ email/thông tin riêng tư trong HTML.
- [ ] Layout mobile đọc được, có nút quay lại feed.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-020-01 | Vitest validate id (uuid/sai định dạng) | Sai → not found | | Pending | |
| TC-020-02 | E2E click card ở feed | Mở đúng report | | Pending | |
| TC-020-03 | E2E `/reports/<uuid-không-tồn-tại>` | Trang 404 | | Pending | |
| TC-020-04 | E2E `/reports/abc` | Trang 404, không 500 | | Pending | |
| TC-020-05 | Kiểm tra HTML/response | Không chứa email người đăng | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run dev     # mở feed → click report; thử URL id sai
npm test
npm run test:e2e -- report-detail
```
