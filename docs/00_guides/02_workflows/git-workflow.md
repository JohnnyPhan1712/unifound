# Quy trình Git

## Branch

- `main`: phiên bản ổn định để demo/deploy.
- Nhóm dùng `main` làm nhánh tích hợp mặc định; không cần `develop` cho quy mô nhỏ.
- Công việc ngắn hạn: `feature/...`, `fix/...`, `docs/...`, `chore/...`.

Một branch chỉ phục vụ một CHG. Không tạo branch theo Sprint hoặc Milestone.

## Luồng làm việc

1. Đồng bộ `main` và tạo branch cho đúng một Task/CHG.
2. Thực hiện thay đổi trong phạm vi file/module đã khai báo; không trộn refactor hoặc format ngoài scope.
3. Chạy kiểm tra phù hợp, cập nhật CHG/report và xem `git status`, `git diff`.
4. Commit rõ nghĩa, push và mở pull request vào `main`. PR phải liên kết CHG và Notion Task.
5. Gán ít nhất một reviewer không phải owner. Reviewer kiểm tra scope, acceptance criteria, test/evidence và nguy cơ conflict.
6. Trước khi merge, owner cập nhật branch từ `main`, xử lý conflict trên branch công việc và chạy lại các kiểm tra bị ảnh hưởng.
7. Chỉ merge sau khi reviewer chấp thuận và checks đạt. Dùng squash merge để giữ lịch sử `main` gọn theo CHG.
8. Sau khi merge, ghi link PR và commit sau merge vào CHG, cập nhật report liên quan rồi mới đóng Notion Task/CHG.

## Quy tắc phối hợp

- Không để hai branch đồng thời sửa cùng migration, schema, config hoặc cùng vùng tài liệu trung tâm nếu chưa thống nhất thứ tự.
- Khi có dependency, Task phụ thuộc phải chờ Task trước merge hoặc ghi rõ cách tích hợp trong CHG.
- Conflict được xử lý bởi owner trên branch của Task; không sửa trực tiếp trên `main` để “giải quyết nhanh”.
- PR nên nhỏ và có một mục tiêu kiểm tra độc lập. Nếu một thay đổi phục vụ nhiều CHG, tạo CHG tích hợp hoặc ghi rõ lý do gộp.
- Không commit secret, file tạm, build output hoặc thay đổi không liên quan.

Commit mẫu:

```text
docs(project): establish initial documentation
feat(report): add lost report creation
fix(matching): cap match score at 100
test(claim): cover invalid status transition
```

Không dùng các message mơ hồ như `update`, `fix`, `done` hoặc `final` đứng một mình; `fix(scope): ...` vẫn hợp lệ khi mô tả rõ phạm vi.

## Thông tin bắt buộc trong pull request

- `CHG-NNN` và link Notion Task;
- phạm vi thay đổi và phần không thay đổi;
- acceptance criteria và kết quả kiểm tra;
- migration, dependency hoặc rủi ro merge nếu có;
- reviewer và ghi chú xử lý conflict nếu branch đã lệch `main`.
