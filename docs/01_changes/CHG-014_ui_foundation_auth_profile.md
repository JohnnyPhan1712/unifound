# CHG-014: Nền UI dùng chung, đăng nhập email trường và hồ sơ

- ID: `CHG-014`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-013` (repo sạch code cũ)
- File/module dự kiến sửa/tạo: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/*`, `src/components/layout/*`, `src/app/login`, `src/app/register`, `src/app/profile`, `src/middleware.ts`, `src/utils/supabase/*`, `src/lib/auth/*`, `src/db/schema.ts` (nếu cần rà soát bảng `users`, `schools`)
- Branch: 
- Commit sau merge: 

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

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-014-01 | Vitest: hàm kiểm tra domain email (hợp lệ, ngoài danh sách, hoa/thường, rỗng) | Chỉ domain trong danh sách pass | | Pending | |
| TC-014-02 | Vitest: Zod schema hồ sơ | Dữ liệu sai bị từ chối | | Pending | |
| TC-014-03 | Đăng ký email domain ngoài trường | Bị từ chối, có thông báo lỗi | | Pending | screenshot |
| TC-014-04 | Đăng ký/đăng nhập email hợp lệ | Vào được, có bản ghi `users` role USER | | Pending | |
| TC-014-05 | Khách mở `/profile` | Chuyển về `/login` | | Pending | |
| TC-014-06 | Sửa hồ sơ hợp lệ / không hợp lệ | Lưu được / báo lỗi tại field | | Pending | |
| TC-014-07 | Tài khoản `locked` đăng nhập | Bị chặn với thông báo | | Pending | |
| TC-014-08 | Layout desktop và mobile (Playwright MCP) | Header/nav đúng, không vỡ layout | | Pending | screenshot |

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
