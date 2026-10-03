# CHG-030: Chat thời gian thực giữa người nhặt và người nhận lại

- ID: `CHG-030`
- Trạng thái: `rejected` (2026-10-03: người dùng quyết định bỏ, chưa thực hiện)
- Ngày tạo: `2026-10-03`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-019` (claim và quyền `canViewClaim`), `CHG-020` (bàn giao, trạng thái `ACCEPTED`/`COMPLETED`), `CHG-018` (thông báo trong web). Nên làm sau `CHG-029` nếu cùng sửa `schema.ts` hoặc migration để tránh xung đột thứ tự migration.
- File/module dự kiến sửa/tạo: `src/db/schema.ts` (bảng `claim_messages`), `drizzle/0007_claim_messages.sql` (do `npm run db:generate`, thêm tay phần RLS policy, hàm security definer và publication Realtime), `src/lib/claims/chat.ts` (schema Zod + hàm gửi), `src/lib/claims/chat-actions.ts` (server action gửi tin), `src/lib/claims/query.ts` (lấy lịch sử tin nhắn), `src/components/claims/chat.tsx` (client component, đăng ký Realtime), `src/app/claims/[id]/page.tsx` (gắn khung chat), `src/lib/notifications/index.ts` và enum `notification_type` (nếu thêm thông báo tin nhắn mới), `src/lib/claims/claims.test.ts`, `tests/e2e/chat.spec.ts`
- Branch: 

## Kết quả người dùng

Trong trang chi tiết yêu cầu nhận lại (`/claims/[id]`), người nhặt và người gửi yêu cầu có **khung chat** để trao đổi chi tiết bàn giao (giờ giấc, đổi điểm hẹn, mô tả thêm). Tin nhắn của bên kia **hiện ngay không cần tải lại trang**.

## Đánh giá độ khó (để quyết định)

**Mức độ: trung bình, làm được trong một CHG.** Supabase có sẵn Realtime nên không cần tự dựng WebSocket server (Vercel không hỗ trợ giữ kết nối WebSocket lâu, nên dùng Supabase Realtime là hướng hợp lý). Phần khó nhất không phải realtime mà là **phân quyền**:

- Dự án đang bật RLS cho mọi bảng `public.*` mà **không có policy** (truy cập dữ liệu đi qua Drizzle ở server). Realtime của trình duyệt chạy bằng quyền user (`authenticated`), nên bảng tin nhắn cần policy `SELECT` cho đúng hai bên của claim; nếu không có policy, user sẽ không nhận được sự kiện, nếu policy sai thì lộ tin nhắn. Dùng cùng kiểu hàm `security definer` như `can_read_claim_image` (CHG-028) để tránh đệ quy RLS.
- Phải bật bảng vào publication `supabase_realtime`.
- Client phải xử lý: nhận sự kiện trùng với tin vừa tự gửi, mất kết nối rồi nối lại (nạp lại lịch sử để không sót tin), cuộn xuống tin mới, trạng thái đang gửi/lỗi.

## Phạm vi

### Bao gồm

- **Phạm vi chat:** mỗi `claim` là một cuộc trò chuyện giữa đúng hai người (người nhặt của tin và người gửi yêu cầu). Chỉ mở chat khi claim ở `ACCEPTED`; claim `COMPLETED` xem lại được nhưng chỉ đọc; `PENDING`, `REJECTED`, `EXPIRED` không chat (tránh bị làm phiền sau khi bị từ chối và vẫn giữ nguyên cơ chế xác minh trước khi lộ liên hệ).
- **Database (qua Drizzle):** bảng `claim_messages` (`id`, `claim_id` → `claims` cascade, `sender_id` → `users`, `body`, `created_at`), index `(claim_id, created_at)`, bật RLS. Migration thêm: hàm security definer `public.can_read_claim_chat(claim_id)` (đúng hai bên hoặc ADMIN không cần, xem Lưu ý), policy `SELECT` cho role `authenticated`, **không** có policy `INSERT/UPDATE/DELETE` (ghi chỉ qua server), và `alter publication supabase_realtime add table public.claim_messages`.
- **Gửi tin:** server action `sendClaimMessage` kiểm tra đăng nhập, là một trong hai bên, claim đang `ACCEPTED`, rồi validate bằng Zod (`body` 1–1000 ký tự sau khi trim); ghi bằng Drizzle. Chỉ gửi văn bản, chưa hỗ trợ ảnh/tệp.
- **Nhận realtime:** `chat.tsx` (client) nạp lịch sử do server render, subscribe `postgres_changes` (INSERT, lọc `claim_id=eq.<id>`) bằng `@supabase/ssr` client đã có; gộp tin theo `id` để không trùng; nạp lại lịch sử khi kết nối lại; cuộn xuống tin mới nhất.
- **Giao diện:** bong bóng tin nhắn của mình/của đối phương, giờ gửi, ô nhập có nút gửi (Enter gửi, Shift+Enter xuống dòng), trạng thái đang gửi/lỗi, trạng thái chỉ đọc khi `COMPLETED`; xuống dòng theo `DESIGN.md`, dùng được ở 320px.
- **Thông báo:** khi có tin nhắn mới, gửi một thông báo trong web cho bên kia nhưng gộp (không tạo mới nếu thông báo chat chưa đọc của claim này đã tồn tại) để không spam. Nếu việc này làm CHG phình, tách phần thông báo ra sau và chỉ ghi vào mục Ghi nhận.

### Các lưu ý (Tránh hiểu nhầm)

- Không dựng WebSocket server riêng, không thêm dependency (dùng `@supabase/supabase-js`/`@supabase/ssr` đã cài). Nếu cần dependency mới phải ghi lý do trong CHG.
- Không dùng Supabase MCP để sửa schema; schema đi qua `src/db/schema.ts` → `npm run db:generate` → `npm run db:migrate`. Phần SQL tay (hàm, policy, publication) nằm trong file migration có phiên bản như `0003`/`0006`. Dùng Supabase MCP chỉ để đọc kiểm tra publication, policy và advisor sau migrate.
- Admin **không** xem chat ở CHG này (giữ nguyên quy tắc `canViewClaim` chỉ cho hai bên; admin không có đường vào giao diện). Policy cũng chỉ cho hai bên để nhất quán.
- Chưa có: trạng thái "đã đọc", "đang nhập", online/offline (Presence), sửa/xóa tin nhắn, ảnh/tệp trong chat, chat nhóm, chat giữa hai người chưa có claim được chấp nhận. Thêm khi có nhu cầu.
- Không phân trang vô hạn: nạp tối đa 200 tin gần nhất ở lần đầu; ghi `ponytail:` giới hạn và hướng nâng cấp (cursor theo `created_at`).
- Không lọc/kiểm duyệt nội dung tự động ở CHG này; người dùng vẫn có chức năng báo cáo vi phạm ở tin (CHG-021). Ghi nhận là rủi ro cần xem xét.
- Giữ `DESIGN.md`; không đưa dữ liệu cá nhân thật vào test, screenshot, log.
- Test E2E cần hai phiên đăng nhập đồng thời (hai browser context) để xác nhận tin hiện ngay mà không reload.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`
- `docs/01_changes/CHG-019_claim_submit_and_decision.md`, `docs/01_changes/CHG-020_handover_and_returned.md`, `docs/01_changes/CHG-028_claim_evidence_images.md` (mẫu hàm security definer + policy)
- `src/db/schema.ts`, `src/lib/claims/query.ts` (`canViewClaim`), `src/lib/claims/handover-actions.ts`, `src/app/claims/[id]/page.tsx`, `src/utils/supabase/client.ts`, `drizzle/0006_claim_images.sql`
- Supabase skills và docs (Realtime *Postgres Changes*, RLS cho Realtime, `supabase_realtime` publication) trước khi viết policy và client; Supabase MCP chỉ để đọc kiểm tra

