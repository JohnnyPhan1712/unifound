# CHG-017: Tin của tôi, sửa/đóng/xóa tin

- ID: `CHG-017`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-016`
- File/module dự kiến sửa/tạo: `src/app/my`, `src/app/reports/[id]/edit`, `src/lib/reports/update.ts`, `src/lib/auth/permissions.ts`, `src/components/reports/*`
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `chưa có` (ghi hash commit trên `main` sau khi push)

## Kết quả người dùng

Sinh viên vào "Tin của tôi" xem các tin đã đăng, sửa, đóng hoặc xóa tin của mình. Người khác (không phải chủ tin, không phải ADMIN) không thể sửa/xóa.

## Phạm vi

### Bao gồm

- S07 tab 1 "Tin đã đăng" (các tab yêu cầu để CHG-019): danh sách tin của tôi kèm trạng thái, hành động sửa/đóng/xóa.
- FR05: sửa tin (dùng lại Zod của CHG-015), đóng tin (`CLOSED`), xóa tin (kèm dọn ảnh Storage).
- Kiểm tra ownership phía server: chủ tin hoặc `ADMIN`; người khác nhận 403, dữ liệu không đổi.
- Không cho sửa/xóa khi tin đang `IN_PROGRESS` hoặc `RETURNED` nếu quy ước ghi rõ trong CHG.
- Nút Sửa/Xóa trên chi tiết tin chỉ hiện cho chủ tin/ADMIN (UI chỉ để tiện, server mới quyết định).

### Các lưu ý

- Hiển thị hết hạn 60 ngày: tin quá hạn hiện nhãn "Đã hết hạn" ở "Tin của tôi", không cần tác vụ nền.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR05, S07, acceptance criteria FR05/FR14)

## Acceptance criteria

- [ ] "Tin của tôi" liệt kê đúng tin của user đang đăng nhập.
- [ ] Chủ tin sửa, đóng, xóa được; thay đổi lưu đúng.
- [ ] `USER` khác gọi sửa/xóa → 403, dữ liệu không đổi.
- [ ] `ADMIN` sửa/xóa được tin của người khác.
- [ ] Tin đã xóa không còn trong feed và ảnh được dọn.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-017-01 | Vitest: hàm phân quyền (owner, admin, user khác, chưa đăng nhập) | Cho/từ chối đúng | | Pending | |
| TC-017-02 | Vitest: điều kiện trạng thái được phép sửa/xóa | Đúng theo quy ước | | Pending | |
| TC-017-03 | Chủ tin sửa tiêu đề/mô tả | Lưu và hiển thị mới | | Pending | |
| TC-017-04 | Chủ tin đóng tin | `CLOSED`, biến khỏi feed | | Pending | |
| TC-017-05 | User B sửa/xóa tin của A (gọi trực tiếp) | 403, dữ liệu không đổi | | Pending | |
| TC-017-06 | ADMIN xóa tin của người khác | Thành công | | Pending | |
| TC-017-07 | Xóa tin có ảnh | Bản ghi và ảnh Storage đều mất | | Pending | |

## Hướng dẫn tự chạy

```
npm run typecheck
npm test
npm run build
npm run dev
```

1. Đăng nhập tài khoản A, tạo tin, vào "Tin của tôi" sửa/đóng/xóa.
2. Đăng nhập tài khoản B, thử sửa/xóa tin của A (mở URL sửa hoặc gọi action trực tiếp) → phải bị từ chối.
