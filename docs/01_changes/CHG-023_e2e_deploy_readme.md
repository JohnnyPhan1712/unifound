# CHG-023: E2E golden path, rà soát UI, deploy Vercel và README

- ID: `CHG-023`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-014` → `CHG-022`
- File/module dự kiến sửa/tạo: `tests/e2e/*.spec.ts`, `playwright.config.ts`, `README.md`, các component UI cần polish, cấu hình Vercel/env (không commit giá trị thật)
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Luồng chính chạy trọn vẹn và có test tự động: đăng nhập → đăng tin → gửi yêu cầu → chấp nhận → hai bên xác nhận → Đã trả. Ứng dụng có URL demo thật trên Vercel, README hướng dẫn cài/chạy, giao diện nhất quán trên desktop và mobile.

## Phạm vi

### Bao gồm

- Playwright E2E golden path (2 tài khoản demo) và ít nhất một edge case (claim sai quyền hoặc email ngoài trường).
- Rà soát UI toàn app theo `DESIGN.md`: icon, spacing, nhất quán component, loading/empty/error/validation ở mọi màn hình quan trọng, mobile; kiểm bằng Playwright MCP.
- Rà soát nhanh NFR: thông tin nhạy cảm (đáp án, liên hệ) không lộ, tải feed < 3 giây, form có label.
- Deploy Vercel, cấu hình env đúng tên ở `03_development.md` mục 4; ghi URL demo thật (không tạo URL giả).
- README: giới thiệu, stack, cài/chạy, env, scripts, test, URL demo, tài khoản demo (không PII thật).
- Ghi lại ít nhất một bug đã phát hiện, sửa và xác minh trong phần Bug của CHG (nếu có thật).

### Các lưu ý

- Không thêm tính năng mới; lỗi phát hiện ở CHG trước được sửa trong CHG này hoặc ghi lại để quay lại CHG gốc.
- Không sửa `docs/02_reports/` trừ khi được yêu cầu; slide/Product Brief không thuộc CHG này.
- Chỉ ghi kết quả test/deploy đã chạy thật.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/01_overview.md` (mục 6, 7), `docs/02_reports/03_development.md` (mục 7, 8)
- Các CHG-014 → CHG-022 (acceptance criteria, bug ghi nhận)

## Acceptance criteria

- [ ] `npm run test:e2e` chạy golden path xanh trên môi trường dev/demo.
- [ ] Vitest, typecheck, build đều pass.
- [ ] Rà soát UI: không còn màn hình quan trọng thiếu loading/empty/error; mobile không vỡ layout.
- [ ] Ứng dụng deploy thành công, mở được bằng URL thật và chạy lại golden path thủ công.
- [ ] README đủ để người mới cài và chạy được.
- [ ] Không secret/PII thật trong repo, log, ảnh chụp.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-023-01 | E2E golden path (đăng nhập → Đã trả) | Xanh | | Pending | test report |
| TC-023-02 | E2E: email ngoài trường / claim sai quyền | Bị từ chối | | Pending | |
| TC-023-03 | Duyệt UI mobile toàn bộ màn hình chính (Playwright MCP) | Không vỡ layout | | Pending | screenshot |
| TC-023-04 | Kiểm tra đáp án/liên hệ không lộ trên feed và chi tiết | Không lộ | | Pending | |
| TC-023-05 | Chạy golden path trên URL Vercel | Thành công | | Pending | URL, screenshot |
| TC-023-06 | Làm theo README trên máy sạch | Cài và chạy được | | Pending | |

## Hướng dẫn tự chạy

```
npm ci
npm run typecheck
npm test
npm run build
npm run test:e2e
```

1. Chạy `npm run db:seed` để có dữ liệu demo.
2. Chạy `npm run test:e2e` và xem report.
3. Mở URL Vercel, chạy lại luồng bằng hai tài khoản demo.
