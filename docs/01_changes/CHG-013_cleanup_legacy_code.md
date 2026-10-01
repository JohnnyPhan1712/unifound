# CHG-013: Dọn code cũ của các CHG bị từ chối

- ID: `CHG-013`
- Trạng thái: `in_review`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `không có`
- File/module dự kiến sửa/xóa: `src/app/*`, `src/components/*`, `src/lib/*`, `src/middleware.ts`, `src/utils/supabase/*`, `src/db/seed.ts`, `src/db/schema.test.ts`, `tests/e2e/*.spec.ts`
- Branch: `chore/CHG-013-cleanup-legacy-code`
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

- [x] `git ls-files src tests` chỉ còn skeleton (`layout`, `page`, `globals.css`), hạ tầng DB (`src/db/{index,migrate,schema}.ts`) và smoke test.
- [x] `drizzle/` và `src/db/schema.ts` không đổi so với `main`.
- [x] Grep không còn import tới module đã xóa (`@/lib/auth`, `@/lib/claims`, `@/components/*`, `@/utils/supabase`...).
- [x] `npm run dev` mở `/` hiển thị placeholder, không lỗi console.
- [x] `npm run typecheck`, `npm test`, `npm run build` pass.
- [x] Danh sách file đã xóa được ghi vào CHG.

## AI Log

### AI-1 — Dọn code cũ theo CHG-013

- Nhiệm vụ (Task): Xóa code CHG-007 → CHG-011 bị từ chối, giữ skeleton + hạ tầng DB, thêm smoke test.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), ponytail
- Đầu vào / Ngữ cảnh (Input/Context): CHG-013, `git ls-files src tests drizzle`, `code_conventions.md`.
- Kết quả AI (AI Output): `git rm` theo 7 nhóm (người dùng duyệt từng nhóm), viết lại `layout.tsx`/`page.tsx`/`globals.css`, thêm `src/smoke.test.ts`.
- Quyết định của nhóm (Human Decision): chờ xác nhận (người dùng đã duyệt từng nhóm xóa trong phiên)
- Kiểm tra / Xác minh (Verification): TC-013-01 → 06; `npm run typecheck`, `npm test`, `npm run build` pass.
- Ứng viên đưa vào báo cáo: không

### AI-2 — Xử lý lỗi môi trường khi typecheck/build

- Nhiệm vụ (Task): Làm `typecheck`/`build` pass sau khi dọn code (xem BUG-1).
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5)
- Đầu vào / Ngữ cảnh (Input/Context): Lỗi `Module "next" has no exported member 'Metadata'`, `postgres` không tìm thấy, `.next/dev/types` cũ.
- Kết quả AI (AI Output): `npm install`, xóa `.next/dev` (build output đã bị gitignore), `npm install next@latest` (16.3.5 → 16.3.8).
- Quyết định của nhóm (Human Decision): Accepted (người dùng chọn phương án nâng `next` và đồng ý xóa `.next/dev`)
- Kiểm tra / Xác minh (Verification): `typecheck`, `test`, `build` pass sau khi nâng.
- Ứng viên đưa vào báo cáo: có

## Bug

### BUG-1 — typecheck/build lỗi sau khi dọn code

- Biểu hiện: `tsc` báo `next` không export `Metadata`, `postgres` không tìm thấy, `.next/dev/types/validator.ts` trỏ tới route đã xóa.
- Các bước tái hiện: Xóa code cũ rồi `npm run typecheck` / `npm run build`.
- Kết quả mong đợi / thực tế: Pass / lỗi TS.
- Nguyên nhân gốc: `next@16.3.5` cài trong node_modules thiếu `types.d.ts` ở thư mục gốc (lỗi có từ trước CHG, `main` cũng bị); `postgres` chưa được cài; `.next/dev` là build output cũ.
- Fix: `npm install`; xóa `.next/dev`; `npm install next@latest` → 16.3.8 (`package.json`: `"next": "^16.3.8"`, đổi từ `latest`; `package-lock.json` cập nhật). Dependency đổi ngoài dự kiến ban đầu của CHG, cần người phụ trách xác nhận.
- Verification: `typecheck`, `test`, `build` pass.
- Commit/issue: chưa commit

### Ghi chú cho người phụ trách

