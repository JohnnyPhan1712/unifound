# CHG-021: Báo cáo vi phạm và kiểm duyệt (admin)

- ID: `CHG-021`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-016`, `CHG-018` (thông báo), `CHG-014` (guard/role)
- File/module dự kiến sửa/tạo: `src/lib/flags/*`, `src/lib/admin/*`, `src/app/admin/layout.tsx`, `src/app/admin/moderation`, `src/components/reports/flag-button.tsx`, `src/lib/auth/*` (khóa tài khoản)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `chưa có` (ghi hash commit trên `main` sau khi push)

## Kết quả người dùng

Sinh viên báo cáo tin spam/sai sự thật kèm lý do. Quản trị viên vào khu vực quản trị, xem hàng đợi báo cáo, ẩn tin hoặc bỏ qua, và khóa/mở khóa tài khoản.

## Phạm vi

### Bao gồm

- FR14: nút "Báo cáo" trên chi tiết tin (đăng nhập, có lý do, mỗi người một báo cáo/tin); lưu `flags` (`NEW`).
- S12: trang kiểm duyệt: danh sách flags `NEW`, xem tin, "Ẩn tin" (`HIDDEN`) hoặc "Bỏ qua" (flag `HANDLED`); tin ẩn biến khỏi feed.
- FR15 (phần khóa): khóa/mở khóa user (`locked`/`active`); user khóa không đăng nhập/thao tác được (tận dụng chặn ở CHG-014).
- Guard `/admin`: chỉ `ADMIN`; server kiểm tra ở mọi action.
- Thông báo cho chủ tin khi tin bị ẩn.

### Các lưu ý

- Kiểm duyệt sau khi đăng (tin lên ngay).
- Tài khoản `ADMIN` được cấp sẵn (seed/Supabase), không có UI cấp quyền.
- Danh mục/địa điểm và thống kê ở CHG-022.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR14, FR15, S12, mục 1 vai trò)

## Acceptance criteria

- [ ] Người dùng báo cáo được tin; báo cáo trùng bị từ chối; thiếu lý do báo lỗi.
- [ ] Admin thấy hàng đợi flags và xử lý được (ẩn tin / bỏ qua).
- [ ] Tin bị ẩn không hiện trong feed và chi tiết công khai.
- [ ] Khóa tài khoản làm user không đăng nhập/thao tác được; mở khóa khôi phục.
- [ ] `USER` vào `/admin` hoặc gọi action admin bị từ chối (403).
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-021-01 | Vitest: quyền admin cho từng action | Chỉ ADMIN được phép | | Pending | |
| TC-021-02 | Vitest: Zod lý do báo cáo | Từ chối rỗng/quá dài | | Pending | |
| TC-021-03 | UI: báo cáo tin, báo cáo lần hai | Lưu lần 1, từ chối lần 2 | | Pending | screenshot |
| TC-021-04 | UI: admin ẩn tin | Tin biến khỏi feed, chủ tin có thông báo | | Pending | |
| TC-021-05 | UI: admin bỏ qua | Flag `HANDLED`, tin vẫn hiện | | Pending | |
| TC-021-06 | UI: admin khóa user | User không đăng nhập/thao tác được | | Pending | |
| TC-021-07 | USER mở `/admin` | Bị chặn | | Pending | |

## Hướng dẫn tự chạy

```
npm test
npm run typecheck
npm run build
npm run dev
```

1. Đăng nhập USER, báo cáo một tin.
2. Đăng nhập ADMIN (tài khoản cấp sẵn), mở `/admin/moderation`, ẩn tin và kiểm tra feed.
3. Khóa một user rồi thử đăng nhập bằng user đó; mở khóa.
