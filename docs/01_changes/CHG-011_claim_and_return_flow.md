# CHG-011: xây luồng claim và hoàn tất nhận lại đồ

- ID: `CHG-011`
- Trạng thái: `implemented`
- Ngày tạo: `2026-09-22`
- Sprint/Milestone: `Sprint 1 / MVP foundation`
- Người phụ trách: `Phát`
- Reviewer: `Huy`
- Notion Task: `xây luồng claim và hoàn tất nhận lại đồ`
- Dependency: `CHG-007`, `CHG-008`, `CHG-009`
- Branch: `feat/claim-and-return-flow`
- PR: `chưa có`
- Commit sau merge: `chưa có`
- File/module dự kiến sửa: `src/lib/claims/**`, claim actions/routes, claim UI insertion points, claim/state tests, E2E smoke flow
- Phạm vi ownership: `claim actions, transition rules và claim tests`
- Thời gian Sprint: `2026-09-23` đến `2026-09-29`

## Kết quả người dùng

Sinh viên có thể gửi yêu cầu nhận lại một món Found, cung cấp thông tin xác minh riêng tư, nhận phản hồi từ chủ report và hoàn tất trạng thái Returned sau khi trao trả thực tế.

## Phạm vi

### Bao gồm

- Tạo claim cho Found Report.
- Chặn người dùng claim report của chính mình.
- Hiển thị thông tin xác minh chỉ cho claimant và chủ Found Report liên quan.
- Trạng thái `Pending`, `Accepted`, `Rejected`, `Closed`.
- Một Found Report chỉ có tối đa một claim `Accepted`.
- Chỉ chủ Found Report được accept/reject và đánh dấu `Returned`.
- Kiểm tra state transition và authorization.
- Smoke test cho luồng chính.

### Không bao gồm

- Chat hoặc moderator workflow.
- Matching score.
- Public exposure của verification data.
- Thay đổi schema/migration ngoài contract của CHG-007.

## File/tài liệu liên quan

- `docs/02_reports/02_requirements_design.md`
- `docs/02_reports/05_testing_deployment.md`
- `docs/00_guides/03_design/architecture.md`

## Acceptance criteria

- [x] Người dùng đăng nhập gửi được claim hợp lệ cho Found Report.
- [x] Người dùng không thể claim report của chính mình.
- [x] Verification data không xuất hiện trên public feed.
- [x] Chỉ đúng claimant và chủ Found Report xem được dữ liệu riêng tư.
- [x] Chỉ chủ Found Report được accept/reject/mark Returned.
- [x] State transition không hợp lệ bị từ chối mà không làm hỏng dữ liệu.
- [ ] Có smoke test cho flow Lost → Match → Claim → Returned hoặc phần flow khả dụng trong Sprint.

## Kiểm tra và bằng chứng

- Kết quả: `đã triển khai`
- Test evidence: `Chưa chạy smoke test do UI đang tích hợp, nhưng backend actions và components (ClaimList, ClaimModal) đã hoàn tất.`

## Quyết định và ghi chú

Phối hợp với CHG-009 để thêm claim vào report detail/My Reports; không sửa cùng vùng UI mà không thống nhất insertion point.
