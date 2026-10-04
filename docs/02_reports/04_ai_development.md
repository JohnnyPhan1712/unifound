# Phát triển có hỗ trợ bởi AI

## 1. Công cụ AI và các tích hợp skill/MCP

| Công cụ | Loại | Mục đích | Dùng ở |
|---|---|---|---|
| Codex | AI coding agent | Thiết lập bộ tài liệu nền tảng ban đầu | Giai đoạn khởi tạo tài liệu |
| Antigravity | AI coding agent | Thành viên dùng làm các task giai đoạn đầu (quy trình cũ) | Giai đoạn đầu: auth, matching, claim bản cũ |
| Claude Code (Opus 5.5, Sonnet 5.5) | AI coding agent chính | Thiết kế UI/mockup, viết code, test, rà soát và ghi log từ giai đoạn thiết kế UI trở đi | Thiết kế UI và toàn bộ giai đoạn làm lại |
| Google Stitch | AI sinh giao diện | Sinh mockup để so sánh với Claude (mục 4) | `assets/stitch_ui_mockups/` |
| `DESIGN.md` (nền Airbnb, lấy từ awesome-design-md) | Tài liệu thiết kế cho AI | Mốc UI cho agent: chỉ đổi branding cho UniFound | 
| Skill `impeccable` | Skill thiết kế UI | Thiết kế, rà soát UI; lệnh `detect` quét lỗi thiết kế | Thiết kế UI, rà soát UI |
| Skill `taste-skill` | Skill thẩm mỹ UI | Nâng chất lượng layout, typography, spacing, không lệch `DESIGN.md` | Đã cài; chưa ghi nhận đã dùng |
| Skill `ponytail` | Plugin giữ code tối giản | Đi theo thứ tự "có cần viết không → tái sử dụng → thư viện sẵn có → code tối thiểu" | Từ giai đoạn dọn code cũ trở đi |
| Supabase skills và Supabase MCP | Skill + MCP | Tra cứu Auth/RLS/Postgres/Storage, đọc cấu trúc bảng, kiểm tra dữ liệu, bucket và policy bằng truy vấn đọc | Giai đoạn làm lại, ảnh minh chứng |
| Playwright MCP | MCP kiểm thử UI | Duyệt và chụp màn hình để tự kiểm tra | Thiết kế mockup |
| Playwright (thư viện) | Thư viện test | E2E và quét UI khi phiên làm việc không có Playwright MCP (các task tìm kiếm, header/popup, ảnh minh chứng đều dùng cách này, ảnh chụp từ script) | Giai đoạn làm lại và hoàn thiện giao diện |

Quy tắc dùng công cụ: không đưa secret hoặc dữ liệu cá nhân thật vào prompt/log/ảnh chụp; thao tác ghi vào database chỉ làm khi người dùng duyệt; schema chỉ đổi qua Drizzle, không sửa trực tiếp bằng MCP.

## 2. AI Development Log

### AI-LOG-001 — Thiết lập tài liệu nền tảng UniFound

- Nguồn: giai đoạn khởi tạo tài liệu, Phan Ngọc Đức Huy.
- AI Tool: Codex.
- Task: Đọc khung repository, tạo bộ guide/report ban đầu phù hợp Mini Project.
- Input / Context: Checklist Mini Project do người dùng tổng hợp; ý tưởng brainstorm UniFound và luồng Lost → Match → Claim → Returned.
- AI Output: Tổ chức thư mục tài liệu (guide, nhật ký công việc, report); điền baseline problem/scope/user stories/requirements/test plan và đánh dấu phần chưa chốt; tạo task đầu tiên ghi lại công việc.
- Human Decision: **Modified**. Người dùng sửa mô hình tham khảo CampusLoop: bỏ `current_system`, dùng report làm nguồn hiện trạng, giới hạn guide ở nội dung chung.
- Verification: Đối chiếu report với checklist deliverable; review diff để bảo đảm AI không tự chốt stack, schema, API hay matching rule.
- Result: Có bộ tài liệu nền; về sau quy trình ghi nhận công việc ban đầu được thay bằng quy trình mới (mẫu AI log 6 trường).

