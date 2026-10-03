# CHG-031: Nhập họ và tên khi đăng ký

- ID: `CHG-031`
- Trạng thái: `in_review`
- Ngày tạo: `2026-10-03`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-014` (đăng ký, `ensureUserRow`, hồ sơ), `CHG-024` (`newPasswordSchema`, tên miền email), `CHG-026` (đăng ký nằm trong popup `AuthForm`)
- File/module dự kiến sửa/tạo: `src/lib/auth/schemas.ts` (`registerSchema` có `fullName`, dùng lại quy tắc họ tên của `profileSchema`), `src/lib/auth/actions.ts` (`register`), `src/lib/auth/session.ts` (`ensureUserRow` nhận thêm `fullName` tùy chọn), `src/components/auth/auth-form.tsx` (ô "Họ và tên" khi `mode === "register"`), `src/app/profile/page.tsx` (câu chào mừng không còn nhắc nhập họ tên), `src/lib/auth/auth.test.ts`, `tests/e2e/edge-cases.spec.ts` (test đăng ký email ngoài trường phải điền họ tên)
- Branch: `main` (làm trực tiếp trên nhánh hiện tại, bắt đầu 2026-10-03; chưa commit)

## Kết quả người dùng

Form **Tạo tài khoản** có thêm ô **Họ và tên** (bắt buộc) ngay trên ô email. Tài khoản mới có sẵn họ tên, hiển thị đúng ở header, tin đăng, yêu cầu nhận lại; người dùng không phải vào Hồ sơ bổ sung họ tên như trước.

## Phạm vi

### Bao gồm

- **Form:** thêm `Input` "Họ và tên" (`name="fullName"`, `autoComplete="name"`, bắt buộc, hiển thị lỗi theo field) chỉ ở chế độ đăng ký, đặt trên ô email. Giữ lại giá trị đã nhập khi form báo lỗi (như email hiện tại).
- **Validate phía server (Zod):** `registerSchema` = `credentialsSchema` + `fullName` (trim, 2–120 ký tự, cùng thông báo với `profileSchema`). Tái sử dụng quy tắc có sẵn, không viết lại; lỗi họ tên và lỗi email/mật khẩu hiện cùng lúc.
- **Lưu họ tên:** `register` truyền `fullName` vào `ensureUserRow` để ghi vào `users.full_name` khi tạo bản ghi. Làm ở bước này (không đợi đăng nhập) để cả luồng "cần xác nhận email" cũng có họ tên. `ensureUserRow` không đổi hành vi với người dùng đã tồn tại và với các nơi gọi khác (đăng nhập, callback).
- **Sau đăng ký:** vẫn chuyển tới `/profile?welcome=1` như hiện tại; ô Họ và tên trong Hồ sơ đã có sẵn giá trị. Rà lại nội dung chào mừng/hướng dẫn ở trang Hồ sơ nếu đang nhắc "nhập họ tên" thì sửa cho khớp.
- **Test:** unit test `registerSchema` (thiếu, 1 ký tự, 121 ký tự, có khoảng trắng đầu/cuối); cập nhật E2E "email ngoài trường bị server từ chối" để điền họ tên; thêm kiểm tra form đăng ký có ô Họ và tên.

### Các lưu ý (Tránh hiểu nhầm)

- **Không đổi schema database:** `users.full_name` đã có (cho phép null vì tài khoản cũ/seed). Không cần migration và không đổi thành `not null`, tránh ảnh hưởng tài khoản hiện có.
- Tài khoản đã tạo trước đây chưa có họ tên vẫn bổ sung ở trang Hồ sơ như cũ; CHG này không bắt buộc họ tên ở lần đăng nhập sau.
- Chỉ họ tên. MSSV, trường, thông tin liên hệ vẫn nhập ở Hồ sơ (trường vẫn tự gán theo tên miền email).
- Không lưu họ tên vào `user_metadata` của Supabase Auth; nguồn dữ liệu duy nhất là bảng `users`. Không thêm dependency.
- Giữ `DESIGN.md`; ô mới dùng `Input` có sẵn, không đổi bố cục popup. Kiểm tra popup không tràn/cuộn khó chịu ở 320px và màn hình thấp vì form dài thêm một ô.
- Không dùng họ tên thật trong ảnh chụp/log; test dùng tên giả.
- Không sửa trang đăng nhập và quên mật khẩu.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`
- `docs/01_changes/CHG-014_ui_foundation_auth_profile.md`, `docs/01_changes/CHG-026_header_auth_popup_help_footer.md`
- `src/lib/auth/schemas.ts`, `src/lib/auth/actions.ts`, `src/lib/auth/session.ts`, `src/components/auth/auth-form.tsx`, `src/app/profile/page.tsx`, `src/lib/auth/auth.test.ts`
- Supabase skills (Auth với `@supabase/ssr`) nếu động vào luồng `signUp`

