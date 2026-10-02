# CHG-026: Header (avatar + menu), popup xác thực, trợ giúp và footer

- ID: `CHG-026`
- Trạng thái: `done`
- Ngày tạo: `2026-10-03`
- Người phụ trách: `Nguyễn Thế Anh`
- Dependency: `CHG-024` (quên mật khẩu), `CHG-025` (token dark mode)
- File/module dự kiến sửa/tạo (thực tế thêm `src/lib/auth/auth-url.ts`, `src/lib/help-content.ts`, `src/components/ui/modal.tsx`, `src/components/layout/popover-menu.tsx`, `tests/e2e/header-help.spec.ts`; xóa `account-menu.tsx`): `src/components/layout/site-header.tsx`, `src/components/layout/user-avatar-button.tsx`, `src/components/layout/hammer-menu.tsx`, `src/components/layout/auth-modal.tsx`, `src/components/layout/post-button.tsx`, `src/components/layout/help-widget.tsx`, `src/components/layout/site-footer.tsx`, `src/app/layout.tsx`, `src/components/auth/password-field.tsx`, `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/forgot-password/page.tsx`, `src/proxy.ts`, `src/lib/auth/session.ts`, `src/lib/auth/actions.ts`, `tests/e2e/`
- Branch: `feat/chg-026` (bắt đầu 2026-10-03)

## Kết quả người dùng

Header gọn với hai nút riêng (avatar và menu), đăng nhập/đăng ký/quên mật khẩu diễn ra trong một popup ngay trên trang hiện tại, có trợ giúp nổi và chân trang đầy đủ thông tin.

## Phạm vi

### Bao gồm

- **T8. Header hai nút riêng:** thứ tự từ trái sang phải là `UserAvatarButton` rồi `HammerMenu` (nút menu nằm ngoài cùng bên phải); bỏ nút “Đăng nhập” rời. `HammerMenu` chỉ gồm chế độ Sáng/Tối, Đăng nhập/Đăng ký, Trợ giúp (không có đổi ngôn ngữ). Avatar: chưa đăng nhập thì mở popup đăng nhập, đã đăng nhập thì mở menu tài khoản và Đăng xuất; đọc được ở dark mode.
- **T9. Popup xác thực duy nhất (`AuthModal`):** 3 chế độ đăng nhập / đăng ký / quên mật khẩu; có liên kết “Quên mật khẩu?” và “Quay lại đăng nhập” về đúng popup; hiện lỗi từng trường, giữ lại email khi lỗi, thông báo thành công khi gửi mail. Nút “Đăng tin” khi chưa đăng nhập mở popup và sau đăng nhập về `/reports/new`. Các trang `/login`, `/register`, `/forgot-password` chỉ còn chuyển hướng (đã đăng nhập thì về `next`); `proxy.ts`, `session.ts`, `actions.ts` chuyển hướng về `/?auth=...`.
- **T10. Trợ giúp nổi (`HelpWidget`):** cố định ở góc màn hình, tự ẩn khi cuộn (`scrollY > 40`) và hiện lại khi về đầu trang; modal trung tâm hỗ trợ theo cấu trúc iLost Support Center (nhóm “Tôi bị mất đồ”, “Tôi nhặt được đồ”, bài viết xem chi tiết, thông tin liên hệ các điểm tiếp nhận); header xanh UniFound, nội dung 100% tiếng Việt.
- **T11. Footer và hydration:** `SiteFooter` 4 cột (giới thiệu, khám phá, khuôn viên liên kết, điểm tiếp nhận trực tiếp) gắn trong `layout.tsx`; thêm `suppressHydrationWarning` trên `<html>`/`<body>` nếu cảnh báo hydration do extension trình duyệt còn xuất hiện.

### Các lưu ý (Tránh hiểu nhầm)