### AI-LOG-002 — Prompt thực hiện các task giai đoạn đầu (auth, report, match, claim)

- Nguồn: bốn task giai đoạn đầu do nhóm trưởng giao cho Quân (đăng nhập), Chiến (đăng và tìm report), Thế Anh (gợi ý trùng khớp), Phát (claim).
- AI Tool: Antigravity (Quân, Thế Anh, Phát) và Claude (Chiến), theo xác nhận của nhóm trưởng; các task này theo mẫu cũ nên không có AI log ghi công cụ.
- Task: Mỗi thành viên prompt AI để làm một phần: đăng nhập/phân quyền, đăng và tìm report, gợi ý trùng khớp, claim.
- Input / Context: Các task theo quy trình cũ, thiết kế cũ (3 bảng `users`, `reports`, `claims`, chưa có vai trò admin).
- AI Output: Code của từng phần, kiểm tra riêng lẻ không đồng đều: phần đăng nhập ghi 41/41 test và build pass; phần đăng/tìm report chỉ kiểm tra phần độc lập, chờ phần đăng nhập; phần gợi ý chưa kiểm tra; phần claim ghi "đã triển khai". Các phần không ghép thành một ứng dụng đúng thiết kế.
- Human Decision: **Rejected** (bốn task bị từ chối, sau đó dọn code cũ). Nhóm trưởng đánh giá nguyên nhân: một phần do AI, chủ yếu do nhóm trưởng giao việc mà không kiểm soát dependency giữa các task, và các thành viên chưa hiểu rõ thiết kế cũng như công nghệ nên viết prompt sai yêu cầu.
- Verification: Review kết quả khi tích hợp; các task chuyển trạng thái từ chối; việc dọn code xóa 46 file code cũ và giữ hạ tầng DB.
- Bài học: Phải chốt thiết kế và dependency trước khi giao prompt; test xanh trong từng task không chứng minh các task ghép được với nhau.

### AI-LOG-003 — Nhận diện thương hiệu và mockup toàn bộ màn hình

- Nguồn: giai đoạn thiết kế UI, Phan Ngọc Đức Huy.
- AI Tool: Claude Code (Opus 5.5), skill `impeccable`, Playwright MCP.
- Task: Đề xuất màu, logo, typography và dựng mockup HTML tĩnh cho SCR-01 → SCR-05 và đăng nhập, giữ nền Airbnb của `DESIGN.md`.
- Input / Context: `AGENTS.md`, `DESIGN.md`, chương 01–03, `use_case_diagram.puml`.
- AI Output: `brand_identity.md` (primary `#2D5BD7`, Mất đồ cam `#9A3D0B`, Nhặt được xanh lục `#0B6B4A`, font Be Vietnam Pro, logo chữ U); bộ mockup 6 màn hình + `index.html` trong `assets/claude_ui_mockups/`, mỗi màn có trạng thái loading/empty/lỗi và layout mobile.
- Human Decision: **Accepted** (2026-10-02: nhóm trưởng xác nhận); người dùng đánh giá đây là bản dễ nhìn nhất và dùng làm chuẩn giao diện khi viết code.
- Verification: Tính tương phản WCAG bằng script (thấp nhất 5,41:1); Playwright MCP duyệt desktop 1440×900 và mobile 390×844, console 0 lỗi; lần duyệt đầu phát hiện hai lỗi AI tạo ra (BUG-1 thẻ gợi ý chồng chữ, BUG-2 icon bị đẩy xuống dòng), đã sửa rồi chụp lại (xem `05_testing_deployment.md`).

### AI-LOG-004 — Schema theo ERD và lớp xác thực

