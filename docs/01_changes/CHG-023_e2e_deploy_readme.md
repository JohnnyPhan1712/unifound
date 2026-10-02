# CHG-023: E2E golden path, rà soát UI, deploy Vercel và README

- ID: `CHG-023`
- Trạng thái: `waiting_for_integration`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Dương Đăng Khang`
- Dependency: `CHG-014` → `CHG-022`
- File/module dự kiến sửa/tạo: `tests/e2e/*.spec.ts`, `playwright.config.ts`, `README.md`, các component UI cần polish, cấu hình Vercel/env (không commit giá trị thật)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

## Kết quả người dùng

Luồng chính chạy trọn vẹn và có test tự động: đăng nhập → đăng tin → gửi yêu cầu → chấp nhận → hai bên xác nhận → Đã trả. Ứng dụng có URL demo thật trên Vercel, README hướng dẫn cài/chạy, giao diện nhất quán trên desktop và mobile.

## Phạm vi

### Bao gồm

- Playwright E2E golden path (2 tài khoản demo) và ít nhất một edge case (claim sai quyền hoặc email ngoài trường).
- Rà soát UI toàn app theo `DESIGN.md`: icon, spacing, nhất quán component, loading/empty/error/validation ở mọi màn hình quan trọng, mobile; kiểm bằng Playwright MCP.
- Rà soát nhanh NFR: thông tin nhạy cảm (đáp án, liên hệ) không lộ, tải feed < 3 giây, form có label.
- Deploy Vercel, cấu hình env đúng tên ở `03_development.md` mục 4; ghi URL demo thật (không tạo URL giả).
- README: giới thiệu, stack, cài/chạy, env, scripts, test, URL demo, tài khoản demo (không PII thật).
- Ghi lại ít nhất một bug đã phát hiện, sửa và xác minh trong phần Bug của CHG (nếu có thật).

### Các lưu ý

- Không thêm tính năng mới; lỗi phát hiện ở CHG trước được sửa trong CHG này hoặc ghi lại để quay lại CHG gốc.
- Không sửa `docs/02_reports/` trừ khi được yêu cầu; slide/Product Brief không thuộc CHG này.
- Chỉ ghi kết quả test/deploy đã chạy thật.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/conventions.md`, `DESIGN.md`
- `docs/02_reports/01_overview.md` (mục 6, 7), `docs/02_reports/03_development.md` (mục 7, 8)
- Các CHG-014 → CHG-022 (acceptance criteria, bug ghi nhận)

## Acceptance criteria

- [ ] `npm run test:e2e` chạy golden path xanh trên môi trường dev/demo.
- [ ] Vitest, typecheck, build đều pass.
- [ ] Rà soát UI: không còn màn hình quan trọng thiếu loading/empty/error; mobile không vỡ layout.
- [ ] Ứng dụng deploy thành công, mở được bằng URL thật và chạy lại golden path thủ công.
- [ ] README đủ để người mới cài và chạy được.
- [ ] Không secret/PII thật trong repo, log, ảnh chụp.

## Ghi chú triển khai

- **E2E Playwright** (`tests/e2e/`):
  - `golden-path.spec.ts`: đăng nhập → đăng tin Nhặt được kèm ảnh → khách xem chi tiết không thấy đáp án → người mất gửi yêu cầu → người nhặt chấp nhận và đặt lịch hẹn → hai bên xác nhận → tin "Đã trả", không nhận yêu cầu mới.
  - `edge-cases.spec.ts`: email ngoài trường bị từ chối; khách bị chuyển về đăng nhập; tự gửi yêu cầu vào tin mình bị chặn; người thứ ba mở URL yêu cầu nhận 404 và không thấy câu trả lời.
  - Test dùng tài khoản demo của seed (`SEED_DEMO_PASSWORD`). Mỗi lần chạy tạo thêm vài tin thử trên DB dev.
- **`playwright.config.ts`:**
  - nạp `.env.local`;
  - dùng `localhost` (sửa lỗi `127.0.0.1` ghi ở CHG-015);
  - chạy tuần tự, mỗi test tối đa 180 giây;
  - `E2E_BASE_URL` để chạy lại golden path trên bản deploy.
- **Rà soát UI:**
  - Detector của impeccable còn 2 cảnh báo advisory, đều có chủ ý: segmented bo góc 0,9rem (DESIGN.md mục Shapes có ghi), cỡ chữ logo.
  - Đã sửa: màu placeholder dùng token `muted`, cỡ chữ ô thống kê và câu hỏi xác minh theo thang h2/h3.
  - Quét 17 màn hình trên iPhone 13 (khách, sinh viên, admin): không tràn ngang, mọi ô nhập có nhãn, không có nút nhỏ hơn 34px, không có lỗi JS.
- **README** viết lại: giới thiệu, stack, cài/chạy, biến môi trường, tài khoản demo (hư cấu), scripts, test, cấu trúc thư mục. URL demo để `TBD` vì chưa deploy.
- **Đã xóa `src/smoke.test.ts`** (test giữ chỗ, không còn cần vì đã có 66 unit test thật).
- **Deploy Vercel: chưa làm.** Máy chưa đăng nhập Vercel CLI (`vercel whoami` → Logged out). Deploy cần chủ dự án:
  - đăng nhập / chọn team;
  - nhập biến môi trường bí mật lên Vercel;
  - thêm URL Vercel vào Supabase Auth (Site URL / Redirect URLs) để link xác nhận email trỏ đúng.
  
  Không tạo URL giả.

### Cập nhật 2026-10-01: kiểm tra lại sau khi làm lại UI (CHG-014)

- Giao diện được làm lại theo mockup (xem CHG-014, AI-3), nên các bằng chứng UI cũ ở TC-023-03 không còn dùng được. Đã chạy lại:
  - `impeccable detect` trên `src/app` và `src/components`: 0 cảnh báo (sau khi khai báo thêm bậc chữ và màu phụ vào `DESIGN.md`).
  - Quét 17 màn hình (khách, sinh viên, admin) trên iPhone 13 bằng bản build production: không tràn ngang, mọi ô nhập có nhãn; nút chữ (Sửa/Đóng/Xóa) nâng tối thiểu lên 36px.
  - E2E 4/4 trên bản build production (`E2E_BASE_URL`). Chạy trên dev server bị lỗi tiến trình con của Next ("Jest worker … exceeding retry limit") do máy thiếu bộ nhớ, không phải lỗi ứng dụng.
  - Unit test 68/68, typecheck, build pass.
- E2E đã sửa theo UI mới: ô chọn danh mục dạng ô, form gửi yêu cầu nằm trong trang chi tiết, nút hiện/ẩn mật khẩu trùng nhãn "Mật khẩu".

### Phụ thuộc còn chờ

- Đang chờ: chủ dự án đăng nhập Vercel và cho phép deploy (đây là thao tác công khai ra ngoài).
- Đã hoàn thành: E2E golden path và edge case, rà soát UI, README, kiểm tra NFR.
- Chưa thể tích hợp: TC-023-05 (golden path trên URL Vercel) và URL demo trong README.
- Điều kiện tiếp tục:
  1. Chạy `npx vercel login`.
  2. Đặt các biến `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `ALLOWED_EMAIL_DOMAINS` trên Vercel.
  3. Deploy.
  4. Chạy `E2E_BASE_URL=<url> npm run test:e2e`.

## AI Log

### AI-1 — E2E golden path và edge case

- Nhiệm vụ (Task): Viết Playwright E2E cho luồng chính và các ca sai quyền.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Playwright (thư viện; phiên này không có Playwright MCP).
- Đầu vào / Ngữ cảnh (Input/Context): `03_development.md` mục 7, `01_overview.md` mục 6–7, acceptance criteria CHG-014 → CHG-022.
- Kết quả AI (AI Output): `tests/e2e/{helpers,golden-path.spec,edge-cases.spec}.ts`, `playwright.config.ts`.
- Quyết định của nhóm (Human Decision): Accepted (2026-10-02: chủ dự án ủy quyền AI khảo sát và xác nhận; đã đối chiếu `02_requirements_design.md`, code và test hiện có).
- Kiểm tra / Xác minh (Verification):
  - Lần chạy đầu: 3/4 pass. Ca đăng ký fail do selector `getByLabel("Mật khẩu", { exact: true })` không khớp nhãn có dấu `*`; lỗi nằm ở test, không phải app.
  - Đã đổi sang regex → 4/4 pass (1,6 phút).
- Ứng viên đưa vào báo cáo: có

### AI-2 — Rà soát UI toàn app

- Nhiệm vụ (Task): Rà UI theo DESIGN.md, mobile, loading/empty/error, nhãn form.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), skill impeccable (`detect`), Playwright.
- Đầu vào / Ngữ cảnh (Input/Context): DESIGN.md, các màn S01–S13.
- Kết quả AI (AI Output): Detector báo 5 cảnh báo advisory, đã sửa 3. Quét mobile tìm ra 2 lỗi bố cục (BUG-1, BUG-2).
- Quyết định của nhóm (Human Decision): Accepted (2026-10-02: chủ dự án ủy quyền AI khảo sát và xác nhận; đã đối chiếu `02_requirements_design.md`, code và test hiện có).
- Kiểm tra / Xác minh (Verification): Chạy lại detector còn 2 cảnh báo có chủ ý; quét lại 17 màn hình đều đạt.
- Ứng viên đưa vào báo cáo: có

### AI-3 — Dọn dữ liệu test trên DB dev/demo

- Nhiệm vụ (Task): Xóa dữ liệu do test E2E và test tay tạo ra, giữ nguyên dữ liệu seed.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), Supabase MCP (`execute_sql`), Storage API qua `@supabase/supabase-js`.
- Đầu vào / Ngữ cảnh (Input/Context): Chủ dự án chọn phương án "xóa tin E2E, tin tay, tài khoản test"; liệt kê (SELECT) trước, chủ dự án duyệt danh sách rồi mới xóa.
- Kết quả AI (AI Output): Xóa 25 file ảnh qua Storage API (đăng nhập bằng từng tài khoản demo sở hữu thư mục); chủ dự án tự chạy SQL xóa 55 thông báo, báo cáo vi phạm trên tin seed, 18 tin (8 E2E + 10 tin tay) kèm 12 yêu cầu nhận, 9 gợi ý, và 2 tài khoản chưa xác nhận email; đặt lại tin seed "Quên bình nước giữ nhiệt" về `OPEN`.
- Quyết định của nhóm (Human Decision): Accepted (chủ dự án duyệt danh sách xóa ngày 2026-10-02).
- Kiểm tra / Xác minh (Verification): Đếm lại bằng SELECT: 8 tin (đều là seed), 0 claim/match/notification/flag/ảnh, `storage.objects` = 0; `npm run db:seed` chạy lại không tạo trùng (8 tin). Lưu ý: lệnh SQL xóa trong DB bị hệ thống phân quyền của Claude Code chặn nên do chủ dự án chạy. Còn 2 hồ sơ mồ côi trong `public.users` (của hai tài khoản test đã xóa, bảng không có khóa ngoại sang `auth.users`); lệnh xóa bị từ chối, chờ chủ dự án xử lý.
- Ứng viên đưa vào báo cáo: không

## Bug

### BUG-1 — Tab "Tin của tôi" bị cắt chữ trên điện thoại

- Biểu hiện: Trên iPhone 13, tab thứ ba hiện "Yêu cầu t…" và phải cuộn ngang mới thấy.
- Các bước tái hiện: Mở `/my?tab=received` ở viewport 390px.
- Kết quả mong đợi / thực tế: Mong đợi đọc được cả 3 tab / thực tế tab cuối bị che.
- Nguyên nhân gốc: Nhãn dài ("Yêu cầu tôi nhận được") trong thanh segmented một hàng.
- Fix: Nhãn ngắn trên màn hẹp ("Đã gửi", "Nhận được"), giữ nhãn đầy đủ từ `sm` trở lên (`src/app/my/page.tsx`).
- Verification: Quét mobile lại, không tràn.
- Commit/issue: `e8cdd04`.

### BUG-2 — Bảng tin trên điện thoại quá dài

- Biểu hiện: Mỗi thẻ tin chiếm gần cả màn hình vì ảnh tỉ lệ 4:3 ở 1 cột.
- Các bước tái hiện: Mở `/` ở viewport 390px.
- Kết quả mong đợi / thực tế: Mong đợi lướt được nhiều tin / thực tế 5 tin dài khoảng 8.500px.
- Nguyên nhân gốc: Tỉ lệ ảnh thẻ dùng chung cho mọi breakpoint.
- Fix: Ảnh 16:9 trên điện thoại, 4:3 từ `sm` (`src/components/reports/report-card.tsx`).
- Verification: Ảnh chụp mobile sau khi sửa.
- Commit/issue: `e8cdd04`.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-023-01 | E2E golden path (đăng nhập → Đã trả) | Xanh | Pass (56,6 s) trên dev | Passed | `npm run test:e2e`, `playwright-report/` |
| TC-023-02 | E2E: email ngoài trường / claim sai quyền | Bị từ chối | Cả 3 ca pass (email ngoài trường, khách vào trang cần đăng nhập, claim sai quyền) | Passed | `tests/e2e/edge-cases.spec.ts` |
| TC-023-03 | Duyệt UI mobile toàn bộ màn hình chính (Playwright MCP) | Không vỡ layout | 17 màn hình (khách/sinh viên/admin) trên iPhone 13: không tràn ngang, đủ nhãn form, không lỗi JS; đã sửa BUG-1/2 | Passed | ảnh `023_m_*.png` (thư viện Playwright, không có Playwright MCP trong phiên) |
| TC-023-04 | Kiểm tra đáp án/liên hệ không lộ trên feed và chi tiết | Không lộ | Golden path kiểm HTML chi tiết không có đáp án; edge case kiểm người thứ ba không thấy câu trả lời; kết quả tương ứng ở TC-016-06, TC-019-08, TC-020-07 | Passed | E2E + CHG-016/019/020 |
| TC-023-05 | Chạy golden path trên URL Vercel | Thành công | Chưa deploy (Vercel CLI chưa đăng nhập, cần chủ dự án) | Pending | |
| TC-023-06 | Làm theo README trên máy sạch | Cài và chạy được | Mô phỏng máy sạch (2026-10-02): `git clone` bản commit `1250428` vào thư mục trống, Node 24.20.0 / npm 11.19.0, `npm ci`, chép `.env.local` (thay cho bước điền `.env.example`), `db:migrate` (chỉ có NOTICE "already exists, skipping"), `db:seed` (chạy lại không trùng), `typecheck`, `test` 68/68, `build`, `next start` → `/` và `/login` trả 200. Chưa chạy lại E2E (tránh thêm tin thử); chưa thử trên máy vật lý khác | Passed (mô phỏng) | log lệnh phiên 2026-10-02 |
| TC-023-07 | NFR: tải feed < 3 giây | < 3 giây | Bản build: 0,56–0,6 s (xem TC-016-07) | Passed | CHG-016 |
| TC-023-08 | Vitest + typecheck + build | Pass | 66/66 unit test, typecheck pass, build pass (17 route) | Passed | log lệnh |

## Hướng dẫn tự chạy

```
npm ci
npm run typecheck
npm test
npm run build
npm run test:e2e
```

1. Chạy `npm run db:seed` để có dữ liệu demo.
2. Chạy `npm run test:e2e` và xem report.
3. Mở URL Vercel, chạy lại luồng bằng hai tài khoản demo.

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- Lần đầu cài Chromium cho Playwright: `npx playwright install chromium`.
- E2E cần `SEED_DEMO_PASSWORD` trong `.env.local`; mỗi lần chạy tạo thêm vài tin thử trên DB đang trỏ tới.
- Chạy lại golden path trên bản deploy: `E2E_BASE_URL=https://<url> npm run test:e2e` (PowerShell: `$env:E2E_BASE_URL='https://<url>'; npm run test:e2e`).
