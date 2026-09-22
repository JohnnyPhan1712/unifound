# CHG-009: xây chức năng đăng, tìm và xem chi tiết report

- ID: `CHG-009`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-22`
- Sprint/Milestone: `Sprint 1 / MVP foundation`
- Người phụ trách: `Chiến`
- Reviewer: `Thế Anh`
- Notion Task: `xây chức năng đăng, tìm và xem chi tiết report`
- Dependency: `CHG-006`, `CHG-007`, `CHG-008`
- Branch: `feat/report-discovery-and-submission`
- PR: `chưa có`
- Commit sau merge: `chưa có`
- File/module dự kiến sửa: `src/app/**` report routes/components, report validation adapter, UI states
- Phạm vi ownership: `report UI, report routes và report submission experience`
- Thời gian Sprint: `2026-09-23` đến `2026-09-29`

## Kết quả người dùng

Sinh viên có thể xem danh sách báo mất/báo tìm thấy, tìm kiếm hoặc lọc, mở chi tiết một món đồ và gửi report mới với thông tin hợp lệ trên desktop hoặc mobile.

## Phạm vi

### Bao gồm

- Feed public cho Lost và Found Report.
- Tìm kiếm/lọc theo phạm vi MVP đã chốt.
- Trang chi tiết report và trạng thái an toàn cho người xem.
- Form tạo Lost hoặc Found Report.
- Validation rõ ràng cho field bắt buộc.
- Category và location theo danh sách được nhóm phê duyệt.
- Loading, empty, error và responsive states.

### Không bao gồm

- Tự quyết định quyền ở frontend.
- Sửa database schema hoặc migration.
- Tự triển khai matching rule.
- Claim state transition.

## File/tài liệu liên quan

- `docs/02_reports/01_overview.md`
- `docs/02_reports/02_requirements_design.md`
- `docs/02_reports/05_testing_deployment.md`

## Acceptance criteria

- [ ] Người dùng chưa đăng nhập xem được feed và detail public.
- [ ] Người dùng đăng nhập tạo được Lost và Found Report hợp lệ.
- [ ] Field thiếu hoặc sai không được lưu và có lỗi dễ hiểu.
- [ ] Feed, form và detail dùng server contract, không tự bỏ qua authorization.
- [ ] UI không tràn trên desktop/mobile và có loading/empty/error state.

## Kiểm tra và bằng chứng

- Kết quả: `chưa kiểm tra`
- Evidence UI/test: `chưa có`

## Quyết định và ghi chú

Phạm vi report UI cần thống nhất insertion point với CHG-011 cho claim và My Reports; không sửa cùng vùng component nếu chưa trao đổi.
