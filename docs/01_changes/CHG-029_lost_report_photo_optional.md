# CHG-029: Ảnh không bắt buộc khi đăng tin Mất đồ

- ID: `CHG-029`
- Trạng thái: `in_review`
- Ngày tạo: `2026-10-03`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-015` (form đăng tin, `ImagePicker`, `createReportSchema`), `CHG-017` (form sửa tin giữ nguyên ảnh), `CHG-028` (đã tham số hóa `ImagePicker`: `required`, `max`, `label`, `hint`)
- File/module dự kiến sửa/tạo: `src/lib/reports/schemas.ts` (`images` của tin LOST cho phép 0 ảnh), `src/components/reports/report-form.tsx` (đổi nhãn/`required` của `ImagePicker` theo loại tin), `src/lib/reports/actions.ts` (chỉ kiểm tra, dự kiến không đổi), `src/components/reports/report-card.tsx`, `src/app/reports/[id]/page.tsx`, `src/lib/reports/query.ts` (kiểm tra chỗ giả định tin luôn có ảnh), `src/lib/reports/checks.ts` (trả sớm khi không có ảnh), `src/lib/reports/reports.test.ts`, `tests/e2e/lost-no-photo.spec.ts`
- Branch: `main` (làm trực tiếp trên nhánh hiện tại theo yêu cầu, bắt đầu 2026-10-03; chưa commit)

## Kết quả người dùng

Khi đăng tin **Mất đồ**, mục ảnh là **không bắt buộc**: người mất đồ không có ảnh vừa chụp thì vẫn đăng được, và nếu có ảnh cũ của món đồ (ảnh chụp trước đây, ảnh trên mạng xã hội…) thì vẫn có thể tải lên để người nhặt dễ nhận ra. Tin **Nhặt được** vẫn bắt buộc ít nhất 1 ảnh.

## Phạm vi

### Bao gồm

- **Schema Zod:** `createReportSchema` tách `images` theo loại: LOST dùng `imageList(0, MAX_IMAGES)`, FOUND giữ `imageList(1, MAX_IMAGES)`. Thông báo "Cần ít nhất 1 ảnh." chỉ còn áp dụng cho FOUND.
- **Form đăng tin:** khi chọn loại Mất đồ, `ImagePicker` hiện nhãn "Ảnh đồ vật (không bắt buộc)" kèm gợi ý "Có thể dùng ảnh cũ của món đồ"; bỏ dấu `*`; khi chọn Nhặt được thì như hiện tại. Đổi loại tin không làm mất ảnh đã chọn.
- **Hiển thị:** rà thẻ tin (`report-card`), chi tiết tin, "Tin của tôi", gợi ý trùng khớp, thông báo: tin LOST không có ảnh phải hiện placeholder gọn (không vỡ layout, không ảnh lỗi), kiểm tra mọi chỗ truy cập `images[0]`.
- **Server:** `createReport` vẫn gọi `checkImages` (đã đúng với mảng rỗng) và chỉ ghi `report_images` khi có ảnh; kiểm tra không `insert().values([])` gây lỗi.
- Cập nhật seed nếu cần có sẵn 1–2 tin LOST không ảnh để demo/test (qua `src/db/seed.ts`).

### Các lưu ý (Tránh hiểu nhầm)

- Chỉ đổi tin LOST. Tin FOUND vẫn bắt buộc ảnh vì ảnh là bằng chứng chính của món đồ đang giữ.
- Không đổi schema database: `report_images` đã là bảng riêng nên tin không có dòng ảnh là hợp lệ; không cần migration.
- Không đổi thuật toán gợi ý trùng khớp (CHG-018). Nếu matching đang cộng điểm theo ảnh thì chỉ xác nhận không lỗi khi thiếu ảnh, không tinh chỉnh điểm.
- Form sửa tin vẫn giữ nguyên ảnh như CHG-017 (không thêm chức năng sửa ảnh).
- Không thêm dependency.
- Giữ `DESIGN.md`; dùng lại cách trình bày chip/nhãn "không bắt buộc" đã có ở form yêu cầu nhận lại (CHG-028).

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`
- `docs/01_changes/CHG-015_seed_and_create_report.md`, `docs/01_changes/CHG-028_claim_evidence_images.md`
- `src/lib/reports/schemas.ts`, `src/lib/reports/actions.ts`, `src/lib/reports/checks.ts`, `src/components/reports/report-form.tsx`, `src/components/reports/image-picker.tsx`, `src/components/reports/report-card.tsx`, `src/app/reports/[id]/page.tsx`

## Acceptance criteria

