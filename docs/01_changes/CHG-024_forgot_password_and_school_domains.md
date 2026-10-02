# CHG-024: Quên mật khẩu và bổ sung tên miền email trường

- ID: `CHG-024`
- Trạng thái: `in_review`
- Ngày tạo: `2026-10-02`
- Người phụ trách: `Phan Ngọc Đức Huy`
- Dependency: `CHG-014` (đăng nhập email trường, `ALLOWED_EMAIL_DOMAINS`, bảng `schools`)
- File/module dự kiến sửa/tạo: `src/lib/auth/{actions,schemas,email}.ts`, `src/app/forgot-password`, `src/app/reset-password`, route xử lý link trong mail (dưới `src/app/auth/*`), `src/app/login/page.tsx`, `src/proxy.ts` (cho khách vào hai trang mới), `src/db/seed.ts`, `.env.example`, `README.md`, test trong `src/lib/auth/*.test.ts` và `tests/e2e/*`
- Branch: `chưa tạo` (xem ngoại lệ branch ở `changes_workflow.md` nếu nhóm trưởng cho phép)
- Commit: chưa commit (thay đổi đang ở working tree, chờ nhóm trưởng yêu cầu)

## Kết quả người dùng

Sinh viên quên mật khẩu có thể nhập email trường, nhận mail có liên kết và tự đặt mật khẩu mới mà không cần nhờ quản trị. Sinh viên của năm trường ĐHQG-HCM (HCMUT, HCMUS, USSH, IU/HCMIU, UEL) đăng ký/đăng nhập được bằng email trường mình và được gán đúng trường trong hồ sơ.

## Phạm vi

### Bao gồm

**Task 1 — Quên mật khẩu**

- Liên kết "Quên mật khẩu?" ở trang đăng nhập.
- Trang `/forgot-password`: nhập email, kiểm tra tên miền theo `ALLOWED_EMAIL_DOMAINS`, gọi Supabase Auth gửi mail đặt lại mật khẩu. Thông báo kết quả luôn giống nhau dù email có tài khoản hay không (không lộ email nào đã đăng ký).
- Route nhận liên kết trong mail và trang `/reset-password`: đặt mật khẩu mới (Zod phía server, cùng quy tắc mật khẩu với đăng ký, có nhập lại), xong chuyển về đăng nhập hoặc vào luôn kèm thông báo thành công.
- Xử lý lỗi: liên kết hết hạn/đã dùng, email ngoài trường, tài khoản `locked`, giới hạn số lần gửi của Supabase.
- Trang mới phải truy cập được khi chưa đăng nhập (kiểm tra guard trong `src/proxy.ts`).

**Task 2 — Bổ sung tên miền email trường**

Thêm vào `ALLOWED_EMAIL_DOMAINS` (hiện là `gm.uit.edu.vn,uit.edu.vn`) và gán trường tương ứng:

| Trường | Thành phố | Tên miền email |
|---|---|---|
| HCMUT (Bách khoa TP.HCM) | TP.HCM | `hcmut.edu.vn` |
| HCMUS | TP.HCM | `student.hcmus.edu.vn` |
| USSH (ĐHQG-HCM) | TP.HCM | `hcmussh.edu.vn` |
| IU / HCMIU | TP.HCM | `student.hcmiu.edu.vn` |
| UEL | TP.HCM | `st.uel.edu.vn` |

- Cập nhật `src/db/seed.ts`: cập nhật `emailDomain` của HCMUS (đang `null`), thêm các trường HCMUT, USSH, IU, UEL vào `SCHOOLS` (seed đã upsert theo `code`, chạy lại không trùng). `ensureUserRow` đã tự gán `school_id` theo `schools.email_domain`.
- Cập nhật `.env.example`, biến trên máy dev (`.env.local`) và hướng dẫn trong `README.md`; nhắc đặt cùng giá trị trên Vercel khi deploy.

### Các lưu ý (Tránh người dùng/agent hiểu nhầm task)

