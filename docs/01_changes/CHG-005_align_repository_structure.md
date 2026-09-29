# CHG-005: Đồng bộ cấu trúc repository với Technology Stack

- ID: `CHG-005`
- Trạng thái: `done`
- Ngày tạo: `2026-09-16`
- Người phụ trách: `Phan Ngọc Đức Huy`
- Branch/PR/Commit: `chưa có`

## Lý do và mục tiêu

Cấu trúc `frontend/`, `backend/`, `database/` được tạo trước khi chốt stack và không còn phù hợp với DEC-004 dùng Next.js cho UI cùng server/backend trong một project. Mục tiêu là chuyển sang layout root tối thiểu cho Next.js, Drizzle và Playwright.

## Phạm vi

### Bao gồm

- Xóa ba thư mục cũ sau khi xác nhận chúng rỗng.
- Chuẩn bị vị trí `src/app/`, `src/db/`, `drizzle/`, `tests/e2e/` và `public/`.
- Đồng bộ convention, development report và README.

### Không bao gồm

- Khởi tạo Next.js hoặc tạo source/config/package giữ chỗ.
- Chọn Node.js version, package manager, PostgreSQL driver hoặc lệnh chạy.
- Tạo trước `components`, `lib` hay feature folder khi chưa có code.

## File/tài liệu liên quan

- `docs/00_guides/01_conventions/folder-structure.md`.
- `docs/02_reports/03_development.md`.
- `README.md`.
- `.gitignore`.
- `docs/01_changes/README.md`.

## Acceptance criteria

- [x] Không còn cấu trúc tách `frontend/`, `backend/`, `database/`.
- [x] Layout mới phản ánh một Next.js application ở root và một nguồn Migration Drizzle.
- [x] Phân biệt vị trí Vitest test nhỏ với Playwright E2E test.
- [x] Không ghi package/config/source là đã tồn tại.
- [x] Bỏ qua dependency, build output, test output và environment file của stack đã chốt.
- [x] Không thay đổi mapping hoặc ý nghĩa DEC-004.

## Kiểm tra và bằng chứng

- [x] Xác nhận `frontend/`, `backend/`, `database/` rỗng trước khi xóa.
- [x] Kiểm tra cây thư mục sau thay đổi.
- [x] Kiểm tra liên kết Markdown nội bộ của các file đã sửa.
- Kết quả: `đạt`.

## Quyết định và ghi chú

- Không dùng monorepo hoặc tách service cho MVP.
- Không tạo file `.gitkeep`; source tree sẽ được version hóa khi bước khởi tạo ứng dụng tạo file thật.