- Nguồn: giai đoạn nền tảng, Trần Minh Chiến.
- AI Tool: Claude Code (Opus 5.5), Supabase MCP, ponytail.
- Task: Viết lại `src/db/schema.ts` theo ERD (10 bảng), dựng Supabase Auth với `@supabase/ssr`, kiểm tra tên miền email phía server, `proxy.ts`, trang đăng nhập/đăng ký/hồ sơ.
- Human Decision: **Accepted** (ủy quyền 2026-10-02). Người dùng đã chọn: cho phép drop dữ liệu cũ, giữ bật xác nhận email, tên miền `gm.uit.edu.vn,uit.edu.vn`.
- Verification: `db:migrate` thành công; Supabase MCP xác nhận 10 bảng đều bật RLS; Vitest kiểm tra tên miền (từ chối cả đuôi giả `uit.edu.vn.evil.com`) và Zod; Playwright kiểm tra luồng đăng ký/đăng nhập thật.

### AI-LOG-005 — Làm lại giao diện theo mockup khi `DESIGN.md` và mockup mâu thuẫn

- Nguồn: giai đoạn nền tảng, Trần Minh Chiến.
- AI Tool: Claude Code (Opus 5.5, Sonnet 5.5), skill `impeccable` (`detect`), Playwright.
- Task: Dựng nền UI; sau khi người dùng chỉ ra giao diện chưa giống mockup thì đối chiếu và làm lại.
- AI Output: Bản đầu (AI-2) theo `DESIGN.md` cũ (màu teal). AI nhận ra hai nguồn mâu thuẫn (`DESIGN.md` teal và `brand_identity.md` + mockup xanh dương), nêu cho chủ dự án chọn; chủ dự án chọn theo mockup, làm lại toàn bộ màn hình và cập nhật token trong `DESIGN.md`.
- Human Decision: AI-2 **Modified** (bị thay bằng AI-3); AI-3 **Accepted** phần chọn hướng, phần kết quả Accepted theo ủy quyền 2026-10-02.
- Verification: Ảnh chụp desktop 1440px và iPhone 13 so với ảnh trong mockup; `impeccable detect` còn 0 cảnh báo; E2E 4/4 trên bản build; quét 17 màn hình mobile.

### AI-LOG-006 — State machine và transaction khi chấp nhận yêu cầu nhận đồ

- Nguồn: giai đoạn luồng claim, Trần Minh Chiến.
- AI Tool: Claude Code (Opus 5.5), Supabase MCP, ponytail.
- Task: Luật gửi yêu cầu, state machine, transaction duyệt yêu cầu bảo đảm một tin chỉ có tối đa một yêu cầu `ACCEPTED`.
- Human Decision: **Accepted** (ủy quyền 2026-10-02). Hai đề xuất của AI được giữ: yêu cầu bị đóng dùng trạng thái `REJECTED`; ADMIN không duyệt thay chủ tin.
- Verification: Vitest (state machine, luật gửi, hết hạn); Playwright với 4 tài khoản, có ca hai trình duyệt bấm "Chấp nhận" cùng lúc cho hai yêu cầu của cùng một tin; Supabase MCP xác nhận chỉ còn một `ACCEPTED`.

### AI-LOG-007 — E2E golden path và edge case

- Nguồn: giai đoạn kiểm thử và triển khai, Dương Đăng Khang.
- AI Tool: Antigravity (Gemini 3.8 Flash, Claude Sonnet), thư viện Playwright.
- Task: Viết Playwright E2E cho luồng đăng nhập → đăng tin → gửi yêu cầu → chấp nhận → hai bên xác nhận → Đã trả, và các ca sai quyền.
- Human Decision: **Accepted** (ủy quyền 2026-10-02).
- Verification: Lần chạy đầu 3/4 pass; ca đăng ký fail vì selector `getByLabel("Mật khẩu", { exact: true })` không khớp nhãn có dấu `*` — lỗi ở test chứ không ở app. Đổi sang regex → 4/4 pass.

### AI-LOG-008 — Quên mật khẩu (PKCE) và thêm tên miền trường

