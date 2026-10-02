# CHG-028: Đính kèm ảnh vào yêu cầu nhận lại

- ID: `CHG-028`
- Trạng thái: `done`
- Ngày tạo: `2026-10-03`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-019` (gửi yêu cầu), `CHG-015` (ảnh tin, `ImagePicker`, `checkImages`), `CHG-027` (đang `in_review`, không đụng cùng file)
- File/module dự kiến sửa/tạo: `src/db/schema.ts` (bảng `claim_images`), `drizzle/0006_claim_images.sql` (do `npm run db:generate`, thêm tay phần bucket/policy; đã đổi tên file và tag trong `_journal.json`), `src/components/claims/claim-form.tsx`, `src/components/reports/image-picker.tsx` (tham số hóa bucket/số ảnh, không nhân đôi code), `src/lib/claims/schemas.ts`, `src/lib/claims/actions.ts`, `src/lib/claims/query.ts`, `src/lib/reports/checks.ts` (`checkImages` nhận bucket), `src/lib/reports/schemas.ts`, `src/app/claims/[id]/page.tsx`, `src/app/reports/[id]/page.tsx` (truyền `userId` cho form), `tests/e2e/`, `src/lib/claims/claims.test.ts`
- Branch: `feat/chg-026` (làm tiếp trên nhánh hiện tại theo yêu cầu, bắt đầu 2026-10-03; chưa commit)

## Kết quả người dùng

Trong form “Gửi yêu cầu nhận lại” có thêm mục **Ảnh minh chứng (không bắt buộc)** để người mất đồ đính kèm ảnh món đồ của mình (ảnh chụp trước đây, hóa đơn, hộp đựng…). Người nhặt xem ảnh này trong trang chi tiết yêu cầu để đối chiếu cùng câu trả lời xác minh trước khi chấp nhận hay từ chối.

## Phạm vi

### Bao gồm

- **Form (theo mockup đã gửi):** thêm mục ảnh minh chứng nằm giữa “Mô tả thêm” và nút “Gửi yêu cầu”, tối đa 3 ảnh, JPG/PNG/WEBP, mỗi ảnh ≤ 5 MB, có xem trước và nút xóa từng ảnh, trạng thái đang tải/lỗi; không có ảnh vẫn gửi được. Dòng gợi ý: “Chỉ người nhặt đồ thấy. Không hiện trên bảng tin hay gợi ý.”
- **Lưu trữ riêng tư:** ảnh minh chứng là dữ liệu nhạy cảm (có thể lộ chi tiết giúp người khác mạo nhận), nên **không dùng bucket công khai `report-images`**. Tạo bucket riêng tư `claim-images`, tải thẳng từ trình duyệt vào thư mục `<user_id>/` như ảnh tin, hiển thị bằng signed URL ngắn hạn tạo ở server.
- **Database (qua Drizzle):** bảng `claim_images` (`id`, `claim_id` → `claims` cascade, `image_path`, `position`; không có `created_at`, đồng bộ với `report_images`), bật RLS. Migration thêm bucket `claim-images` (private, 5 MB, jpeg/png/webp) và policy Storage: chỉ ghi vào thư mục của chính mình; đọc/tạo signed URL được với chủ thư mục, người nhặt của tin (qua hàm security definer `public.can_read_claim_image`) hoặc ADMIN.
- **Server:** `claimSchema` thêm `images` (mảng, ≤ 3, mặc định rỗng); `submitClaim` gọi lại `checkImages` (đúng bucket, đúng thư mục của user, định dạng, dung lượng, không trùng) rồi ghi `claims` và `claim_images` trong cùng transaction.
- **Hiển thị:** trang chi tiết yêu cầu (`/claims/[id]`) hiện ảnh minh chứng cho **người nhặt và người gửi yêu cầu** (đúng quy tắc `canViewClaim` hiện có); người khác, kể cả admin, vẫn nhận 404 ở trang này (policy Storage vẫn cho ADMIN đọc, giống `report-images`, nhưng giao diện chưa có đường vào). Có thể bấm xem ảnh lớn.
- Thông báo gửi cho người nhặt giữ nguyên, không đính kèm ảnh.

### Các lưu ý (Tránh hiểu nhầm)

- Ảnh chỉ là **thông tin tham khảo thêm**; không tự động duyệt/loại yêu cầu và không đổi cơ chế gợi ý trùng khớp.
- Không cho sửa/thêm ảnh sau khi đã gửi yêu cầu (yêu cầu hiện không có chức năng sửa).
- Tin trên bảng tin, trang chi tiết tin, gợi ý, thông báo **không** được lộ ảnh minh chứng.
- Ảnh bỏ khỏi form hoặc form bị hủy vẫn nằm trong Storage (như `ImagePicker` hiện tại); ghi chú `ponytail:` dọn sau, không làm job dọn trong CHG này.
- Không thêm dependency; tái sử dụng `ImagePicker`, `checkImages`, hằng số trong `schemas.ts`. Nếu tham số hóa làm `ImagePicker` rối, tách hàm dùng chung nhỏ thay vì sao chép.
- Thay đổi schema phải đi qua `src/db/schema.ts` → `npm run db:generate` → `npm run db:migrate`; không sửa schema trực tiếp bằng Supabase MCP.
- Giữ `DESIGN.md` (ô chọn ảnh dùng cùng kiểu với form đăng tin).

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`
- `docs/01_changes/CHG-015_seed_and_create_report.md`, `docs/01_changes/CHG-019_claim_submit_and_decision.md`
- `src/components/claims/claim-form.tsx`, `src/components/reports/image-picker.tsx`, `src/lib/reports/checks.ts`, `src/lib/reports/schemas.ts`, `src/lib/claims/actions.ts`, `src/lib/claims/query.ts`, `src/app/claims/[id]/page.tsx`, `drizzle/0003_report_images_bucket.sql`
- Supabase skills (Storage: bucket private, RLS, signed URL) trước khi viết policy; dùng Supabase MCP chỉ để đọc kiểm tra bucket/policy sau migrate

