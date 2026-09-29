# CHG-004: Hoàn thiện tài liệu Technology Stack

- ID: `CHG-004`
- Trạng thái: `done`
- Ngày tạo: `2026-09-15`
- Người phụ trách: `Phan Ngọc Đức Huy`
- Branch/PR/Commit: `chưa có`

## Lý do và mục tiêu

DEC-004 đã chốt danh sách công nghệ nhưng chưa giải thích đầy đủ vai trò, lý do lựa chọn, phương án thay thế và trạng thái sử dụng thực tế. Công việc này hoàn thiện phần đó mà không thay đổi mapping hoặc ý nghĩa của DEC-004.

## Phạm vi

### Bao gồm

- Giải thích ngắn gọn từng thành phần của stack và ranh giới trách nhiệm.
- Thêm sơ đồ Technology Stack và bảng so sánh nhanh.
- Chuẩn bị tài liệu runtime, package, environment, local development, database, testing và deployment.
- Phân biệt rõ quyết định đã chốt với implementation chưa tồn tại.

### Không bao gồm

- Cài package, tạo source/config, schema, Migration, test hoặc deployment.
- Tự chọn version, package manager, PostgreSQL driver, lệnh chạy hoặc URL demo.
- Thay đổi DEC-001 đến DEC-005.

## File/tài liệu liên quan

- `docs/02_reports/02_requirements_design.md`.
- `docs/02_reports/03_development.md`.
- `docs/01_changes/README.md`.

## Acceptance criteria

- [x] Mỗi công nghệ có vai trò, lý do chọn và phương án nếu không dùng.
- [x] Phân biệt Zod/database constraint, Drizzle/PostgreSQL, Supabase Auth/Authorization và Vitest/Playwright.
- [x] Giải thích PostgreSQL khác `localStorage` và mock data không đồng nghĩa với `localStorage`.
- [x] Có sơ đồ stack và bảng so sánh nhanh.
- [x] Development report phân biệt Installed/Planned và không bịa version, command, secret hoặc URL.
- [x] DEC-004 giữ nguyên mapping và stack đã chốt.

## Kiểm tra và bằng chứng

- [x] Đối chiếu DEC-004 với overview, requirements, architecture và development report.
- [x] Xác nhận workspace chưa có `package.json`, lockfile hoặc config implementation.
- [x] Kiểm tra liên kết Markdown nội bộ và các thành phần bắt buộc của tài liệu.
- Kết quả: `đạt`.

## Quyết định và ghi chú

- Không phát hiện mâu thuẫn về stack; thiếu sót hiện tại là phần giải thích và cách theo dõi implementation.
- Mermaid được dùng cho sơ đồ inline nhỏ, không tạo thêm asset khi chưa có nhu cầu tái sử dụng.
