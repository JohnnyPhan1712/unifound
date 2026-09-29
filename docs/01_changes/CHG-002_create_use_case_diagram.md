# CHG-002: Tạo sơ đồ Use Case UniFound

- ID: `CHG-002`
- Trạng thái: `done`
- Ngày tạo: `2026-09-15`
- Người phụ trách: `Phan Ngọc Đức Huy`
- Branch/PR/Commit: `chưa có`

## Lý do và mục tiêu

Product Brief cần mô tả trực quan actor và chức năng chính. Mục tiêu là tạo một sơ đồ Use Case bám đúng phạm vi MVP đã ghi trong overview/requirements và có thể hiển thị trực tiếp trong report.

## Phạm vi

### Bao gồm

- Actor Sinh viên, Sinh viên mất đồ và Sinh viên nhặt được đồ.
- Các use case feed/search, report, matching, claim, tracking và Returned.
- PlantUML source và SVG preview.
- Nhúng sơ đồ vào report yêu cầu/thiết kế.

### Không bao gồm

- Auth, admin/moderation, notification, chat hoặc chức năng ngoài MVP.
- Chốt quyền/state transition đang thuộc DEC-002/DEC-005.
- Sequence, activity, class hoặc database diagram.

## File/tài liệu liên quan

- `docs/02_reports/assets/diagrams/use_case_diagram.puml`.
- `docs/02_reports/assets/diagrams/use_case_diagram.svg`.
- `docs/02_reports/02_requirements_design.md`.
- `docs/02_reports/04_ai_development.md`.

## Acceptance criteria

- [x] Actor và use case khớp FR-01 đến FR-06.
- [x] Có source PlantUML chỉnh sửa được.
- [x] Có SVG hiển thị trực tiếp trong Markdown.
- [x] Report liên kết cả source và hình.
- [x] Nội dung chưa chốt được ghi rõ là Draft.

## Kiểm tra và bằng chứng

- [x] Parse SVG bằng XML parser.
- [x] Kiểm tra PlantUML có đủ `@startuml`/`@enduml` và các alias được tham chiếu hợp lệ.
- [x] Kiểm tra liên kết Markdown nội bộ.
- Kết quả: `đạt`.

## Quyết định và ghi chú

- Máy local chưa có PlantUML/Java/Graphviz; việc gửi source tới PlantUML Server công khai bị chặn để bảo vệ nội dung dự án.
- `.puml` là nguồn chuẩn; SVG preview tương ứng được tạo cục bộ để report vẫn hiển thị hình.
