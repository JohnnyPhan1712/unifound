# CHG-010: xây cơ chế gợi ý report trùng khớp

- ID: `CHG-010`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-22`
- Sprint/Milestone: `Sprint 1 / MVP foundation`
- Người phụ trách: `Thế Anh`
- Reviewer: `Phát`
- Notion Task: `xây cơ chế gợi ý report trùng khớp`
- Dependency: `CHG-006`, `CHG-007`, `CHG-009 contract`
- Branch: `feat/matching-suggestions`
- PR: `chưa có`
- Commit sau merge: `chưa có`
- File/module dự kiến sửa: `src/lib/matching/**`, matching adapter/components, `tests/**` matching unit tests
- Phạm vi ownership: `matching module, score/reason output và unit tests`
- Thời gian Sprint: `2026-09-23` đến `2026-09-29`

## Kết quả người dùng

Sinh viên có thể xem những report Lost và Found có khả năng liên quan, biết điểm số và lý do được cộng điểm. Gợi ý chỉ hỗ trợ kiểm tra, không khẳng định ai là chủ sở hữu món đồ.

## Phạm vi

### Bao gồm

- So sánh chỉ giữa Lost Report và Found Report.
- Category giống nhau: 30 điểm.
- Location giống nhau: 30 điểm.
- Ngày xảy ra chênh lệch không quá 3 ngày: 20 điểm.
- Keyword title/description tương đồng: 20 điểm.
- Chỉ hiển thị potential match từ 50 điểm.
- Output gồm score và lý do.
- Xử lý field thiếu mà không crash hoặc tự suy đoán.
- Unit tests cho ngưỡng, dữ liệu thiếu và trường hợp không hợp lệ.

### Không bao gồm

- AI, embedding hoặc machine learning.
- Xác nhận quyền sở hữu.
- Thay đổi database schema.
- Claim workflow.

## File/tài liệu liên quan

- `docs/02_reports/02_requirements_design.md`
- `docs/02_reports/05_testing_deployment.md`

## Acceptance criteria

- [ ] Cùng input luôn cho cùng output.
- [ ] Chỉ cặp Lost-to-Found được tính.
- [ ] Điểm và lý do đúng rule `30/30/20/20`.
- [ ] Match chỉ đạt khi score từ 50.
- [ ] Field thiếu không gây lỗi hoặc tạo điểm giả.
- [ ] Có unit tests cho boundary và edge cases.

## Kiểm tra và bằng chứng

- Kết quả: `chưa kiểm tra`
- Unit test evidence: `chưa có`

## Quyết định và ghi chú

Module matching phải độc lập để CHG-009 chỉ tích hợp phần hiển thị, không thay đổi scoring rule.
