# Phát triển

> Trạng thái: **Not Started**. File này chỉ phản ánh implementation có bằng chứng; thiết kế dự kiến nằm trong `02_requirements_design.md`.

## 1. Technology Stack

Stack mục tiêu đã chốt tại [DEC-004](02_requirements_design.md#dec-004--stack-và-triển-khai). Lý do lựa chọn và ranh giới trách nhiệm được giải thích tại [Technology Stack](02_requirements_design.md#10-technology-stack); file này chỉ theo dõi cách dùng thực tế.

| Thành phần | Công nghệ/phiên bản | Trạng thái | Bằng chứng |
|---|---|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS | Not Started | Chưa có source/lockfile |
| Backend | Next.js server, Zod, Drizzle ORM | Not Started | Chưa có source/lockfile |
| Data storage/Auth | PostgreSQL + Supabase, Supabase Auth | Not Started | Chưa có schema/migration |
| Testing | Vitest, Playwright | Not Started | Chưa có test/config |
| Deployment | Vercel | Not Started | Chưa có URL/build |

Phiên bản thực tế phải lấy từ manifest/lockfile, không suy ra từ tài liệu brainstorm.

## 2. Runtime

| Thành phần | Phiên bản | Trạng thái |
|---|---|---|
| Node.js | `TBD` | Chưa có manifest/toolchain config |
| Package manager | `TBD` | Chưa có lockfile |
| TypeScript | `TBD` | Planned; chưa có `package.json` |

Không tự chọn version trước khi project được khởi tạo và kiểm tra.

## 3. Main packages

Hiện chưa có `package.json`; không package nào được ghi là Installed.

| Mục đích | Package dự kiến | Trạng thái |
|---|---|---|
| Application | `next`, `typescript` | Planned |
| UI | `tailwindcss` | Planned |
| Validation | `zod` | Planned |
| ORM | `drizzle-orm` | Planned |
| Supabase/Auth client | `@supabase/supabase-js` | Planned |
| Unit Test | `vitest` | Planned |
| End-to-End Test | `@playwright/test` | Planned |
| PostgreSQL driver và công cụ Migration | `TBD` | Chưa chốt theo implementation |

Package và version cuối cùng phải được cập nhật từ `package.json`/lockfile sau khi cài đặt.

## 4. Environment variables

Tên dự kiến theo kiến trúc đã chọn; giá trị thật không được ghi vào tài liệu hoặc commit.

| Biến | Phạm vi | Trạng thái/Mục đích |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server | Planned — địa chỉ project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server | Planned — public/anonymous key cho Supabase client |
| `DATABASE_URL` | Chỉ server | Planned — kết nối PostgreSQL cho Drizzle/Migration |

Tên biến phải được xác nhận lại theo code và cấu hình Supabase thực tế. Không đưa database password hoặc secret server vào biến có tiền tố `NEXT_PUBLIC_`.

## 5. Local development

Chưa có implementation hoặc scripts đã kiểm tra. Các lệnh sau giữ `TBD` đến khi tồn tại trong `package.json`:

| Thao tác | Lệnh | Trạng thái |
|---|---|---|
| Install | `TBD` | Chờ chọn package manager |
| Run development | `TBD` | Chờ khởi tạo project |
| Unit Test | `TBD` | Chờ setup Vitest |
| End-to-End Test | `TBD` | Chờ setup Playwright |
| Build | `TBD` | Chờ khởi tạo project |

## 6. Database workflow

```text
Drizzle schema
      ↓
Migration có phiên bản
      ↓
PostgreSQL trên Supabase
```

- **Schema design:** định nghĩa bảng, cột, quan hệ và constraint theo DEC-001/DEC-002; hiện chưa triển khai.
- **Migration:** tạo và áp dụng thay đổi schema có phiên bản; package/lệnh cụ thể là `TBD` đến khi setup Drizzle.
- **Seed demo data:** chạy riêng sau Migration; không thay schema và không chứa dữ liệu cá nhân hoặc thông tin xác minh nhạy cảm thật.

## 7. Testing

| Công cụ | Phạm vi chính | Lệnh | Trạng thái |
|---|---|---|---|
| Vitest | Matching score, validation helper, state transition, business rule độc lập | `TBD` | Planned |
| Playwright | Luồng login → report → claim → accept → returned trên ứng dụng hoàn chỉnh | `TBD` | Planned |

Chỉ ghi lệnh chạy sau khi config và script tương ứng tồn tại, chạy thành công.

## 8. Deployment

- Target: Vercel (`Planned`).
- Cấu hình environment variables trên môi trường deploy bằng đúng tên được code sử dụng; không commit giá trị thật.
- Build command và cấu hình runtime: `TBD` đến khi project được khởi tạo.
- Production/demo URL: `TBD`; không tạo URL giả.

## 9. Cấu trúc hiện tại

```text
unifound/
├── src/
│   ├── app/      # vị trí Next.js app; chưa có source
│   └── db/       # vị trí Drizzle schema/client; chưa có source
├── drizzle/      # vị trí Migration; hiện rỗng
├── tests/e2e/    # vị trí Playwright test; hiện rỗng
├── public/       # static asset; hiện rỗng
└── docs/         # tài liệu dự án
```

Layout một application ở root thay cho ba project `frontend/`, `backend/`, `database/`. Cấu trúc chi tiết theo [`folder-structure.md`](../00_guides/01_conventions/folder-structure.md); package/config chỉ được tạo khi khởi tạo implementation.

## 10. Trạng thái feature

| Feature | Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|---|
| Feed/tìm lọc report | FR-01 | Planned | Chưa triển khai |
| Tạo report | FR-02 | Planned | Chưa triển khai |
| Chi tiết report | FR-03 | Planned | Chưa triển khai |
| Potential matches | FR-04 | Planned | Rule đã chốt tại DEC-003; chưa triển khai |
| Claim | FR-05 | Planned | Quy trình đã chốt tại DEC-005; chưa triển khai |
| My Reports/Returned | FR-06 | Planned | Quyền/state rule đã chốt tại DEC-001/DEC-002; chưa triển khai |

## 11. Quyết định và business rule

DEC-001 đến DEC-005 đã được chốt trong [`02_requirements_design.md`](02_requirements_design.md#9-quyết-định-mvp-đã-chốt). Trước khi code matching cần đặc tả phần chuẩn hóa keyword/test dataset; trước khi tạo seed cần chốt danh sách location đầy đủ.

Mỗi quyết định đáng kể phải có CHG và cập nhật file này sau khi được triển khai/kiểm tra.

## 12. Hạn chế hiện tại

Chưa có ứng dụng chạy được, test, demo data hoặc deployment. Không có feature nào được xem là implemented.