## Acceptance criteria

- [x] Form Tạo tài khoản có ô Họ và tên bắt buộc, nằm trên ô email; form Đăng nhập và Quên mật khẩu không đổi. (E2E xác nhận ô hiện ở popup đăng ký; form đăng nhập không đổi do điều kiện `mode === "register"`.)
- [ ] Thiếu họ tên, họ tên < 2 hoặc > 120 ký tự bị server từ chối kèm thông báo tiếng Việt ngay tại ô; giá trị đã nhập (họ tên, email) được giữ lại.
- [ ] Đăng ký thành công: `users.full_name` có đúng họ tên đã trim; header, trang Hồ sơ hiển thị họ tên đó. Đúng với cả luồng có session ngay và luồng cần xác nhận email.
- [ ] Người dùng cũ chưa có họ tên và luồng đăng nhập/callback không bị ảnh hưởng.
- [x] Không phát sinh migration.
- [x] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đều pass (81 test); `edge-cases` và `header-help` E2E pass (11 test). Chưa chạy lại toàn bộ E2E.
- [ ] Kiểm tra giao diện popup đăng ký bằng Playwright MCP (desktop và 320px), screenshot làm evidence: **chưa làm**, không có Playwright MCP trong phiên.

## AI Log

### AI-1 — Thêm họ tên vào đăng ký

- Nhiệm vụ (Task): thêm ô Họ và tên ở form đăng ký, validate server và lưu vào `users.full_name`.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), skill ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): CHG-031, `schemas.ts`, `actions.ts`, `session.ts`, `auth-form.tsx`, `profile/page.tsx`.
- Kết quả AI (AI Output): tách `fullName` dùng chung giữa `profileSchema` và `registerSchema` mới; `ensureUserRow` nhận `fullName` tùy chọn nên các nơi gọi khác (đăng nhập, callback) không đổi; `register` giữ lại cả họ tên khi báo lỗi. Sửa thêm câu chào ở trang Hồ sơ vì đang bảo "điền họ tên".
- Quyết định của nhóm (Human Decision): chờ xác nhận
- Kiểm tra / Xác minh (Verification): unit test `registerSchema` (TC-031-02); E2E `edge-cases` và `header-help`; `lint`, `typecheck`, `test`, `build` pass.
- Ứng viên đưa vào báo cáo: không

## Bug

Không có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-031-01 | Mở popup đăng ký | Có ô Họ và tên phía trên email; popup đăng nhập không có ô này | Popup đăng ký có ô Họ và tên (E2E); chưa đối chiếu popup đăng nhập bằng test | Passed | `edge-cases.spec.ts` |
| TC-031-02 | Unit test `registerSchema`: thiếu, 1 ký tự, 121 ký tự, khoảng trắng đầu/cuối | Thiếu/ngắn/dài bị từ chối theo field `fullName`; chuỗi hợp lệ được trim | Thiếu, 1 ký tự, 121 ký tự bị từ chối; chuỗi hợp lệ được trim | Passed | `auth.test.ts` TC-031 |
| TC-031-03 | Gửi form đăng ký để trống họ tên | Lỗi ngay tại ô Họ và tên; email đã nhập được giữ | Chưa chạy | Pending | — |
| TC-031-04 | Đăng ký email ngoài trường (có điền họ tên) | Lỗi tên miền như cũ | Lỗi tên miền như cũ khi đã điền họ tên | Passed | `edge-cases.spec.ts` |
| TC-031-05 | Đăng ký thành công với họ tên hợp lệ (email trường thử nghiệm) | `users.full_name` đúng; header và Hồ sơ hiển thị họ tên | Chưa chạy: cần đăng ký thật trên Supabase bằng email trường thử nghiệm | Pending | — |
| TC-031-06 | Đăng ký khi Supabase bật xác nhận email | Bản ghi `users` đã có họ tên trước khi xác nhận; đăng nhập sau đó thấy đúng tên | Chưa chạy | Pending | — |
| TC-031-07 | Đăng nhập tài khoản cũ chưa có họ tên | Đăng nhập bình thường; Hồ sơ cho nhập họ tên như trước | Chưa chạy riêng; luồng đăng nhập không đổi (`ensureUserRow` giữ nguyên với người dùng đã có), golden path dùng tài khoản seed | Pending | — |
| TC-031-08 | Popup đăng ký ở 320px và màn hình thấp | Không tràn ngang, các ô và nút vẫn thao tác được | Chưa chạy | Pending | — |

## Hướng dẫn tự chạy

```
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test   # cần SEED_DEMO_PASSWORD trong .env.local
npm run dev           # xem tay: mở /?auth=register, thử để trống họ tên, rồi đăng ký bằng email trường thử nghiệm
```