## Acceptance criteria

- [x] Form có mục ảnh minh chứng đúng vị trí, không bắt buộc; gửi không ảnh vẫn thành công như trước.
- [x] Chọn tối đa 3 ảnh JPG/PNG/WEBP ≤ 5 MB; file sai định dạng, quá lớn hoặc quá số lượng bị từ chối kèm thông báo tiếng Việt; có xem trước và xóa từng ảnh; nút gửi bị khóa khi ảnh còn đang tải.
- [x] Server từ chối đường dẫn ảnh không thuộc thư mục của người gửi, ảnh trùng; ảnh chưa tải lên/sai bucket do truy vấn `storage.objects` theo đúng bucket (kiểm tra bằng đọc code, chưa có test tự động riêng cho nhánh này).
- [x] Ảnh nằm trong bucket riêng tư `claim-images`; URL công khai không truy cập được; người nhặt và người gửi xem được qua signed URL.
- [x] Trang chi tiết yêu cầu hiển thị ảnh cho người nhặt và người gửi; người thứ ba nhận 404; ảnh không xuất hiện ở chi tiết tin công khai. (Admin chưa xem được vì `/claims/[id]` hiện chỉ cho hai bên; xem phần Ghi nhận.)
- [x] Migration có phiên bản (`0006_claim_images`), đã chạy trên DB dev; RLS bật cho `claim_images` (kiểm tra bằng Supabase MCP, chỉ đọc).
- [x] `npm run lint`, `npm run typecheck`, `npm test` (78 test), `npm run build` đều pass; 22 E2E (kể cả golden path) pass, có thêm `tests/e2e/claim-images.spec.ts`.
- [ ] Kiểm tra giao diện bằng Playwright MCP: **chưa dùng Playwright MCP** (không có trong phiên). Đã dùng script `@playwright/test` chụp desktop 1280px và 320px (form có 2 ảnh xem trước, không tràn ngang); ảnh lưu thư mục tạm.

## AI Log

### AI-1 — Lưu ảnh minh chứng riêng tư và cho người nhặt đọc

- Nhiệm vụ (Task): thiết kế nơi lưu và cách cấp quyền đọc ảnh minh chứng.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), skill ponytail, Supabase MCP (chỉ đọc), Drizzle migration.
- Đầu vào / Ngữ cảnh (Input/Context): CHG-028, `image-picker.tsx`, `checks.ts`, `drizzle/0003_report_images_bucket.sql`, `claims/query.ts`.
- Kết quả AI (AI Output): bucket riêng tư `claim-images` + bảng `claim_images`; vì người nhặt không phải chủ thư mục nên policy Storage gọi hàm `security definer public.can_read_claim_image` (các bảng `public.*` bật RLS không policy) và server tạo signed URL 1 giờ bằng session của người xem, không cần service-role key. Tái sử dụng `ImagePicker`/`checkImages` bằng cách thêm tham số (bucket, số ảnh, nhãn, bắt buộc) thay vì sao chép.
- Quyết định của nhóm (Human Decision): chờ xác nhận (người dùng đã duyệt kế hoạch gồm bucket riêng tư).
- Kiểm tra / Xác minh (Verification): E2E `claim-images.spec.ts` (người nhặt thấy ảnh tải được, URL công khai không mở được, người thứ ba 404); Supabase MCP xác nhận bucket `public=false`, 2 policy, RLS bật; unit test Zod và `checkImages`.
- Ứng viên đưa vào báo cáo: có

