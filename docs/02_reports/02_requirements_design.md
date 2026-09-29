# Yêu cầu và thiết kế

## 1. Yêu cầu chức năng

| ID | Yêu cầu | User story | 
|---|---|---|
| FR-01 | Mọi người xem và tìm/lọc các Lost/Found Report công khai. | US-01, US-02 |
| FR-02 | Người dùng đã đăng nhập tạo Lost hoặc Found Report với field bắt buộc và server-side validation. | US-01, US-02 |
| FR-03 | Xem chi tiết một report và trạng thái hiện tại. | US-03, US-04 |
| FR-04 | Tính và hiển thị Potential Matches giữa Lost/Found Report bằng rule-based score. | US-03 |
| FR-05 | Người dùng đã đăng nhập gửi claim kèm thông tin xác minh riêng tư cho Found Report không thuộc sở hữu của mình. | US-04 |
| FR-06 | Claimant theo dõi claim của mình; chủ Found Report xử lý claim và đánh dấu `Returned` sau khi trao trả. | US-05 |
| FR-07 | Chủ report sửa hoặc xóa report của mình; người dùng `ADMIN` sửa hoặc xóa mọi report để xử lý bài vi phạm. | US-01, US-02, US-06 |

**Acceptance criteria:**

- **FR-02 — Tạo report:**
  - Given người dùng ở màn hình Create Report, when nhập đủ dữ liệu hợp lệ và submit, then report được lưu và xuất hiện với đúng loại/trạng thái.
  - Given thiếu field bắt buộc, when submit, then không lưu và hiển thị lỗi tại field liên quan.
- **FR-04 — Potential Matches:**
  - Given có Lost và Found Report, when mở kết quả matching, then chỉ các cặp đủ điều kiện được hiển thị cùng score hoặc lý do khớp.
  - Score phải deterministic với cùng input; dữ liệu thiếu không gây lỗi hoặc cộng điểm sai.
- **FR-05/06 — Claim và Returned:**
  - Given report phù hợp và claim hợp lệ, when gửi claim, then trạng thái được lưu và hiển thị trong My Reports.
  - Chỉ actor hợp lệ mới được chuyển trạng thái; chuyển trạng thái sai bị từ chối và không làm mất dữ liệu.
- **FR-07 — Sửa/xóa report:**
  - Given người dùng là chủ report hoặc `ADMIN`, when sửa hoặc xóa report, then thay đổi được lưu.
  - Given người dùng `USER` không phải chủ report, when cố sửa hoặc xóa, then server từ chối (403) và dữ liệu không đổi.

**Quyền truy cập:** Mọi người được xem report công khai. Chỉ người dùng đã đăng nhập được tạo report, gửi claim và quản lý report/claim của mình; chủ report chỉ được sửa hoặc xóa report của mình, ngoại trừ người dùng có vai trò `ADMIN`. Claimant xem trạng thái claim do mình gửi; chủ Found Report xem các claim gửi đến report đó. Đăng nhập dùng Supabase Auth với email/password hoặc magic link; MVP chỉ có hai vai trò: `USER` (mặc định khi đăng ký, không tự nâng quyền) và `ADMIN` (tài khoản quản trị được cấp sẵn, có quyền sửa/xóa mọi report để xử lý bài vi phạm). Không có Moderator hoặc Staff, và không có quy trình kiểm duyệt riêng. Supabase Auth xác định danh tính; server vẫn phải kiểm tra ownership và quyền thực hiện từng thao tác.

## 2. Yêu cầu phi chức năng

- Responsive và usable trên desktop/mobile.
- Form có label, thông báo lỗi rõ và thao tác được bằng bàn phím ở mức cơ bản.
- Không lộ secret, dữ liệu cá nhân thật hoặc thông tin xác minh sở hữu không cần công khai.
- Match score có thể giải thích, nhất quán và không vượt miền giá trị đã chốt.
- Luồng demo hoạt động ổn định với dữ liệu mẫu; trình duyệt mục tiêu và ngưỡng hiệu năng là `TBD`.

## 3. Màn hình dự kiến

| ID | Màn hình | Mục đích chính |
|---|---|---|
| SCR-01 | Home / Lost & Found Feed | Xem, tìm và lọc report |
| SCR-02 | Create Report | Tạo Lost/Found Report |
| SCR-03 | Report Detail | Xem mô tả, trạng thái, gửi claim phù hợp; chủ report hoặc `ADMIN` sửa/xóa report |
| SCR-04 | Potential Matches | Xem các cặp gợi ý và score/lý do |
| SCR-05 | My Reports / Claim Status | Theo dõi và hoàn tất luồng |

Mỗi màn hình quan trọng cần có loading, empty, validation/error và layout mobile phù hợp. Feed và chi tiết report công khai; thao tác tạo/quản lý report hoặc claim yêu cầu đăng nhập.

