# CHG-008: tích hợp đăng nhập và phân quyền sở hữu

- ID: `CHG-008`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-22`
- Sprint/Milestone: `Sprint 1 / MVP foundation`
- Người phụ trách: `Quân`
- Reviewer: `Chiến`
- Notion Task: `tích hợp đăng nhập và phân quyền sở hữu`
- Dependency: `CHG-006`, `CHG-007`
- Branch: `feat/auth-and-ownership`
- PR: `chưa có`
- Commit sau merge: `chưa có`
- File/module dự kiến sửa: `src/app/**` auth surfaces, `src/lib/auth/**`, protected server actions/routes, auth tests
- Phạm vi ownership: `auth utilities, session boundary và ownership checks`
- Thời gian Sprint: `2026-09-23` đến `2026-09-29`

## Kết quả người dùng

Sinh viên có thể đăng nhập, đăng xuất và tiếp tục phiên làm việc của mình. Người chưa đăng nhập vẫn có thể xem nội dung công khai, nhưng chỉ người có quyền mới được tạo hoặc quản lý hoạt động cá nhân.

## Phạm vi

### Bao gồm

- Tích hợp Supabase Auth theo lựa chọn email/password hoặc magic link đã được nhóm chốt.
- Session handling cho client và server.
- Giao diện login/logout tối thiểu.
- Bảo vệ thao tác cần đăng nhập.
- Kiểm tra ownership phía server cho report và claim actions.

### Không bao gồm

- Database schema hoặc migration.
- Matching score.
- Claim state transition chi tiết.
- Trang feed và report form đầy đủ.

## File/tài liệu liên quan

- `docs/02_reports/02_requirements_design.md`
- `docs/02_reports/03_development.md`
- `docs/00_guides/03_design/architecture.md`

## Acceptance criteria

- [ ] Người dùng có thể đăng nhập và đăng xuất bằng flow đã chọn.
- [ ] Người chưa đăng nhập không thể thực hiện thao tác cần quyền.
- [ ] Server từ chối thao tác của người không sở hữu dữ liệu.
- [ ] Feed công khai không yêu cầu đăng nhập.
- [ ] Không đưa auth secret vào source hoặc tài liệu.

## Kiểm tra và bằng chứng

- Kết quả: `chưa kiểm tra`
- Auth/ownership tests: `chưa có`

## Quyết định và ghi chú

Các feature khác gọi qua auth boundary này, không tự tạo session helper hoặc ownership check riêng.
