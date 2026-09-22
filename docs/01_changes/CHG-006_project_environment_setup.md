# CHG-006: cài framework/package và cấu hình môi trường

- ID: `CHG-006`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-22`
- Sprint/Milestone: `Sprint 1 / MVP foundation`
- Người phụ trách: `Huy`
- Vai trò: `Team Lead / Integration Lead`
- Reviewer: `Khang`
- Notion Task: `cài framework/package và cấu hình môi trường`
- Dependency: `CHG-005`
- Branch: `chore/project-environment-setup`
- PR: `chưa có`
- Commit sau merge: `chưa có`
- File/module dự kiến sửa: `package.json`, lockfile, config root, `.env.example`, app shell, setup documentation
- Phạm vi ownership: `root manifests và tool configuration`
- Thời gian Sprint: `2026-09-23` đến `2026-09-29`

## Kết quả người dùng

Thành viên trong nhóm có thể cài dependencies, chạy UniFound ở local, chạy kiểm tra và build project bằng các lệnh thống nhất. Mỗi người biết các biến môi trường cần cấu hình mà không phải chia sẻ secret trong repository.

## Phạm vi

### Bao gồm

- Tạo `package.json` và lockfile phù hợp với package manager đã chọn.
- Cài và cấu hình Next.js, TypeScript, Tailwind CSS, Zod, Drizzle, Supabase client, Vitest và Playwright.
- Tạo scripts cho development, typecheck, test và build.
- Tạo `.env.example` theo các biến đã được phê duyệt.
- Xác nhận app shell hiện tại chạy được với cấu hình mới.
- Cập nhật hướng dẫn cài đặt và chạy local.

### Không bao gồm

- Thiết kế schema hoặc migration.
- Auth flow, report flow, matching và claim flow.
- Secret thật hoặc giá trị environment thật.

## File/tài liệu liên quan

- `docs/02_reports/02_requirements_design.md`
- `docs/02_reports/03_development.md`
- `docs/00_guides/01_conventions/folder-structure.md`

## Acceptance criteria

- [ ] Thành viên mới có thể cài dependencies từ repository sạch.
- [ ] Development server khởi động được.
- [ ] Có lệnh typecheck, test và build rõ ràng.
- [ ] `.env.example` không chứa secret và khớp tên biến được code sử dụng.
- [ ] Không thay đổi schema hoặc business rule của feature khác.

## Kiểm tra và bằng chứng

- Kết quả: `chưa kiểm tra`
- Lệnh kiểm tra: `chưa xác định trước khi package manager được chọn`

## Quyết định và ghi chú

Huy điều phối integration và tổng hợp evidence cuối Sprint nhưng không sở hữu implementation của các feature khác.