## 4. UI/UX 

- Ưu tiên tạo report nhanh, nhãn Lost/Found dễ phân biệt nhưng không chỉ dựa vào màu.
- Match score phải đi kèm tín hiệu giải thích; không trình bày như xác nhận sở hữu.
- Trạng thái và hành động tiếp theo phải rõ trên detail/My Reports.

## 5. Kiến trúc mức cao

### Use Case Diagram

Sơ đồ chỉ mô tả phạm vi MVP hiện tại. Hai actor “Sinh viên mất đồ” và “Sinh viên nhặt được đồ” là vai trò chuyên biệt của “Sinh viên”, không phải loại tài khoản riêng. Actor “Quản trị viên” là người dùng có vai trò `ADMIN`, kế thừa các thao tác của “Sinh viên” và có thêm quyền sửa/xóa báo cáo của người khác.

- PlantUML source: [`use_case_diagram.puml`](assets/use_case_diagram.puml).

### Kiến trúc hệ thống

```text
Responsive Web UI
       ↓
Backend / validation / matching / state rules
       ↓
Data storage
```

Ứng dụng dùng Next.js + TypeScript cho UI và server/backend, Tailwind CSS cho UI, Zod cho validation, Drizzle ORM truy cập PostgreSQL trên Supabase, Supabase Auth cho xác thực và Vercel để hosting. Drizzle chỉ chạy phía server; server là nơi quyết định cuối cùng về validation và business rule. Sơ đồ, lý do chọn và phương án thay thế của từng công nghệ nằm ở [03_development.md](03_development.md#1-technology-stack).

## 6. Data model dự kiến

| Entity | Mục đích | Field/quan hệ cần nghiên cứu |
|---|---|---|
| User | Chủ report và người gửi claim | Supabase Auth identity, role (`USER`/`ADMIN`), reports, claims |
| Report | Lost/Found item và trạng thái | owner, type, title, category, description, location, eventDate, status |
| Claim | Yêu cầu nhận lại Found item | claimant, found report, verification info riêng tư, status, created time |

**Report:** Field bắt buộc gồm `type` (`Lost` hoặc `Found`), `title`, `category`, `description`, `location`, `eventDate`; server từ chối request thiếu hoặc sai định dạng. Category là danh sách cố định: Điện tử; Ví / giấy tờ; Chìa khóa; Quần áo / phụ kiện; Sách / dụng cụ học tập; Khác. Location là danh sách khu vực đã định nghĩa trong trường, không dùng GPS hoặc tọa độ chính xác. Report và claim phải có cơ chế xóa hoặc đóng; không công khai thông tin liên hệ cá nhân như field bắt buộc trên feed.

**Claim:** Chỉ là yêu cầu nhận lại đồ, gửi đến Found Report và không phải bằng chứng sở hữu; người dùng không được claim report của chính mình. Trạng thái gồm `Pending`, `Accepted`, `Rejected`, `Closed`; một Found Report có tối đa một claim `Accepted`, các claim còn lại chuyển sang `Rejected` hoặc `Closed` khi accept. `Accepted` nghĩa là chủ Found Report chấp nhận; `Returned` chỉ đặt sau khi món đồ thực sự được trao trả. Claimant cung cấp thông tin xác minh riêng tư để chủ Found Report đối chiếu; chỉ claimant và chủ Found Report liên quan được truy cập thông tin này, không xuất hiện trên feed hoặc dùng cho public matching. Chỉ chủ Found Report được xem thông tin xác minh, `Accept`/`Reject` claim và đánh dấu `Returned`. MVP không có chat hoặc Moderator xác minh thay; seed không dùng dữ liệu cá nhân hoặc thông tin xác minh nhạy cảm thật.

Không tạo bảng Match riêng nếu score có thể tính khi đọc; chỉ lưu khi có nhu cầu lịch sử/hiệu năng được chứng minh. 

## 7. Matching rule

Chỉ tính điểm giữa `Lost Report` và `Found Report`:

| Tín hiệu | Điểm |
|---|---:|
| Category giống nhau | 30 |
| Location giống nhau | 30 |
| Ngày xảy ra chênh lệch không quá 3 ngày | 20 |
| Keyword trong title/description tương đồng | 20 |
| **Tổng tối đa** | **100** |

- Chỉ hiển thị Potential Match khi `score >= 50`.
- Kết quả phải nêu các lý do được cộng điểm.
- Cùng input phải cho cùng kết quả; không dùng AI, embedding hoặc machine learning.
- Field tùy chọn bị thiếu không cộng điểm, không gây lỗi và không được tự suy đoán.
- Matching chỉ là gợi ý để kiểm tra, không phải xác nhận quyền sở hữu.
- Phiên bản đầu chỉ xét location giống nhau; chưa có khái niệm khu vực gần nhau.

