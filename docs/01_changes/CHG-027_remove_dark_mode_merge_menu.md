# CHG-027: Bỏ dark mode và gom menu tài khoản vào HammerMenu

- ID: `CHG-027`
- Trạng thái: `done`
- Ngày tạo: `2026-10-03`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-026` (đã `done`: `HammerMenu`, `layout.tsx`)
- File/module dự kiến sửa/tạo: `src/components/layout/hammer-menu.tsx`, `src/components/layout/user-avatar-button.tsx`, `src/components/layout/site-header.tsx`, `src/components/layout/popover-menu.tsx` (nếu không còn nơi dùng thì gộp/xóa), `src/app/layout.tsx`, `src/app/globals.css`, `tests/e2e/header-help.spec.ts`, `tests/e2e/search-filters.spec.ts`
- Branch: `feat/chg-026` (làm tiếp trên nhánh hiện tại, bắt đầu 2026-10-03; chưa commit)

## Kết quả người dùng

Giao diện chỉ còn một chế độ sáng (không còn mục Sáng/Tối, hệ điều hành đặt chế độ tối cũng không ảnh hưởng). Avatar chỉ dùng để xem hồ sơ; mọi mục còn lại của tài khoản nằm trong `HammerMenu`.

## Phạm vi

### Bao gồm

- **Bỏ dark mode:** xóa mục Sáng/Tối, hàm `toggleTheme` và hook `useDark` trong `HammerMenu`.
- **Avatar chỉ để xem hồ sơ:** khi đã đăng nhập, `UserAvatarButton` là liên kết tới `/profile` (không còn mở menu thả xuống, bỏ `aria-haspopup`; nhãn truy cập “Hồ sơ của <tên>”). Khách vẫn bấm avatar để mở popup đăng nhập như CHG-026.
- **Chuyển mục tài khoản sang `HammerMenu`:** khi đã đăng nhập, menu có Tin và yêu cầu của tôi, Gợi ý trùng khớp, Thông báo (kèm số chưa đọc), Đăng tin mới, Quản trị (chỉ admin), Trợ giúp, Đăng xuất. Khách: Đăng nhập, Đăng ký, Trợ giúp. `HammerMenu` nhận thêm `unread` và `isAdmin` từ `SiteHeader`. Mục “Hồ sơ” không lặp lại trong menu vì đã có avatar.
- Xóa `THEME_SCRIPT` và thẻ `<head>` chứa nó trong `layout.tsx`; giữ `suppressHydrationWarning` trên `<body>`/`<html>` nếu extension trình duyệt vẫn gây cảnh báo hydration (kiểm tra rồi quyết định).
- Xóa khối `html.dark` trong `globals.css`.
- Xóa test dark mode: TC-025-07 trong `search-filters.spec.ts` và test “chế độ Tối” trong `header-help.spec.ts`; cập nhật các test kiểm tra danh sách mục menu (không còn “Chế độ Tối”).

### Các lưu ý (Tránh hiểu nhầm)

- Không đổi token màu của chế độ sáng, không đổi ngôn ngữ (giao diện giữ tiếng Việt), không đổi schema.
- Khai báo `color-scheme: light` đã có trong `globals.css`, giữ nguyên để trình duyệt không tự đảo màu form/scrollbar.
- Chỉ xóa dark mode và chuyển mục menu; không refactor ngoài phạm vi. Nội dung/hành vi các mục chuyển sang (liên kết, quyền Quản trị, Đăng xuất bằng server action) giữ nguyên như ở `UserAvatarButton` hiện tại. Menu vẫn phải luôn nằm trong DOM (ẩn bằng `hidden`) để form Đăng xuất gửi được sau khi menu đóng.
- Chuông thông báo trên header (CHG-018) giữ nguyên.
- `DESIGN.md` đã ghi “Don't làm dark mode trong MVP”, không cần sửa.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`
- `docs/01_changes/CHG-026_header_auth_popup_help_footer.md`, `docs/01_changes/CHG-025_unify_search_filters.md`
- `src/components/layout/hammer-menu.tsx`, `src/app/layout.tsx`, `src/app/globals.css`

## Acceptance criteria