- Nguồn: giai đoạn bổ sung, Phan Ngọc Đức Huy.
- AI Tool: Antigravity (Claude Sonnet), Supabase MCP (`search_docs`, SELECT), Playwright, ponytail.
- Task: Thêm `/forgot-password`, `/reset-password`, `/auth/callback`; thêm 5 tên miền và 4 trường vào seed.
- AI Output: Dùng `redirectTo` về `/auth/callback` (PKCE, `exchangeCodeForSession`) thay vì sửa mail template để khỏi đổi cấu hình Supabase; thông báo giống nhau dù email có tài khoản hay không (không lộ email đã đăng ký); chặn tài khoản `locked`.
- Human Decision: **Accepted** (2026-10-02: nhóm trưởng xác nhận).
- Verification: `lint`, `typecheck`, `test` 72/72, `build`; Playwright cho các ca lỗi và mobile. Chưa kiểm: gửi mail thật và bấm liên kết, tài khoản `locked`, đăng ký thật bằng email các trường mới.

### AI-LOG-009 — Popup xác thực, Trợ giúp và kiểm tra nội dung với code thật

- Nguồn: giai đoạn hoàn thiện giao diện (header, popup, trợ giúp), Phan Ngọc Đức Huy và Thế Anh.
- AI Tool: Claude Code (Sonnet 5.5) + Antigravity (Gemini Flash 3.8, Claude Sonnet), ponytail, thư viện Playwright; tham khảo cấu trúc iLost Support Center.
- Task: Cho đăng nhập/đăng ký/quên mật khẩu và Trợ giúp mở thành popup ngay trên trang hiện tại từ nhiều nơi (avatar, menu, nút "Đăng tin", proxy, server action); viết nội dung trợ giúp.
- Input / Context: Header cũ, các trang `/login` `/register` `/forgot-password`, server action và proxy hiện có, logic chấm điểm (`score.ts`) và bàn giao (`handover.ts`).
- AI Output: Trạng thái popup nằm trên URL (`?auth=login|register|forgot`, `?help=1`) thay vì React context, nên server chỉ cần `redirect` về URL tương ứng; popup dùng `<dialog>` gốc (có sẵn focus trap, phím Esc và lớp nền), không thêm thư viện. Menu giữ trong DOM (ẩn bằng `hidden`) để form Đăng xuất không bị gỡ trước khi gửi. Bản nháp nội dung trợ giúp ban đầu sai hai điểm: mô tả gợi ý trùng khớp thiếu điều kiện (cùng danh mục, trong 14 ngày) và nói tin đóng khi một bên bấm "Đã trả"; AI tự đối chiếu mã nguồn rồi sửa thành "cả hai bên cùng xác nhận". Danh sách điểm tiếp nhận chỉ dùng tên địa điểm có trong dữ liệu mẫu, không bịa số điện thoại hay giờ làm việc.
- Human Decision: **Accepted** (người dùng xác nhận hoàn thành). Danh sách điểm tiếp nhận là nội dung minh họa, cần nhóm xác nhận lại tên và ghi chú nếu dùng thật.
- Verification: 8 test Playwright (thứ tự nút header, luồng đăng nhập ↔ đăng ký ↔ quên mật khẩu, "Đăng tin" khi chưa đăng nhập, Trợ giúp ẩn/hiện khi cuộn, footer) cùng test edge case cập nhật, 20/20 E2E lúc đó pass; đối chiếu thủ công nội dung trợ giúp với mã nguồn. Chưa dùng Playwright MCP (không có trong phiên), thay bằng ảnh chụp từ script Playwright.

### AI-LOG-010 — Ảnh minh chứng riêng tư, Họ và tên khi đăng ký, Hủy bàn giao

- Nguồn: giai đoạn hoàn thiện luồng nhận đồ; gồm ba phần: ảnh minh chứng, họ và tên khi đăng ký, hủy bàn giao.
- AI Tool: Antigravity (Claude Sonnet), ponytail, Supabase MCP (chỉ đọc), Drizzle migration.
- Task:
  1. Cho người mất đồ đính kèm ảnh minh chứng khi gửi yêu cầu nhận; thiết kế nơi lưu và cách cấp quyền đọc.
  2. Thêm ô **Họ và tên** bắt buộc ở form đăng ký, validate server và lưu vào `users.full_name`.
  3. Xử lý trường hợp hai bên đã xác nhận bàn giao nhưng đến hẹn không gặp được nhau: thêm thao tác **Hủy bàn giao** để tin không kẹt ở "Đang bàn giao".
