# Phát triển

> Trạng thái: **CHG-008 auth & ownership implemented & verified; report discovery and matching pending**. File này chỉ phản ánh implementation có bằng chứng; thiết kế dự kiến nằm trong `02_requirements_design.md`.

## 1. Technology Stack

Stack mục tiêu đã chốt tại [DEC-004](02_requirements_design.md#dec-004--stack-và-triển-khai). Lý do lựa chọn và ranh giới trách nhiệm được giải thích tại [Technology Stack](02_requirements_design.md#10-technology-stack); file này chỉ theo dõi cách dùng thực tế.

| Thành phần | Công nghệ/phiên bản | Trạng thái | Bằng chứng |
|---|---|---|---|
| Frontend | Next.js 16.3.5, TypeScript 7.0.2, Tailwind CSS 4.3.3 | Implemented (app shell, auth UI) | `src/app/`, `src/components/`, `package-lock.json`, `npm run build` |
| Backend | Next.js server, Zod 4.6.5, Drizzle ORM 0.45.3, postgres 3.4.5, @supabase/ssr 0.9.0 | Implemented (schema/client/migration/auth actions) | `src/db/`, `src/lib/auth/`, `drizzle/` |
| Data storage/Auth | PostgreSQL + Supabase, Supabase Auth | Verified on Supabase; Auth Actions & Ownership ready | `drizzle/0000_massive_sphinx.sql`, `src/lib/auth/` |
| Testing | Vitest 5.0.1, Playwright 1.63.0 | Configured & 25 Unit tests passed | `vitest.config.ts`, `src/db/schema.test.ts`, `src/lib/auth/ownership.test.ts` |
| Deployment | Vercel | Not Started | Chưa có URL/build |

Phiên bản thực tế phải lấy từ manifest/lockfile, không suy ra từ tài liệu brainstorm.

## 2. Runtime

| Thành phần | Phiên bản | Trạng thái |
|---|---|---|
| Node.js | `v24.20.0` | Verified locally |
| Package manager | `npm 11.19.0` | Verified locally; generated `package-lock.json` |
| TypeScript | `7.0.2` | Installed and typecheck passed |

Không tự chọn version trước khi project được khởi tạo và kiểm tra.

## 3. Main packages

Các package nền tảng đã được cài trong `package.json` và lockfile npm.

| Mục đích | Package/version thực tế | Trạng thái |
|---|---|---|
| Application | `next@16.3.5`, `react@19.3.0`, `react-dom@19.3.0`, `typescript@7.0.2` | Installed |
| UI | `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3` | Installed |
| Validation | `zod@4.6.5` | Installed |
| ORM | `drizzle-orm@0.45.3` | Implemented | `src/db/schema.ts`, `src/db/index.ts` |
| Supabase/Auth client | `@supabase/supabase-js@2.117.0`, `@supabase/ssr@0.9.0` | Implemented & verified | `src/utils/supabase/`, `src/lib/auth/`, `src/middleware.ts` |
| Unit Test | `vitest@5.0.1` | Installed; 25 tests passed |
| End-to-End Test | `@playwright/test@1.63.0` | Installed; browser launch blocked in current environment |
| PostgreSQL driver và công cụ Migration | `drizzle-kit@0.31.11`, `postgres@3.4.5` | Implemented & verified | `drizzle/`, `src/db/migrate.ts`, `src/db/seed.ts` |

Package và version cuối cùng phải được cập nhật từ `package.json`/lockfile sau khi cài đặt.

## 4. Environment variables

Tên dự kiến theo kiến trúc đã chọn; giá trị thật không được ghi vào tài liệu hoặc commit.

| Biến | Phạm vi | Trạng thái/Mục đích |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server | Verified — URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client + server | Verified — publishable key cho Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server | Verified — tương thích ngược với anon key |
| `DATABASE_URL` | Chỉ server | Verified — kết nối PostgreSQL cho Drizzle qua Supabase transaction pooler |

Tên biến phải được xác nhận lại theo code và cấu hình Supabase thực tế. Không đưa database password hoặc secret server vào biến có tiền tố `NEXT_PUBLIC_`.

## 5. Local development

Scripts đã được khai báo trong `package.json`:

| Thao tác | Lệnh | Trạng thái |
|---|---|---|
| Install | `npm ci` | Cấu hình sẵn; `npm install` đã chạy thành công |
| Run development | `npm run dev` | Configured; app shell & auth routes |
| Unit Test | `npm test` | Passed: 25 tests (1 app test, 9 schema tests, 15 auth/ownership tests) |
| End-to-End Test | `npm run test:e2e` | Configured; browser launch trả `spawn UNKNOWN` trên môi trường hiện tại |
| Typecheck | `npm run typecheck` | Passed |
| Build | `npm run build` | Passed: Next.js 16 build thành công |
| Sinh migration | `npm run db:generate` | Passed: sinh `drizzle/0000_massive_sphinx.sql` |
| Chạy migration | `npm run db:migrate` | Passed: áp dụng 100% lên Supabase PostgreSQL |
| Đồng bộ schema | `npm run db:push` | Configured |
| Nạp dữ liệu demo | `npm run db:seed` | Passed: nạp 3 users, 7 reports, 2 claims an toàn lên Supabase |

## 6. Database workflow

```text
Drizzle schema (src/db/schema.ts)
      ↓ drizzle-kit generate
Migration có phiên bản (drizzle/0000_massive_sphinx.sql)
      ↓ drizzle-kit migrate (npm run db:migrate)
PostgreSQL trên Supabase (Verified)
```

- **Schema design:** Định nghĩa 3 bảng `users`, `reports`, `claims` và 5 enums (`report_type`, `report_category`, `report_location`, `report_status`, `claim_status`) theo DEC-001/DEC-002/DEC-005. Ràng buộc toàn vẹn: onDelete cascade cho khóa ngoại, partial unique index `unique_accepted_claim_per_report` trên `claims(report_id) WHERE status = 'accepted'`.
- **Migration:** Đã tạo migration phiên bản đầu tiên tại `drizzle/0000_massive_sphinx.sql` bằng `npm run db:generate`. Đã chạy thành công lên database Supabase qua `npm run db:migrate`.
- **Database client:** Triển khai tại `src/db/index.ts` dùng driver `postgres` với singleton connection pool (`prepare: false` tương thích transaction pooler) và proxy fallback khi build tĩnh không có `DATABASE_URL`.
- **Seed demo data:** Triển khai tại `src/db/seed.ts` chứa dữ liệu mẫu chuẩn khuôn viên trường; an toàn, không chứa thông tin cá nhân thật (PII) hay secret; đã nạp thành công vào database Supabase thực tế qua `npm run db:seed`.

## 7. Testing

| Công cụ | Phạm vi chính | Lệnh | Trạng thái |
|---|---|---|---|
| Vitest | Matching score, validation helper, state transition, schema contract, auth & ownership rules | `npm test` | Passed: 25 tests |
| Playwright | Luồng login → report → claim → accept → returned trên ứng dụng hoàn chỉnh | `npm run test:e2e` | Configured; browser launch blocked in current environment |

Chỉ ghi lệnh chạy sau khi config và script tương ứng tồn tại, chạy thành công.

## 8. Deployment

- Target: Vercel (`Planned`).
- Cấu hình environment variables trên môi trường deploy bằng đúng tên được code sử dụng; không commit giá trị thật.
- Build command và cấu hình runtime: `npm run build`.
- Production/demo URL: `TBD`; không tạo URL giả.

## 9. Cấu trúc hiện tại

```text
unifound/
├── src/
│   ├── app/          # Next.js app shell, /login, /register, root layout với AuthHeader
│   ├── components/   # AuthHeader component
│   ├── db/           # Drizzle schema, database client, migrate/seed scripts, schema unit tests
│   ├── lib/
│   │   └── auth/     # Auth Server Actions, Zod schemas, Ownership & Authorization helpers & tests
│   ├── utils/        # Supabase SSR server/client/middleware helpers
│   └── middleware.ts # Next.js session refresh middleware
├── drizzle/          # Migration SQL có phiên bản được sinh bởi Drizzle Kit
├── tests/e2e/        # vị trí Playwright test
├── public/           # static asset
└── docs/             # tài liệu dự án
```

CHG-006 đã thêm root config, `.env.example`, app shell và baseline test. CHG-007 đã hoàn thành schema, migration SQL, database client, seed script và schema unit tests trong `src/db/` và `drizzle/`, đồng thời áp dụng thành công lên Supabase. CHG-008 đã hoàn thành Auth Server Actions, hệ thống kiểm soát quyền sở hữu và giao diện đăng nhập/đăng ký.

## 10. Trạng thái feature

| Feature | Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|---|
| Auth & Phân quyền | DEC-001 | Implemented | Server actions, ownership helpers, login/register UI hoàn tất |
| Feed/tìm lọc report | FR-01 | Planned | Thuộc CHG-009 |
| Tạo report | FR-02 | Planned | Thuộc CHG-009 |
| Chi tiết report | FR-03 | Planned | Thuộc CHG-009 |
| Potential matches | FR-04 | Planned | Rule đã chốt tại DEC-003; thuộc CHG-010 |
| Claim | FR-05 | Planned | Quy trình đã chốt tại DEC-005; thuộc CHG-011 |
| My Reports/Returned | FR-06 | Planned | Quyền/state rule đã chốt tại DEC-001/DEC-002; thuộc CHG-011 |

## 11. Quyết định và business rule

DEC-001 đến DEC-005 đã được chốt trong [`02_requirements_design.md`](02_requirements_design.md#9-quyết-định-mvp-đã-chốt).
- CHG-007 đã thể chế hóa các quyết định DEC-001, DEC-002 và DEC-005 vào schema Drizzle và migration PostgreSQL, đã kiểm chứng trên Supabase.
- CHG-008 đã triển khai các hàm kiểm tra ràng buộc sở hữu và quyền truy cập (`src/lib/auth/ownership.ts`).
- Trước khi code matching (CHG-010) cần đặc tả phần chuẩn hóa keyword/test dataset.

Mỗi quyết định đáng kể phải có CHG và cập nhật file này sau khi được triển khai/kiểm tra.

## 12. Hạn chế hiện tại

App shell, database schema/client/migration và authentication/authorization đã hoàn thành và kiểm chứng trực tiếp; test unit đạt 25/25; Next.js build thành công. Các màn hình nghiệp vụ tiếp theo (Feed, Create Report, Matching, Claim Flow) thuộc CHG-009 đến CHG-011. Playwright browser launch vẫn bị hạn chế trong môi trường terminal hiện tại với lỗi `spawn UNKNOWN`.
