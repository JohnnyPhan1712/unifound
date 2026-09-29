# CHG-007: tạo schema database và migration

- ID: `CHG-007`
- Trạng thái: `done`
- Ngày tạo: `2026-09-22`
- Người phụ trách: `Khang`
- Dependency: `CHG-006`
- Branch: `feat/database-schema`
- Commit sau merge: `TBD`
- File/module dự kiến sửa: `src/db/**`, `drizzle/**`, database scripts, development report evidence
- Phạm vi ownership: `database schema, client, migrations và seed`

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

- [x] Migration áp dụng được trên database phát triển (đã chạy `npm run db:migrate` thành công 100% trên Supabase `bbbufhoruqmrgivrlqot`).
- [x] Required fields, report type và status được biểu diễn rõ.
- [x] Quan hệ owner, claimant và found report hợp lệ (foreign keys onDelete cascade, partial unique index `unique_accepted_claim_per_report`).
- [x] Seed chạy được trên database và không chứa dữ liệu cá nhân thật (đã chạy `npm run db:seed` thành công trên Supabase: tạo 3 users, 7 reports, 2 claims an toàn).
- [x] Các CHG khác có thể dùng database contract mà không sửa trực tiếp migration của CHG này (export đầy đủ types và enums từ `@/db`).

## Kiểm tra và bằng chứng

- Kết quả: `đã kiểm tra thành công trên database Supabase phát triển thực tế; 5/5 tiêu chí đạt 100%`
- Migration/seed evidence:
  - `npm run db:generate`: sinh thành công migration `drizzle/0000_massive_sphinx.sql` chứa 5 enums, 3 bảng (`users`, `reports`, `claims`), 3 foreign keys và 1 partial unique index.
  - `npm run db:migrate`: áp dụng migration thành công 100% trên PostgreSQL hosted Supabase (`aws-0-ap-southeast-2.pooler.supabase.com`).
  - `npm run db:seed`: nạp thành công 3 demo users, 7 reports Lost/Found và 2 claims mẫu an toàn vào database Supabase thực tế.
  - `npm test`: 10 tests passed (1 app test + 9 database schema contract tests).
  - `npm run typecheck`: passed với 0 lỗi.
  - `npm run build`: Next.js 16 build thành công.

## Quyết định và ghi chú

Chỉ Khang sở hữu `src/db/**` và `drizzle/**` trong Sprint này. Thay đổi schema mới phải được trao đổi qua CHG hoặc PR riêng.

### Quyết định triển khai CHG-007

- Cài đặt `postgres` (`postgres.js`) làm PostgreSQL driver chính thức kết nối Supabase, cấu hình `prepare: false` tương thích với Supabase transaction pooler.
- Thiết lập partial unique index trên PostgreSQL: `CREATE UNIQUE INDEX unique_accepted_claim_per_report ON claims (report_id) WHERE status = 'accepted'` để thực thi ràng buộc DEC-002 ngay tại tầng database.
- Export các hằng số mảng `REPORT_TYPES`, `REPORT_CATEGORIES`, `REPORT_LOCATIONS`, `REPORT_STATUSES`, `CLAIM_STATUSES` từ `src/db/schema.ts` để các module UI và Zod validation (CHG-008, CHG-009) tái sử dụng trực tiếp.
- `db` client sử dụng Proxy an toàn khi `DATABASE_URL` chưa cấu hình, cho phép build tĩnh không bị crash.