- [x] Menu không còn mục Sáng/Tối; không còn `THEME_SCRIPT`, `localStorage.theme`, khối `html.dark`.
- [x] Đã đăng nhập: bấm avatar chuyển tới `/profile`, không mở menu; `HammerMenu` có đủ Tin và yêu cầu của tôi, Gợi ý trùng khớp, Thông báo, Đăng tin mới, Quản trị (chỉ admin), Trợ giúp, Đăng xuất. (Mục Quản trị chỉ kiểm tra bằng đọc code, chưa có test với tài khoản admin.)
- [x] Khách: avatar vẫn mở popup đăng nhập; `HammerMenu` chỉ có Đăng nhập, Đăng ký, Trợ giúp.
- [x] Đăng xuất từ `HammerMenu` hoạt động (về bảng tin ở trạng thái khách).
- [x] Máy đang ở chế độ tối của hệ điều hành vẫn hiển thị giao diện sáng nhất quán.
- [x] Không có cảnh báo hydration trong console (duyệt desktop + 320px khi đã đăng nhập).
- [x] `npm run lint`, `npm run typecheck`, `npm test` (74 test), `npm run build` đều pass; toàn bộ E2E (19 test, kể cả golden path) pass sau khi bỏ/cập nhật test dark mode.
- [ ] Kiểm tra giao diện bằng Playwright MCP: **chưa dùng Playwright MCP** (không có trong phiên). Đã dùng script `@playwright/test` chụp desktop 1280px và 320px (chế độ tối của hệ điều hành bật); ảnh lưu thư mục tạm, không đưa vào repo.

## AI Log

### AI-1 — Gom mục tài khoản vào HammerMenu, bỏ dark mode

- Nhiệm vụ (Task): bỏ dark mode; avatar chỉ xem hồ sơ; chuyển menu tài khoản sang `HammerMenu`.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), skill ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): CHG-027, `hammer-menu.tsx`, `user-avatar-button.tsx`, `site-header.tsx`, `layout.tsx`, `globals.css`, các spec E2E.
- Kết quả AI (AI Output): `HammerMenu` nhận `signedIn/isAdmin/unread` và dựng mục theo trạng thái; `UserAvatarButton` còn là liên kết (`/profile` hoặc popup đăng nhập), bỏ phụ thuộc `PopoverMenu`/`logout`. Menu vẫn luôn nằm trong DOM để form Đăng xuất gửi được. Test dark mode bị xóa, thêm test xác nhận hệ điều hành tối + `localStorage.theme=dark` đều bị bỏ qua.
- Quyết định của nhóm (Human Decision): chờ xác nhận.
- Kiểm tra / Xác minh (Verification): lint, typecheck, 74 unit test, build, 19 E2E pass; screenshot desktop/320px.
- Ứng viên đưa vào báo cáo: không

## Bug

Không có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
| --- | --- | --- | --- | --- | --- |
| TC-027-01 | Mở `HammerMenu` khi là khách | Đăng nhập, Đăng ký, Trợ giúp; không có mục Sáng/Tối; bấm avatar mở popup đăng nhập | Đạt đúng kỳ vọng | Passed | `header-help.spec.ts` test 1 |
| TC-027-02 | Mở `HammerMenu` khi đã đăng nhập (user thường và admin) | User: Tin và yêu cầu của tôi, Gợi ý trùng khớp, Thông báo (số chưa đọc), Đăng tin mới, Trợ giúp, Đăng xuất; admin có thêm Quản trị | Đạt đúng kỳ vọng | Passed | `header-help.spec.ts` test 5 (user thường); admin chưa có test |
| TC-027-03 | Bấm avatar khi đã đăng nhập | Chuyển tới `/profile`, không có menu thả xuống | Đạt đúng kỳ vọng | Passed | `header-help.spec.ts` test 5 |
| TC-027-04 | Đăng xuất từ `HammerMenu` | Về bảng tin ở trạng thái khách, avatar mở lại popup đăng nhập | Đạt đúng kỳ vọng | Passed | `header-help.spec.ts` test 5 |
| TC-027-05 | Trình duyệt giả lập `prefers-color-scheme: dark` | Giao diện vẫn sáng, `<html>` không có class `dark` | Đạt đúng kỳ vọng | Passed | `header-help.spec.ts` test “không còn chế độ Tối” (`colorScheme: dark`, nền body trắng) + screenshot |
| TC-027-06 | Máy từng lưu `localStorage.theme = "dark"` rồi tải trang | Giao diện vẫn sáng (giá trị cũ bị bỏ qua) | Đạt đúng kỳ vọng | Passed | cùng test trên (`localStorage.theme=dark` bị bỏ qua) |
| TC-027-07 | Duyệt bảng tin, popup đăng nhập, trợ giúp, footer ở desktop và mobile | Không vỡ bố cục, không có cảnh báo console | Đạt đúng kỳ vọng | Passed | screenshot desktop và 320px, console sạch |
| TC-027-08 | Chạy toàn bộ E2E | Tất cả pass, không còn test dark mode | Đạt đúng kỳ vọng | Passed | `npx playwright test`: 19 passed |

## Hướng dẫn tự chạy

```
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test   # cần SEED_DEMO_PASSWORD trong .env.local
npm run dev           # xem tay: bật chế độ tối của hệ điều hành rồi tải lại; đăng nhập, bấm avatar và mở menu
```
