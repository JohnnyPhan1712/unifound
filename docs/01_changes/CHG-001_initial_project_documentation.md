# CHG-001: Thiết lập tài liệu nền tảng UniFound

- ID: `CHG-001`
- Trạng thái: `done`
- Ngày tạo: `2026-09-15`
- Người phụ trách: `Phan Ngọc Đức Huy`
- Branch/PR/Commit: `chưa có`

## Lý do và mục tiêu

Repository đã có khung guide/report nhưng phần lớn chưa có nội dung. Nhóm cần một nguồn chung để bắt đầu Mini Project, quản lý mỗi công việc bằng CHG và dùng report làm nơi phản ánh trạng thái hiện tại thay cho `current_system`.

Mục tiêu là thiết lập bộ tài liệu tối thiểu từ yêu cầu môn học và ý tưởng UniFound, đồng thời giữ các quyết định sản phẩm/kỹ thuật chưa được nhóm chốt ở trạng thái Draft/TBD.

## Phạm vi

### Bao gồm

- Mô tả cách đọc và cập nhật tài liệu.
- Quy ước coding, naming, cấu trúc thư mục, Git và CHG.
- Định hướng kiến trúc/roadmap tối thiểu.
- Điều chỉnh khung report theo deliverable Mini Project.
- Điền bối cảnh, phạm vi, user stories và test plan ban đầu từ thông tin đã có.

### Không bao gồm

- Chốt stack, schema, API, auth hoặc công thức matching.
- Tạo source frontend/backend, database, wireframe, slide hay deployment.
- Khẳng định test, bug fix hoặc feature chưa có bằng chứng.
- Tạo `current_system`, knowledge base hoặc guide database/API riêng.

## File/tài liệu liên quan

- `README.md`, `AGENT.md`, `docs/README.md`.
- `docs/00_guides/`.
- `docs/01_changes/`.
- `docs/02_reports/`.

## Acceptance criteria

- [x] Có điểm bắt đầu và thứ tự đọc rõ ràng cho thành viên/AI.
- [x] `00_guides`, `01_changes`, `02_reports` có vai trò không trùng nhau.
- [x] CHG ánh xạ 1–1 với Task Notion và có template tối thiểu.
- [x] Report bao phủ Product Brief, AI log/comparison, testing/bug evidence, deployment và kết quả.
- [x] Ý tưởng chưa chốt được ghi rõ là Draft/Planned/TBD.
- [x] Không tạo thư mục `current_system` hoặc guide chuyên biệt chưa cần.

## Kiểm tra và bằng chứng

- [x] Kiểm tra liên kết Markdown nội bộ.
- [x] Tìm placeholder trống, khẳng định triển khai sai và tham chiếu `current_system`.
- [x] Đối chiếu cấu trúc report với checklist Mini Project do người dùng cung cấp.
- Kết quả: `đạt`.

## Quyết định và ghi chú

- Report đồng thời là Product Brief và nguồn tình hình hiện tại để tránh duy trì hai bộ tài liệu.
- Một CHG cho toàn bộ công việc khởi tạo tài liệu vì các file cùng tạo ra một baseline duy nhất; tách theo từng file sẽ không tạo thêm kết quả độc lập.
- Sau khi tạo commit, bổ sung hash vào trường `Branch/PR/Commit` và liên kết CHG này với Task/Document tương ứng trên Notion.
