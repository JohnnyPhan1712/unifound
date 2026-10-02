# Kết quả và bài học

## 1. Kết quả

| Mục tiêu | Kết quả | Bằng chứng |
|---|---|---|
| Một user flow hoàn chỉnh | Đạt trên môi trường dev: đăng nhập → đăng tin → gửi yêu cầu (kèm ảnh minh chứng tùy chọn) → chấp nhận và hẹn → hai bên xác nhận → Đã trả. Chạy lại trên URL Vercel: chờ xác nhận | E2E 22/22 lần chạy gần nhất (TC-16, TC-17, TC-24 → TC-36); `05_testing_deployment.md` |
| Năm màn hình responsive | Vượt mục tiêu: 17 màn hình (khách, sinh viên, admin) quét trên iPhone 13, không tràn ngang, đủ nhãn form; header, popup và form ảnh minh chứng kiểm tới 320px | TC-18, TC-38 |
| Xử lý dữ liệu/chuyển trạng thái | 11 bảng bật RLS; state machine yêu cầu nhận và bàn giao; transaction bảo đảm một yêu cầu `ACCEPTED`; gợi ý trùng khớp có điểm và lý do; ảnh minh chứng lưu riêng tư và chỉ hai bên xem được; kiểm duyệt, khóa tài khoản, quản trị danh mục | 78/78 unit test; TC-09 → TC-15, TC-36, TC-37 |
| Tìm kiếm và trải nghiệm | Một thanh tìm kiếm gộp (danh mục, trường → khu vực, khoảng ngày, tìm không dấu), đăng nhập/đăng ký/quên mật khẩu trong popup, Trợ giúp trong web, footer | TC-24 → TC-33 |
| Live URL và demo data | Đã deploy https://unifound-blue.vercel.app/; có seed hư cấu và tài khoản demo | Kiểm tra trên URL còn chờ xác nhận (TC-21) |
| AI Development Log có kiểm soát | 10 log, có Modified/Rejected, 5 quyết định có giải thích, so sánh Claude với Stitch | `04_ai_development.md` |

## 2. Đánh giá cuối kỳ

- Điểm mạnh:
  - Luồng Mất đồ → gợi ý → yêu cầu nhận → bàn giao → Đã trả chạy trọn vẹn, có test tự động ở ba lớp (Vitest, kiểm tra trực tiếp trên database, Playwright).
  - Phân quyền và quyền riêng tư kiểm ở phía server: đáp án xác minh và liên hệ không xuất hiện trong HTML của người không có quyền (TC-05, TC-12, TC-13).
  - Giao diện nhất quán theo một nguồn thiết kế (mockup + `DESIGN.md` đã đồng bộ), có `impeccable detect` 0 cảnh báo.
  - Dữ liệu nhạy cảm mới (ảnh minh chứng) được xử lý bằng bucket riêng tư + signed URL và kiểm bằng E2E: URL công khai bị chặn, người thứ ba nhận 404 (TC-36).
- Hạn chế:
  - Chức năng: không có nhắn tin trong ứng dụng, không bản đồ, matching theo luật điểm đơn giản chứ không dùng AI.
  - Kỹ thuật: gửi mail thật (xác nhận email, đặt lại mật khẩu) phụ thuộc cấu hình SMTP của Supabase, chưa kiểm hết (TC-22/23); E2E tạo dữ liệu thử trên database dev.
  - Dữ liệu: dữ liệu demo nhỏ (8 tin seed), phân trang chưa kiểm trên UI; danh sách điểm tiếp nhận trong Trợ giúp và chân trang là nội dung minh họa dựa trên tên địa điểm của dữ liệu mẫu.
  - Ảnh minh chứng: admin chưa xem được qua giao diện; ảnh bị bỏ khỏi form vẫn nằm trong Storage (chưa có tác vụ dọn).
  - Kiểm thử: kiểm thử trên bản deploy Vercel chưa hoàn tất (TC-21); các thay đổi giao diện gần đây chưa xem lại bằng Playwright MCP và chưa thử trên iOS/Safari thật.
  - Thời gian: Các task giai đoạn đầu bị từ chối nên phải dọn và làm lại, mất một phần thời gian của dự án.
