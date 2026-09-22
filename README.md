# UniFound

UniFound là Mini Project web hỗ trợ sinh viên đăng tin đồ thất lạc, xem các tin có khả năng liên quan và gửi yêu cầu nhận lại đồ.

## Trạng thái

Phạm vi, kiến trúc và Technology Stack của MVP đã được chốt. Cấu trúc root đã chuẩn bị cho một ứng dụng Next.js full-stack; source, package, database schema, test và deployment chưa được triển khai.

## Bắt đầu

1. Đọc [hướng dẫn tài liệu](docs/README.md).
2. Xem [tổng quan và phạm vi hiện tại](docs/02_reports/01_overview.md).
3. Xem [cấu trúc repository](docs/00_guides/01_conventions/folder-structure.md).
4. Trước một công việc đáng kể, đọc [quy trình thay đổi](docs/00_guides/02_workflows/changes-workflow.md).

## Chạy local

Yêu cầu Node.js 24.x và npm 11.x. Từ thư mục repository:

```text
npm ci
copy .env.example .env.local
npm run dev
```

Các lệnh kiểm tra:

```text
npm run typecheck
npm test
npm run test:e2e
npm run build
```

`npm run test:e2e` cần browser Chromium của Playwright; cài một lần bằng `npx playwright install chromium`.
Các biến môi trường trong `.env.example` chỉ là tên biến, không chứa secret.

Không commit secret, dữ liệu cá nhân thật hoặc bằng chứng có thông tin nhạy cảm.
