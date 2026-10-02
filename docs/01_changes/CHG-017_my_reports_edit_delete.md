# CHG-017: Tin của tôi, sửa/đóng/xóa tin

- ID: `CHG-017`
- Trạng thái: `done`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-016`
- File/module dự kiến sửa/tạo: `src/app/my`, `src/app/reports/[id]/edit`, `src/lib/reports/update.ts`, `src/lib/auth/permissions.ts`, `src/components/reports/*`
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

## Kết quả người dùng

Sinh viên vào "Tin của tôi" xem các tin đã đăng, sửa, đóng hoặc xóa tin của mình. Người khác (không phải chủ tin, không phải ADMIN) không thể sửa/xóa.

## Phạm vi

### Bao gồm

- S07 tab 1 "Tin đã đăng" (các tab yêu cầu để CHG-019): danh sách tin của tôi kèm trạng thái, hành động sửa/đóng/xóa.
- FR05: sửa tin (dùng lại Zod của CHG-015), đóng tin (`CLOSED`), xóa tin (kèm dọn ảnh Storage).
- Kiểm tra ownership phía server: chủ tin hoặc `ADMIN`; người khác nhận 403, dữ liệu không đổi.
- Không cho sửa/xóa khi tin đang `IN_PROGRESS` hoặc `RETURNED` nếu quy ước ghi rõ trong CHG.
- Nút Sửa/Xóa trên chi tiết tin chỉ hiện cho chủ tin/ADMIN (UI chỉ để tiện, server mới quyết định).

### Các lưu ý

- Hiển thị hết hạn 60 ngày: tin quá hạn hiện nhãn "Đã hết hạn" ở "Tin của tôi", không cần tác vụ nền.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR05, S07, acceptance criteria FR05/FR14)

## Acceptance criteria

- [ ] "Tin của tôi" liệt kê đúng tin của user đang đăng nhập.
- [ ] Chủ tin sửa, đóng, xóa được; thay đổi lưu đúng.
- [ ] `USER` khác gọi sửa/xóa → 403, dữ liệu không đổi.
- [ ] `ADMIN` sửa/xóa được tin của người khác.
- [ ] Tin đã xóa không còn trong feed và ảnh được dọn.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## Ghi chú triển khai

- Quy ước trạng thái (`src/lib/auth/permissions.ts`):
  - Sửa và đóng: chỉ khi `OPEN`.
  - Xóa: được khi `OPEN`, `CLOSED`, `HIDDEN`; không được khi `IN_PROGRESS` hoặc `RETURNED`, để giữ lịch sử yêu cầu nhận đồ và số liệu thống kê.
  - ADMIN theo cùng quy ước.
- Mọi server action (`src/lib/reports/update.ts`) tự tải tin rồi kiểm tra chủ tin/ADMIN và trạng thái. Sai quyền trả "Bạn không có quyền thực hiện thao tác này (403)." và không đổi dữ liệu.
- Trang `/reports/[id]/edit` của người khác hiện màn 403, và kiểm tra quyền xong mới đưa đáp án xác minh vào form.
- Sửa tin dùng lại Zod của CHG-015 (`updateReportSchema`, bỏ ảnh). Loại tin và ảnh giữ nguyên; muốn đổi ảnh thì xóa tin và đăng lại.
- Xóa tin: xóa bản ghi trước (cascade ảnh, yêu cầu, gợi ý, báo cáo), sau đó xóa file trên Storage bằng session người dùng. Policy cho chủ thư mục hoặc ADMIN (`public.is_admin()`).
- `/my` hiện tab "Tin đã đăng"; hai tab yêu cầu thêm ở CHG-019. Tin quá hạn hiện nhãn "Đã hết hạn".
- Thêm link "Tin của tôi" trên header khi đã đăng nhập.

## AI Log

### AI-1 — Phân quyền sửa/đóng/xóa phía server

- Nhiệm vụ (Task): Hàm phân quyền thuần + server action có kiểm tra ownership/trạng thái, nút thao tác trên "Tin của tôi" và chi tiết tin.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Supabase MCP (kiểm tra `report_images`/`storage.objects` bằng select), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): FR05, S07, acceptance criteria FR05/FR14, CHG-017.
- Kết quả AI (AI Output):
  - `canManageReport`, `statusAllows`.
  - Action `updateReport`/`closeReport`/`deleteReport`.
  - Component `ManageActions`, trang `/my`, `/reports/[id]/edit`.
- Quyết định của nhóm (Human Decision): Accepted (2026-10-02: chủ dự án ủy quyền AI khảo sát và xác nhận; đã đối chiếu `02_requirements_design.md`, code và test hiện có). Quy ước trạng thái (chỉ sửa/đóng tin `OPEN`; không xóa tin `IN_PROGRESS`/`RETURNED`) được giữ vì bảo toàn dữ liệu bàn giao.
- Kiểm tra / Xác minh (Verification):
  - Vitest TC-017-01/02.
  - Playwright với 3 tài khoản. Tài khoản B tự sửa giá trị `id` ẩn trong form của mình thành tin của A rồi gửi, để gọi action trực tiếp.
- Ứng viên đưa vào báo cáo: có

## Bug

Không có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-017-01 | Vitest: hàm phân quyền (owner, admin, user khác, chưa đăng nhập) | Cho/từ chối đúng | Chủ tin, ADMIN được; user khác, khách, tài khoản khóa (kể cả admin bị khóa) bị từ chối | Passed | `src/lib/auth/permissions.test.ts` |
| TC-017-02 | Vitest: điều kiện trạng thái được phép sửa/xóa | Đúng theo quy ước | Sửa/đóng chỉ `OPEN`; xóa chặn `IN_PROGRESS`/`RETURNED` | Passed | `src/lib/auth/permissions.test.ts` |
| TC-017-03 | Chủ tin sửa tiêu đề/mô tả | Lưu và hiển thị mới | Tiêu đề mới hiện trên chi tiết, có thông báo "Đã lưu thay đổi." | Passed | Playwright |
| TC-017-04 | Chủ tin đóng tin | `CLOSED`, biến khỏi feed | Nhãn "Đã đóng"; tìm "CHG017" trên feed chỉ còn tin chưa đóng | Passed | Playwright |
| TC-017-05 | User B sửa/xóa tin của A (gọi trực tiếp) | 403, dữ liệu không đổi | B mở URL sửa → màn "Không có quyền truy cập (403)"; B không thấy nút quản lý; B gửi form xóa/đóng với `id` tin của A → "Bạn không có quyền thực hiện thao tác này (403)."; tin của A vẫn `Đang mở` | Passed | Playwright, `017_forbidden_tamper.png` |
| TC-017-06 | ADMIN xóa tin của người khác | Thành công | Admin xóa tin của Demo A → chuyển `/?deleted=1`, chi tiết trả 404 | Passed | Playwright |
| TC-017-07 | Xóa tin có ảnh | Bản ghi và ảnh Storage đều mất | 2 tin test (1 do admin, 1 do chủ tin) không còn trong `reports`/`report_images`; không còn object Storage nào tạo sau thời điểm test CHG-015 | Passed | Supabase MCP `execute_sql` (select) |

## Hướng dẫn tự chạy

```
npm run typecheck
npm test
npm run build
npm run dev
```

1. Đăng nhập tài khoản A, tạo tin, vào "Tin của tôi" sửa/đóng/xóa.
2. Đăng nhập tài khoản B, thử sửa/xóa tin của A (mở URL sửa hoặc gọi action trực tiếp) → phải bị từ chối.

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- A = Demo A, B = Demo B. Admin xóa tin người khác: đăng nhập admin, mở chi tiết tin rồi bấm Xóa.
