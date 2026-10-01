# CHG-015: Seed dữ liệu và đăng tin Mất đồ / Nhặt được

- ID: `CHG-015`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-014`
- File/module dự kiến sửa/tạo: `src/db/seed.ts`, `src/db/schema.ts` (rà `reports`, `report_images`), `src/lib/reports/*` (Zod schema, create), `src/app/reports/new`, `src/components/reports/*`, cấu hình Supabase Storage bucket ảnh
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `chưa có` (ghi hash commit trên `main` sau khi push)

## Kết quả người dùng

Có dữ liệu mẫu (trường, danh mục, địa điểm, vài tin). Sinh viên đăng nhập bấm "Đăng tin", chọn Mất đồ hoặc Nhặt được, điền form, tải 1–5 ảnh và lưu thành công; tin tự có hạn 60 ngày.

## Phạm vi

### Bao gồm

- Seed (`npm run db:seed`): `schools`, `categories`, `locations`, một số `reports` mẫu, không PII/secret; chạy lặp lại không lỗi.
- S03/FR03: form đăng tin (loại, tiêu đề, danh mục, mô tả, thời điểm, địa điểm, 1–5 ảnh).
- FR04: tin FOUND thêm `keeping_place`, `verify_question`, `verify_answer` (đáp án không trả về client công khai).
- Zod server-side: bắt buộc field, số ảnh 1–5, giới hạn dung lượng/định dạng ảnh, category/location tồn tại.
- Upload ảnh lên Supabase Storage, lưu đường dẫn vào `report_images`.
- `expires_at = created_at + 60 ngày`, `status = OPEN`.
- Trạng thái loading/lỗi/thành công của form; layout mobile.

### Các lưu ý

- Chưa làm feed/chi tiết (CHG-016) nên chỉ cần chuyển hướng về trang xác nhận đơn giản hoặc trang chi tiết tạm.
- Chưa chạy matching (CHG-018).
- Chỉ dùng MCP Supabase để đọc/kiểm tra; ghi/xóa dữ liệu chỉ khi CHG yêu cầu và hỏi người dùng trước.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR03, FR04, S03, mục 9 ERD)
- `docs/02_reports/03_development.md` (mục 6 Database workflow)
- Skill Supabase (Storage)

## Acceptance criteria

- [ ] `npm run db:seed` nạp dữ liệu mẫu, chạy lại không tạo trùng/lỗi.
- [ ] Đăng tin LOST hợp lệ lưu đúng `type`, `status=OPEN`, `expires_at` +60 ngày, ảnh lưu vào Storage và `report_images`.
- [ ] Đăng tin FOUND lưu thêm nơi giữ, câu hỏi, đáp án; đáp án không lộ ra client công khai.
- [ ] Thiếu field bắt buộc hoặc ảnh ngoài 1–5 → không lưu, lỗi hiện tại field.
- [ ] Khách không vào được `/reports/new`.
- [ ] Ảnh sai định dạng/quá dung lượng bị từ chối.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-015-01 | Vitest: Zod schema tạo tin (thiếu title, type sai, 0 ảnh, 6 ảnh, FOUND thiếu câu hỏi) | Đúng lỗi từng trường hợp | | Pending | |
| TC-015-02 | Vitest: tính `expires_at` | Đúng +60 ngày | | Pending | |
| TC-015-03 | Chạy `db:seed` hai lần | Không lỗi, không trùng | | Pending | |
| TC-015-04 | Đăng tin LOST hợp lệ (UI) | Lưu thành công | | Pending | screenshot |
| TC-015-05 | Đăng tin FOUND hợp lệ (UI) | Lưu kèm nơi giữ/câu hỏi/đáp án | | Pending | |
| TC-015-06 | Submit thiếu field / ảnh 0 và 6 | Báo lỗi tại field, không lưu | | Pending | |
| TC-015-07 | Khách mở `/reports/new` | Chuyển về đăng nhập | | Pending | |
| TC-015-08 | Kiểm tra DB bằng MCP (chỉ đọc) | Có `reports`, `report_images` đúng | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run typecheck
npm test
npm run build
npm run dev
```

1. Đăng nhập, mở `/reports/new`.
2. Đăng một tin Mất đồ và một tin Nhặt được (kèm ảnh); thử submit thiếu field, thử 0 và 6 ảnh.
3. Kiểm tra bản ghi trong Supabase (chỉ xem).
