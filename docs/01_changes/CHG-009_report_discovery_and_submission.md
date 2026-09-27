# CHG-009: xây chức năng đăng, tìm và xem chi tiết report

- ID: `CHG-009`
- Trạng thái: `waiting_for_integration`
- Ngày tạo: `2026-09-22`
- Sprint/Milestone: `Sprint 1 / MVP foundation`
- Người phụ trách: `Chiến`
- Reviewer: `Thế Anh`
- Notion Task: `xây chức năng đăng, tìm và xem chi tiết report`
- Dependency: `CHG-006`, `CHG-007`, `CHG-008`
- Branch: `feat/report-discovery-and-submission`
- PR: `chưa có`
- Commit sau merge: `chưa có`
- File/module dự kiến sửa: `src/app/**` report routes/components, report validation adapter, UI states; `tests/e2e/**` report specs
- Phạm vi ownership: `report UI, report routes và report submission experience`
- Thời gian Sprint: `2026-09-23` đến `2026-09-29`

## Kết quả người dùng

Sinh viên có thể xem danh sách báo mất/báo tìm thấy, tìm kiếm hoặc lọc, mở chi tiết một món đồ và gửi report mới với thông tin hợp lệ trên desktop hoặc mobile.

## Phạm vi

### Bao gồm

- Feed public cho Lost và Found Report.
- Tìm kiếm/lọc theo phạm vi MVP đã chốt.
- Trang chi tiết report và trạng thái an toàn cho người xem.
- Form tạo Lost hoặc Found Report.
- Validation rõ ràng cho field bắt buộc.
- Category và location theo danh sách được nhóm phê duyệt.
- Loading, empty, error và responsive states.

### Không bao gồm

- Tự quyết định quyền ở frontend.
- Sửa database schema hoặc migration.
- Tự triển khai matching rule.
- Claim state transition.

## File/tài liệu liên quan

- `docs/02_reports/01_overview.md`
- `docs/02_reports/02_requirements_design.md`
- `docs/02_reports/05_testing_deployment.md`

## Acceptance criteria

- [x] Người dùng chưa đăng nhập xem được feed và detail public. _(E2E trên database Supabase dev)_
- [ ] Người dùng đăng nhập tạo được Lost và Found Report hợp lệ. _(action + form đã có; chờ CHG-008 để có phiên đăng nhập thật)_
- [ ] Field thiếu hoặc sai không được lưu và có lỗi dễ hiểu. _(validation server đã unit test; hiển thị lỗi trên form chưa kiểm tra được vì cần đăng nhập)_
- [x] Feed, form và detail dùng server contract, không tự bỏ qua authorization. _(query chỉ select cột công khai; `userId` lấy từ session phía server)_
- [x] UI không tràn trên desktop/mobile và có loading/empty/error state. _(E2E mobile 375px không tràn; ảnh chụp desktop/mobile)_

## Kiểm tra và bằng chứng

- Kết quả: `phần độc lập đã kiểm tra trên database Supabase dev (2026-09-27); chờ CHG-008 cho luồng tạo tin khi đăng nhập`
- `npm run typecheck`: passed.
- `npm test`: 26 tests passed (16 test cho `src/app/reports/report-validation.test.ts`, `report-display.test.ts`).
- `npm run build`: passed.
- `npx playwright test` (chạy với production build `next start` ở cổng 3000): 10/10 passed — tìm theo từ khóa, chip loại tin + lọc khu vực, empty state, chi tiết không lộ email chủ tin, not-found cho id sai, khách được yêu cầu đăng nhập, không tràn ngang ở 375px.
- Kiểm tra thủ công bằng dữ liệu seed: feed hiện đủ 7 tin; lọc `type=found&location=H6` trả đúng 1 tin; `q=Casio` trả đúng 1 tin.
- Evidence UI: ảnh chụp desktop/mobile của feed, detail và trang đăng tin (khách) đã được owner xem trực tiếp; chưa lưu vào `docs/02_reports/assets/testing/`.

## Triển khai

| Màn hình | Route | File chính |
|---|---|---|
| SCR-01 Home / Feed | `/` (`?q=&type=&category=&location=`) | `src/app/page.tsx`, `src/app/reports/report-feed.tsx`, `report-filters.tsx` |
| SCR-02 Create Report | `/reports/new` (`?type=lost\|found` chọn sẵn loại tin) | `src/app/reports/new/page.tsx`, `create-report-form.tsx`, `actions.ts` |
| SCR-03 Report Detail | `/reports/[id]` | `src/app/reports/[id]/page.tsx`, `loading.tsx`, `not-found.tsx` |

