# CHG-013: Dọn code cũ của các CHG bị từ chối

- ID: `CHG-013`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `không có`
- File/module dự kiến sửa/xóa: `src/app/*`, `src/components/*`, `src/lib/*`, `src/middleware.ts`, `src/utils/supabase/*`, `src/db/seed.ts`, `src/db/schema.test.ts`, `tests/e2e/*.spec.ts`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Repo chỉ còn skeleton Next.js sạch và cấu hình nền, không còn code của các CHG-007 → CHG-011 đã bị từ chối; `typecheck`, `test`, `build` vẫn chạy để các CHG sau viết lại trên nền này.

## Phạm vi

### Bao gồm

- Xóa bằng `git rm`, để có lịch sử:
  - `src/app/api/**`, `src/app/login`, `src/app/register`, `src/app/reports/**`, `src/app/error.tsx`, `src/app/page.test.tsx`.
  - `src/components/**` (auth-header, claims, report-actions).
  - `src/lib/**` (auth, claims).
  - `src/middleware.ts`, `src/utils/supabase/**`.
  - `src/db/seed.ts`, `src/db/schema.test.ts`.
  - `tests/e2e/*.spec.ts`.
- Giữ tối thiểu để build chạy: `src/app/layout.tsx` (html + body, không header/footer), `src/app/page.tsx` (placeholder), `src/app/globals.css` (chỉ `@import "tailwindcss"`; token và font sẽ làm ở CHG-015).
- Thêm một smoke test Vitest tối thiểu để `npm test` không báo "no tests".
- Rà `package.json`: chỉ ghi chú dependency không còn được dùng (không gỡ nếu CHG sau sẽ dùng lại: `zod`, `@supabase/*`, `drizzle-*`, `postgres`).

### Các lưu ý

- **Giữ nguyên** `drizzle/**`, `src/db/schema.ts`, `src/db/index.ts`, `src/db/migrate.ts`, `drizzle.config.ts`: database Supabase thật đã áp migration này, CHG-014 sẽ rà soát và sửa. Không xóa migration đã áp dụng.
- **Không thao tác** gì trên database Supabase (không xóa bảng/dữ liệu).
- Giữ cấu hình CHG-006 (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `.env.example`), `DESIGN.md`, `docs/`, `README.md`.
- `start-web.bat`, `stitch_unifound_campus_lost_and_found.zip` không thuộc phạm vi; ghi lại để người phụ trách quyết định.
- `npm run test:e2e` chưa có test là chấp nhận được ở CHG này, ghi rõ trong phần test.
- Không xóa/sửa mockup ở `docs/02_reports/assets/`.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/01_changes/README.md` (CHG-007 → CHG-011 `rejected`)
- `docs/00_guides/code_conventions.md`, `docs/00_guides/git_workflow.md`
- `git ls-files src tests drizzle` để lập danh sách xóa thật, không dựa vào danh sách trong CHG này

## Acceptance criteria

- [ ] `git ls-files src tests` chỉ còn skeleton (`layout`, `page`, `globals.css`), hạ tầng DB (`src/db/{index,migrate,schema}.ts`) và smoke test.
- [ ] `drizzle/` và `src/db/schema.ts` không đổi so với `main`.
- [ ] Grep không còn import tới module đã xóa (`@/lib/auth`, `@/lib/claims`, `@/components/*`, `@/utils/supabase`...).
- [ ] `npm run dev` mở `/` hiển thị placeholder, không lỗi console.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.
- [ ] Danh sách file đã xóa được ghi vào CHG.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-013-01 | `git ls-files src tests drizzle` sau khi xóa | Chỉ còn file trong phạm vi "Giữ" | | Pending | |
| TC-013-02 | `git diff main -- drizzle src/db/schema.ts` | Không có thay đổi | | Pending | |
| TC-013-03 | Grep import tới module đã xóa | Không còn kết quả | | Pending | |
| TC-013-04 | Vitest smoke | Pass | | Pending | |
| TC-013-05 | `npm run build` | Build thành công | | Pending | |
| TC-013-06 | `npm run dev` mở `/` | Placeholder hiển thị | | Pending | screenshot |

## Hướng dẫn tự chạy

```
git ls-files src tests drizzle
npm run typecheck
npm test
npm run build
npm run dev     # mở http://localhost:3000
```
