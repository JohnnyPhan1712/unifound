# Định hướng hệ thống UniFound

> Đây là baseline MVP đã chốt, không phải bằng chứng triển khai. Hiện trạng được cập nhật trong `docs/02_reports/03_development.md`.

UniFound tập trung tin Lost/Found trong trường và gợi ý các cặp có khả năng liên quan để người dùng tiếp tục xác minh.

## Luồng MVP

```text
Đăng Lost Report
→ tìm Found Report tương đồng
→ xem match score và chi tiết
→ gửi Claim
→ claimant cung cấp thông tin xác minh riêng tư
→ chủ Found Report Accept hoặc Reject
→ hai bên trao trả đồ
→ chủ Found Report đánh dấu Returned
```

## Màn hình dự kiến

1. Home / Lost & Found Feed.
2. Create Report.
3. Report Detail.
4. Potential Matches.
5. My Reports / Claim Status.

## Matching MVP

Chỉ match Lost ↔ Found. Category và location giống nhau cùng được 30 điểm; ngày chênh lệch không quá 3 ngày và keyword tương đồng cùng được 20 điểm. Hiển thị từ 50 điểm và luôn nêu lý do cộng điểm.

## Ranh giới an toàn

- Không công khai thông tin dùng để chứng minh quyền sở hữu nếu điều đó giúp người khác đoán câu trả lời.
- Không xem match score là xác nhận chủ sở hữu.
- Không dùng dữ liệu cá nhân thật làm demo hoặc đưa vào prompt AI.