## Acceptance criteria

- [ ] Hai bên của claim `ACCEPTED` chat được; tin của người này hiện ở người kia trong vài giây **không cần tải lại trang** (kiểm tra bằng hai trình duyệt/context).
- [ ] Người thứ ba (kể cả đã đăng nhập) không đọc được tin nhắn: không thấy ở trang, không nhận được sự kiện Realtime, không đọc được qua API Supabase trực tiếp.
- [ ] Không gửi được khi claim không phải `ACCEPTED`; claim `COMPLETED` chỉ xem lại; kiểm tra phía server, không chỉ ẩn nút.
- [ ] Nội dung tin nhắn được validate bằng Zod (trim, 1–1000 ký tự) và hiển thị an toàn (không render HTML).
- [ ] Mất kết nối rồi nối lại không bị sót hoặc trùng tin; tin tự gửi không hiện hai lần.
- [ ] Migration có phiên bản (`0007_claim_messages`) đã chạy trên DB dev; RLS bật, bảng nằm trong publication `supabase_realtime` (kiểm tra bằng Supabase MCP, chỉ đọc; chạy advisor và ghi cảnh báo nếu có).
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đều pass; E2E `chat.spec.ts` pass; golden path hiện có không hỏng.
- [ ] Kiểm tra giao diện bằng Playwright MCP (desktop và 320px), screenshot làm evidence.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-030-01 | Claim `ACCEPTED`: A gửi tin, B đang mở trang | Tin hiện ở B trong vài giây, không reload | | Pending | |
| TC-030-02 | B trả lời, A đang mở trang | Tin hiện ở A ngay; mỗi tin chỉ hiện một lần ở người gửi | | Pending | |
| TC-030-03 | Người thứ ba mở `/claims/[id]` | 404, không thấy tin nhắn | | Pending | |
| TC-030-04 | Người thứ ba đọc `claim_messages` bằng client Supabase / đăng ký Realtime kênh của claim | Không có dòng, không nhận sự kiện | | Pending | |
| TC-030-05 | Gửi khi claim `PENDING`, `REJECTED`, `EXPIRED` (gọi thẳng server action) | Bị từ chối, không ghi DB | | Pending | |
| TC-030-06 | Claim `COMPLETED` | Hiện lịch sử, ô nhập bị khóa, server từ chối gửi | | Pending | |
| TC-030-07 | Tin rỗng, chỉ khoảng trắng, > 1000 ký tự (unit test Zod) | Bị từ chối kèm thông báo tiếng Việt | | Pending | |
| TC-030-08 | Tin chứa `<script>`/HTML | Hiển thị dạng văn bản thuần, không thực thi | | Pending | |
| TC-030-09 | Ngắt mạng rồi bật lại khi đối phương đã gửi tin | Sau khi nối lại, tin bị lỡ xuất hiện, không trùng | | Pending | |
| TC-030-10 | Thông báo tin nhắn mới (nếu làm) | Bên kia có đúng một thông báo chưa đọc cho claim, không spam | | Pending | |
| TC-030-11 | Giao diện 320px | Khung chat không tràn ngang, ô nhập không bị bàn phím che | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:generate
npm run db:migrate
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test   # cần SEED_DEMO_PASSWORD trong .env.local
npm run dev           # xem tay: hai trình duyệt (hoặc một cửa sổ ẩn danh) đăng nhập hai tài khoản demo của một claim đã chấp nhận, mở /claims/<id> rồi nhắn qua lại
```
