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
| Supabase skills và Supabase MCP | Skill + MCP | Tra cứu Auth/RLS/Postgres, đọc cấu trúc bảng, kiểm tra dữ liệu bằng truy vấn đọc | Giai đoạn làm lại |
| Playwright MCP | MCP kiểm thử UI | Duyệt và chụp màn hình để tự kiểm tra | Thiết kế mockup |
| Playwright (thư viện) | Thư viện test | E2E và quét UI khi phiên làm việc không có Playwright MCP | Giai đoạn làm lại |

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

### AI-LOG-004 — Dọn code cũ và xử lý lỗi môi trường

- Nguồn: giai đoạn dọn code cũ, Phan Ngọc Đức Huy.
- AI Tool: Claude Code (Sonnet 5.5), ponytail.
- Task: Xóa code của các task bị từ chối, giữ hạ tầng DB, rồi làm `typecheck`/`build` pass.
- AI Output: `git rm` 46 file theo 7 nhóm (người dùng duyệt từng nhóm), viết lại trang placeholder. Sau đó `typecheck` lỗi do `next@16.3.5` cài thiếu `types.d.ts`; AI đề xuất nâng `next` lên 16.3.8 và xóa `.next/dev`.
- Human Decision: Xóa code: **Accepted** (2026-10-02: nhóm trưởng xác nhận; đã duyệt từng nhóm xóa trong phiên). Nâng `next` và xóa `.next/dev`: **Accepted** (người dùng chọn phương án).
- Verification: `typecheck`, `test`, `build` pass; grep không còn import tới module đã xóa.

### AI-LOG-005 — Schema theo ERD và lớp xác thực

- Nguồn: giai đoạn nền tảng, Trần Minh Chiến.
- AI Tool: Claude Code (Opus 5.5), Supabase MCP, ponytail.
- Task: Viết lại `src/db/schema.ts` theo ERD (10 bảng), dựng Supabase Auth với `@supabase/ssr`, kiểm tra tên miền email phía server, `proxy.ts`, trang đăng nhập/đăng ký/hồ sơ.
- Human Decision: **Accepted** (ủy quyền 2026-10-02). Người dùng đã chọn: cho phép drop dữ liệu cũ, giữ bật xác nhận email, tên miền `gm.uit.edu.vn,uit.edu.vn`.
- Verification: `db:migrate` thành công; Supabase MCP xác nhận 10 bảng đều bật RLS; Vitest kiểm tra tên miền (từ chối cả đuôi giả `uit.edu.vn.evil.com`) và Zod; Playwright kiểm tra luồng đăng ký/đăng nhập thật.

### AI-LOG-006 — Làm lại giao diện theo mockup khi `DESIGN.md` và mockup mâu thuẫn

- Nguồn: giai đoạn nền tảng, Trần Minh Chiến.
- AI Tool: Claude Code (Opus 5.5, Sonnet 5.5), skill `impeccable` (`detect`), Playwright.
- Task: Dựng nền UI; sau khi người dùng chỉ ra giao diện chưa giống mockup thì đối chiếu và làm lại.
- AI Output: Bản đầu (AI-2) theo `DESIGN.md` cũ (màu teal). AI nhận ra hai nguồn mâu thuẫn (`DESIGN.md` teal và `brand_identity.md` + mockup xanh dương), nêu cho chủ dự án chọn; chủ dự án chọn theo mockup, làm lại toàn bộ màn hình và cập nhật token trong `DESIGN.md`.
- Human Decision: AI-2 **Modified** (bị thay bằng AI-3); AI-3 **Accepted** phần chọn hướng, phần kết quả Accepted theo ủy quyền 2026-10-02.
- Verification: Ảnh chụp desktop 1440px và iPhone 13 so với ảnh trong mockup; `impeccable detect` còn 0 cảnh báo; E2E 4/4 trên bản build; quét 17 màn hình mobile.

