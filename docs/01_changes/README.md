# Change records

| ID | Công việc | Trạng thái | Notion Task |
|---|---|---|---|
| [`CHG-001`](CHG-001_initial_project_documentation.md) | Thiết lập tài liệu nền tảng ban đầu | `done` | Thiết lập tài liệu nền tảng UniFound |
| [`CHG-002`](CHG-002_create_use_case_diagram.md) | Tạo sơ đồ Use Case MVP | `done` | Tạo sơ đồ Use Case UniFound |
| [`CHG-003`](CHG-003_finalize_mvp_decisions.md) | Chốt quyết định MVP | `done` | Chốt quyết định MVP UniFound |
| [`CHG-004`](CHG-004_document_technology_stack.md) | Hoàn thiện tài liệu Technology Stack | `done` | Hoàn thiện tài liệu Technology Stack UniFound |
| [`CHG-005`](CHG-005_align_repository_structure.md) | Đồng bộ cấu trúc repository với Technology Stack | `done` | Đồng bộ cấu trúc repository UniFound |
| [`CHG-006`](CHG-006_project_environment_setup.md) | cài framework/package và cấu hình môi trường | `done` | cài framework/package và cấu hình môi trường |
| [`CHG-007`](CHG-007_database_schema_and_migrations.md) | tạo schema database và migration | `done` | tạo schema database và migration |
| [`CHG-008`](CHG-008_auth_and_ownership.md) | tích hợp đăng nhập và phân quyền sở hữu | `rejected` | tích hợp đăng nhập và phân quyền sở hữu |
| [`CHG-009`](CHG-009_report_discovery_and_submission.md) | xây chức năng đăng, tìm và xem chi tiết report | `rejected` | xây chức năng đăng, tìm và xem chi tiết report |
| [`CHG-010`](CHG-010_match_suggestions.md) | xây cơ chế gợi ý report trùng khớp | `rejected` | xây cơ chế gợi ý report trùng khớp |
| [`CHG-011`](CHG-011_claim_and_return_flow.md) | xây luồng claim và hoàn tất nhận lại đồ | `rejected` | xây luồng claim và hoàn tất nhận lại đồ |
| [`CHG-012`](CHG-012_brand_identity_and_ui_mockups.md) | Xác định nhận diện thương hiệu và mockup toàn bộ màn hình | `in_progress` | Xác định nhận diện thương hiệu và mockup UniFound |

Số CHG tiếp theo: `CHG-013`.

### Thứ tự phụ thuộc

```text
CHG-005
	↓
CHG-006 ──→ CHG-007 ──→ CHG-008 ──→ CHG-009 ──→ CHG-011
	└────────────────────→ CHG-010
```

