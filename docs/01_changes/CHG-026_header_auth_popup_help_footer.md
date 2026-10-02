# CHG-026: Header (avatar + menu), popup xác thực, trợ giúp và footer

- ID: `CHG-026`
- Trạng thái: `proposed`
- Ngày tạo: `2026-10-03`
- Người phụ trách: `Nguyễn Thế Anh`
- Dependency: `CHG-024` (quên mật khẩu), `CHG-025` (token dark mode)
- File/module dự kiến sửa/tạo: `src/components/layout/site-header.tsx`, `src/components/layout/user-avatar-button.tsx`, `src/components/layout/hammer-menu.tsx`, `src/components/layout/auth-modal.tsx`, `src/components/layout/post-button.tsx`, `src/components/layout/help-widget.tsx`, `src/components/layout/site-footer.tsx`, `src/app/layout.tsx`, `src/components/auth/password-field.tsx`, `src/app/login/page.tsx`, `src/app/register/page.tsx`, `src/app/forgot-password/page.tsx`, `src/proxy.ts`, `src/lib/auth/session.ts`, `src/lib/auth/actions.ts`, `tests/e2e/`
- Branch:

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

- [ ] T8: Header có `UserAvatarButton` rồi `HammerMenu` theo thứ tự trái → phải; menu chỉ có Sáng/Tối, Đăng nhập/Đăng ký, Trợ giúp; không còn nút Đăng nhập rời.
- [ ] T9: Đăng nhập, đăng ký, quên mật khẩu đều chạy trong popup; “Quay lại đăng nhập” về popup đăng nhập; “Đăng tin” khi chưa đăng nhập mở popup và đăng nhập xong về `/reports/new`; URL cũ `/login`, `/register`, `/forgot-password` vẫn chạy.
- [ ] T10: Nút Trợ giúp nổi ẩn khi cuộn, hiện lại ở đầu trang; modal đúng bố cục, tiếng Việt hoàn toàn.
- [ ] T11: Footer 4 cột hiển thị đủ nội dung và liên kết; không còn cảnh báo hydration.
- [ ] Avatar, menu, popup, footer đọc được ở dark mode.
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đều pass; toàn bộ E2E (kể cả golden path) pass.
- [ ] Kiểm tra giao diện bằng Playwright MCP (desktop + mobile, light + dark), screenshot ghi evidence.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
| --- | --- | --- | --- | --- | --- |
| TC-026-01 | Thứ tự và nội dung nút header (T8) | Avatar rồi Hammer từ trái sang phải; menu chỉ có Sáng/Tối, Đăng nhập/Đăng ký, Trợ giúp | — | Pending | — |
| TC-026-02 | Avatar khi chưa/đã đăng nhập (T8) | Chưa đăng nhập mở popup; đã đăng nhập mở menu tài khoản + Đăng xuất | — | Pending | — |
| TC-026-03 | Luồng popup đăng nhập ↔ đăng ký ↔ quên mật khẩu (T9) | Chuyển chế độ trong popup; “Quay lại đăng nhập” về đúng popup; có “Quên mật khẩu?” | — | Pending | — |
| TC-026-04 | “Đăng tin” khi chưa đăng nhập (T9) | Mở popup; đăng nhập xong về `/reports/new` | — | Pending | — |
| TC-026-05 | URL cũ `/login`, `/register`, `/forgot-password` (T9) | Chuyển hướng mở đúng popup; đã đăng nhập thì về `next` | — | Pending | — |
| TC-026-06 | Trợ giúp nổi ẩn/hiện khi cuộn, nội dung modal (T10) | Ẩn khi `scrollY > 40`, hiện lại ở đầu trang; tiếng Việt, header xanh | — | Pending | — |
| TC-026-07 | Footer 4 cột (T11) | Đủ 4 cột, liên kết hoạt động | — | Pending | — |
| TC-026-08 | Dark mode header, popup, footer | Chữ/icon đủ tương phản | — | Pending | — |

## Hướng dẫn tự chạy

```
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test
npm run dev
```
