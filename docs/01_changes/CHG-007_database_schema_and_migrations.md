# CHG-007: tạo schema database và migration

- ID: `CHG-007`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-22`
- Sprint/Milestone: `Sprint 1 / MVP foundation`
- Người phụ trách: `Khang`
- Reviewer: `Quân`
- Notion Task: `tạo schema database và migration`
- Dependency: `CHG-006`
- Branch: `feat/database-schema`
- PR: `chưa có`
- Commit sau merge: `chưa có`
- File/module dự kiến sửa: `src/db/**`, `drizzle/**`, database scripts, development report evidence
- Phạm vi ownership: `database schema, client, migrations và seed`
- Thời gian Sprint: `2026-09-23` đến `2026-09-29`

## Kết quả người dùng

Người dùng có thể tin rằng báo mất, báo tìm thấy và yêu cầu nhận đồ được lưu trong dữ liệu chung của ứng dụng, thay vì chỉ tồn tại trong một trình duyệt hoặc một máy tính.

## Phạm vi

### Bao gồm

- Định nghĩa bảng User, Report và Claim theo các quyết định MVP.
- Định nghĩa type, status, quan hệ ownership và các constraint cần thiết.
- Tạo database client và Drizzle configuration.
- Tạo migration có phiên bản.
- Tạo seed data an toàn để phát triển và kiểm thử.

### Không bao gồm

- Login/logout UI.
- Report feed hoặc report form.
- Matching algorithm.
- Claim UI và logic chuyển trạng thái ngoài constraint dữ liệu.
- Dữ liệu cá nhân hoặc thông tin xác minh thật.

## File/tài liệu liên quan

- `docs/02_reports/02_requirements_design.md`
- `docs/02_reports/03_development.md`
- `docs/00_guides/03_design/architecture.md`

## Acceptance criteria

- [ ] Migration áp dụng được trên database phát triển.
- [ ] Required fields, report type và status được biểu diễn rõ.
- [ ] Quan hệ owner, claimant và found report hợp lệ.
- [ ] Seed chạy được và không chứa dữ liệu cá nhân thật.
- [ ] Các CHG khác có thể dùng database contract mà không sửa trực tiếp migration của CHG này.

## Kiểm tra và bằng chứng

- Kết quả: `chưa kiểm tra`
- Migration/seed evidence: `chưa có`

## Quyết định và ghi chú

Chỉ Khang sở hữu `src/db/**` và `drizzle/**` trong Sprint này. Thay đổi schema mới phải được trao đổi qua CHG hoặc PR riêng.
