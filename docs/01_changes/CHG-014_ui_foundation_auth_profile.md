# CHG-014: Nền UI dùng chung, đăng nhập email trường và hồ sơ

- ID: `CHG-014`
- Trạng thái: `in_review`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-013` (repo sạch code cũ)
- File/module dự kiến sửa/tạo: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/*`, `src/components/layout/*`, `src/app/login`, `src/app/register`, `src/app/profile`, `src/middleware.ts`, `src/utils/supabase/*`, `src/lib/auth/*`, `src/db/schema.ts` (nếu cần rà soát bảng `users`, `schools`)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

## Kết quả người dùng

Người dùng thấy giao diện UniFound đúng `DESIGN.md` (header, nav, icon, responsive), đăng ký/đăng nhập được bằng email trường hợp lệ, cập nhật hồ sơ (họ tên, MSSV, trường, liên hệ). Email ngoài trường bị từ chối; khách bị chuyển về trang đăng nhập khi vào trang cần quyền.

## Phạm vi

### Bao gồm

- Design tokens, font, màu, spacing theo `DESIGN.md`; bộ icon dùng chung (ưu tiên thư viện đã cài, nếu thêm thì ghi lý do trong CHG).
- Component dùng chung: Button, Input/Field có label + lỗi, Badge trạng thái/loại tin (không chỉ dựa vào màu), Card, Empty/Loading/Error state.
- Layout: header + điều hướng responsive (desktop/mobile), footer tối thiểu; menu theo vai trò (Khách/USER/ADMIN).
- FR01/S02: đăng ký/đăng nhập/đăng xuất Supabase Auth (`@supabase/ssr`); server kiểm tra domain theo `ALLOWED_EMAIL_DOMAINS`; tạo bản ghi `users` (`role=USER`, gán `school_id` theo domain nếu có); chặn tài khoản `locked`.
- Middleware refresh session + guard route cần đăng nhập.
- FR02/S10: trang hồ sơ (họ tên, MSSV, trường, contact_info) với Zod phía server.
- Rà lại `src/db/schema.ts` cho `users`/`schools` nếu thiếu; mọi đổi schema đi qua Drizzle migration.

### Các lưu ý

- Mockup CHG-012 chỉ là tham khảo, chưa đầy đủ (thiếu icon, tối ưu UI); nguồn chuẩn là `DESIGN.md`.
- Chưa làm tính năng đăng tin, feed (CHG-015/016). Trang chủ chỉ cần placeholder dùng layout mới.
- Không nâng quyền `ADMIN` qua UI; tài khoản admin cấp sẵn.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (mục 1, 2 FR01–FR02, 7 S02/S10)
- `docs/02_reports/03_development.md` (mục 4 biến môi trường)
- `node_modules/next/dist/docs/` (Next.js bản này có breaking changes)
- Skill Supabase (Auth với `@supabase/ssr`), impeccable/taste-skill cho UI

## Acceptance criteria

- [ ] Header/nav/component chung dùng token và icon theo `DESIGN.md`, hiển thị đúng ở desktop và mobile.
- [ ] Đăng ký/đăng nhập bằng email domain hợp lệ thành công và có bản ghi `users` với `role=USER`.
- [ ] Email domain ngoài danh sách bị server từ chối, hiện thông báo lỗi tiếng Việt.
- [ ] Tài khoản `locked` không đăng nhập/dùng được.
- [ ] Khách vào trang hồ sơ bị chuyển về đăng nhập.
- [ ] Cập nhật hồ sơ lưu được; dữ liệu sai bị Zod từ chối, lỗi hiện tại field.
- [ ] Form có label, thao tác được bằng bàn phím cơ bản.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## Ghi chú triển khai

