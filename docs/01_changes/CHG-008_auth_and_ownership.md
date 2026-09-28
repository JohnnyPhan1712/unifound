# CHG-008: tích hợp đăng nhập và phân quyền sở hữu

- ID: `CHG-008`
- Trạng thái: `in_review`
- Ngày tạo: `2026-09-22`
- Sprint/Milestone: `Sprint 1 / MVP foundation`
- Người phụ trách: `Quân`
- Reviewer: `Chiến`
- Notion Task: `tích hợp đăng nhập và phân quyền sở hữu`
- Dependency: `CHG-006`, `CHG-007`
- Branch: `feat/auth-and-ownership`
- PR: `chưa có`
- Commit sau merge: `chưa có`
- File/module dự kiến sửa: `src/app/**` auth surfaces, `src/lib/auth/**`, protected server actions/routes, auth tests
- Phạm vi ownership: `auth utilities, session boundary và ownership checks`
- File/module đã sửa: `src/db/schema.ts`, `src/db/schema.test.ts`, `src/db/seed.ts`, `src/lib/auth/**`, `src/app/api/auth/**`, `src/app/api/reports/**`, `src/components/auth-header.tsx`, `src/components/report-actions.tsx`
- Phạm vi ownership: `auth utilities, role authorization (USER/ADMIN), API route handlers, session boundary và ownership checks`
- Thời gian Sprint: `2026-09-23` đến `2026-09-29`

## Kết quả người dùng
Sinh viên có thể đăng ký tài khoản, đăng nhập, đăng xuất và duy trì phiên làm việc an toàn. Người chưa đăng nhập vẫn có thể xem nội dung feed công khai, nhưng các thao tác nhạy cảm (tạo tin, nhận đồ, xem bằng chứng xác minh riêng tư) được kiểm soát quyền chặt chẽ phía server. Phân quyền rõ ràng giữa USER (chỉ sửa/xóa bài đăng của chính mình) và ADMIN (quản trị, sửa/xóa bài vi phạm).

## Phạm vi

### Bao gồm
- Tích hợp Supabase Auth với Next.js SSR qua `@supabase/ssr`.
- Thêm `userRoleEnum` ("USER", "ADMIN") và cột `role` vào bảng `users` (`src/db/schema.ts`).
- Xây dựng Server Actions tại `src/lib/auth/actions.ts`: `signInWithPassword`, `signUpWithPassword` (mặc định gán `role = 'USER'`), `signOut`, `getCurrentUser`, `getCurrentUserWithProfile`, `deleteReportAction`, `updateReportAction`.
- Xây dựng hệ thống phân quyền & sở hữu tại `src/lib/auth/ownership.ts`:
  - `requireAuth`: Bắt buộc đăng nhập cho các thao tác riêng tư.
  - `assertAdmin`: Bắt buộc quyền Quản trị viên (ADMIN).
  - `assertUserOwnsReport`: Kiểm tra người dùng là chủ sở hữu hoặc ADMIN trước khi sửa/xóa/đóng.
  - `canUserManageReport`: Helper kiểm tra quyền cho UI component.
  - `assertCanClaimReport`: Ngăn người dùng tự claim đồ do chính mình đăng; chỉ cho phép claim Found Report còn mở.
  - `assertCanManageClaim`: Chỉ người nhặt đồ (chủ Found Report) mới có quyền duyệt/từ chối Claim và đánh dấu `Returned`.
  - `assertCanViewProof`: Bảo vệ thông tin xác minh quyền sở hữu (`proof`), chỉ người gửi claim và chủ Found Report mới được xem.
- Xây dựng REST API Route Handlers:
  - `POST /api/auth/register`: Đăng ký tài khoản (ép role USER).
  - `POST /api/auth/login`: Đăng nhập lấy profile + role.
  - `POST /api/auth/logout`: Đăng xuất và xóa phiên.
  - `GET /api/auth/me`: Lấy thông tin user hiện tại kèm role (401 nếu chưa đăng nhập).
  - `GET /api/reports`: Xem danh sách bài đăng công khai.
  - `POST /api/reports`: Tạo bài đăng (bắt buộc auth, tự động gán userId = currentUser.id).
  - `PUT /api/reports/:id` & `DELETE /api/reports/:id`: Cập nhật/xóa bài đăng với ownership check phía backend (403 nếu cố sửa/xóa bài người khác khi không phải ADMIN).
- Giao diện UI:
  - Header với trạng thái tài khoản, nhãn badge `ADMIN` và nút Đăng xuất (`src/components/auth-header.tsx`).
  - Nút thao tác Sửa/Xóa hiển thị theo quyền sở hữu và Admin (`src/components/report-actions.tsx`).
  - Trang Đăng nhập (`src/app/login/page.tsx`).
  - Trang Đăng ký (`src/app/register/page.tsx`).
- Viết 24 Unit tests với Vitest (`src/lib/auth/ownership.test.ts`) và 10 schema tests (`src/db/schema.test.ts`) bao phủ toàn diện các kịch bản phân quyền.

### Không bao gồm
- Matching score (thuộc CHG-010).
- Claim state transition chi tiết (thuộc CHG-011).
- Trang feed và report form đầy đủ (thuộc CHG-009).

## File/tài liệu liên quan

- `docs/02_reports/02_requirements_design.md`
- `docs/02_reports/03_development.md`
- `docs/00_guides/03_design/architecture.md`

## Acceptance criteria
- [x] Người dùng có thể đăng ký, đăng nhập và đăng xuất bằng flow Email/Password.
- [x] Phân quyền USER và ADMIN hoạt động chính xác (USER mặc định khi đăng ký, không thể tự nâng role).
- [x] Người chưa đăng nhập không thể thực hiện thao tác cần quyền (bị từ chối với `UnauthorizedError` / HTTP 401).
- [x] Server từ chối thao tác của người không sở hữu dữ liệu (bị từ chối với `ForbiddenError` / HTTP 403), trừ khi có role ADMIN.
- [x] Backend tự động gán userId từ phiên xác thực khi tạo post, không tin tưởng userId gửi từ client.
- [x] Feed công khai không yêu cầu đăng nhập.
- [x] Không đưa auth secret vào source hoặc tài liệu.

## Kiểm tra và bằng chứng

- Kết quả: `đã kiểm tra thành công; 7/7 tiêu chí đạt 100%`
- Unit tests: `npm test` -> 41/41 tests passed (24 auth/ownership tests, 10 schema contract tests, 6 API route security tests, 1 app shell test).
- Typecheck: `npm run typecheck` -> passed với 0 lỗi.
- Next.js build: `npm run build` -> tạo build production thành công với 10/10 route static và dynamic.
- Live Server E2E Verification: Đã chạy server và test trực tiếp các endpoint GET/POST/PUT/DELETE, xác nhận mã lỗi 401 Unauthorized khi chưa đăng nhập và 400 Bad Request khi dữ liệu không hợp lệ.

## Quyết định và ghi chú

Các feature khác (CHG-009, CHG-010, CHG-011) sẽ gọi trực tiếp các helper từ `@/lib/auth/ownership` và `@/lib/auth/actions`, không tự tạo session helper hoặc ownership check riêng.