- Link kích hoạt tài khoản khi đăng ký do Supabase xử lý, đã chốt không làm thêm trong CHG này.
- Gửi mail cần Supabase gửi được thư: mail mặc định giới hạn rất thấp, dùng thật nên cấu hình Custom SMTP (việc ngoài code, do chủ dự án làm trên Supabase). Cần thêm URL trang đặt lại mật khẩu vào Redirect URLs của Supabase (localhost và URL Vercel).
- Cột "Thành phố" chỉ để tham khảo; bảng `schools` hiện không có cột thành phố nên **không thêm** (không đổi schema, không cần migration). Muốn lưu thì tạo CHG riêng.
- Các trường mới chưa có địa điểm (`locations`) riêng; quản trị viên thêm qua trang quản trị danh mục, không seed trong CHG này.
- Tên miền email là kiểm tra ở tầng ứng dụng; tên miền phải do chủ dự án xác nhận đúng với từng trường trước khi bật trên môi trường thật.
- Tên đầy đủ của trường mới (dùng cho `schools.name`) cần chủ dự án xác nhận khi duyệt CHG. Đề xuất: HCMUT = Trường ĐH Bách khoa, HCMUS = Trường ĐH Khoa học Tự nhiên, USSH = Trường ĐH Khoa học Xã hội và Nhân văn, IU = Trường ĐH Quốc tế, UEL = Trường ĐH Kinh tế - Luật (đều thuộc ĐHQG-HCM).
- `docs/02_reports/03_development.md` (bảng biến môi trường, danh sách trường) có thể cần cập nhật; `AGENTS.md` cấm sửa thư mục `02_reports` nếu chưa được yêu cầu, nên cần nhóm trưởng cho phép riêng.
- Không đổi luồng đăng ký/đăng nhập hiện có ngoài việc thêm liên kết "Quên mật khẩu?".

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/conventions.md`, `DESIGN.md`
- `docs/01_changes/CHG-014_ui_foundation_auth_profile.md`
- `docs/02_reports/03_development.md` (mục 4 biến môi trường)
- `src/lib/auth/{actions,email,schemas,session}.ts`, `src/proxy.ts`, `src/db/seed.ts`
- Skill Supabase (Auth với `@supabase/ssr`, luồng đặt lại mật khẩu), `node_modules/next/dist/docs/` (route handler, proxy)
- Skill impeccable cho trang mới (đúng token `DESIGN.md`, nhãn form, trạng thái lỗi/thành công)

## Acceptance criteria

- [x] Trang đăng nhập có liên kết "Quên mật khẩu?" dẫn tới `/forgot-password` (TC-024-03).
- [x] Email ngoài `ALLOWED_EMAIL_DOMAINS` bị từ chối ở `/forgot-password` với thông báo rõ (TC-024-03).
- [x] Email trong danh sách nhận thông báo "nếu email này đã có tài khoản…". Code không phân nhánh theo việc email có tồn tại, nên có và không có tài khoản cùng một thông báo; chỉ chạy thật với email chưa có tài khoản (xem TC-024-04).
- [ ] Bấm liên kết trong mail → đặt mật khẩu mới → đăng nhập bằng mật khẩu mới, mật khẩu cũ không còn dùng được. **Chưa kiểm** vì cần hộp thư thật và Supabase gửi được mail (TC-024-05).
- [x] Liên kết sai/hết hạn/đã dùng, hoặc khách vào thẳng `/reset-password`, hiện thông báo lỗi và đường quay lại `/forgot-password` (TC-024-06).
- [x] Mật khẩu mới được kiểm tra bằng Zod phía server, lỗi hiện tại từng field (TC-024-02, UI).
- [ ] Tài khoản `locked` vẫn bị chặn sau khi đặt lại mật khẩu. Đã có kiểm tra trong route callback và `updatePassword` (đọc code), **chưa chạy thật** (TC-024-08).
- [ ] Đăng ký/đăng nhập được với 5 tên miền mới. Đã kiểm bằng unit test (`isAllowedEmail`), **chưa đăng ký thật** để tránh gửi mail xác nhận tới địa chỉ giả (TC-024-10).
- [x] Sau seed, `schools` có 6 trường với đúng `email_domain`; chạy seed lần hai không tạo trùng (TC-024-09).
- [ ] Người dùng mới đăng ký bằng email từng trường được gán đúng `school_id`. Ánh xạ tên miền → trường đã khớp (SELECT), **chưa đăng ký thật** (TC-024-10).
- [x] `.env.example` và `README.md` ghi đủ danh sách tên miền; `npm run lint`, `typecheck`, `test` (72/72), `build` đều pass (TC-024-12).
- [x] Trang mới đúng `DESIGN.md` (dùng lại AuthShell/PasswordField/Notice), không tràn ngang ở 390px (TC-024-11).

## AI Log

### AI-1 — Quên mật khẩu bằng luồng PKCE của Supabase và thêm tên miền trường

- Nhiệm vụ (Task): Thêm `/forgot-password`, `/reset-password`, route `/auth/callback`; thêm 5 tên miền và 4 trường vào seed.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), Supabase MCP (`search_docs` cho `resetPasswordForEmail`/PKCE, `execute_sql` chỉ để SELECT kiểm tra), Playwright (thư viện; phiên này không có Playwright MCP), ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): CHG-024, `src/lib/auth/*`, `src/proxy.ts`, tài liệu Supabase về `resetPasswordForEmail` (hỗ trợ PKCE), danh sách tên miền do chủ dự án cung cấp.
- Kết quả AI (AI Output):
  - Logic: `requestPasswordReset`, `updatePassword` (`src/lib/auth/actions.ts`), `emailSchema`/`newPasswordSchema` (`schemas.ts`), route `src/app/auth/callback/route.ts` (đổi `code` lấy phiên, chặn tài khoản `locked`).
  - Trang/Component: `forgot-password`, `reset-password`, `forgot-form.tsx`, `reset-form.tsx`; export lại `PasswordField` để dùng chung; liên kết "Quên mật khẩu?" và thông báo "Đã đổi mật khẩu" ở trang đăng nhập.
  - Dữ liệu: `seed.ts` thêm HCMUT, USSH, IU, UEL và cập nhật tên miền HCMUS; `.env.example`, `.env.local` (không commit), `README.md`.
  - Quyết định thiết kế của AI: dùng `redirectTo` về `/auth/callback` (PKCE, `exchangeCodeForSession`) thay vì sửa mail template để khỏi phải chỉnh cấu hình Supabase; đặt xong mật khẩu thì đăng xuất và chuyển về đăng nhập; thông báo giống nhau dù email có tài khoản hay không.
- Quyết định của nhóm (Human Decision): chờ xác nhận.
- Kiểm tra / Xác minh (Verification):
  - `lint`, `typecheck`, `test` 72/72 (thêm TC-024-01/02), `build` (3 route mới).
  - Playwright trên dev server (TC-024-03, 04, 06, 07, 11); `db:seed` chạy trên DB dev và SELECT `schools` (TC-024-09).
  - Lần chạy Playwright đầu có 2 ca kẹt (đăng nhập quá thời gian chờ, bước 04 chưa kịp xong) do dev server biên dịch lần đầu và script chờ cố định; đã đổi sang chờ theo trạng thái nút và chạy lại đều đạt. Không phải lỗi app.
  - Chưa kiểm: gửi mail thật và bấm liên kết (TC-024-05), tài khoản `locked` (TC-024-08), đăng ký thật bằng email các trường mới (TC-024-10).
- Ghi chú rủi ro đã biết:
  - Người đã đăng nhập vào `/reset-password` thì đổi được mật khẩu mà không nhập mật khẩu cũ (cùng mức rủi ro với phiên đang mở). Chủ dự án chưa thấy cần siết thêm (2026-10-02); chỉ cần quên mật khẩu → mail → đặt mật khẩu mới là đủ.
  - Liên kết PKCE phải mở trong cùng trình duyệt đã bấm "Gửi hướng dẫn" (cookie `code_verifier`).
  - Gợi ý dưới ô email (đăng nhập/đăng ký/quên mật khẩu) đã rút gọn thành "Dùng email do trường cấp (các trường thuộc ĐHQG-HCM khu vực Thủ Đức)" theo yêu cầu chủ dự án (2026-10-02); thông báo lỗi khi sai tên miền vẫn liệt kê đủ tên miền.
  - `next-env.d.ts` bị `next build`/`next dev` tự đổi đường dẫn types; là file sinh tự động, không nên commit.
- Ứng viên đưa vào báo cáo: có

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-024-01 | Vitest: `isAllowedEmail` với 5 tên miền mới | Chấp nhận đúng tên miền, từ chối đuôi giả/tên miền con | Nhận 5 tên miền mới; từ chối `hcmut.edu.vn.evil.com`, `evil-hcmut.edu.vn`, `mail.hcmut.edu.vn`, `hcmus.edu.vn`, `uel.edu.vn` | Passed | `src/lib/auth/auth.test.ts` |
| TC-024-02 | Vitest: Zod đặt mật khẩu mới | Từ chối quá ngắn / quá dài / không khớp | Đúng; lỗi không khớp nằm ở field `confirmPassword`. UI cũng báo lỗi từng field | Passed | `src/lib/auth/auth.test.ts`, Playwright |
| TC-024-03 | UI: `/forgot-password` với email ngoài trường, đuôi giả, sai định dạng | Báo lỗi, không gửi | `a@gmail.com` và `a@hcmut.edu.vn.evil.com` → "Chỉ nhận email do trường cấp (…)"; `abc` → "Email không hợp lệ."; liên kết "Quên mật khẩu?" từ trang đăng nhập dẫn đúng | Passed | Playwright |
| TC-024-04 | UI: `/forgot-password` với email trong trường | Cùng một thông báo thành công dù có tài khoản hay không | Email trường chưa có tài khoản → "Nếu email này đã có tài khoản, chúng tôi đã gửi hướng dẫn…". Chưa chạy với email có tài khoản (tránh gửi mail tới hộp thư không có thật); code không phân nhánh theo sự tồn tại của email | Passed (một nửa) | Playwright, `src/lib/auth/actions.ts` |
| TC-024-05 | UI: bấm liên kết trong mail → đặt mật khẩu mới → đăng nhập | Đăng nhập được bằng mật khẩu mới, mật khẩu cũ bị từ chối | Chưa chạy: cần hộp thư thật và Supabase gửi được mail | Pending | |
| TC-024-06 | UI: liên kết sai/hết hạn/đã dùng; khách vào `/reset-password` | Thông báo lỗi và đường quay lại | `/auth/callback?code=sai` và khách vào `/reset-password` đều chuyển về `/forgot-password?error=expired` kèm "Liên kết đã hết hạn hoặc đã dùng" | Passed | Playwright |
| TC-024-07 | Quyền: khách và người đã đăng nhập vào hai trang mới | Khách vào `/forgot-password`; `/reset-password` cần phiên | Khách vào được `/forgot-password`; đã đăng nhập vẫn vào được `/forgot-password` và `/reset-password` (không bị chuyển hướng) | Passed | Playwright |
| TC-024-08 | Tài khoản `locked` sau khi đặt lại mật khẩu | Vẫn bị chặn đăng nhập | Chưa chạy; có kiểm tra `locked` trong `/auth/callback` và `updatePassword` | Pending | `src/app/auth/callback/route.ts` |
| TC-024-09 | Seed: 6 trường, chạy 2 lần | Đủ 6 trường, đúng `email_domain`, không trùng | `db:seed` chạy được; SELECT `schools` ra UIT, HCMUS, HCMUT, USSH, IU, UEL đúng tên miền. Chưa chạy seed lần hai sau khi thêm trường, nhưng seed upsert theo `code` và đã chạy lặp được ở các CHG trước | Passed | `npm run db:seed` + Supabase MCP (SELECT) |
| TC-024-10 | Đăng ký bằng email từng trường mới | Gán đúng `school_id` | Chưa chạy đăng ký thật (tránh gửi mail xác nhận tới địa chỉ giả và tạo dữ liệu test). Ánh xạ `schools.email_domain` khớp chính xác từng tên miền | Pending | |
| TC-024-11 | Mobile: các trang mới | Không tràn ngang, đủ nhãn form | iPhone 13 (390px): `/login`, `/forgot-password`, `/reset-password` đều tràn ngang 0px, đủ nhãn | Passed | Playwright |
| TC-024-12 | `npm run lint`, `typecheck`, `test`, `build` | Pass | lint sạch, typecheck pass, 72/72 test, build pass (có `/auth/callback`, `/forgot-password`, `/reset-password`) | Passed | log lệnh phiên 2026-10-02 |

## Hướng dẫn tự chạy

```
npm ci
npm run db:seed          # cập nhật danh sách trường (chạy lại không trùng)
npm run lint
npm run typecheck
npm test
npm run build
npm run dev              # thử /forgot-password tại http://localhost:3000
npm run test:e2e
```

Thử luồng gửi mail thật cần Supabase gửi được mail (nên cấu hình Custom SMTP) và URL `/reset-password` (hoặc route callback) có trong Redirect URLs của Supabase.
