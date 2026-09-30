# CHG-027: E2E golden path và rà soát responsive/accessibility

- ID: `CHG-027`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-026`
- File/module dự kiến sửa/tạo: `tests/e2e/golden-path.spec.ts`, `tests/e2e/responsive.spec.ts`, `playwright.config.ts`, sửa lỗi nhỏ phát hiện được (ghi từng lỗi vào mục Bug)
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Luồng chính từ đăng nhập đến Returned chạy ổn định trên desktop và mobile; form dùng được bằng bàn phím.

## Phạm vi

### Bao gồm

- Một test Playwright cho golden path: đăng nhập → tạo Lost report → xem Potential Matches → (user khác) gửi claim → chủ Found Accept → đánh dấu Returned → kiểm tra My Reports.
- Test lặp ở viewport desktop và mobile.
- Rà soát tay + tự động: label form, thông báo lỗi, thứ tự Tab, tương phản, không tràn ngang.
- Test dữ liệu độc lập: mỗi lần chạy tạo dữ liệu riêng hoặc reset an toàn.
- Sửa lỗi nhỏ phát hiện; lỗi lớn tạo CHG riêng, không làm ở đây.

### Các lưu ý

- Không thêm tính năng mới.
- Ghi ít nhất một bug thật đã tìm, sửa và xác minh (yêu cầu Mini Project), nếu có phát sinh.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/01_overview.md` mục 6, 7
- `docs/02_reports/03_development.md` mục 7
- `tests/e2e/*`; các CHG-016 → CHG-026

## Acceptance criteria

- [ ] Golden path pass trên desktop và mobile, chạy lặp lại nhiều lần vẫn pass.
- [ ] Không còn lỗi label/focus nghiêm trọng ở Create Report, Login, Claim form.
- [ ] Không có màn hình nào tràn ngang ở 375px.
- [ ] Bug phát hiện được ghi đủ 7 trường.
- [ ] `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-027-01 | Golden path desktop | Hoàn tất tới Returned | | Pending | |
| TC-027-02 | Golden path mobile | Hoàn tất tới Returned | | Pending | |
| TC-027-03 | Chạy golden path 3 lần liên tiếp | Pass cả 3 | | Pending | |
| TC-027-04 | Điều hướng bằng bàn phím các form chính | Hoàn tất không cần chuột | | Pending | |
| TC-027-05 | Quét tràn ngang các màn hình ở 375px | Không tràn | | Pending | screenshot |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run test:e2e
npm run test:e2e -- --headed   # xem trực tiếp khi debug
```
