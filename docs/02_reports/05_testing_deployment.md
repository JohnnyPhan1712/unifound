# Kiểm thử và triển khai

> Trạng thái: **Planned**. Chưa có test nào được chạy, bug evidence hoặc deployment.

## 1. Phạm vi kiểm thử

- Luồng chính: Lost Report → Potential Matches → Claim → Returned.
- Valid/invalid input, dữ liệu thiếu/trùng, state transition và quyền.
- Matching rule và biên score.
- Loading/empty/error cùng responsive desktop/mobile.
- Build và smoke test trên URL triển khai.

## 2. Test case chính

| ID | Test | Kết quả mong đợi | Trạng thái |
|---|---|---|---|
| TC-001 | Tạo Lost Report hợp lệ | Lưu và hiển thị đúng dữ liệu/trạng thái | Not Tested — chờ CHG-008 (đăng nhập) |
| TC-002 | Tạo Found Report hợp lệ | Lưu và hiển thị đúng dữ liệu/trạng thái | Not Tested — chờ CHG-008 (đăng nhập) |
| TC-003 | Thiếu tên vật phẩm | Không lưu; hiển thị lỗi rõ | Partial — validation server passed (Vitest); UI chưa kiểm tra |
| TC-004 | Thiếu category/field bắt buộc | Không lưu; hiển thị lỗi rõ | Partial — validation server passed (Vitest); UI chưa kiểm tra |
| TC-005 | Matching cùng category/location và ngày gần | Tính score đúng rule đã chốt | Not Tested |
| TC-006 | Matching khác ngày hoặc thiếu dữ liệu | Không lỗi; điểm/loại trừ đúng rule | Not Tested |
| TC-007 | Không có potential match | Hiển thị empty state phù hợp | Not Tested |
| TC-008 | Gửi claim hợp lệ | Lưu claim và cập nhật My Reports | Not Tested |
| TC-009 | Claim trùng/không hợp lệ | Bị từ chối, không tạo dữ liệu sai | Not Tested |
| TC-010 | Chuyển Found thành Returned | Chỉ actor/state hợp lệ được cập nhật | Not Tested |
| TC-011 | Responsive năm màn hình | Không tràn/cản trở thao tác chính | Partial — Passed cho Feed và Create (khách) ở 375px (`tests/e2e/report-discovery.spec.ts`, 2026-09-27); các màn hình còn lại chưa có |

Chi tiết input, precondition, actual result và evidence được bổ sung khi chạy test. Evidence lưu trong `assets/testing/` hoặc liên kết issue/commit.

## 3. Bug evidence bắt buộc

### BUG-001 — TBD

- Biểu hiện: `TBD`.
- Các bước tái hiện: `TBD`.
- Kết quả mong đợi/thực tế: `TBD`.
- Nguyên nhân gốc: `TBD`.
- Fix: `TBD`.
- Verification: `TBD`.
- Commit/issue/evidence: `TBD`.

Không tạo bug giả để đủ checklist; ghi lỗi thật đầu tiên có bằng chứng phát hiện và xử lý.

## 4. Deployment và demo

- Nền tảng/build/config/URL: `TBD`.
- Trạng thái: **Offline / Not Deployed**.
- Demo data và tài khoản demo: `TBD`; không dùng dữ liệu cá nhân thật.
- Luồng demo: tạo Lost Report → xem match → gửi claim → Returned.
- Video dự phòng: `TBD`.

Sau deployment, chạy lại luồng chính trên URL thật và ghi ngày xác minh gần nhất.