### AI-LOG-007 — State machine và transaction khi chấp nhận yêu cầu nhận đồ

- Nguồn: giai đoạn luồng claim, Trần Minh Chiến.
- AI Tool: Claude Code (Opus 5.5), Supabase MCP, ponytail.
- Task: Luật gửi yêu cầu, state machine, transaction duyệt yêu cầu bảo đảm một tin chỉ có tối đa một yêu cầu `ACCEPTED`.
- Human Decision: **Accepted** (ủy quyền 2026-10-02). Hai đề xuất của AI được giữ: yêu cầu bị đóng dùng trạng thái `REJECTED`; ADMIN không duyệt thay chủ tin.
- Verification: Vitest (state machine, luật gửi, hết hạn); Playwright với 4 tài khoản, có ca hai trình duyệt bấm "Chấp nhận" cùng lúc cho hai yêu cầu của cùng một tin; Supabase MCP xác nhận chỉ còn một `ACCEPTED`.

### AI-LOG-008 — E2E golden path và edge case

- Nguồn: giai đoạn kiểm thử và triển khai, Dương Đăng Khang.
- AI Tool: Claude Code (Opus 5.5), thư viện Playwright.
- Task: Viết Playwright E2E cho luồng đăng nhập → đăng tin → gửi yêu cầu → chấp nhận → hai bên xác nhận → Đã trả, và các ca sai quyền.
- Human Decision: **Accepted** (ủy quyền 2026-10-02).
- Verification: Lần chạy đầu 3/4 pass; ca đăng ký fail vì selector `getByLabel("Mật khẩu", { exact: true })` không khớp nhãn có dấu `*` — lỗi ở test chứ không ở app. Đổi sang regex → 4/4 pass.

### AI-LOG-009 — Quên mật khẩu (PKCE) và thêm tên miền trường

- Nguồn: giai đoạn bổ sung, Phan Ngọc Đức Huy.
- AI Tool: Claude Code (Sonnet 5.5), Supabase MCP (`search_docs`, SELECT), Playwright, ponytail.
- Task: Thêm `/forgot-password`, `/reset-password`, `/auth/callback`; thêm 5 tên miền và 4 trường vào seed.
- AI Output: Dùng `redirectTo` về `/auth/callback` (PKCE, `exchangeCodeForSession`) thay vì sửa mail template để khỏi đổi cấu hình Supabase; thông báo giống nhau dù email có tài khoản hay không (không lộ email đã đăng ký); chặn tài khoản `locked`.
- Human Decision: **Accepted** (2026-10-02: nhóm trưởng xác nhận).
- Verification: `lint`, `typecheck`, `test` 72/72, `build`; Playwright cho các ca lỗi và mobile. Chưa kiểm: gửi mail thật và bấm liên kết, tài khoản `locked`, đăng ký thật bằng email các trường mới.

### AI-LOG-010 — Dọn dữ liệu test trên database dev/demo

- Nguồn: giai đoạn kiểm thử và triển khai, Dương Đăng Khang.
- AI Tool: Claude Code (Sonnet 5.5), Supabase MCP (`execute_sql` chỉ SELECT), Storage API.
- Task: Xóa dữ liệu do E2E và test tay tạo ra, giữ dữ liệu seed.
- AI Output: AI liệt kê (SELECT) dữ liệu cần xóa; chủ dự án duyệt danh sách; AI xóa 25 file ảnh qua Storage API; chủ dự án tự chạy SQL xóa (vì lệnh xóa bị hệ thống phân quyền của Claude Code chặn).
- Human Decision: **Accepted** (chủ dự án duyệt danh sách xóa ngày 2026-10-02).
- Verification: Đếm lại bằng SELECT: còn 8 tin seed, 0 yêu cầu/gợi ý/thông báo/báo cáo/ảnh; `db:seed` chạy lại không tạo trùng. Còn 2 hồ sơ mồ côi trong `public.users` chờ chủ dự án xử lý.

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
