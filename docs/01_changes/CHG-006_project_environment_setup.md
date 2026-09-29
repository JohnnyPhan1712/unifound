# CHG-006: cài framework/package và cấu hình môi trường

- ID: `CHG-006`
- Trạng thái: `done`
- Ngày tạo: `2026-09-22`
- Người phụ trách: `Huy`
- Vai trò: `Team Lead / Integration Lead`
- Dependency: `CHG-005`
- Branch: `chore/project-environment-setup`
- Commit sau merge: `dd3f456`
- File/module dự kiến sửa: `package.json`, lockfile, config root, `.env.example`, app shell, setup documentation
- Phạm vi ownership: `root manifests và tool configuration`

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

- [x] Thành viên mới có thể cài dependencies từ repository sạch.
- [x] Development server khởi động được.
- [x] Có lệnh typecheck, test và build rõ ràng.
- [x] `.env.example` không chứa secret và khớp tên biến được code sử dụng.
- [x] Không thay đổi schema hoặc business rule của feature khác.

## Kiểm tra và bằng chứng

- Kết quả: `đã hoàn thành; acceptance criteria đạt và PR #1 đã được merge vào main`
- Runtime: `Node v24.20.0`, `npm 11.19.0`, lockfile: `package-lock.json`
- Đã đạt: `npm install`, `npm run typecheck`, `npm test` (1 test), `npm run build`, `npm audit --omit=dev` (0 runtime vulnerabilities)
- Đã cấu hình: `npm run dev`, `npm run test:e2e`, `.env.example`, app shell tại `src/app/`
- Chưa đạt do môi trường: `npm run test:e2e` đã có Chromium nhưng browser launch trả `spawn UNKNOWN`; cần chạy lại trên môi trường Windows cho phép khởi chạy browser process.
- Giới hạn: chưa có schema, migration, database client, auth hoặc feature nghiệp vụ; các phần này thuộc CHG-007 trở đi.

## Quyết định và ghi chú

Huy điều phối integration và tổng hợp evidence cuối Sprint nhưng không sở hữu implementation của các feature khác.

### Quyết định triển khai CHG-006

- Dùng npm vì npm 11 đã có sẵn trên máy; không có pnpm hoặc yarn trong môi trường kiểm tra.
- Dùng Node 24.20.0 hiện có để kiểm tra local; package versions được khóa trong `package-lock.json`.
- Drizzle Kit chỉ được cấu hình ở root; schema, migration và database client không nằm trong CHG-006.
- Playwright chỉ có smoke test app shell, không kiểm tra full MVP flow.