- Input / Context: Form yêu cầu, `ImagePicker`, `checkImages`, migration bucket ảnh tin, truy vấn yêu cầu; `schemas.ts`, `actions.ts`, `session.ts`, `auth-form.tsx`; `rules.ts`, `handover-actions.ts`, `handover.tsx`, `claims/[id]/page.tsx`.
- AI Output:
  1. Ảnh minh chứng có thể lộ chi tiết giúp người khác mạo nhận nên AI đề xuất bucket riêng tư `claim-images` (không dùng bucket công khai của ảnh tin) và bảng `claim_images`. Vì người nhặt không phải chủ thư mục ảnh nên policy Storage gọi hàm `security definer public.can_read_claim_image`; server tạo signed URL 1 giờ bằng session của người xem, không cần service-role key. Tái dùng `ImagePicker` và `checkImages` bằng cách thêm tham số (bucket, số ảnh, nhãn) thay vì sao chép code.
  2. Tách quy tắc `fullName` dùng chung giữa `profileSchema` và `registerSchema` mới (trim, 2–120 ký tự); `ensureUserRow` nhận `fullName` tùy chọn nên đăng nhập/callback không đổi; `register` giữ lại họ tên đã nhập khi báo lỗi. Không đổi schema DB (`users.full_name` đã có), không thêm migration.
  3. Xác nhận bằng đọc code rằng `IN_PROGRESS` chỉ thoát được sang `RETURNED`/`HIDDEN` nên tin bị kẹt; đề xuất thêm trạng thái claim `CANCELLED` (migration `0007_claim_cancelled.sql`) thay vì dùng lại `REJECTED` để phân biệt "bị từ chối" với "bàn giao thất bại". Action `cancelHandover` theo mẫu `confirmHandover`: một transaction khóa dòng, claim `ACCEPTED` → `CANCELLED`, tin `IN_PROGRESS` → `OPEN`, thông báo bên còn lại; cả người nhặt và người nhận đều hủy được, người ngoài bị từ chối; bấm lặp lại không đổi dữ liệu. Nút "Hủy bàn giao" có `confirm()`, thông tin liên hệ tự ẩn khi không còn `ACCEPTED`. Sửa thêm `ClaimSteps` ở trang tin vì trạng thái mới làm bước "Được chấp nhận" hiển thị sai.
- Human Decision:
  1. **Accepted** (người dùng duyệt kế hoạch gồm bucket riêng tư và xác nhận hoàn thành).
  2. Chờ xác nhận.
  3. **Accepted** (người dùng chọn phương án `CANCELLED` và test tay thấy ổn, 2026-10-04; bỏ qua Playwright MCP và `/ponytail-review`).
- Verification:
  1. E2E: người nhặt thấy ảnh và ảnh tải được, URL công khai của ảnh không mở được, người thứ ba mở trang yêu cầu nhận 404 và chi tiết tin công khai không chứa đường dẫn `claim-images`; unit test Zod và `checkImages` (ảnh trùng, đường dẫn của người khác, đường dẫn sai dạng bị từ chối); Supabase MCP (chỉ đọc) xác nhận bucket không công khai, có 2 policy và RLS bật. Advisor Supabase cảnh báo hàm này gọi được qua RPC bởi người đã đăng nhập; chấp nhận có chủ ý vì hàm chỉ trả boolean theo `auth.uid()` của người gọi, cùng kiểu với `is_admin()` đã có. Chưa có test tự động cho nhánh "ảnh chưa tải lên Storage" (chỉ xác nhận bằng đọc code).
  2. Unit test `registerSchema` (thiếu, 1 ký tự, 121 ký tự, khoảng trắng đầu/cuối); `lint`, `typecheck`, `test` (81), `build` pass; E2E `edge-cases` và `header-help` pass (11 test). Chưa chạy lại toàn bộ E2E; chưa kiểm tra popup bằng Playwright MCP (desktop và 320px).
  3. Unit test chuyển trạng thái (`ACCEPTED` → `CANCELLED` được; `COMPLETED`/`CANCELLED`/`REJECTED`/`PENDING` bị từ chối); `lint`, `typecheck`, `test` (82), `build` pass; migration đã `db:migrate` trên DB dev; người dùng test tay hủy từ cả hai phía. Chưa có E2E cho hủy bàn giao.

