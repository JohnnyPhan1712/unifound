# Phát triển có hỗ trợ bởi AI

AI là công cụ hỗ trợ; nhóm chịu trách nhiệm review, quyết định và xác minh. Chỉ chọn khoảng 5–10 tương tác có ý nghĩa, không chép toàn bộ chat.

## 1. Công cụ AI

| Công cụ | Mục đích | Nhiệm vụ |
|---|---|---|
| Codex + Ponytail | Phân tích yêu cầu và thiết lập tài liệu tối thiểu | AI-LOG-001 |

## 2. AI Development Log

### AI-LOG-001 — Thiết lập tài liệu nền tảng UniFound

**Task**

Đọc khung repository UniFound và tài liệu CampusLoop, sau đó tạo bộ guide/report ban đầu phù hợp Mini Project.

**AI Tool**

Codex với Ponytail.

**Input / Context**

- Checklist Mini Project do người dùng tổng hợp.
- Ý tưởng brainstorm UniFound và flow Lost → Match → Claim → Returned.
- `D:\Workspace\Projects\campusloop-system\docs` làm tài liệu tham khảo.
- Yêu cầu không tạo `current_system`, dùng report để xem hiện trạng và chưa tạo guide database/API chuyên biệt.

**AI Output**

- Tổ chức `00_guides`, `01_changes`, `02_reports`.
- Điền baseline problem/scope/user stories/requirements/test plan và đánh dấu phần chưa chốt.
- Tạo CHG-001 ánh xạ với một Task Notion.

**Human Decision**

- Quyết định: **Modified**.
- Lý do: người dùng chủ động sửa mô hình CampusLoop bằng cách bỏ `current_system`, dùng report làm nguồn hiện trạng và giới hạn guide ở nội dung chung.

**Verification**

- Đối chiếu report với checklist deliverable Mini Project.
- Kiểm tra liên kết Markdown nội bộ và tìm tham chiếu sai tới `current_system`.
- Review diff để bảo đảm không tự chốt stack, schema, API hoặc matching rule.
- Bằng chứng: `docs/01_changes/CHG-001_initial_project_documentation.md` và commit/PR sẽ bổ sung sau.

**Result**

Baseline tài liệu đã được tạo; người phụ trách cần review nội dung dự án và liên kết Task/Document trong Notion.

### AI-LOG-002 — Tạo sơ đồ Use Case UniFound

**Task**

Phân tích overview/requirements, tạo sơ đồ Use Case bằng PlantUML và hiển thị trong report.

**AI Tool**

Codex với Ponytail.

**Input / Context**

Các user story US-01–US-05, yêu cầu FR-01–FR-06 và phạm vi MVP trong report.

**AI Output**

PlantUML source, SVG preview cục bộ và phần Use Case Diagram trong `02_requirements_design.md`.

**Human Decision**

- Quyết định: **Accepted** theo yêu cầu tạo sơ đồ; nội dung nghiệp vụ vẫn là Draft chờ nhóm review.
- Lý do: sơ đồ chỉ chứa actor/use case đã có, không mở rộng auth, admin hay chức năng ngoài MVP.

**Verification**

- Đối chiếu từng use case với FR-01–FR-06.
- Parse SVG, kiểm tra cấu trúc PlantUML và liên kết Markdown.
- Bằng chứng: `docs/01_changes/CHG-002_create_use_case_diagram.md`.

**Result**

Report có thể hiển thị SVG và liên kết tới source PlantUML để chỉnh sửa/render lại.

## 3. Quyết định quan trọng có AI hỗ trợ

### Dùng report làm nguồn hiện trạng

- Đề xuất tham khảo: CampusLoop tách guide, current system, change và report.
- Đánh giá của người dùng: `current_system` gây trùng với report trong phạm vi Mini Project.
- Quyết định cuối: bỏ `current_system`; mọi tuyên bố hiện trạng nằm trong report tương ứng.
- Kiểm soát: nội dung dự kiến phải có nhãn Draft/Planned/TBD.

### Chỉ tạo guide chung ở baseline

- Đề xuất tham khảo: CampusLoop có guide riêng cho API, database, role và technology stack.
- Đánh giá của người dùng: các thiết kế đó chưa được UniFound chốt.
- Quyết định cuối: chỉ tạo convention, workflow và design overview chung; thêm guide chuyên biệt khi có một công việc thật sự cần nó.
- Kiểm soát: các câu hỏi kỹ thuật mở được ghi trong report thay vì biến giả định thành specification.

## 4. AI tool comparison — bắt buộc, chưa thực hiện

Chọn đúng một task nhỏ, cung cấp cùng yêu cầu cho hai AI và lưu bằng chứng trong `assets/ai/`.

| Tiêu chí | AI A | AI B |
|---|---|---|
| Mức đáp ứng yêu cầu | TBD | TBD |
| UI/UX hoặc chất lượng đầu ra | TBD | TBD |
| Code dễ đọc | TBD | TBD |
| Responsive | TBD | TBD |
| Lỗi/số lần sửa | TBD | TBD |

- Task so sánh: `TBD` (gợi ý: Create Lost Report UI).
- Kết luận theo độ phù hợp với task, không kết luận một công cụ tốt hơn mọi mặt.

## 5. Quy tắc

- Không đưa secret hoặc dữ liệu cá nhân nhạy cảm vào prompt/repository.
- Review code/tài liệu do AI tạo trước khi merge.
- Với output quan trọng, ghi rõ Accepted/Modified/Rejected và lý do.
- Verification phải nêu phương pháp và bằng chứng, không chỉ ghi “đã kiểm tra”.
- Câu hỏi cú pháp, dịch thuật hoặc sửa chính tả không cần đưa vào 5–10 logs chọn lọc.
