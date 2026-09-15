# Quy trình Git

## Branch

- `main`: phiên bản ổn định để demo/deploy.
- `develop`: nhánh tích hợp nếu nhóm quyết định sử dụng.
- Công việc ngắn hạn: `feature/...`, `fix/...`, `docs/...`, `chore/...`.

Với nhóm nhỏ, có thể bỏ `develop` và tạo pull request thẳng vào `main`; nhóm chỉ cần chọn một cách và dùng nhất quán.

## Luồng làm việc

1. Đồng bộ nhánh đích.
2. Tạo branch cho đúng một Task/CHG.
3. Thực hiện thay đổi trong phạm vi.
4. Chạy kiểm tra phù hợp và cập nhật CHG/report.
5. Xem `git status` và `git diff`; không commit secret hoặc file tạm.
6. Commit rõ nghĩa, push và tạo pull request nếu nhóm dùng review.

Commit mẫu:

```text
docs(project): establish initial documentation
feat(report): add lost report creation
fix(matching): cap match score at 100
test(claim): cover invalid status transition
```

Không dùng message `update`, `fix`, `done` hoặc `final`.