- `package.json` còn script `db:seed` trỏ tới `src/db/seed.ts` đã xóa; CHG-015 sẽ viết lại seed.
- `start-web.bat`, `stitch_unifound_campus_lost_and_found.zip` không thuộc phạm vi, chưa động tới.
- `npm run test:e2e` hiện chưa có test (đã xóa `tests/e2e/*.spec.ts`), chấp nhận theo phạm vi CHG.
- Dependency không còn được dùng trong `src` hiện tại nhưng giữ cho các CHG sau: `zod`, `@supabase/*`, `drizzle-*`, `postgres`.
- Danh sách file đã xóa (`git rm`, 46 file):

  - `src/app/api/auth/login/route.ts`
  - `src/app/api/auth/logout/route.ts`
  - `src/app/api/auth/me/route.ts`
  - `src/app/api/auth/register/route.ts`
  - `src/app/api/reports/[id]/route.ts`
  - `src/app/api/reports/route.ts`
  - `src/app/error.tsx`
  - `src/app/login/page.tsx`
  - `src/app/register/page.tsx`
  - `src/app/reports/[id]/ReportActions.tsx`
  - `src/app/reports/[id]/loading.tsx`
  - `src/app/reports/[id]/not-found.tsx`
  - `src/app/reports/[id]/page.tsx`
  - `src/app/reports/new/actions.ts`
  - `src/app/reports/new/create-report-form.tsx`
  - `src/app/reports/new/current-user.ts`
  - `src/app/reports/new/page.tsx`
  - `src/app/reports/report-badges.tsx`
  - `src/app/reports/report-display.test.ts`
  - `src/app/reports/report-display.ts`
  - `src/app/reports/report-feed.tsx`
  - `src/app/reports/report-fields.ts`
  - `src/app/reports/report-filters.tsx`
  - `src/app/reports/report-queries.ts`
  - `src/app/reports/report-validation.test.ts`
  - `src/app/reports/report-validation.ts`
  - `src/components/auth-header.tsx`
  - `src/components/claims/ClaimList.tsx`
  - `src/components/claims/ClaimModal.tsx`
  - `src/components/report-actions.tsx`
  - `src/db/schema.test.ts`
  - `src/db/seed.ts`
  - `src/lib/auth/actions.ts`
  - `src/lib/auth/api-routes.test.ts`
  - `src/lib/auth/ownership.test.ts`
  - `src/lib/auth/ownership.ts`
  - `src/lib/auth/schemas.ts`
  - `src/lib/claims/actions.ts`
  - `src/lib/claims/queries.ts`
  - `src/lib/claims/schema.ts`
  - `src/middleware.ts`
  - `src/utils/supabase/client.ts`
  - `src/utils/supabase/middleware.ts`
  - `src/utils/supabase/server.ts`
  - `tests/e2e/app-shell.spec.ts`
  - `tests/e2e/report-discovery.spec.ts`

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-013-01 | `git ls-files src tests drizzle` sau khi xóa | Chỉ còn file trong phạm vi "Giữ" | | `git ls-files src tests drizzle` chỉ còn `src/app/{globals.css,layout.tsx,page.tsx}`, `src/db/{index,migrate,schema}.ts`, `src/smoke.test.ts`, `drizzle/**` | Passed | `git ls-files` |
| TC-013-02 | `git diff main -- drizzle src/db/schema.ts` | Không có thay đổi | | `git diff main --stat -- drizzle src/db/schema.ts` rỗng | Passed | `git diff main` |
| TC-013-03 | Grep import tới module đã xóa | Không còn kết quả | | Grep `@/(lib|components|utils)`, `utils/supabase`, `db/seed` trong `src` không có kết quả | Passed | Grep |
| TC-013-04 | Vitest smoke | Pass | | `npm test`: 1 file, 1 test pass | Passed | `src/smoke.test.ts` |
| TC-013-05 | `npm run build` | Build thành công | | `npm run build` thành công (route `/`, `/_not-found`) | Passed | Log build |
| TC-013-06 | `npm run dev` mở `/` | Placeholder hiển thị | `curl localhost:3000` trả `<h1>UniFound</h1>`, `lang="vi"`, log dev không có lỗi | Passed | Không có Playwright MCP trong phiên nên không có screenshot; kiểm tra bằng curl |

## Hướng dẫn tự chạy

```
git ls-files src tests drizzle
npm run typecheck
npm test
npm run build
npm run dev     # mở http://localhost:3000
```
