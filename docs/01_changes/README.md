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
| [`CHG-013`](CHG-013_cleanup_legacy_code.md) | Dọn code cũ của các CHG bị từ chối | `proposed` | Dọn code cũ UniFound |
| [`CHG-014`](CHG-014_audit_and_fix_database.md) | Rà soát và chỉnh sửa database theo chương 01/02 | `proposed` | Chỉnh database UniFound |
| [`CHG-015`](CHG-015_ui_foundation.md) | Nền tảng UI: design tokens, layout shell, component dùng chung | `proposed` | Nền tảng UI UniFound |
| [`CHG-016`](CHG-016_auth_and_roles.md) | Đăng nhập và vai trò USER/ADMIN | `proposed` | Auth và vai trò UniFound |
| [`CHG-017`](CHG-017_create_report.md) | Tạo Lost/Found Report (SCR-02) | `proposed` | Tạo report UniFound |
| [`CHG-018`](CHG-018_seed_demo_data.md) | Seed dữ liệu demo | `proposed` | Seed dữ liệu demo UniFound |
| [`CHG-019`](CHG-019_feed_and_filters.md) | Feed công khai và tìm/lọc (SCR-01) | `proposed` | Feed và bộ lọc UniFound |
| [`CHG-020`](CHG-020_report_detail.md) | Chi tiết report chỉ-đọc (SCR-03) | `proposed` | Chi tiết report UniFound |
| [`CHG-021`](CHG-021_edit_delete_report.md) | Sửa/xóa report và phân quyền (FR-07) | `proposed` | Sửa xóa report UniFound |
| [`CHG-022`](CHG-022_matching_engine.md) | Matching engine rule-based | `proposed` | Matching engine UniFound |
| [`CHG-023`](CHG-023_potential_matches_screen.md) | Màn hình Potential Matches (SCR-04) | `proposed` | Potential Matches UniFound |
| [`CHG-024`](CHG-024_submit_claim.md) | Gửi Claim kèm thông tin xác minh riêng tư | `proposed` | Gửi claim UniFound |
| [`CHG-025`](CHG-025_claim_decision_and_returned.md) | Accept/Reject Claim và đánh dấu Returned | `proposed` | Xử lý claim UniFound |
| [`CHG-026`](CHG-026_my_reports_and_claim_status.md) | My Reports / Claim Status (SCR-05) | `proposed` | My Reports UniFound |
| [`CHG-027`](CHG-027_e2e_golden_path_and_polish.md) | E2E golden path và rà responsive/a11y | `proposed` | E2E và polish UniFound |
| [`CHG-028`](CHG-028_deployment_and_readme.md) | Deploy Vercel, README và URL demo | `proposed` | Deploy UniFound |

Số CHG tiếp theo: `CHG-029`.

> CHG-008 → CHG-011 đã `rejected`; CHG-013 → CHG-028 dọn code cũ, chỉnh database rồi xây lại phần auth → claim theo chương 01–03.

### Thứ tự phụ thuộc

```text
CHG-005
	↓
CHG-006 ──→ CHG-007

CHG-013 ─→ CHG-014 ─┬→ CHG-015 ─→ CHG-016 ─→ CHG-017 ─→ CHG-018 ─→ CHG-019 ─→ CHG-020 ─┬→ CHG-021
                    │                                                                  ├→ CHG-023 (cần thêm CHG-022)
                    └→ CHG-022 (matching engine, làm song song được)                   └→ CHG-024 ─→ CHG-025 ─→ CHG-026 ─→ CHG-027 ─→ CHG-028
```
