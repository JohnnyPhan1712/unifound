# Định hướng kiến trúc

> Trạng thái: **Approved baseline**. Stack và business rule chi tiết được chốt trong `docs/02_reports/02_requirements_design.md`.

```text
Người dùng
   ↓
Web responsive
   ↓ request / response
Backend / business rules
   ↓
Data storage
```

## Trách nhiệm

- Web: hiển thị feed, form report, chi tiết, potential matches và trạng thái report/claim.
- Backend: validate input, kiểm soát quyền, tính match score và chuyển trạng thái hợp lệ.
- Storage: lưu người dùng, report, kết quả/điều kiện matching và claim theo thiết kế được chốt.

## Nguyên tắc

- Matching rule-based đủ cho MVP; không cần ML/LLM trong sản phẩm.
- Không cho frontend tự quyết định quyền hoặc trạng thái nghiệp vụ.
- Match score là gợi ý, không phải bằng chứng sở hữu.
- Giữ một ứng dụng triển khai đơn giản; chưa có nhu cầu microservice, queue hay search engine riêng.
- Kiến trúc và stack cuối cùng phải được cập nhật trong `docs/02_reports/02_requirements_design.md` và `03_development.md` sau khi chốt/triển khai.

## Stack đã chốt

- Next.js + TypeScript cho web và server/backend; Tailwind CSS cho UI; Zod cho server-side validation.
- Drizzle ORM truy cập PostgreSQL hosted trên Supabase; Supabase Auth xác thực người dùng; Vercel hosting.
- Vitest và Playwright cho kiểm thử.
