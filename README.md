# UniFound

UniFound là Mini Project web hỗ trợ sinh viên đăng tin đồ thất lạc, xem các tin có khả năng liên quan và gửi yêu cầu nhận lại đồ.

## Features

- **Feed công khai** — xem các Lost/Found Report từ sinh viên khác
- **Đăng ký và quản lý** — tạo Lost Report hoặc Found Report với thông tin cơ bản
- **Gợi ý tự động** — xem các report tương đồng và điểm khớp để ưu tiên kiểm tra
- **Gửi yêu cầu nhận đồ** — gửi claim kèm thông tin xác minh riêng tư
- **Theo dõi quá trình** — kiểm tra trạng thái report/claim và hoàn thành flow khi đã trả đồ

## Tech Stack

- **Frontend & Server:** Next.js, React, TypeScript
- **Database & ORM:** PostgreSQL (Supabase), Drizzle ORM
- **Authentication:** Supabase Auth (email/password)
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Testing:** Vitest (unit), Playwright (E2E)
- **Deployment:** Vercel

## Trạng thái

Phạm vi, kiến trúc và Technology Stack của MVP đã được chốt. Cấu trúc root đã chuẩn bị cho một ứng dụng Next.js full-stack; source, package, database schema, test và deployment chưa được triển khai.

## Installation

**Yêu cầu:** Node.js 24.x và npm 11.x

```bash
git clone <repo-url>
cd unifound
npm ci
cp .env.example .env.local
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

`npm run test:e2e` cần browser Chromium của Playwright; cài một lần bằng `npx playwright install chromium`.
Các biến môi trường trong `.env.example` chỉ là tên biến, không chứa secret.

## Project Structure

```
unifound/
├── src/
│   ├── app/              # Next.js routes, UI và server actions
│   └── db/               # Drizzle schema và database client
├── tests/
│   └── e2e/              # Playwright E2E tests
├── public/               # Static assets
├── docs/                 # Tài liệu dự án
├── drizzle/              # Database migrations
├── package.json
├── tsconfig.json
└── README.md
```
