# Phát triển có hỗ trợ bởi AI

AI là công cụ hỗ trợ; nhóm chịu trách nhiệm review, quyết định và xác minh. Chỉ chọn khoảng 5–10 tương tác có ý nghĩa, không chép toàn bộ chat.

## 1. Công cụ AI

| Công cụ | Mục đích | Nhiệm vụ |
|---|---|---|
| Codex | Phân tích yêu cầu và thiết lập tài liệu tối thiểu | AI-LOG-001 |

## 2. AI Development Log

### AI-LOG-001 — Thiết lập tài liệu nền tảng UniFound

**Task**

Đọc khung repository UniFound, sau đó tạo bộ guide/report ban đầu phù hợp Mini Project.

**AI Tool**

Codex.

**Input / Context**

- Checklist Mini Project do người dùng tổng hợp.
- Ý tưởng brainstorm UniFound và flow Lost → Match → Claim → Returned.

**AI Output**

- Tổ chức `00_guides`, `01_changes`, `02_reports`.
- Điền baseline problem/scope/user stories/requirements/test plan và đánh dấu phần chưa chốt.
- Tạo CHG-001 ánh xạ với một Task.

**Human Decision**

- Quyết định: **Modified**.
- Lý do: người dùng chủ động sửa mô hình CampusLoop bằng cách bỏ `current_system`, dùng report làm nguồn hiện trạng và giới hạn guide ở nội dung chung.

**Verification**

- Đối chiếu report với checklist deliverable Mini Project.
- Review diff để bảo đảm không tự chốt stack, schema, API hoặc matching rule.
- Bằng chứng: `docs/01_changes/CHG-001_initial_project_documentation.md`.

**Result**

Baseline tài liệu đã được tạo; 

## 3. Quyết định quan trọng có AI hỗ trợ

### Dùng report làm nguồn hiện trạng

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
- **Ghi log ngay trong CHG của Task** — mục “Trong khi làm — Ghi log” ở `docs/00_guides/changes-workflow.md`. Cuối Sprint, Team Lead đọc lại chọn logs tốt nhất để chép vào tài liệu này.