- Không đổi schema hay migration.
- Không đổi logic server action Auth ngoài việc chuyển hướng về popup; giữ nguyên validation Zod và kiểm tra quyền.
- Thanh tìm kiếm và bộ lọc thuộc `CHG-025`, không làm ở đây.
- Test E2E đăng nhập phải cập nhật helper `loginAs` sang popup và chạy cả golden path (cần `SEED_DEMO_PASSWORD`).
- Giữ `DESIGN.md` và font Be Vietnam Pro.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`
- `docs/01_changes/CHG-014_ui_foundation_auth_profile.md`, `docs/01_changes/CHG-024_forgot_password_and_school_domains.md`
- `src/components/layout/site-header.tsx`, `src/lib/auth/actions.ts`, `src/lib/auth/session.ts`, `src/proxy.ts`, `src/app/auth/callback/route.ts`, `src/app/reset-password/page.tsx`
- Tham khảo nội dung trợ giúp: [iLost Support Center](https://support.ilost.co/en)

## Acceptance criteria

- [x] T8: Header có `UserAvatarButton` rồi `HammerMenu` theo thứ tự trái → phải; menu chỉ có Sáng/Tối, Đăng nhập/Đăng ký, Trợ giúp; không còn nút Đăng nhập rời. (Khi đã đăng nhập, menu ẩn Đăng nhập/Đăng ký vì vô nghĩa; Đăng xuất nằm ở menu avatar.)
- [x] T9: Đăng nhập, đăng ký, quên mật khẩu đều chạy trong popup; “Quay lại đăng nhập” về popup đăng nhập; “Đăng tin” khi chưa đăng nhập mở popup và đăng nhập xong về `/reports/new`; URL cũ `/login`, `/register`, `/forgot-password` vẫn chạy.
- [x] T10: Nút Trợ giúp nổi ẩn khi cuộn, hiện lại ở đầu trang; modal đúng bố cục, tiếng Việt hoàn toàn.
- [x] T11: Footer 4 cột hiển thị đủ nội dung và liên kết; không còn cảnh báo hydration (console không có error/warning khi duyệt desktop + mobile, sáng + tối).
- [x] Avatar, menu, popup, footer đọc được ở dark mode.
- [x] `npm run lint`, `npm run typecheck`, `npm test` (74 test), `npm run build` đều pass; toàn bộ E2E (20 test, kể cả golden path) pass.
- [ ] Kiểm tra giao diện bằng Playwright MCP: **chưa dùng Playwright MCP** (không có trong phiên làm việc). Đã thay bằng script `@playwright/test` chụp screenshot desktop 1280px + mobile 390/320px, sáng + tối (lưu ở thư mục tạm, không đưa vào repo). Chờ người dùng xem lại giao diện / chụp bằng Playwright MCP nếu cần.

## AI Log

### AI-1 — Thiết kế cơ chế popup xác thực và trợ giúp

- Nhiệm vụ (Task): chọn cách mở popup đăng nhập/đăng ký/quên mật khẩu và modal trợ giúp từ nhiều nơi (avatar, menu, nút Đăng tin, proxy, server action).
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), skill ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): CHG-026, `site-header.tsx`, `account-menu.tsx`, `actions.ts`, `session.ts`, `proxy.ts`, các trang `/login` `/register` `/forgot-password`.
- Kết quả AI (AI Output): trạng thái popup nằm trên URL (`?auth=login|register|forgot`, `?help=1`) thay vì React context; server chỉ cần `redirect(authUrl(...))`; popup dùng `<dialog>` gốc (focus trap, Esc, lớp nền miễn phí); không thêm dependency. Menu giữ luôn trong DOM (ẩn bằng `hidden`) để form Đăng xuất không bị gỡ trước khi submit.
- Quyết định của nhóm (Human Decision): chờ xác nhận.
- Kiểm tra / Xác minh (Verification): `tests/e2e/header-help.spec.ts` (8 test) + `edge-cases.spec.ts` cập nhật, toàn bộ 20 E2E pass; screenshot desktop/mobile sáng/tối.
- Ứng viên đưa vào báo cáo: có

### AI-2 — Soát nội dung trợ giúp với logic thật

- Nhiệm vụ (Task): viết bài trợ giúp (mất đồ / nhặt được) và danh sách điểm tiếp nhận.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5); tham khảo cấu trúc iLost Support Center.
- Đầu vào / Ngữ cảnh (Input/Context): `score.ts`, `rules.ts`, `handover.ts`.
- Kết quả AI (AI Output): bản nháp đầu mô tả gợi ý trùng khớp thiếu điều kiện (cùng danh mục, 14 ngày) và nói “đóng tin” khi một bên xác nhận “Đã trả”; AI tự đối chiếu mã nguồn và sửa lại thành cả hai bên cùng xác nhận. Danh sách điểm tiếp nhận chỉ dùng tên địa điểm có trong dữ liệu seed, không bịa số điện thoại/giờ làm việc.
- Quyết định của nhóm (Human Decision): chờ xác nhận. Cần người dùng xác nhận lại tên/ghi chú các điểm tiếp nhận (nội dung minh họa).
- Kiểm tra / Xác minh (Verification): đối chiếu thủ công với `src/lib/matching/score.ts` và `src/lib/claims/handover.ts`.
- Ứng viên đưa vào báo cáo: có

## Bug

### BUG-1 — Nút menu tràn khỏi màn hình 320px khi đã đăng nhập

- Biểu hiện: ở viewport 320px, header đã đăng nhập (logo + Đăng tin + chuông + avatar + menu) rộng hơn màn hình, nút menu bị cắt.
- Các bước tái hiện: đăng nhập, mở bảng tin ở 320px, kiểm tra `scrollWidth > innerWidth`.
- Kết quả mong đợi / thực tế: không tràn ngang / tràn ngang (`overflowX: true`).
- Nguyên nhân gốc: tách avatar và menu thành hai nút riêng làm header thêm ~90px so với nút ghép cũ.
- Fix: `Logo` nhận `textClass`; header ẩn chữ “UniFound” dưới 380px (giữ biểu tượng) và giảm khoảng cách giữa nút.
- Verification: script Playwright ở 320px: `overflowX: false`, screenshot đủ 4 nút.
- Commit/issue: chưa commit.

### Ghi nhận — test E2E chập chờn một lần

- Lần chạy đầy đủ đầu tiên, `edge-cases › claim sai quyền` fail một lần (trang `/reports/{id}/claim` hiện “Không tìm thấy trang”); chạy lại riêng và chạy lại toàn bộ đều pass. Chưa xác định nguyên nhân (nghi do dev server biên dịch lần đầu); không liên quan code đã đổi (trang claim không sửa).

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
| --- | --- | --- | --- | --- | --- |
| TC-026-01 | Thứ tự và nội dung nút header (T8) | Avatar rồi Hammer từ trái sang phải; menu chỉ có Sáng/Tối, Đăng nhập/Đăng ký, Trợ giúp | Avatar rồi Hammer; menu khách đúng 4 mục (Chế độ Tối, Đăng nhập, Đăng ký, Trợ giúp); không còn nút Đăng nhập rời | Passed | `tests/e2e/header-help.spec.ts` (test 1) |
| TC-026-02 | Avatar khi chưa/đã đăng nhập (T8) | Chưa đăng nhập mở popup; đã đăng nhập mở menu tài khoản + Đăng xuất | Khách: avatar mở popup; đã đăng nhập: menu tài khoản có Đăng xuất, menu hammer chỉ còn Chế độ Tối + Trợ giúp | Passed | `header-help.spec.ts` (test 1, 5) |
| TC-026-03 | Luồng popup đăng nhập ↔ đăng ký ↔ quên mật khẩu (T9) | Chuyển chế độ trong popup; “Quay lại đăng nhập” về đúng popup; có “Quên mật khẩu?” | Đăng nhập → Quên mật khẩu (lỗi giữ email) → Quay lại đăng nhập → Đăng ký trong cùng popup; Esc đóng | Passed | `header-help.spec.ts` (test 2) |
| TC-026-04 | “Đăng tin” khi chưa đăng nhập (T9) | Mở popup; đăng nhập xong về `/reports/new` | Khách bấm “Đăng tin” mở popup; đăng nhập xong về `/reports/new` | Passed | `header-help.spec.ts` (test 4) |
| TC-026-05 | URL cũ `/login`, `/register`, `/forgot-password` (T9) | Chuyển hướng mở đúng popup; đã đăng nhập thì về `next` | `/login?next=`, `/register`, `/forgot-password?error=expired` chuyển sang popup đúng chế độ (kèm thông báo hết hạn); `/reports/new` khi khách → `/?auth=login&next=…` | Passed | `header-help.spec.ts` (test 3), `edge-cases.spec.ts`. Nhánh “đã đăng nhập thì về `next`” chưa có test tự động |
| TC-026-06 | Trợ giúp nổi ẩn/hiện khi cuộn, nội dung modal (T10) | Ẩn khi `scrollY > 40`, hiện lại ở đầu trang; tiếng Việt, header xanh | Nút Trợ giúp ẩn khi cuộn 400px, hiện lại ở đầu trang; modal có 2 nhóm bài, xem bài chi tiết, điểm tiếp nhận, header xanh | Passed | `header-help.spec.ts` (test 6) + screenshot |
| TC-026-07 | Footer 4 cột (T11) | Đủ 4 cột, liên kết hoạt động | Đủ 4 cột; liên kết “Tin Mất đồ” chuyển sang `?type=LOST` | Passed | `header-help.spec.ts` (test 7) + screenshot |
| TC-026-08 | Dark mode header, popup, footer | Chữ/icon đủ tương phản | Chữ/icon đọc được ở dark mode (header, menu, popup, trợ giúp, footer, avatar đã đăng nhập); bật/tắt được và nhớ sau khi tải lại | Passed | `header-help.spec.ts` (test 8) + screenshot desktop/mobile (xem thủ công) |

## Hướng dẫn tự chạy

```
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test   # cần SEED_DEMO_PASSWORD trong .env.local (đã chạy npm run db:seed); tự bật dev server
npm run dev           # xem tay: mở / rồi thử avatar, menu, ?auth=login, ?help=1, cuộn trang, chế độ Tối
```
