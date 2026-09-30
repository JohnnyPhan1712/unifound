# CHG-018: Seed dữ liệu demo

- ID: `CHG-018`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-016`, `CHG-017`
- File/module dự kiến sửa/tạo: `src/db/seed.ts`, tài liệu biến môi trường seed (nếu cần service role key, chỉ dùng cục bộ)
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Sau `npm run db:seed`, ứng dụng có sẵn tài khoản demo và khoảng 12 report để xem feed, matching và demo end-to-end.

## Phạm vi

### Bao gồm

- 3–4 tài khoản demo (USER) và 1 ADMIN, email dạng `@example.com`, không dùng PII thật.
- ~12 report đủ 6 category, nhiều location, cả Lost và Found, đa dạng ngày.
- Có chủ ý ít nhất 3 cặp Lost/Found sẽ đạt score ≥50, 1 cặp sát ngưỡng (<50) và 1 report không có cặp nào.
- Seed idempotent: chạy nhiều lần không nhân đôi dữ liệu.
- Liệt kê tài khoản/mật khẩu demo trong CHG (mật khẩu demo, không phải secret thật).

### Các lưu ý

- Chưa seed claim (CHG-024/025 tự bổ sung dữ liệu claim vào seed trong phạm vi của mình).
- Không sửa schema/migration.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` mục 6, 7 (để thiết kế cặp khớp)
- `docs/02_reports/03_development.md` mục 4, 6
- `src/db/schema.ts` (schema sau CHG-014); `src/db/seed.ts` do CHG này tạo mới (file cũ đã xóa ở CHG-013)

## Acceptance criteria

- [ ] `npm run db:seed` chạy được trên DB sạch và trên DB đã seed.
- [ ] Đủ số lượng report/tài khoản, có cặp khớp/sát ngưỡng/không khớp như mô tả.
- [ ] Không có PII thật hoặc secret trong file seed.
- [ ] Đăng nhập được bằng tài khoản demo và ADMIN.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-018-01 | Chạy seed lần 1 trên DB sạch | Tạo đủ user/report | | Pending | |
| TC-018-02 | Chạy seed lần 2 | Số bản ghi không đổi | | Pending | |
| TC-018-03 | Đếm report theo type/category | Có cả Lost/Found, đủ 6 category | | Pending | |
| TC-018-04 | Đăng nhập tài khoản demo và ADMIN | Thành công, role đúng | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:migrate
npm run db:seed
npm run db:seed    # chạy lần 2 kiểm tra idempotent
```