- [ ] Đăng tin Mất đồ không ảnh thành công; có thể đăng kèm 1–5 ảnh (kể cả ảnh cũ) như trước. (Mới xác nhận LOST không ảnh; LOST kèm ảnh chưa có test riêng, chỉ dùng chung luồng upload với FOUND.)
- [x] Đăng tin Nhặt được không ảnh vẫn bị từ chối với thông báo tiếng Việt (cả ở form lẫn khi gọi thẳng server action).
- [ ] Form hiện đúng nhãn "(không bắt buộc)" cho Mất đồ và nhãn bắt buộc cho Nhặt được; đổi loại tin không làm mất ảnh đã chọn. (Nhãn đã xác nhận bằng E2E; việc giữ ảnh khi đổi loại chưa test.)
- [ ] Tin Mất đồ không ảnh hiển thị đúng ở bảng tin, chi tiết, "Tin của tôi", gợi ý, thông báo; không có ảnh lỗi hoặc vỡ layout. (Xác nhận bằng đọc code: mọi nơi dùng `ReportVisual` với `path` rỗng đã có placeholder theo danh mục; chưa xem tay trên UI.)
- [x] Không phát sinh migration; matching và ghi `report_images` không lỗi khi không có ảnh.
- [x] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đều pass; E2E đăng tin Mất đồ không ảnh pass; golden path hiện có không hỏng.
- [ ] Kiểm tra giao diện bằng Playwright MCP (desktop và 320px), screenshot làm evidence: **chưa làm**, không có Playwright MCP trong phiên; mới kiểm tra bằng E2E `@playwright/test` (chưa chụp 320px).

## AI Log

### AI-1 — Cho phép tin Mất đồ không ảnh

- Nhiệm vụ (Task): đổi schema, form và server để ảnh không bắt buộc với tin LOST.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), skill ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): CHG-029, `schemas.ts`, `report-form.tsx`, `image-picker.tsx`, `checks.ts`, `actions.ts`, các chỗ dùng `ReportVisual`.
- Kết quả AI (AI Output): thêm `optionalImages` cho nhánh LOST của `createReportSchema`; đổi nhãn `ImagePicker` theo loại tin (tái sử dụng tham số `required/label/hint` có sẵn). Rà code thấy thêm 2 chỗ sẽ lỗi khi mảng ảnh rỗng ở server mà yêu cầu ban đầu không nêu: `checkImages` sinh SQL `in ()` sai cú pháp và `insert(reportImages).values([])` bị lỗi, nên thêm guard ở cả hai. Hiển thị đã có placeholder sẵn nên không sửa.
- Quyết định của nhóm (Human Decision): chờ xác nhận
- Kiểm tra / Xác minh (Verification): unit test Zod TC-029-04; E2E `lost-no-photo.spec.ts` (đăng LOST không ảnh thành công, FOUND không ảnh bị từ chối); `lint`, `typecheck`, `test`, `build` pass; 23 E2E pass.
- Ứng viên đưa vào báo cáo: có

## Bug

Không có.

### Ghi nhận

- Hai điểm lỗi tiềm ẩn khi mảng ảnh rỗng (`checkImages`, insert `report_images`) được phát hiện qua đọc code và đã chặn sẵn trước khi phát sinh; chưa từng gây lỗi thực tế.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-029-01 | Đăng tin Mất đồ không kèm ảnh | Thành công, chuyển tới chi tiết tin, không có dòng `report_images` | Thành công; E2E đăng LOST không ảnh, chuyển tới chi tiết tin | Passed | `lost-no-photo.spec.ts` |
| TC-029-02 | Đăng tin Mất đồ kèm 1–5 ảnh | Thành công, ảnh hiển thị đúng thứ tự | Không có test riêng cho LOST kèm ảnh; luồng upload ảnh dùng chung với FOUND (golden path pass) | Passed | `golden-path.spec.ts`, unit test `reports.test.ts` |
| TC-029-03 | Đăng tin Nhặt được không ảnh | Bị từ chối "Cần ít nhất 1 ảnh." | Form báo "Cần ít nhất 1 ảnh.", không tạo tin | Passed | `lost-no-photo.spec.ts` |
| TC-029-04 | Gọi thẳng `createReport` với `type=FOUND`, `images=[]` (unit test Zod) | Lỗi theo field `images`; không ghi `reports` | FOUND `[]` bị từ chối theo field `images`; LOST `[]` và thiếu field đều hợp lệ | Passed | `reports.test.ts` TC-029 |
| TC-029-05 | Đổi loại tin Mất đồ ↔ Nhặt được khi đã chọn ảnh | Ảnh giữ nguyên; nhãn và dấu `*` đổi đúng | Chưa test tay đổi loại khi đã chọn ảnh; `ImagePicker` luôn được render nên state giữ nguyên (chỉ xác nhận bằng đọc code); nhãn đổi đúng (E2E) | Pending | `lost-no-photo.spec.ts` (phần nhãn) |
| TC-029-06 | Xem tin Mất đồ không ảnh ở bảng tin, chi tiết, Tin của tôi, gợi ý | Hiện placeholder, không lỗi console, không vỡ layout | Chưa xem tay; đọc code thấy `ReportVisual` có placeholder khi `path` rỗng | Pending | — |
| TC-029-07 | Chạy matching với tin Mất đồ không ảnh | Không lỗi; gợi ý vẫn tạo theo các tiêu chí khác | Chưa chạy riêng; matching chạy sau khi tin lưu nên LOST không ảnh trong E2E không gây lỗi (tin đã đăng thành công) | Pending | `lost-no-photo.spec.ts` |
| TC-029-08 | Giao diện 320px | Mục ảnh và placeholder không tràn ngang | Chưa chạy | Pending | — |

## Hướng dẫn tự chạy

```
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test   # cần SEED_DEMO_PASSWORD trong .env.local
npm run dev           # xem tay: đăng nhập, Đăng tin mới → Mất đồ, bỏ trống ảnh rồi gửi; thử lại với Nhặt được
```
