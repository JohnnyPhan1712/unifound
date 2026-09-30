# CHG-016: Đăng nhập và vai trò USER/ADMIN

- ID: `CHG-016`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-014`, `CHG-015`
- File/module dự kiến sửa/tạo: `src/lib/auth/*` (viết lại), `src/utils/supabase/*`, `src/middleware.ts`, `src/app/login`, `src/app/register`, `src/components/layout/AuthMenu`, slot auth ở Header
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Người dùng đăng ký, đăng nhập (email/password hoặc magic link), đăng xuất; header hiển thị trạng thái đăng nhập; trang yêu cầu đăng nhập chuyển hướng về login khi chưa đăng nhập.

## Phạm vi

### Bao gồm

- Đăng ký / đăng nhập email+password và magic link bằng Supabase Auth (`@supabase/ssr`), đăng xuất, refresh session qua middleware.
- Đồng bộ bảng `users` với Supabase Auth; role mặc định `USER`, không cho tự nâng quyền.
- Tài khoản `ADMIN` được cấp sẵn (bằng SQL/seed thủ công, ghi cách làm trong CHG).
- Helper server: `getCurrentUser`, `requireUser`, `requireAdmin`.
- Zod schema cho form đăng ký/đăng nhập, lỗi hiển thị tại field.

### Các lưu ý

- Chỉ xác định danh tính. Ownership/quyền từng thao tác report/claim thuộc CHG-021/024/025.
- Không đưa key/secret vào code hay log; `DATABASE_URL` chỉ dùng phía server.
- Code auth cũ (CHG-008 `rejected`) đã được xóa ở CHG-013; viết mới hoàn toàn. Schema `users` do CHG-014 sở hữu, CHG này không sửa schema.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` mục 1 (Quyền truy cập), mục 6 (User)
- `docs/02_reports/03_development.md` mục 1 (Supabase Auth), 4 (env), 6 (DB)
- `src/db/schema.ts`; mockup `06_auth.html`

## Acceptance criteria

- [ ] Đăng ký thành công tạo user với role `USER`; không có đường nào tự đặt `ADMIN` từ client.
- [ ] Đăng nhập sai mật khẩu hiện lỗi rõ, không lộ email có tồn tại hay không.
- [ ] Magic link gửi được và đăng nhập được (hoặc ghi rõ giới hạn môi trường test).
- [ ] Đăng xuất xóa session; header cập nhật đúng.
- [ ] Trang yêu cầu đăng nhập redirect về `/login` kèm đường dẫn quay lại.
- [ ] `requireAdmin` từ chối `USER` (403).
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-016-01 | Vitest schema đăng ký/đăng nhập (email sai, mật khẩu ngắn) | Trả lỗi theo field | | Pending | |
| TC-016-02 | Vitest `requireUser`/`requireAdmin` với anon/USER/ADMIN | anon→401/redirect, USER→403 ở admin | | Pending | |
| TC-016-03 | E2E đăng ký → đăng nhập → đăng xuất | Header đổi trạng thái đúng | | Pending | |
| TC-016-04 | E2E vào `/reports/new` khi chưa đăng nhập | Redirect `/login` | | Pending | |
| TC-016-05 | E2E đăng nhập sai mật khẩu | Thông báo lỗi chung, không lộ tồn tại email | | Pending | |

## Hướng dẫn tự chạy

```
# cần .env.local có NEXT_PUBLIC_SUPABASE_URL, KEY, DATABASE_URL (không commit)
npm run db:migrate
npm run dev
npm test
npm run test:e2e -- auth
```
