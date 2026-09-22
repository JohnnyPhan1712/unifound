# Change records

Mỗi CHG tương ứng với một Task trên Notion và một kết quả có thể kiểm tra độc lập.

| ID | Công việc | Trạng thái | Notion Task |
|---|---|---|---|
| [`CHG-001`](CHG-001_initial_project_documentation.md) | Thiết lập tài liệu nền tảng ban đầu | `done` | Thiết lập tài liệu nền tảng UniFound |
| [`CHG-002`](CHG-002_create_use_case_diagram.md) | Tạo sơ đồ Use Case MVP | `done` | Tạo sơ đồ Use Case UniFound |
| [`CHG-003`](CHG-003_finalize_mvp_decisions.md) | Chốt quyết định MVP | `done` | Chốt quyết định MVP UniFound |
| [`CHG-004`](CHG-004_document_technology_stack.md) | Hoàn thiện tài liệu Technology Stack | `done` | Hoàn thiện tài liệu Technology Stack UniFound |
| [`CHG-005`](CHG-005_align_repository_structure.md) | Đồng bộ cấu trúc repository với Technology Stack | `done` | Đồng bộ cấu trúc repository UniFound |
| [`CHG-006`](CHG-006_project_environment_setup.md) | cài framework/package và cấu hình môi trường | `in_progress` | cài framework/package và cấu hình môi trường |
| [`CHG-007`](CHG-007_database_schema_and_migrations.md) | tạo schema database và migration | `proposed` | tạo schema database và migration |
| [`CHG-008`](CHG-008_auth_and_ownership.md) | tích hợp đăng nhập và phân quyền sở hữu | `proposed` | tích hợp đăng nhập và phân quyền sở hữu |
| [`CHG-009`](CHG-009_report_discovery_and_submission.md) | xây chức năng đăng, tìm và xem chi tiết report | `proposed` | xây chức năng đăng, tìm và xem chi tiết report |
| [`CHG-010`](CHG-010_match_suggestions.md) | xây cơ chế gợi ý report trùng khớp | `proposed` | xây cơ chế gợi ý report trùng khớp |
| [`CHG-011`](CHG-011_claim_and_return_flow.md) | xây luồng claim và hoàn tất nhận lại đồ | `proposed` | xây luồng claim và hoàn tất nhận lại đồ |

Số CHG tiếp theo: `CHG-012`.

## Sprint 1 — MVP foundation

- Thời gian: `2026-09-23` đến `2026-09-29` (7 ngày).
- Mục tiêu: làm cho project chạy được và triển khai luồng người dùng đầu tiên từ report đến claim/returned.
- Team Lead/Integration Lead: `Huy`.
- Thành viên: `Khang`, `Quân`, `Chiến`, `Thế Anh`, `Phát`.
- Quy tắc: mỗi Task có một CHG, một owner, một branch và một PR; Huy điều phối tích hợp nhưng không sở hữu toàn bộ feature.

### Thứ tự phụ thuộc

```text
CHG-005
	↓
CHG-006 ──→ CHG-007 ──→ CHG-008 ──→ CHG-009 ──→ CHG-011
	└────────────────────→ CHG-010
```

CHG-010 có thể phát triển module matching độc lập sau khi thống nhất report contract; CHG-011 phối hợp với CHG-009 tại các điểm chèn UI và chỉ đóng sau khi flow chính được kiểm tra.

### Lịch chính

| Ngày | Hoạt động |
|---|---|
| `23/09` | Huy hoàn tất package/environment setup; cả nhóm xác nhận branch, reviewer và dependency. |
| `24–25/09` | Làm database, auth, report UI, matching và claim theo contract. |
| `26–27/09` | Tích hợp qua PR, xử lý contract mismatch và conflict. |
| `28/09` | Kiểm tra flow `Lost → Match → Claim → Returned`, responsive và bug fix. |
| `29/09` | Review, merge, cập nhật report/evidence và đóng CHG đạt Definition of Done. |

Mỗi CHG mới cần liên kết với một Notion Task, một branch và một pull request. Các trường Branch, PR, Commit sau merge, Reviewer và Dependency được cập nhật trong quá trình thực hiện; các CHG lịch sử chưa có evidence Git vẫn giữ nguyên trạng thái lịch sử.

Xem quy tắc và template tại [`changes-workflow.md`](../00_guides/02_workflows/changes-workflow.md) và [`git-workflow.md`](../00_guides/02_workflows/git-workflow.md).
