# Quy ước viết mã

> Áp dụng sau khi stack được chốt. Quy tắc của formatter/linter trong source sẽ ưu tiên hơn tài liệu này.

- Viết code dễ đọc, chỉ tách hàm/component khi có trách nhiệm rõ.
- Dùng tên tiếng Anh theo nghiệp vụ; nội dung giao diện có thể dùng tiếng Việt.
- Validate dữ liệu ở ranh giới nhận input; không tin dữ liệu từ client.
- Xử lý trạng thái loading, empty, lỗi và thao tác bất đồng bộ trên UI.
- Không hard-code secret, credential hoặc dữ liệu cá nhân thật.
- Không thêm dependency nếu nền tảng hoặc dependency sẵn có đã giải quyết được.
- Comment giải thích lý do hoặc giới hạn, không diễn giải lại code.
- Một thay đổi logic không hiển nhiên phải có kiểm tra nhỏ nhất chứng minh hành vi chính.

## Trước khi hoàn thành công việc

- Chạy formatter/linter/test/build thực sự có trong project.
- Xem lại diff và loại file sinh tự động không cần commit.
- Cập nhật report và CHG liên quan theo kết quả thật.
