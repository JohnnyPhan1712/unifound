# Change records

| ID | Công việc | Trạng thái |
|---|---|---|
| [`CHG-001`](CHG-001_initial_project_documentation.md) | Thiết lập tài liệu nền tảng ban đầu | `done` |
| [`CHG-002`](CHG-002_create_use_case_diagram.md) | Tạo sơ đồ Use Case MVP | `done` |
| [`CHG-003`](CHG-003_finalize_mvp_decisions.md) | Chốt quyết định MVP | `done` |
| [`CHG-004`](CHG-004_document_technology_stack.md) | Hoàn thiện tài liệu Technology Stack | `done` |
| [`CHG-005`](CHG-005_align_repository_structure.md) | Đồng bộ cấu trúc repository với Technology Stack | `done` |
| [`CHG-006`](CHG-006_project_environment_setup.md) | cài framework/package và cấu hình môi trường | `done` |
| [`CHG-007`](CHG-007_database_schema_and_migrations.md) | tạo schema database và migration | `done` |
| [`CHG-008`](CHG-008_auth_and_ownership.md) | tích hợp đăng nhập và phân quyền sở hữu | `rejected` |
| [`CHG-009`](CHG-009_report_discovery_and_submission.md) | xây chức năng đăng, tìm và xem chi tiết report | `rejected` |
| [`CHG-010`](CHG-010_match_suggestions.md) | xây cơ chế gợi ý report trùng khớp | `rejected` |
| [`CHG-011`](CHG-011_claim_and_return_flow.md) | xây luồng claim và hoàn tất nhận lại đồ | `rejected` |
| [`CHG-012`](CHG-012_brand_identity_and_ui_mockups.md) | Xác định nhận diện thương hiệu và mockup toàn bộ màn hình | `done` |
| [`CHG-013`](CHG-013_cleanup_legacy_code.md) | Dọn code cũ của các CHG bị từ chối | `done` |
| [`CHG-014`](CHG-014_ui_foundation_auth_profile.md) | Nền UI dùng chung, đăng nhập email trường và hồ sơ | `done` |
| [`CHG-015`](CHG-015_seed_and_create_report.md) | Seed dữ liệu và đăng tin Mất đồ / Nhặt được | `done` |
| [`CHG-016`](CHG-016_feed_search_report_detail.md) | Bảng tin, tìm kiếm và chi tiết tin | `done` |
| [`CHG-017`](CHG-017_my_reports_edit_delete.md) | Tin của tôi, sửa/đóng/xóa tin | `done` |
| [`CHG-018`](CHG-018_matching_and_notifications.md) | Gợi ý tin phù hợp (matching) và thông báo trong web | `done` |
| [`CHG-019`](CHG-019_claim_submit_and_decision.md) | Gửi yêu cầu nhận đồ và xử lý chấp nhận/từ chối | `done` |
| [`CHG-020`](CHG-020_handover_and_returned.md) | Bàn giao (điểm hẹn, liên hệ) và xác nhận Đã trả | `done` |
| [`CHG-021`](CHG-021_flags_and_admin_moderation.md) | Báo cáo vi phạm và kiểm duyệt admin | `done` |
| [`CHG-022`](CHG-022_admin_catalog_and_stats.md) | Quản trị danh mục, địa điểm và thống kê | `done` |
| [`CHG-023`](CHG-023_e2e_deploy_readme.md) | E2E golden path, rà soát UI, deploy Vercel và README | `done` |
| [`CHG-024`](CHG-024_forgot_password_and_school_domains.md) | Quên mật khẩu và bổ sung tên miền email trường | `done` |
| [`CHG-025`](CHG-025_unify_search_filters.md) | Gôm chung mục tìm kiếm và bộ lọc bảng tin | `proposed` |
| [`CHG-026`](CHG-026_header_auth_popup_help_footer.md) | Header (avatar + menu), popup xác thực, trợ giúp và footer | `proposed` |

Số CHG tiếp theo: `CHG-027`.

> CHG-014 → CHG-024 đã `done` (2026-10-03). Lưu ý: TC-023-05 (golden path trên URL Vercel) vẫn Pending trong CHG-023, các test case chưa chạy của CHG-024 (TC-024-05/08/10) cũng vậy.
>
> CHG-001 → CHG-011 theo quy trình cũ, không còn áp dụng. CHG-008 → CHG-011 đã `rejected`; CHG-013 dọn code cũ của các CHG bị từ chối.