## 3. Quyết định quan trọng có AI hỗ trợ

### Chọn mockup do Claude tạo làm chuẩn giao diện

- Đề xuất của AI: bản UI đầu dùng `DESIGN.md` (teal); khi đối chiếu, AI nêu rằng `DESIGN.md` và mockup mâu thuẫn.
- Giải thích: Mockup có đủ trạng thái (loading/empty/lỗi), logo, palette đã kiểm tương phản WCAG và chụp màn hình làm bằng chứng; chủ dự án đánh giá đây là bản dễ nhìn nhất.
- Quyết định cuối: Theo mockup (xanh dương), làm lại toàn bộ màn hình, sửa token trong `DESIGN.md` cho khớp.
- Kiểm soát: Ảnh chụp đối chiếu với mockup; `impeccable detect` 0 cảnh báo .

### Bỏ các task giai đoạn đầu, làm lại theo ERD 10 bảng

- Bối cảnh: Thiết kế cũ chỉ có 3 bảng, không có vai trò admin; các task làm song song bị lệch nhau (xem AI-LOG-002).
- Giải thích: Sửa vá từng phần tốn hơn dọn rồi làm lại theo chuỗi task có dependency rõ ràng.
- Quyết định cuối: Đánh dấu từ chối, dọn code cũ (giữ hạ tầng DB), làm lại có thứ tự.
- Kiểm soát: Danh sách file xóa được ghi lại; người dùng duyệt từng nhóm xóa.

### Yêu cầu bị đóng dùng `REJECTED`, ADMIN không duyệt thay chủ tin

- Đề xuất của AI: Khi chủ tin chấp nhận một yêu cầu, các yêu cầu còn lại chuyển `REJECTED`; chỉ chủ tin FOUND duyệt.
- Giải thích: Giữ ít trạng thái, và việc xác minh đồ thuộc về người nhặt nên admin không nên thay mặt.
- Quyết định cuối: Giữ theo đề xuất; có partial unique index làm lớp chặn cuối ở database.
- Kiểm soát: TC-09 → TC-12 (xem `05_testing_deployment.md`).

### Lưu ảnh minh chứng ở bucket riêng tư

- Đề xuất của AI: Không dùng bucket công khai như ảnh tin; dùng bucket riêng tư và signed URL ngắn hạn, cấp quyền đọc cho người nhặt qua hàm kiểm tra trong database (xem AI-LOG-010).
- Giải thích: Ảnh minh chứng có thể chứa chi tiết dùng để chứng minh sở hữu; nếu công khai thì người khác có thể xem rồi mạo nhận.
- Quyết định cuối: Người dùng duyệt kế hoạch theo đề xuất; chỉ người nhặt và người gửi xem được, admin được phép đọc ở tầng Storage nhưng giao diện chưa có đường vào.
- Kiểm soát: E2E kiểm URL công khai bị chặn và người thứ ba nhận 404; Supabase MCP xác nhận bucket riêng tư và RLS.

### Giữ bật xác nhận email của Supabase

- Giải thích: Đăng ký thật phải bấm liên kết trong thư; tài khoản demo do seed tạo sẵn ở trạng thái đã xác nhận nên vẫn thử nhanh được.
- Quyết định cuối: Chủ dự án chọn giữ bật.
- Hệ quả đã biết: Gửi mail thật phụ thuộc cấu hình SMTP của Supabase, chưa kiểm hết.

## 4. So sánh hai AI: Claude và Google Stitch

- Task so sánh: Thiết kế UI/mockup cho các màn hình MVP của UniFound.
- Bằng chứng: `assets/claude_ui_mockups/` và `assets/stitch_ui_mockups/`.
- Lưu ý công bằng: Hai bên không cùng điều kiện. Claude được hỗ trợ skill/MCP (Playwright MCP, `taste-skill`, `impeccable`) và `DESIGN.md` nền Airbnb nên tự kiểm tra được; Stitch chỉ sinh giao diện từ prompt. Kết luận chỉ cho task này.

