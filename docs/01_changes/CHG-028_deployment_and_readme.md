# CHG-028: Deploy Vercel, README và URL demo

- ID: `CHG-028`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-027`
- File/module dự kiến sửa/tạo: `README.md`, cấu hình Vercel (dashboard/`vercel.json` nếu cần), `.env.example`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Ứng dụng chạy trên một URL demo công khai với dữ liệu mẫu; người mới clone repo làm theo README chạy được local.

## Phạm vi

### Bao gồm

- README: giới thiệu, yêu cầu môi trường, cài đặt (`npm ci`), biến môi trường, migrate, seed, chạy dev/test/build, tài khoản demo.
- `.env.example` chỉ có tên biến, không giá trị thật.
- Cấu hình Vercel: biến môi trường theo đúng tên code dùng, build `npm run build`.
- Cấu hình Supabase cho môi trường demo (redirect URL cho Auth/magic link), chạy migration và seed.
- Smoke test trên URL thật; ghi URL demo vào CHG (không tạo URL giả).

### Các lưu ý

- Không commit secret, `.env` hoặc dữ liệu cá nhân thật.
- Không sửa `docs/02_reports/` (Team Lead cập nhật báo cáo và URL khi cần).
- Không thêm tính năng mới.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/03_development.md` mục 4, 5, 8
- `package.json`; kết quả CHG-027

## Acceptance criteria

- [ ] Có URL demo truy cập được công khai.
- [ ] Đăng nhập tài khoản demo và chạy hết luồng chính trên URL demo.
- [ ] README đủ để người mới chạy local theo từng bước.
- [ ] `.env.example` có đủ tên biến, không giá trị thật; repo không chứa secret.
- [ ] Magic link/redirect Auth hoạt động trên URL demo (hoặc ghi giới hạn).
- [ ] `npm run build` pass trên Vercel.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-028-01 | Làm theo README trên máy sạch/thư mục clone mới | Chạy được dev | | Pending | |
| TC-028-02 | Mở URL demo, xem feed | Thấy dữ liệu seed | | Pending | screenshot |
| TC-028-03 | Golden path trên URL demo | Hoàn tất tới Returned | | Pending | |
| TC-028-04 | Quét repo tìm secret/`.env` | Không có | | Pending | |
| TC-028-05 | Mở URL demo trên mobile | Dùng được, không tràn ngang | | Pending | screenshot |

## Hướng dẫn tự chạy

```
npm ci
cp .env.example .env.local   # điền giá trị thật cục bộ
npm run db:migrate
npm run db:seed
npm run build
```