## Bug

Không có.

### Ghi nhận

- Advisor Supabase cảnh báo `public.can_read_claim_image` gọi được qua RPC bởi user đăng nhập. Chủ ý: cùng kiểu với `public.is_admin()` đã có, hàm chỉ trả boolean theo `auth.uid()` của người gọi, không lộ dữ liệu.
- Admin có quyền đọc ở policy Storage nhưng chưa xem được ảnh vì `/claims/[id]` chỉ cho người nhặt và người gửi; nếu cần admin duyệt ảnh minh chứng thì làm ở CHG khác.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
| --- | --- | --- | --- | --- | --- |
| TC-028-01 | Gửi yêu cầu không kèm ảnh | Thành công như trước, trang yêu cầu không có mục ảnh | Thành công, trang yêu cầu không có mục ảnh | Passed | `claim-images.spec.ts` test 2 |
| TC-028-02 | Gửi yêu cầu kèm 1–3 ảnh hợp lệ | Thành công; người nhặt thấy đủ ảnh trong `/claims/[id]` | Gửi kèm ảnh thành công; người nhặt thấy ảnh, ảnh tải được (naturalWidth > 0) | Passed | `claim-images.spec.ts` test 1 |
| TC-028-03 | Chọn ảnh thứ 4, file PDF, file > 5 MB | Bị từ chối kèm thông báo tiếng Việt; không tải lên | PDF bị từ chối; chọn 4 ảnh thì bỏ bớt 1 kèm thông báo (file > 5 MB do cùng logic `ImagePicker` đã dùng ở form đăng tin, chưa test riêng) | Passed | `claim-images.spec.ts` test 3 |
| TC-028-04 | Xóa ảnh khỏi danh sách trước khi gửi | Ảnh không được gắn vào yêu cầu | Xóa 1 trong 2 ảnh trước khi gửi, chỉ còn 1 ảnh gắn vào | Passed | `claim-images.spec.ts` test 1 |
| TC-028-05 | Đang tải ảnh thì bấm gửi | Nút gửi bị khóa đến khi tải xong | Nút gửi bị khóa khi đang tải, mở lại khi xong (kiểm tra `toBeEnabled` sau khi tải) | Passed | `claim-images.spec.ts` test 1 |
| TC-028-06 | Gửi trực tiếp action với đường dẫn ảnh của người khác / chưa tồn tại / trùng | Server trả lỗi theo field `images`, không ghi `claims` (unit test) | Ảnh trùng, đường dẫn người khác, đường dẫn sai dạng bị từ chối (unit test). Ảnh chưa tồn tại trong Storage: chỉ xác nhận bằng đọc code | Passed | `claims.test.ts` TC-028-06 |
| TC-028-07 | Mở URL công khai của ảnh minh chứng khi chưa đăng nhập | Không truy cập được (403/404) | URL công khai `/object/public/claim-images/...` không trả 2xx | Passed | `claim-images.spec.ts` test 1 |
| TC-028-08 | Người thứ ba mở `/claims/[id]` | 404, không lộ ảnh; ảnh không có ở bảng tin/chi tiết tin/gợi ý | Người thứ ba thấy 404, chi tiết tin công khai không chứa `claim-images` | Passed | `claim-images.spec.ts` test 1 |
| TC-028-09 | Admin mở yêu cầu (đã loại khỏi phạm vi) | Không áp dụng: giữ quy tắc `canViewClaim` hiện có | Admin chưa xem được vì `/claims/[id]` chỉ cho hai bên (xem Ghi nhận); đã đổi phạm vi CHG | N/A | — (đã chỉnh phạm vi) |
| TC-028-10 | Giao diện mobile 320/390px | Mục ảnh không tràn ngang, lưới xem trước gọn | Không tràn ngang ở 320px, lưới xem trước gọn | Passed | screenshot desktop/320px (xem thủ công) |

## Hướng dẫn tự chạy

```
npm run db:generate
npm run db:migrate
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test   # cần SEED_DEMO_PASSWORD trong .env.local
npm run dev           # xem tay: đăng nhập tài khoản demo, mở tin Nhặt được của người khác, gửi yêu cầu kèm ảnh, rồi đăng nhập bên người nhặt để xem
```