- Schema cũ (CHG-007: 3 bảng, enum chữ thường) không khớp ERD ở `02_requirements_design.md` mục 9. Chủ dự án đồng ý xóa dữ liệu test cũ (2026-10-01), nên CHG này thay toàn bộ schema theo ERD bằng 2 migration Drizzle: `0001_drop_legacy_schema.sql` (custom, drop bảng/enum cũ) và `0002_erd_schema.sql` (10 bảng). Snapshot `0001_snapshot.json` được để rỗng để `drizzle-kit generate` tạo mới không hỏi rename.
- Id dùng `uuid` (ERD ghi `int`) vì `users.id` phải trùng `auth.users.id`; các bảng khác dùng uuid cho thống nhất.
- Bổ sung so với ERD: `schools.email_domain` (gán trường theo domain), `users.updated_at`. Tất cả bảng bật RLS không policy: app chỉ truy cập qua Drizzle phía server, Data API công khai không đọc được.
- Next.js 16 đổi `middleware` thành `proxy`: dùng `src/proxy.ts` (refresh session bằng `getClaims` + chuyển khách về `/login?next=...`). Trang vẫn tự kiểm tra lại bằng `requireUser()`.
- Biến môi trường dùng đúng tên `03_development.md` mục 4: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `ALLOWED_EMAIL_DOMAINS=gm.uit.edu.vn,uit.edu.vn` (đã đổi tên key trong `.env.local` cũ).
- Icon: thêm `lucide-react` vì chưa có thư viện icon nào; vẽ tay ~30 icon SVG nhất quán tốn nhiều code hơn.
- Giữ bật "Confirm email" của Supabase theo quyết định chủ dự án. Đăng ký thật phải bấm link trong mail; tài khoản demo do seed CHG-015 tạo sẵn ở trạng thái đã xác nhận.
- Tài khoản bị khóa: `getCurrentUser()` coi như khách, `requireUser()` chuyển về `/login?error=locked`, action đăng nhập đăng xuất lại và báo lỗi.
- Script `typecheck` đổi thành `next typegen && tsc --noEmit` để có type `PageProps` khi chưa build.

### Cập nhật 2026-10-01: làm lại giao diện theo mockup CHG-012

- Bản UI đầu tiên của CHG này theo `DESIGN.md` cũ (teal) nên khác mockup CHG-012. Hai nguồn mâu thuẫn: `DESIGN.md` (teal) và `07_brand_identity.md` + mockup (UniFound Blue `#2D5BD7`, Nhặt được xanh lục, Mất đồ cam).
- Chủ dự án chọn **theo mockup** (xanh dương) và làm lại **toàn bộ màn hình**. `DESIGN.md` được sửa token cho khớp (màu, bo góc 4/8/14/20/32, chữ 16px, thêm các bậc chữ phụ); phần cấu trúc giữ nguyên.
- Đã đổi:
  - Token trong `globals.css` lấy từ `uf.css` của mockup; logo mới (chữ U trong khiên).
  - Header 3 cột: logo, tab Tất cả / Mất đồ / Nhặt được ở giữa (chỉ ở bảng tin), Đăng tin / chuông / menu tài khoản dạng popover.
  - Nhãn loại tin (pill trắng có bóng khi nằm trên ảnh), nhãn trạng thái (viền hairline + chấm màu), thông báo, ô nhập 56px viền ink khi focus, nút 48px (secondary viền ink, nút chữ gạch chân), thẻ đăng nhập có thanh tiêu đề và nút đóng, nút hiện/ẩn mật khẩu.
- Chủ ý khác mockup: nhãn của ô nhập luôn hiện (mockup đăng nhập chỉ dùng placeholder), để đạt yêu cầu "form có label" của dự án.
- Chủ ý khác mockup: không có đăng nhập bằng liên kết email (chưa có trong phạm vi).

## AI Log

### AI-1 — Thay schema theo ERD và dựng lớp auth

- Nhiệm vụ (Task): Viết lại `src/db/schema.ts` theo ERD, sinh migration, dựng Supabase Auth (`@supabase/ssr`) với kiểm tra domain phía server, `proxy.ts`, trang đăng nhập/đăng ký/hồ sơ.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Supabase MCP (đọc cấu trúc DB, `search_docs` cho mẫu SSR/proxy), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): CHG-014, ERD mục 9, `03_development.md` mục 4/6, docs Next.js 16 trong `node_modules/next/dist/docs` (proxy, PageProps).
- Kết quả AI (AI Output): 10 bảng + enum chữ hoa, migration drop schema cũ, `src/proxy.ts`, `src/lib/auth/*`, form có lỗi theo field.
- Quyết định của nhóm (Human Decision): chờ xác nhận. Chủ dự án đã chọn: cho phép drop dữ liệu cũ; giữ bật xác nhận email; domain `gm.uit.edu.vn,uit.edu.vn`; không commit.
- Kiểm tra / Xác minh (Verification): `npm run db:migrate` thành công; Supabase MCP xác nhận 10 bảng đều bật RLS; Vitest TC-014-01/02; Playwright kiểm tra luồng thật (bảng Test case).
- Ứng viên đưa vào báo cáo: có

