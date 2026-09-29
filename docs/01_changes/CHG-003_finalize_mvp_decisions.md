# CHG-003: Chốt quyết định MVP

- ID: `CHG-003`
- Trạng thái: `done`
- Ngày tạo: `2026-09-15`
- Người phụ trách: `Phan Ngọc Đức Huy`
- Branch/PR/Commit: `chưa có`

## Lý do và mục tiêu

Thay các câu hỏi mở của Product Brief bằng quyết định nghiệp vụ và kỹ thuật đã được chốt, giữ nguyên mapping DEC-001 đến DEC-005 và loại bỏ các mô tả `TBD` mâu thuẫn.

## Phạm vi

### Bao gồm

- Quyền truy cập, authentication, report, claim và quyền riêng tư.
- Matching deterministic, stack, hosting, testing và dữ liệu demo.
- Đồng bộ overview, requirements, development và design guide liên quan.

### Không bao gồm

- Triển khai source, schema, migration, test hoặc deployment.
- Tự quyết định danh sách location đầy đủ, thuật toán keyword hoặc cơ chế xóa/đóng chi tiết.

## File/tài liệu liên quan

- `docs/02_reports/01_overview.md`.
- `docs/02_reports/02_requirements_design.md`.
- `docs/02_reports/03_development.md`.
- `docs/00_guides/03_design/architecture.md`.
- `docs/00_guides/03_design/system-overview.md`.

## Acceptance criteria

- [x] Giữ nguyên mapping DEC-001 đến DEC-005.
- [x] Ghi đủ quyết định được cung cấp và không mô tả chúng là `TBD`.
- [x] Phân biệt rõ `Accepted` với `Returned` và giới hạn một claim `Accepted` trên mỗi Found Report.
- [x] Không mô tả specification đã chốt như bằng chứng implementation.
- [x] Ghi nhận chi tiết còn thiếu thay vì tự mở rộng scope.

## Kiểm tra và bằng chứng

- [x] Rà soát tham chiếu DEC và các mô tả `TBD` liên quan trong tài liệu.
- [x] Kiểm tra liên kết Markdown nội bộ của các file đã sửa.
- Kết quả: `đạt`.

## Quyết định và ghi chú

- `02_requirements_design.md` là nguồn chi tiết cho DEC-001 đến DEC-005; overview chỉ tóm tắt và liên kết để tránh lặp.
- Asset Use Case hiện vẫn là draft và cần một công việc đồng bộ diagram riêng.
