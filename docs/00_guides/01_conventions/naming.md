# Quy ước đặt tên

- Tên kỹ thuật dùng tiếng Anh, không dấu và nhất quán theo một thuật ngữ.
- Thư mục và file Markdown dùng `lower_snake_case`; ngoại lệ hồ sơ thay đổi dùng `CHG-NNN_lower_snake_case.md`.
- Branch dùng `<type>/<short-kebab-case>` với `feature`, `fix`, `docs` hoặc `chore`.
- Commit dùng `<type>(<scope>): <mô tả ngắn>`.
- ID tài liệu dùng tiền tố ổn định: `US`, `FR`, `SCR`, `DEC`, `TECH`, `BR`, `AI-LOG`, `TC`, `BUG`, `CHG`.
- Trạng thái nghiệp vụ và tên field phải giống nhau giữa UI, API, backend và database sau khi được chốt.
- Không dùng tên như `final`, `new`, `latest`, `temp` hoặc tên cá nhân để quản lý phiên bản.

Ví dụ:

```text
docs/initial-project-documentation
docs(project): establish initial documentation
CHG-001_initial_project_documentation.md
```
