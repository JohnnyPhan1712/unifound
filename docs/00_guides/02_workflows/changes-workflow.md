# Quy trình quản lý thay đổi

CHG ghi lại lý do, phạm vi, quyết định và việc kiểm tra của một công việc đáng kể. **Một CHG tương ứng một Task trên Notion**, không tương ứng máy móc với từng file hoặc từng commit.

Đơn vị triển khai mặc định là **một Task = một CHG = một branch = một pull request**. Một CHG có thể có nhiều commit, nhưng chỉ có một người phụ trách cuối cùng.

## Khi cần CHG

Tạo CHG cho tài liệu nền tảng, quyết định kỹ thuật, kiến trúc, schema/API, luồng nghiệp vụ, feature, tích hợp, kiểm thử release hoặc deployment. Không cần CHG riêng cho typo hay format nhỏ; ghi cùng công việc đang làm.

## Định danh và trạng thái

- File: `CHG-NNN_lower_snake_case.md`.
- Lấy số tiếp theo từ `docs/01_changes/README.md`; không tái sử dụng ID.
- Trạng thái: `proposed` → `approved` → `in_progress` → `in_review` → `done`; dùng `waiting_for_integration` khi phần độc lập đã xong nhưng còn chờ dependency, `blocked` khi không thể tiếp tục và `rejected` khi bị hủy.

## Ánh xạ với Notion

| Notion | CHG |
|---|---|
| Task Name | Tiêu đề và mục tiêu CHG |
| Status, Priority, Story Points, dates | Quản lý trong Task; CHG chỉ ghi trạng thái thực hiện cần truy vết |
| Assignee | Người phụ trách |
| Related Sprint | Sprint/Milestone |
| Related Documents | Các report/guide bị thay đổi |
| Evidence | Commit, PR, test hoặc asset ghi trong CHG |

Task quản lý tiến độ; CHG quản lý ngữ cảnh kỹ thuật. Không sao chép toàn bộ thuộc tính Notion vào Markdown.

## Phân công và tránh xung đột

- Milestone và Sprint chỉ dùng để lập kế hoạch; không tạo branch riêng cho Milestone hoặc Sprint.
- Mỗi Task/CHG có một `Owner` chịu trách nhiệm về phạm vi, review và đóng công việc. Có thể ghi thêm contributor, nhưng không chia một CHG thành nhiều owner ngang nhau.
- Trước khi chuyển sang `in_progress`, phải khai báo các file/module dự kiến sửa, reviewer, dependency và các Task có thể chạm cùng khu vực.
- Không để hai Task đồng thời sửa cùng migration, schema, cấu hình hoặc cùng một vùng tài liệu trung tâm nếu chưa thống nhất thứ tự thực hiện.
- Nếu hai Task bắt buộc dùng chung file, chia rõ vùng sở hữu hoặc tạo một Task tích hợp; dependency phải được ghi trong Notion và CHG.
- Không format, đổi tên hoặc refactor ngoài phạm vi vì việc đó làm tăng diện tích conflict và khó review.

## Quy tắc cho AI khi xử lý dependency

- AI chỉ thực hiện phạm vi của CHG hiện tại; không tự làm thay scope của CHG khác.
- Dependency không nhất thiết ngăn việc bắt đầu. AI có thể làm phần độc lập, unit test, mock hoặc interface đã thống nhất.
- AI không được tự sửa schema, auth helper, component hoặc module thuộc ownership của CHG khác để hoàn tất công việc của mình.
- Khi dependency chưa sẵn sàng, AI phải ghi rõ trong CHG:
	- `Đang chờ`: CHG nào;
	- `Đã hoàn thành`: phần độc lập nào;
	- `Chưa thể tích hợp`: phần nào;
	- `Điều kiện tiếp tục`: contract, merge hoặc evidence cần có.
- Dùng `waiting_for_integration` khi phần độc lập đã hoàn thành và chỉ còn chờ ghép với dependency. Dùng `blocked` khi dependency hoặc quyết định còn thiếu khiến không thể tiếp tục phần đang làm.
- Không chuyển `done` chỉ vì code cục bộ đã chạy; `done` yêu cầu acceptance criteria, integration, test, review, merge và evidence đầy đủ.

## Điều kiện sẵn sàng và hoàn tất

### Definition of Ready

Task/CHG chỉ được bắt đầu khi đã có:

- mục tiêu, phạm vi bao gồm và không bao gồm;
- acceptance criteria có thể kiểm tra;
- owner và reviewer;
- Sprint/Milestone, file/module dự kiến sửa và dependency;
- quyết định kỹ thuật cần thiết, hoặc ghi rõ quyết định đó không thuộc phạm vi.

### Definition of Done

CHG chỉ được chuyển sang `done` khi:

- acceptance criteria đều đạt và bằng chứng kiểm tra đã được ghi;
- branch đã cập nhật từ `main`, conflict đã được xử lý trên branch công việc;
- pull request đã được reviewer chấp thuận và merge;
- CHG có link PR, commit sau merge và các report/asset liên quan đã được cập nhật;
- Notion Task và CHG cùng phản ánh trạng thái hoàn tất.

## Quy trình

1. Đọc report, guide và source liên quan.
2. Tạo Task trên Notion, gắn Milestone/Sprint, owner, reviewer, dependency và acceptance criteria.
3. Tạo CHG tương ứng, khai báo file/module dự kiến sửa và kiểm tra Definition of Ready.
4. Tạo branch cho CHG, chuyển `in_progress` và thực hiện thay đổi nhỏ nhất.
5. Nếu dependency chưa sẵn sàng, thực hiện phần độc lập; ghi rõ phần chờ và chuyển `waiting_for_integration` hoặc `blocked` thay vì mở rộng sang CHG khác.
6. Chạy kiểm tra, ghi bằng chứng và cập nhật report phản ánh trạng thái mới.
7. Cập nhật branch từ `main`, xử lý conflict trên branch công việc và mở pull request.
8. Sau khi dependency được bàn giao, tiếp tục integration; chỉ sau khi reviewer chấp thuận và PR được merge mới bổ sung evidence và chuyển CHG/Notion Task sang `done`.

## Template tối thiểu

```markdown
# CHG-NNN: Tên công việc

- ID: `CHG-NNN`
- Trạng thái: `proposed`
- Ngày tạo: `YYYY-MM-DD`
- Người phụ trách: `chưa phân công`
- Reviewer: `chưa phân công`
- Notion Task: `Tên Task`
- Sprint/Milestone: `chưa liên kết`
- Dependency: `không có`
- File/module dự kiến sửa: `chưa xác định`
- Branch: `chưa có`
- PR: `chưa có`
- Commit sau merge: `chưa có`

## Lý do và mục tiêu

## Phạm vi
### Bao gồm
### Không bao gồm

## File/tài liệu liên quan

## Acceptance criteria
- [ ]

## Kiểm tra và bằng chứng
- Kết quả: `chưa kiểm tra`

## Quyết định và ghi chú
```
