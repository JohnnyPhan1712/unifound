# CHG-014: Rà soát và chỉnh sửa database theo thiết kế chương 01/02

- ID: `CHG-014`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-013`
- File/module dự kiến sửa/tạo: `src/db/schema.ts`, `drizzle/*` (thêm migration mới), `src/db/schema.test.ts` (viết mới), database Supabase (qua migration)
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Database trên Supabase khớp thiết kế ở `01_overview.md` và `02_requirements_design.md`: dữ liệu report/claim đúng cấu trúc, gắn với tài khoản Supabase Auth, thông tin xác minh của claim không bị lộ qua API công khai.

## Phạm vi

### Bao gồm

- **Bắt buộc dùng Supabase MCP và Supabase skills** (xem `AGENTS.md`); ghi đúng tên công cụ vào `AI Tool`.
- **Bước 1 — Audit hiện trạng (chỉ đọc):** bằng Supabase MCP, liệt kê bảng, cột, enum, constraint, index, RLS, trigger, danh sách migration đã áp dụng; chạy advisor security/performance. So với `drizzle/*` và `src/db/schema.ts` để phát hiện lệch (drift). Ghi bảng "Hiện trạng" vào CHG.
- **Bước 2 — Đối chiếu với docs:** lập bảng gap theo dữ liệu thật, mỗi dòng đánh dấu `đạt` / `cần sửa` / `cần quyết định`. Gợi ý các điểm cần kiểm (rút từ schema trong repo, **chưa xác nhận trên DB thật**):

| Điểm cần kiểm | Yêu cầu / hướng sửa nếu lệch |
|---|---|
| `users.id` gắn với `auth.users.id`; profile tự tạo khi đăng ký, role mặc định `USER`, không tự nâng quyền | FK tới `auth.users` + trigger tạo profile; bỏ default random của `id` |
| Cột không có trong docs: `image_url`, `avatar_url` | Bỏ; `full_name` → `display_name` để hiển thị người đăng, không lộ email |
| `report_status` có `pending`, `accepted` trùng với trạng thái claim | Rút gọn `open`, `returned`, `closed`; Accepted thuộc claim |
| Claim `proof` | Đổi thành `verification_info` (thông tin xác minh riêng tư) |
| Chống gửi trùng claim | Partial unique `(report_id, claimant_id)` khi `pending`/`accepted`; giữ `unique_accepted_claim_per_report` |
| CHECK và index | Không rỗng cho `title`, `description`, `verification_info`; index feed `(type, status, created_at desc)`, `category`, `location`; index FK của `claims` |
| RLS trên `users`, `reports`, `claims` | Bật RLS, không policy cho `anon`/`authenticated` (app truy cập qua server + Drizzle); đặc biệt bảo vệ `verification_info` |
| Enum type / 6 category / `claim_status` / cascade delete | Giữ nguyên |
| Location | Giữ danh sách hiện có (H1, H2, H3, H6, parking, canteen, sports, other) và ghi là giả định; đổi sau bằng migration |

- **Bước 3 — Chỉnh sửa qua Drizzle:** sửa `src/db/schema.ts` → `npm run db:generate` → migration mới (thêm tiếp, không xóa lịch sử) → `npm run db:migrate`. Phần Drizzle không sinh được (FK tới `auth.users`, trigger, RLS) đặt trong migration tùy chỉnh (`drizzle-kit generate --custom`).
- **Bước 4 — Xác minh:** đọc lại DB bằng Supabase MCP, chạy lại advisor, ghi evidence.
- Viết lại `src/db/schema.test.ts` (schema contract) cho schema mới.

### Các lưu ý

- Không sửa schema trực tiếp bằng MCP; mọi thay đổi đi qua Drizzle migration (đúng `AGENTS.md`).
- Nếu DB thật lệch nghiêm trọng so với repo (drift), hoặc cần xóa/ghi dữ liệu, **dừng và hỏi người dùng trước**; mặc định chỉ đọc qua MCP.
- Nếu đổi tên cột/enum làm mất dữ liệu đang có, ghi quyết định vào CHG trước khi migrate (dữ liệu seed cũ dùng để demo, có thể bỏ nếu người dùng xác nhận).
- Không làm seed (CHG-018), auth UI (CHG-016), Zod schema (CHG-017).
- Không sửa `docs/02_reports/`; nếu thiết kế cần cập nhật tài liệu, ghi đề xuất cho Team Lead.
- Không in hay ghi vào log các secret (`DATABASE_URL`, service role key).

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/01_overview.md`, `docs/02_reports/02_requirements_design.md` (mục 1, 5, 6, 7)
- `docs/02_reports/03_development.md` mục 1 (PostgreSQL, Drizzle, Supabase Auth), 4, 6
- `AGENTS.md` (mục Công cụ Supabase)
- `src/db/schema.ts`, `drizzle/*`

## Acceptance criteria

- [ ] CHG có bảng audit hiện trạng và bảng gap kèm evidence lấy từ Supabase MCP.
- [ ] Mỗi điểm `cần sửa` đã được sửa hoặc ghi lý do hoãn; điểm `cần quyết định` có xác nhận của người dùng.
- [ ] Lịch sử migration trong repo và trên Supabase nhất quán, không có drift.
- [ ] Đăng ký một tài khoản Auth thử tạo profile `USER`; không có đường tự đặt `ADMIN` từ client.
- [ ] DB từ chối claim trùng active của cùng (report, claimant) và từ chối hai claim `accepted` cùng report.
- [ ] Dùng anon key gọi REST không đọc được `claims` (RLS hoạt động).
- [ ] Advisor không còn cảnh báo security mức cao liên quan 3 bảng này.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-014-01 | Supabase MCP liệt kê bảng/cột/enum/index/RLS/trigger/migration | Có bảng hiện trạng đầy đủ | | Pending | |
| TC-014-02 | So khớp lịch sử migration repo và Supabase | Không drift | | Pending | |
| TC-014-03 | Vitest schema contract (enum, cột bắt buộc, không còn cột thừa) | Pass | | Pending | |
| TC-014-04 | Tạo user Auth thử | Profile `USER` được tạo tự động | | Pending | |
| TC-014-05 | Thử insert claim trùng active / hai claim accepted (DB dev, hỏi người dùng trước) | Bị từ chối | | Pending | |
| TC-014-06 | Gọi REST bằng anon key vào `claims` | Không có dữ liệu | | Pending | |
| TC-014-07 | Advisor security/performance sau migrate | Không cảnh báo mức cao | | Pending | |

## Hướng dẫn tự chạy

```
# cần .env.local có DATABASE_URL của project Supabase (không commit)
npm run db:generate
npm run db:migrate
npm test -- schema
npm run typecheck
npm run build
```
