# Tổng quan dự án

> Trạng thái: **Approved baseline** — phạm vi và các quyết định MVP đã được chốt; trạng thái triển khai được theo dõi riêng trong [`03_development.md`](03_development.md).

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

Persona cần được xác minh bằng khảo sát/phỏng vấn nếu nhóm thực hiện nghiên cứu người dùng.

## 4. Phạm vi MVP

### Trong phạm vi

- Feed Lost/Found có tìm kiếm hoặc lọc cơ bản.
- Tạo Lost Report hoặc Found Report với validation.
- Xem chi tiết report.
- Hiển thị Potential Matches bằng rule-based score.
- Gửi claim, theo dõi report/claim và chuyển Found Report thành `Returned` theo quy trình được chốt.
- Năm màn hình chính, responsive desktop/mobile, dữ liệu demo và live deployment.

### Ngoài phạm vi

- Mobile native, chat real-time, push notification, bản đồ/GPS tracking.
- Computer vision, ML/LLM matching hoặc chatbot trong website.
- Hệ thống kiểm duyệt, danh tiếng hay phân quyền phức tạp.
- Tích hợp nhiều trường hoặc quy trình pháp lý giải quyết tranh chấp.

## 5. User stories

| ID | User story | Ưu tiên |
|---|---|---|
| US-01 | Là sinh viên bị mất đồ, tôi muốn tạo Lost Report để người nhặt và hệ thống có thể tìm thấy nhu cầu của tôi. | Must |
| US-02 | Là sinh viên nhặt được đồ, tôi muốn tạo Found Report để chủ sở hữu có thể liên hệ/claim. | Must |
| US-03 | Là người đăng report, tôi muốn xem các report tương đồng cùng lý do/điểm khớp để ưu tiên kiểm tra. | Must |
| US-04 | Là sinh viên, tôi muốn xem chi tiết và gửi claim để bắt đầu quá trình nhận lại đồ. | Must |
| US-05 | Là người đăng, tôi muốn theo dõi trạng thái report/claim và ghi nhận đồ đã trả để luồng có kết thúc rõ ràng. | Must |

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

## 8. Quyết định MVP đã chốt

Giữ nguyên mapping quyết định của dự án; đặc tả chi tiết và acceptance criteria nằm tại [`02_requirements_design.md`](02_requirements_design.md#9-quyết-định-mvp-đã-chốt).

| ID | Quyết định | Trạng thái |
|---|---|---|
| DEC-001 | Feed công khai; phải đăng nhập để tạo/quản lý report, gửi/quản lý claim; dùng Supabase Auth với email/password hoặc magic link; chưa có role phức tạp. | Đã chốt |
| DEC-002 | Chốt field bắt buộc, category/location dạng danh sách, quyền sở hữu và vòng đời Claim/Found Report đến `Returned`. | Đã chốt |
| DEC-003 | Chỉ match Lost ↔ Found bằng score deterministic `30/30/20/20`, hiển thị từ 50 điểm và giải thích lý do cộng điểm. | Đã chốt |
| DEC-004 | Next.js + TypeScript, Tailwind CSS, Zod, PostgreSQL trên Supabase, Drizzle ORM, Supabase Auth, Vercel, Vitest và Playwright. | Đã chốt |
| DEC-005 | Claim là yêu cầu nhận đồ; thông tin xác minh là riêng tư, chỉ claimant và chủ Found Report liên quan được xem; không có chat hoặc Moderator trong MVP. | Đã chốt |

## 9. Nguyên tắc phạm vi MVP

- Không bổ sung chat real-time, Moderator workflow, GPS, AI/ML matching, role phức tạp, xác minh danh tính nâng cao hoặc notification phức tạp khi chưa có quyết định mới.
- Matching chỉ gợi ý report cần kiểm tra, không xác nhận quyền sở hữu.
- PostgreSQL là nguồn dữ liệu nghiệp vụ chính; dữ liệu demo được seed riêng và không chứa dữ liệu cá nhân hoặc thông tin xác minh thật.
- Yêu cầu mới ảnh hưởng nghiệp vụ, database hoặc security phải được ghi nhận để quyết định trước khi mở rộng phạm vi.