### AI-3 — Làm lại giao diện theo mockup CHG-012

- Nhiệm vụ (Task): Đối chiếu giao diện đã làm với mockup, chuyển token và bố cục sang đúng mockup trên toàn bộ màn hình.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5 và Sonnet 5.5), skill impeccable (`detect`), Playwright.
- Đầu vào / Ngữ cảnh (Input/Context): `docs/02_reports/assets/claude_ui_mockups/` (HTML, `uf.css`, ảnh chụp), `07_brand_identity.md`. Chủ dự án chỉ ra giao diện chưa giống mockup; AI đối chiếu và nêu mâu thuẫn giữa `DESIGN.md` và mockup; chủ dự án chọn theo mockup, phạm vi toàn bộ màn hình.
- Kết quả AI (AI Output): `globals.css`, header/menu/tab, bảng tin (ô tìm kiếm pill, hàng danh mục, thẻ), chi tiết tin (cột hành động bên phải, bước tiến độ, thanh hành động trên điện thoại), gợi ý (điểm lớn, lý do kèm điểm, bảng cách tính), Tin của tôi (hàng, 4 bước tiến độ), form đăng tin (ô chọn loại tin và danh mục, thanh nút cố định), đăng nhập; cập nhật `DESIGN.md`.
- Quyết định của nhóm (Human Decision): Accepted phần chọn hướng (theo mockup, xanh dương, toàn bộ); phần kết quả chờ xác nhận.
- Kiểm tra / Xác minh (Verification): Ảnh chụp desktop 1440px và iPhone 13 so với ảnh chụp trong mockup; `impeccable detect` còn 0 cảnh báo; E2E 4/4 trên bản build; quét 17 màn hình mobile (xem CHG-023).
- Ứng viên đưa vào báo cáo: có (ví dụ AI phát hiện hai nguồn thiết kế mâu thuẫn và để chủ dự án quyết định)

### AI-2 — Nền UI theo DESIGN.md (bản đầu, đã được thay bởi AI-3)

- Nhiệm vụ (Task): Token màu/font/bo góc/bóng, component dùng chung (button, field, badge, notice, empty, loading, submit), header/nav responsive.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), skill impeccable (đọc PRODUCT.md/DESIGN.md, craft floor).
- Đầu vào / Ngữ cảnh (Input/Context): `DESIGN.md` (nguồn chuẩn), không dùng mockup CHG-012 làm hướng dẫn.
- Kết quả AI (AI Output): `src/app/globals.css` (`@theme` Tailwind v4 + lớp `.btn/.panel/.control/.badge/.segmented`), `src/components/ui/*`, `src/components/layout/*`; menu điện thoại dùng `<details>` (không cần JS).
- Quyết định của nhóm (Human Decision): chờ xác nhận.
- Kiểm tra / Xác minh (Verification): ảnh chụp Playwright desktop 1280px và iPhone 13; không tràn ngang; thứ tự Tab hợp lý trên form hồ sơ. Ghi chú: `PRODUCT.md` (file chưa commit) còn ghi quyết định cũ (status chữ thường, danh mục cố định), lệch với CHG; đã theo CHG/`02_requirements_design.md`.
- Ứng viên đưa vào báo cáo: có

## Bug

### BUG-1 — Email có khoảng trắng/chữ hoa bị Zod từ chối

- Biểu hiện: `" A@GM.UIT.EDU.VN "` bị báo "Email không hợp lệ".
- Các bước tái hiện: `credentialsSchema.parse({ email: " A@GM.UIT.EDU.VN ", password: "12345678" })`.
- Kết quả mong đợi / thực tế: Mong đợi chuẩn hóa thành `a@gm.uit.edu.vn` / thực tế lỗi validation.
- Nguyên nhân gốc: Zod v4 `z.email().trim()` kiểm tra định dạng trước khi trim.
- Fix: `z.string().trim().toLowerCase().pipe(z.email(...))` trong `src/lib/auth/schemas.ts`.
- Verification: TC-014-02 pass.
- Commit/issue: `e8cdd04`.

### BUG-2 — `npm run typecheck` lỗi `PageProps<"/login">` khi chưa build