- AI hỗ trợ tốt/chưa đủ ở đâu:
  - Tốt khi có ngữ cảnh rõ (ERD, acceptance criteria, `DESIGN.md`) và công cụ tự kiểm (Playwright, Supabase MCP, `impeccable detect`): sinh được nhiều màn hình và logic nhất quán, phát hiện cả lỗi do chính AI tạo ra.
  - Chưa đủ khi prompt dựa trên thiết kế cũ hoặc thiếu dependency: AI viết đúng yêu cầu được đưa nhưng sai so với thiết kế chung . AI cũng không thay được các quyết định phải do chủ dự án chốt (deploy, xóa dữ liệu, xác minh tên miền trường).
- Output được sửa hoặc từ chối:
  - Từ chối: bốn task giai đoạn đầu (AI-LOG-002).
  - Sửa: bản UI đầu thay bằng bản theo mockup (AI-LOG-005); lỗi bố cục mockup do AI tạo (BUG-06); selector test sai (AI-LOG-007); lỗi lệch đồng hồ (BUG-01); bản nháp nội dung Trợ giúp sai điều kiện gợi ý và điều kiện "Đã trả" nên AI tự đối chiếu mã nguồn và sửa (AI-LOG-009); popup "Thời gian" chồng nhau trên iPhone và nút menu tràn 320px (BUG-07, BUG-08).
- Bài học:
  - Web: kiểm tra trên bản build production và trên thiết bị hẹp; các lỗi như lệch đồng hồ database/máy chủ, thứ tự `trim` của Zod, type route của Next.js chỉ lộ khi chạy thật.
  - UI/UX: cần một nguồn thiết kế duy nhất; mockup có trạng thái loading/empty/lỗi giúp code sau này ít phải đoán. Lỗi chỉ lộ trên thiết bị thật (ô chọn ngày của iOS rộng hơn dự tính) nên cần kiểm tra ở nhiều chiều rộng, kể cả 320px; tách một nút thành hai nút cũng làm header tràn ở màn hình hẹp. Giao diện chỉ giữ chế độ sáng, khớp với quyết định ban đầu trong nhận diện thương hiệu, nên bớt bề mặt phải kiểm thử.
  - Thiết kế dữ liệu nhạy cảm: nên xác định ngay ai được xem một dữ liệu (ảnh minh chứng) rồi chọn nơi lưu và cơ chế cấp quyền tương ứng (bucket riêng tư + signed URL) thay vì tái dùng nơi lưu công khai có sẵn; tái dùng component bằng cách thêm tham số thay vì sao chép code.
  - Teamwork: giao việc phải chốt thiết kế và kiểm soát dependency trước; test xanh từng task không chứng minh các task ghép được.
  - AI-assisted development: ghi log ngay khi làm, giữ Human Decision trung thực (phân biệt quyết định của người dùng với ủy quyền cho AI), cho AI đọc tài liệu hướng dẫn (`AGENTS.md`) và cho nó công cụ để tự kiểm.

## 3. Hướng phát triển

- Cấu hình Custom SMTP và hoàn tất kiểm thử mail thật (xác nhận, đặt lại mật khẩu).
- Chạy lại E2E trên URL Vercel; thêm dữ liệu demo để kiểm phân trang.
- Đăng nhập bằng liên kết email, lưu thành phố của trường, thêm địa điểm cho các trường mới.
- Dọn ảnh minh chứng mồ côi trong Storage; cho admin xem ảnh minh chứng khi kiểm duyệt nếu cần; thay danh sách điểm tiếp nhận minh họa bằng thông tin thật đã được các trường xác nhận.
- Ý tưởng ngoài phạm vi hiện tại: bản đồ, matching nâng cao, mobile app.

## 4. Tài liệu tham khảo

- UI/UX: [Airbnb](https://www.airbnb.com.vn/)
- Business process: [iLost](https://ilost.co/)
- Ứng dụng demo: https://unifound-blue.vercel.app/

## 5. Phụ lục

- Visual assets: `assets/claude_ui_mockups/` (mockup dùng làm chuẩn), `assets/stitch_ui_mockups/` (bản so sánh), `assets/use_case_diagram.puml`.
- Nhận diện thương hiệu: [`brand_identity.md`](brand_identity.md).
