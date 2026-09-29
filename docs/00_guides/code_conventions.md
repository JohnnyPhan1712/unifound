# Quy ước Code

## Nguyên tắc chung

- Quy ước formatter/linter trong project sẽ ưu tiên hơn tài liệu này.
- Tên kỹ thuật dùng tiếng Anh không dấu; nội dung tài liệu và giao diệu dùng tiếng Việt.
- Không dùng `new`, `latest`, `final`, `temp` hoặc tên cá nhân để quản lý phiên bản.
- Giữ tên trạng thái và field giống nhau giữa UI, API, backend và database.

## Viết mã

- Viết code dễ đọc, chỉ tách hàm/component khi có trách nhiệm rõ.
- Validate dữ liệu ở ranh giới nhận input; không tin dữ liệu từ client.
- Xử lý trạng thái loading, empty, lỗi và thao tác bất đồng bộ trên UI.
- Không hard-code secret, credential hoặc dữ liệu cá nhân thật.
- Không thêm dependency nếu nền tảng hoặc dependency sẵn có đã giải quyết được.
- Comment giải thích lý do hoặc giới hạn, không diễn giải lại code.
- Một thay đổi logic không hiển nhiên phải có kiểm tra nhỏ nhất chứng minh hành vi chính.

## Đặt tên

### Thư mục và tài liệu

- Thư mục: `NN_lower_snake_case` (ví dụ: `00_guides`, `01_changes`)
- Tài liệu: `lower_snake_case.md` (ví dụ: `git_workflow.md`, `code_conventions.md`)
- Tài liệu thay đổi (CHG): `CHG-NNN_lower_snake_case.md` (ví dụ: `CHG-011_claim_and_return_flow.md`)

### Branch và commit

| Loại | Format | Ví dụ |
|---|---|---|
| Branch | `<type>/<short-kebab-case>` | `feat/CHG-011-claim-flow`, `fix/auth-bug` |
| Commit | `<type>(<scope>): <mô tả>` | `feat(claim): add verification form`, `fix(matching): cap score at 100` |

**Type:** `feat`, `fix`, `docs`, `test`, `chore`

### ID tài liệu

Sử dụng tiền tố chuẩn:

| Tiền tố | Ý nghĩa |
|---|---|
| `US` | User Story |
| `CHG` | Change/Task |
| `BUG` | Bug Report |
| `TC` | Test Case |

Ví dụ: `US-01`, `DEC-001`, `CHG-011`, `BUG-042`

### Trạng thái và field

**Trạng thái phải nhất quán trong database, backend và UI:**

Nguồn duy nhất là `src/db/schema.ts` (enum `report_status`, `claim_status`, `user_role`). UI, API và backend dùng đúng giá trị enum đó, không tự đặt tên khác; không chép lại danh sách giá trị vào tài liệu để tránh lạc hậu.

**Convention cho field:**

- Database: `snake_case` (ví dụ: `created_at`, `is_verified`)
- API endpoint: `kebab-case` hoặc `snake_case` theo convention hiện tại
- Biến trong code: `camelCase` (TypeScript, JavaScript)

## Trước khi hoàn thành công việc

- Chạy formatter/linter/test/build có trong project.
- Xem lại diff và loại file sinh tự động không cần commit.
- Cập nhật CHG/report liên quan theo kết quả thật.
- Không commit secret, file tạm, build output hoặc thay đổi không liên quan.
