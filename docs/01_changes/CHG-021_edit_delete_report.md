# CHG-021: Sửa/xóa report và phân quyền (FR-07)

- ID: `CHG-021`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-016`, `CHG-020`
- File/module dự kiến sửa/tạo: `src/lib/reports/permissions.ts`, `src/lib/reports/actions.ts` (update/delete), `src/app/reports/[id]/edit/*`, `src/components/reports/ReportOwnerActions.tsx`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Chủ report sửa hoặc xóa report của mình; ADMIN sửa/xóa mọi report; USER khác bị từ chối.

## Phạm vi

### Bao gồm

- Hàm quyền thuần `canEditReport / canDeleteReport(user, report)`: owner hoặc ADMIN.
- Server action update (dùng lại Zod schema của CHG-017) và delete; kiểm tra quyền ở server, trả 403 khi vi phạm.
- Form sửa điền sẵn dữ liệu; xóa có hộp thoại xác nhận.
- Nút sửa/xóa chỉ hiện với người có quyền (nhưng server vẫn là nơi quyết định).
- Xóa report kéo theo claim liên quan theo ràng buộc DB (cascade) — ghi rõ hành vi.

### Các lưu ý

- Không đổi `type` hay `ownerId` khi sửa.
- Không chuyển trạng thái Returned/claim ở đây (CHG-025).

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` FR-07, mục Quyền truy cập
- `src/db/schema.ts` (onDelete), `src/lib/auth/*` (requireUser)

## Acceptance criteria

- [ ] Owner sửa/xóa được report của mình.
- [ ] ADMIN sửa/xóa được report của người khác.
- [ ] USER không phải owner gọi sửa/xóa → 403, dữ liệu không đổi (kể cả gọi trực tiếp action/API).
- [ ] Anon bị từ chối/redirect login.
- [ ] Sửa với dữ liệu sai bị Zod từ chối, lỗi tại field.
- [ ] Xóa yêu cầu xác nhận và report biến mất khỏi feed.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-021-01 | Vitest ma trận quyền owner/other/admin/anon × edit/delete | Đúng bảng quyền | | Pending | |
| TC-021-02 | Vitest action update bởi USER khác | 403, DB không đổi | | Pending | |
| TC-021-03 | E2E owner sửa title | Detail hiển thị title mới | | Pending | |
| TC-021-04 | E2E owner xóa (xác nhận) | Report biến mất khỏi feed | | Pending | |
| TC-021-05 | E2E ADMIN xóa report người khác | Thành công | | Pending | |
| TC-021-06 | E2E USER khác mở `/reports/[id]/edit` | Bị chặn | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run dev     # đăng nhập owner, ADMIN, USER khác để so sánh
npm test
npm run test:e2e -- edit-delete
```
