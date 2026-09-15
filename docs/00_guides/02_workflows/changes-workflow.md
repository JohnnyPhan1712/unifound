# Quy trình quản lý thay đổi

CHG ghi lại lý do, phạm vi, quyết định và việc kiểm tra của một công việc đáng kể. **Một CHG tương ứng một Task trên Notion**, không tương ứng máy móc với từng file hoặc từng commit.

## Khi cần CHG

Tạo CHG cho tài liệu nền tảng, quyết định kỹ thuật, kiến trúc, schema/API, luồng nghiệp vụ, feature, tích hợp, kiểm thử release hoặc deployment. Không cần CHG riêng cho typo hay format nhỏ; ghi cùng công việc đang làm.

## Định danh và trạng thái

- File: `CHG-NNN_lower_snake_case.md`.
- Lấy số tiếp theo từ `docs/01_changes/README.md`; không tái sử dụng ID.
- Trạng thái: `proposed` → `approved` → `in_progress` → `done`; dùng `blocked` hoặc `rejected` khi có lý do.

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

## Quy trình

1. Đọc report, guide và source liên quan.
2. Tạo Task trên Notion và CHG với phạm vi/tiêu chí chấp nhận.
3. Chuyển `in_progress` khi bắt đầu; thực hiện thay đổi nhỏ nhất.
4. Kiểm tra, ghi bằng chứng và cập nhật report phản ánh trạng thái mới.
5. Chuyển `done` khi acceptance criteria đều đạt; thêm commit/PR khi có.

## Template tối thiểu

```markdown
# CHG-NNN: Tên công việc

- ID: `CHG-NNN`
- Trạng thái: `proposed`
- Ngày tạo: `YYYY-MM-DD`
- Người phụ trách: `chưa phân công`
- Notion Task: `Tên Task`
- Sprint/Milestone: `chưa liên kết`
- Branch/PR/Commit: `chưa có`

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