- Validation adapter: `src/app/reports/report-validation.ts` (Zod, dùng enum export từ `src/db/schema.ts`); giới hạn field dùng chung client/server ở `report-fields.ts`.
- Truy vấn công khai: `src/app/reports/report-queries.ts` chỉ select cột công khai (không `userId`, email hay dữ liệu claim).
- Trạng thái UI: skeleton cho feed (`Suspense`) và detail (`loading.tsx`); empty state; `src/app/error.tsx` có nút thử lại; `not-found.tsx` cho id sai hoặc không tồn tại.
- Giao diện theo mockup `docs/02_reports/assets/ui/index.html`: font Be Vietnam Pro (`next/font/google`, subset `vietnamese`), token màu trong `src/app/globals.css`, header/footer ở `src/app/layout.tsx` và `site-header.tsx`.

## Dependency và tích hợp

- `Đang chờ`: CHG-008 (auth boundary, login/logout UI, đồng bộ Supabase Auth user → bảng `users`).
- `Đã hoàn thành`: feed, tìm/lọc, detail, form tạo tin, validation server, UI states, unit test, E2E cho khách.
- `Chưa thể tích hợp`:
  - `src/app/reports/new/current-user.ts` đang gọi trực tiếp `supabase.auth.getUser()` làm contract tạm, chỉ dùng trong route tạo tin.
  - Trang `/reports/new` chưa có link tới trang đăng nhập vì route login chưa có trên `main`.
  - Insert report cần user tồn tại trong bảng `users`; nếu CHG-008 chưa đồng bộ, action trả lỗi rõ (FK `23503`) thay vì tự tạo profile.
  - E2E tạo tin khi đã đăng nhập chưa viết được.
- `Điều kiện tiếp tục`: CHG-008 merge helper session/ownership và flow login; thay `current-user.ts` bằng helper đó, thêm link đăng nhập, chạy E2E tạo Lost/Found Report.
- Ghi nhận khi xem branch `origin/Quan` (chỉ đọc, 2026-09-27): branch không có merge base với `main`, thêm cột `users.role` vào `schema.ts` nhưng không có migration, và có file trong vùng report (`src/app/api/reports/**`, `src/components/report-actions.tsx`). Cần Huy/Khang/Quân thống nhất trước khi tích hợp với CHG-009.

## Quyết định và ghi chú

Phạm vi report UI cần thống nhất insertion point với CHG-011 cho claim và My Reports; không sửa cùng vùng component nếu chưa trao đổi.

- Trang chủ `/` là SCR-01 Feed (thay app shell tĩnh của CHG-006); `tests/e2e/app-shell.spec.ts` được cập nhật tương ứng.
- Giao diện, nhãn và giới hạn field theo mockup đã có trong `docs/02_reports/assets/ui/index.html`: thuật ngữ "tin", nhãn loại tin/khu vực/trạng thái (`Thư viện H6`, `Nhà giữ xe`, `Đã trao trả`…), tên đồ vật 4–100 ký tự, mô tả công khai 10–600 ký tự, ngày xảy ra không ở tương lai theo giờ Việt Nam. `userId` luôn lấy từ session phía server.
- Đổi font sang Be Vietnam Pro vì font Georgia/Times New Roman cũ hiển thị sai chữ có hai dấu chồng (`ồ`, `ầ`, `ấ`…) và ký tự `&` (phát hiện qua ảnh chụp, owner xác nhận trên browser thật).
- Bộ lọc MVP: từ khóa (ILIKE trên title/description, escape `%`/`_`), chip loại tin, danh mục, khu vực; chip và ô chọn áp dụng ngay khi đổi, vẫn có nút "Tìm" khi chưa tải JS. Chưa làm bộ lọc thời gian/sắp xếp và nút "Sao chép liên kết" có trong mockup. Feed hiển thị tối đa 50 tin mới nhất, chưa phân trang.
- Chưa hỗ trợ upload ảnh (`imageUrl`) vì chưa có quyết định về storage; card và detail dùng icon theo danh mục như mockup.
- Không làm phần của CHG-010/CHG-011 trong mockup (menu "Gợi ý phù hợp", "Tin của tôi", nút "Yêu cầu nhận lại", điểm match). Điểm chèn: khối nền xanh (`action-box`) trong cột phải của `src/app/reports/[id]/page.tsx`, hiện chỉ hiển thị trạng thái tin.
- `src/middleware.ts` (thuộc CHG-008) bị Next.js 16 cảnh báo deprecated, cần đổi sang `proxy.ts`; không sửa trong CHG này.
- Môi trường sandbox hiện tại: với `next dev`, kết nối WebSocket HMR bị lỗi và trang not-found bị kẹt ở skeleton; bản production (`next build` + `next start`) hiển thị đúng. E2E được chạy trên production build. Chromium của Playwright phải cài thủ công vào `%LOCALAPPDATA%\ms-playwright` vì trình tải của Playwright bị timeout.
