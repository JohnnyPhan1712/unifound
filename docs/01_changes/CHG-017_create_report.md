# CHG-017: Tạo Lost/Found Report (SCR-02)

- ID: `CHG-017`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-014`, `CHG-015`, `CHG-016`
- File/module dự kiến sửa/tạo: `src/lib/reports/constants.ts`, `src/lib/reports/schema.ts`, `src/lib/reports/actions.ts` (createReport), `src/app/reports/new/*`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Người dùng đã đăng nhập tạo Lost hoặc Found Report; thiếu/sai field thì báo lỗi ngay tại field, dữ liệu hợp lệ được lưu.

## Phạm vi

### Bao gồm

- Hằng số: category (6 giá trị cố định), location (danh sách khu vực trường), type, status khởi tạo.
- Zod schema dùng chung client và server: `type`, `title`, `category`, `description`, `location`, `eventDate` bắt buộc; ngày không ở tương lai.
- Server action tạo report gắn `ownerId` từ session (không nhận từ client).
- Form theo mockup `02_create_report.html`: label, lỗi tại field, trạng thái submit/loading.
- Sau khi tạo: chuyển tới trang chi tiết (nếu CHG-020 chưa merge thì về feed).

### Các lưu ý

- Không có trường liên hệ cá nhân bắt buộc trên report.
- Không làm sửa/xóa (CHG-021) hay hiển thị feed (CHG-019).
- Code tạo report cũ (CHG-009 `rejected`) đã được xóa ở CHG-013; viết mới.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` mục 1 (FR-02), 6 (Report)
- `src/db/schema.ts` (enum, cột)
- Mockup `02_create_report.html`, `DESIGN.md`

## Acceptance criteria

- [ ] Given dữ liệu hợp lệ, submit → bản ghi lưu đúng type/status/owner.
- [ ] Given thiếu field bắt buộc, không lưu và lỗi hiện tại field liên quan.
- [ ] Server từ chối category/location/type ngoài danh sách dù bypass form.
- [ ] Người chưa đăng nhập không tạo được (server từ chối, không chỉ ẩn nút).
- [ ] Form dùng bàn phím được, mọi input có label.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-017-01 | Vitest schema: hợp lệ | Parse thành công | | Pending | |
| TC-017-02 | Vitest schema: thiếu từng field bắt buộc | Lỗi đúng field | | Pending | |
| TC-017-03 | Vitest schema: category/location/type/ngày sai | Bị từ chối | | Pending | |
| TC-017-04 | Vitest action khi anon | Từ chối, không ghi DB | | Pending | |
| TC-017-05 | E2E tạo Lost report | Lưu và điều hướng đúng | | Pending | |
| TC-017-06 | E2E tạo Found report | Lưu đúng type Found | | Pending | |
| TC-017-07 | E2E submit form rỗng | Lỗi tại field, không lưu | | Pending | |

## Hướng dẫn tự chạy

```
npm run dev     # đăng nhập, vào /reports/new, thử form hợp lệ và form rỗng
npm test
npm run test:e2e -- create-report
```
