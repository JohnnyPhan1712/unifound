# Tổng quan dự án

## 1. Problem statement

Sinh viên đang tìm hoặc trả đồ thất lạc qua Facebook, nhóm lớp, Zalo/Discord, confession hoặc bảo vệ. Tin đăng phân tán, thiếu cấu trúc và dễ trôi; người mất và người nhặt có thể đăng ở hai kênh khác nhau nên khó tìm thấy nhau.

UniFound hướng tới tập trung Lost/Found Report và gợi ý các cặp có khả năng liên quan, giúp người dùng đi từ đăng tin đến gửi claim và ghi nhận đồ đã được trả lại trong một luồng rõ ràng.

## 2. Mục tiêu

- Xây dựng MVP web nhỏ nhưng hoàn chỉnh trong 3–4 tuần.
- Có ít nhất một luồng end-to-end làm thay đổi trạng thái dữ liệu.
- Giúp sinh viên tìm report liên quan nhanh hơn bằng matching rule-based có thể giải thích.
- Hoạt động hợp lý trên desktop và mobile, có URL demo và dữ liệu mẫu.
- Chứng minh AI được dùng có kiểm soát qua Human Decision và Verification.

## 3. Người dùng và persona

### Nhóm người dùng chính

Sinh viên trong trường cần đăng đồ bị mất, đăng đồ nhặt được, xem kết quả phù hợp và theo dõi claim/report của mình.

### Persona

- Tên: Minh (giả định).
- Hồ sơ: sinh viên thường xuyên học tại nhiều khu vực trong trường.
- Mục tiêu: tìm lại đồ nhanh mà không phải theo dõi nhiều nhóm mạng xã hội.
- Điểm khó khăn: tin bị trôi, mô tả không đồng nhất, khó biết tin nào đáng kiểm tra.
- Nhu cầu: đăng tin nhanh, lọc/gợi ý rõ, bảo vệ thông tin dùng để xác minh sở hữu.

## 4. Phạm vi MVP

### Trong phạm vi

- Feed Lost/Found có tìm kiếm hoặc lọc cơ bản.
- Tạo Lost Report hoặc Found Report với validation.
- Xem chi tiết report.
- Hiển thị Potential Matches bằng rule-based score.
- Gửi claim, theo dõi report/claim và chuyển Found Report thành `Returned` theo quy trình được chốt.
- Phân quyền hai vai trò: `USER` (sửa/xóa report của mình) và `ADMIN` (sửa/xóa mọi report để xử lý bài vi phạm).
- Năm màn hình chính, responsive desktop/mobile, dữ liệu demo và live deployment.

### Ngoài phạm vi

- Mobile native, chat real-time, push notification, bản đồ/GPS tracking.
- Computer vision, ML/LLM matching hoặc chatbot trong website.
- Quy trình kiểm duyệt riêng, hệ thống danh tiếng hay phân quyền phức tạp hơn hai vai trò `USER`/`ADMIN`.
- Tích hợp nhiều trường hoặc quy trình pháp lý giải quyết tranh chấp.

## 5. User stories

| ID | User story |
|---|---|
| US-01 | Là sinh viên bị mất đồ, tôi muốn tạo Lost Report để người nhặt và hệ thống có thể tìm thấy nhu cầu của tôi. |
| US-02 | Là sinh viên nhặt được đồ, tôi muốn tạo Found Report để chủ sở hữu có thể liên hệ/claim. | 
| US-03 | Là người đăng report, tôi muốn xem các report tương đồng cùng lý do/điểm khớp để ưu tiên kiểm tra. | 
| US-04 | Là sinh viên, tôi muốn xem chi tiết và gửi claim để bắt đầu quá trình nhận lại đồ. |
| US-05 | Là người đăng, tôi muốn theo dõi trạng thái report/claim và ghi nhận đồ đã trả để luồng có kết thúc rõ ràng. |
| US-06 | Là quản trị viên, tôi muốn sửa hoặc xóa report vi phạm để giữ nội dung trên hệ thống phù hợp. |

## 6. Luồng người dùng chính

```text
Xem feed công khai
→ đăng nhập
→ tạo Lost Report hoặc Found Report
→ xem Potential Matches giữa Lost và Found Report
→ gửi Claim kèm thông tin xác minh riêng tư cho Found Report
→ chủ Found Report Accept hoặc Reject
→ hai bên trao trả đồ
→ chủ Found Report đánh dấu Returned
```

## 7. Ràng buộc Mini Project

- Khoảng 3–6 màn hình; hiện dự kiến 5.
- Ít nhất một user flow hoàn chỉnh và một xử lý dữ liệu/chuyển trạng thái.
- Không dùng đầu ra AI theo kiểu one-shot mà không review/verify.
- Có repository, README cài/chạy, live URL, Product Brief, 6–8 slides và Project Hub.
- Có 5–10 AI interactions có ý nghĩa, một đánh giá Accept/Modify/Reject, hai quyết định quan trọng được giải thích và một task so sánh bằng hai AI.
- Có test case chính và ít nhất một bug/problem đã phát hiện, sửa và xác minh.