| Tiêu chí | Claude (Claude Code + skill/MCP) | Google Stitch |
|---|---|---|
| Mức đáp ứng yêu cầu | 6 màn hình (feed, đăng tin, chi tiết, gợi ý, tin của tôi, đăng nhập) + trang mục lục; chuyển được trạng thái loading/empty/lỗi/vai trò | 5 màn hình (feed, tạo báo cáo, chi tiết/claim, trùng khớp, báo cáo của tôi) + modal duyệt yêu cầu; không có màn đăng nhập |
| UI/UX hoặc chất lượng đầu ra | Nhận diện thương hiệu có tài liệu và lý do, tương phản đã kiểm, Lost/Found phân biệt bằng icon + chữ; nhóm đánh giá dễ nhìn nhất | Một khối giao diện đầy đủ và nhiều chi tiết, nhưng nhóm đánh giá render dư thừa quá nhiều; bảng màu teal + cam riêng, không có tài liệu lý do |
| Code dễ đọc | HTML tĩnh tách riêng từng màn, token trong `uf.css` (736 dòng), `uf.js` (255 dòng) | Một file `code.html` 1.798 dòng gồm cả 5 màn, Tailwind qua CDN, cấu hình màu inline, 11 ảnh tải từ máy chủ ngoài |
| Responsive | Có điểm ngắt riêng cho laptop/tablet/điện thoại; có ảnh chụp mobile của feed, gợi ý, tin của tôi, lỗi nhập liệu | Dùng lớp breakpoint của Tailwind (`sm/md/lg`); nhóm chưa chụp màn hình mobile để đối chiếu |
| Lỗi / số lần sửa | Hai lỗi bố cục do AI tạo ra (thẻ gợi ý chồng chữ, icon bị đẩy xuống dòng), phát hiện bằng Playwright MCP và sửa trong cùng phiên | Chưa kiểm thử lỗi bằng trình duyệt; nhóm không chọn làm chuẩn |
| Công cụ hỗ trợ | Playwright MCP, taste-skill, impeccable, `DESIGN.md` | Không có skill/MCP kèm theo |

- Kết luận theo độ phù hợp với task: Claude phù hợp hơn cho đồ án này vì đầu ra dễ chuyển thành code (token rõ, từng màn tách riêng) và có vòng tự kiểm bằng trình duyệt. Stitch nhanh để có một bản nhìn đầy đủ nhưng đầu ra gộp một file, phụ thuộc tài nguyên ngoài và cần dọn nhiều. Chưa đủ cơ sở kết luận công cụ nào tốt hơn mọi mặt.
- Đề xuất dọn `claude_ui_mockups/` (chờ nhóm trưởng duyệt, chưa thực hiện):
  - Sửa liên kết hỏng trong `index.html` (trỏ `../../07_brand_identity.md`, file thật là `../../brand_identity.md`) và comment đầu `assets/uf.css`.
  - Bổ sung ảnh chụp còn thiếu: màn đăng nhập mobile, đăng tin bản desktop (ảnh lỗi nhập liệu desktop đã bỏ ở giai đoạn thiết kế, chỉ còn bản mobile), chi tiết tin của chủ tin trên mobile.
  - Không cần xóa file nào: mockup là tài liệu tham chiếu thiết kế; ba file logo SVG đang được `brand_identity.md` tham chiếu.

## 5. Quy tắc

- Không đưa secret hoặc dữ liệu cá nhân nhạy cảm vào prompt/repository.
- Review code/tài liệu do AI tạo trước khi merge.
- Với output quan trọng, ghi rõ Accepted/Modified/Rejected và lý do.
- Verification phải nêu phương pháp và bằng chứng, không chỉ ghi "đã kiểm tra".
- Câu hỏi cú pháp, dịch thuật hoặc sửa chính tả không đưa vào log chọn lọc.
- Ghi log ngay khi làm từng task; cuối Sprint, Team Lead chọn log tốt nhất chép vào tài liệu này.
