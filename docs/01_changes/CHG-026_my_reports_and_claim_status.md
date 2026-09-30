# CHG-026: My Reports / Claim Status (SCR-05)

- ID: `CHG-026`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-025`
- File/module dự kiến sửa/tạo: `src/app/my-reports/page.tsx`, `src/lib/reports/my-queries.ts`, `src/components/my-reports/*`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Người dùng theo dõi report của mình, các claim mình đã gửi và các claim gửi đến report của mình, thấy rõ hành động tiếp theo.

## Phạm vi

### Bao gồm

- Trang yêu cầu đăng nhập theo mockup `05_my_reports.html`, ba khu: Report của tôi, Claim tôi đã gửi, Claim gửi đến tôi.
- Hiển thị trạng thái claim/report bằng chữ + badge; gợi ý hành động tiếp theo (vd: "Chờ chủ report duyệt", "Xử lý claim", "Đánh dấu đã trả").
- Link nhanh sang trang chi tiết để hành động (dùng lại panel CHG-025).
- Loading, empty từng khu, error; mobile.

### Các lưu ý

- Chỉ hiển thị dữ liệu của chính người dùng; thông tin xác minh chỉ hiện ở claim gửi đến mình và claim do mình gửi.
- Không thêm logic chuyển trạng thái mới.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` FR-06, SCR-05, mục 4
- Mockup `05_my_reports.html`, `DESIGN.md`

## Acceptance criteria

- [ ] Chưa đăng nhập → redirect login.
- [ ] Ba khu hiển thị đúng dữ liệu theo user; user khác không thấy dữ liệu của nhau.
- [ ] Trạng thái và hành động tiếp theo rõ, đúng với trạng thái thật.
- [ ] Empty state cho từng khu khi chưa có dữ liệu.
- [ ] Trạng thái cập nhật sau khi Accept/Reject/Returned.
- [ ] Không tràn ngang ở 375px.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-026-01 | Vitest hàm map trạng thái → nhãn/hành động tiếp theo | Đúng từng trạng thái | | Pending | |
| TC-026-02 | E2E claimant xem claim đã gửi | Thấy Pending/Accepted đúng | | Pending | |
| TC-026-03 | E2E chủ report xem claim gửi đến | Thấy claim + link xử lý | | Pending | |
| TC-026-04 | E2E user mới chưa có dữ liệu | Empty state ba khu | | Pending | |
| TC-026-05 | E2E anon vào `/my-reports` | Redirect login | | Pending | |
| TC-026-06 | Kiểm tra cô lập dữ liệu giữa hai user | Không thấy dữ liệu của nhau | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run dev     # đăng nhập lần lượt owner và claimant → /my-reports
npm test
npm run test:e2e -- my-reports
```
