# Cấu trúc repository

```text
unifound/
├── src/
│   ├── app/                  # Next.js routes, UI và server entry points
│   └── db/                   # Drizzle schema và database client
├── drizzle/                  # Migration được sinh và quản lý bởi Drizzle
├── tests/
│   └── e2e/                  # Playwright End-to-End Test
├── public/                   # Static asset của ứng dụng
├── docs/
│   ├── 00_guides/            # Quy tắc và định hướng
│   ├── 01_changes/           # Hồ sơ từng công việc
│   └── 02_reports/           # Product Brief và trạng thái hiện tại
├── package.json              # Package và scripts sau khi khởi tạo
├── drizzle.config.*          # Cấu hình Drizzle sau khi setup
├── next.config.*             # Cấu hình Next.js khi cần
├── playwright.config.*       # Cấu hình Playwright sau khi setup
├── tsconfig.json             # Cấu hình TypeScript sau khi khởi tạo
├── AGENT.md
└── README.md
```

## Quy tắc

- Next.js UI và server-side logic nằm trong cùng một application ở root; không tách lại thành `frontend/` và `backend/` khi chưa có nhu cầu đã được phê duyệt.
- Route-specific UI, Server Actions và Route Handlers đặt gần route trong `src/app/`; chỉ tạo `src/components/` hoặc `src/lib/` khi có code dùng chung thật sự.
- Drizzle schema/database client đặt trong `src/db/`; Migration chỉ có một nguồn chính tại `drizzle/`.
- Vitest test nhỏ đặt cạnh module dưới dạng `*.test.ts`/`*.test.tsx`; Playwright test luồng hoàn chỉnh đặt trong `tests/e2e/`.
- Các file config trong sơ đồ chỉ được tạo bởi bước setup tương ứng, không tạo file rỗng trước implementation.
- Asset của report đặt trong `docs/02_reports/assets/{ai,diagrams,testing,ui}/`.
- Không tạo `current_system`; cập nhật file tương ứng trong `02_reports`.