- Biểu hiện: `TS2344: Type '"/login"' does not satisfy the constraint '"/"'`.
- Các bước tái hiện: thêm route mới rồi chạy `npm run typecheck` trước `npm run build`.
- Kết quả mong đợi / thực tế: Mong đợi pass / thực tế dùng type route cũ trong `.next/types`.
- Nguyên nhân gốc: type route của Next.js 16 chỉ sinh khi `dev`/`build`/`typegen`.
- Fix: script `typecheck` = `next typegen && tsc --noEmit`.
- Verification: `npm run typecheck` pass.
- Commit/issue: `e8cdd04`.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-014-01 | Vitest: hàm kiểm tra domain email (hợp lệ, ngoài danh sách, hoa/thường, rỗng) | Chỉ domain trong danh sách pass | Đúng, kể cả domain con và đuôi giả `uit.edu.vn.evil.com` bị từ chối | Passed | `src/lib/auth/auth.test.ts` |
| TC-014-02 | Vitest: Zod schema hồ sơ | Dữ liệu sai bị từ chối | Họ tên ngắn, MSSV sai, schoolId sai, liên hệ > 120 ký tự bị từ chối | Passed | `src/lib/auth/auth.test.ts` |
| TC-014-03 | Đăng ký email domain ngoài trường | Bị từ chối, có thông báo lỗi | `someone@gmail.com` → "Chỉ nhận email do trường cấp (@gm.uit.edu.vn, @uit.edu.vn)." tại field, không gọi Supabase | Passed | screenshot Playwright `014_register_domain_error_desktop.png` |
| TC-014-04 | Đăng ký/đăng nhập email hợp lệ | Vào được, có bản ghi `users` role USER | Đăng ký `uf.test.<timestamp>@gm.uit.edu.vn` → báo "Đã gửi email xác nhận", MCP thấy bản ghi `users` role USER/active; đăng nhập tài khoản demo đã xác nhận → vào trang chủ | Passed | Playwright + Supabase MCP (chỉ đọc) |
| TC-014-05 | Khách mở `/profile` | Chuyển về `/login` | Chuyển về `/login?next=%2Fprofile` | Passed | Playwright |
| TC-014-06 | Sửa hồ sơ hợp lệ / không hợp lệ | Lưu được / báo lỗi tại field | Lỗi hiện dưới "Họ và tên", "MSSV"; dữ liệu hợp lệ lưu và còn sau khi tải lại | Passed | Playwright |
| TC-014-07 | Tài khoản `locked` đăng nhập | Bị chặn với thông báo | Kiểm tra cùng CHG-021: admin khóa Demo C → đăng nhập báo "Tài khoản đã bị khóa. Liên hệ quản trị viên để được hỗ trợ." và ở lại `/login`; phiên đang mở bị chuyển về màn đăng nhập | Passed | Playwright, `021_locked_login.png` |
| TC-014-08 | Layout desktop và mobile (Playwright MCP) | Header/nav đúng, không vỡ layout | Header, menu `<details>` trên iPhone 13 đúng; `scrollWidth <= innerWidth` | Passed | screenshot `014_profile_desktop.png`, `014_menu_user_mobile.png` (Playwright thư viện, không có Playwright MCP trong phiên) |

## Hướng dẫn tự chạy

```
npm run typecheck
npm test
npm run build
npm run dev     # http://localhost:3000
```

1. Điền `.env` theo `03_development.md` mục 4 (không commit).
2. Mở `/register`, thử email ngoài trường → phải bị từ chối; thử email trường hợp lệ → vào được.
3. Mở `/profile` khi chưa đăng nhập → bị chuyển về `/login`; đăng nhập rồi sửa hồ sơ.
4. Thu nhỏ cửa sổ về độ rộng điện thoại, kiểm tra header/nav.

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- Supabase đang bật "Confirm email": đăng ký bằng email trường thật sẽ nhận mail xác nhận; để thử nhanh, chạy `npm run db:migrate && npm run db:seed` (CHG-015) rồi đăng nhập bằng tài khoản demo.
- Kiểm tra tài khoản bị khóa (TC-014-07): đăng nhập admin → `/admin/users` → Khóa Demo C → đăng nhập Demo C phải báo "Tài khoản đã bị khóa"; nhớ Mở khóa lại.
