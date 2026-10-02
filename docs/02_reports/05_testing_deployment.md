# Kiểm thử và triển khai

Chỉ ghi kết quả đã chạy thật; mục chưa chạy ghi rõ Pending.

## 1. Phạm vi kiểm thử

- Luồng chính: đăng tin Nhặt được/Mất đồ → gợi ý trùng khớp → gửi yêu cầu nhận → chấp nhận và hẹn bàn giao → hai bên xác nhận → Đã trả.
- Valid/invalid input, dữ liệu thiếu/trùng, state transition và quyền (khách, người dùng, chủ tin, người thứ ba, admin, tài khoản bị khóa).
- Matching rule và biên điểm (49/50), hết hạn tin 60 ngày và yêu cầu 7 ngày.
- Loading/empty/error cùng responsive desktop và mobile (iPhone 13, 390px; popup, header và form ảnh minh chứng kiểm tới 320px).
- Thanh tìm kiếm/lọc (kết hợp nhiều tiêu chí, tìm không dấu), header và popup xác thực, Trợ giúp, footer, chỉ có chế độ sáng.
- Ảnh minh chứng khi gửi yêu cầu nhận: định dạng, số lượng, quyền xem và không lộ ra công khai.
- Build và kiểm tra trên bản triển khai (xem mục 4 về phần còn chờ xác nhận).

## 2. Kết quả chạy lệnh kiểm tra

Chạy ngày 2026-10-03 trên nhánh `main` (sau khi gộp thanh tìm kiếm, header/popup, bỏ chế độ tối và ảnh minh chứng):

| Lệnh | Kết quả |
|---|---|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm test` (Vitest) | 9 file, 78/78 test pass |
| `npm run build` | Pass, 20 route |
| `npm run test:e2e` | Không chạy lại trong lần này (mỗi lần chạy tạo thêm tin thử trên DB dev). Kết quả gần nhất khi hoàn thành ảnh minh chứng: 22/22 pass (5 file, kể cả golden path), chạy trên dev server |

## 3. Test case chính

| ID | Nhóm | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|---|
| TC-01 | Unit | Kiểm tra tên miền email trường | Chỉ tên miền trong danh sách pass | Đúng, kể cả tên miền con và đuôi giả `uit.edu.vn.evil.com` bị từ chối | Passed | `src/lib/auth/auth.test.ts` |
| TC-02 | UI | Đăng ký bằng email ngoài trường | Bị từ chối, báo lỗi tại field | `someone@gmail.com` bị từ chối, không gọi Supabase | Passed | Playwright |
| TC-03 | UI | Đăng tin thiếu field, 0 và 6 ảnh | Báo lỗi tại field, không lưu | Lỗi đúng từng field; 6 ảnh → giữ 5; Zod phía server cũng chặn | Passed | Playwright |
| TC-04 | Bảo mật | Gọi Storage API với ảnh sai định dạng, quá 5 MB, thư mục người khác | Bị từ chối | Cả ba bị từ chối | Passed | script Node |
| TC-05 | Bảo mật | Xem HTML chi tiết tin Nhặt được | Không có đáp án xác minh, không có liên hệ | Không chứa đáp án, câu hỏi hay số liên hệ | Passed | Playwright |
| TC-06 | Phân quyền | User B sửa/xóa tin của A | 403, dữ liệu không đổi | B bị chặn ở URL sửa và khi gửi form với `id` của A; tin của A vẫn `Đang mở` | Passed | Playwright |
| TC-07 | Unit | Ngưỡng gợi ý 49 so với 50 điểm | 49 không lưu, 50 lưu | `shouldSuggest(49)=false`, `shouldSuggest(50)=true` | Passed | `matching.test.ts` |
| TC-08 | UI | A đăng Mất đồ, B đăng Nhặt được khớp | Có gợi ý, hai bên có thông báo | 85 điểm, 3 lý do; chuông A và B đều "1 chưa đọc"; tin khác danh mục không gợi ý | Passed | Playwright |
| TC-09 | Unit | State machine yêu cầu nhận | Chỉ chuyển trạng thái cho phép | Chỉ còn đúng 3 chuyển hợp lệ | Passed | `claims.test.ts` |
| TC-10 | Unit | Hết hạn yêu cầu sau 7 ngày | `EXPIRED` đúng ranh giới | 7 ngày − 1 ms → `PENDING`; đúng 7 ngày → `EXPIRED` | Passed | `claims.test.ts` |
| TC-11 | DB / đồng thời | Hai trình duyệt cùng bấm "Chấp nhận" cho hai yêu cầu của một tin | Chỉ một `ACCEPTED` | DB còn 1 `ACCEPTED`, 1 `REJECTED`, tin `IN_PROGRESS` (chứng minh khóa dòng trong transaction; lỗi 23505 từ unique index chưa ép riêng) | Passed | Playwright + Supabase MCP |
| TC-12 | Phân quyền | Người thứ ba mở URL yêu cầu | 403/404, không lộ câu trả lời | 404, HTML không có câu trả lời | Passed | Playwright |
| TC-13 | Phân quyền | Sai người bấm xác nhận bàn giao | Bị từ chối, không đổi dữ liệu | C phát lại request của B → 403; `owner_confirmed_at` vẫn rỗng | Passed | Playwright + Supabase MCP |
| TC-14 | Phân quyền | USER mở `/admin`, phát lại action admin | Bị chặn | 403 cả khi vào trang và khi phát lại action | Passed | Playwright |
| TC-15 | UI | Dashboard so với dữ liệu seed | Khớp | 15 tin, tỉ lệ đã trả 10%, số liệu tuần và top danh mục trùng truy vấn SQL trực tiếp | Passed | Playwright + Supabase MCP |
| TC-16 | E2E | Đăng nhập → đăng tin → yêu cầu → chấp nhận → xác nhận hai bên → Đã trả | Xanh | Pass trên dev (56,6 s); sau khi làm lại UI, 4/4 trên bản build production | Passed | `tests/e2e/golden-path.spec.ts` |
| TC-17 | E2E | Email ngoài trường, khách vào trang cần đăng nhập, claim sai quyền | Bị từ chối | Cả 3 ca pass | Passed | `tests/e2e/edge-cases.spec.ts` |
| TC-18 | Responsive | Quét 17 màn hình (khách, sinh viên, admin) trên iPhone 13 | Không vỡ layout | Không tràn ngang, đủ nhãn form, không lỗi JS; đã sửa BUG-04/2 | Passed | ảnh `023_m_*.png` |
| TC-19 | NFR | Tải feed | < 3 giây | 0,56–0,6 s trên bản build (2,5 s lần đầu khởi động lạnh) | Passed |  |
| TC-20 | UI | Quên mật khẩu với email ngoài trường | Báo lỗi, không gửi | `a@gmail.com` và `a@hcmut.edu.vn.evil.com` bị từ chối | Passed | Playwright |
| TC-21 | Triển khai | Chạy golden path trên URL Vercel | Thành công | Đã deploy; chưa có kết quả chạy trên URL này | **Pending** | chờ xác nhận |
| TC-22 | UI | Bấm liên kết trong mail → đặt mật khẩu mới | Đăng nhập được bằng mật khẩu mới | Chưa chạy: cần hộp thư thật và Supabase gửi được mail | **Pending** |  |
| TC-23 | UI | Đăng ký bằng email 5 trường mới | Gán đúng `school_id` | Chưa chạy đăng ký thật; ánh xạ tên miền → trường đã khớp bằng SELECT | **Pending** |  |
| TC-24 | UI | Thanh tìm kiếm gộp trên desktop | Đủ 4 phân đoạn (Tìm kiếm / Danh mục / Vị trí / Thời gian), không trùng lặp | Đúng, không còn dải icon danh mục cũ | Passed | `tests/e2e/search-filters.spec.ts` |
| TC-25 | UI | Mở ô chọn, bấm ra ngoài/Esc, cuộn trang | Chỉ một ô mở một lúc; Esc/click ngoài đóng; thanh bám đỉnh khi cuộn | Đúng kỳ vọng | Passed | `search-filters.spec.ts` |
| TC-26 | UI | Tìm từ khóa + danh mục + ngày, chip, xóa từng chip/"Xóa tất cả" | URL có đủ tham số; chip hiện/xóa đúng; mobile đủ 4 tiêu chí | URL có `q`, `category`, `from`; 3 chip; xóa chip và "Xóa tất cả" đúng; mobile không tràn | Passed | `search-filters.spec.ts` |
| TC-27 | UI | Gõ từ khóa rồi xem có gợi ý không | Không dropdown gợi ý | `type=text`, `autocomplete=off`, không có listbox | Passed | `search-filters.spec.ts` |
| TC-28 | UI | Chọn trường UIT trong ô Vị trí | Chỉ còn khu vực của UIT | Đúng, không còn khu vực của trường khác | Passed | `search-filters.spec.ts` |
| TC-29 | Unit/DB | Tìm không dấu "vi", "the", "khoa" | Ra "ví", "thẻ", "khóa" | Hàm bỏ dấu và điều kiện `translate ilike` pass unit test; trên DB dev "vi" khớp "Mất ví da màu nâu" và "Nhặt được thẻ sinh viên" | Passed | `src/lib/reports/query.test.ts` + truy vấn SQL |
| TC-30 | UI | Header, menu, avatar khi là khách và khi đã đăng nhập | Thứ tự avatar rồi menu; khách: menu có Đăng nhập, Đăng ký, Trợ giúp, avatar mở popup; đã đăng nhập: avatar vào `/profile`, menu có Tin và yêu cầu của tôi, Gợi ý, Thông báo, Đăng tin mới, Trợ giúp, Đăng xuất | Đúng cả hai trạng thái; Đăng xuất về bảng tin ở trạng thái khách. Mục Quản trị của admin chỉ xác nhận bằng đọc code | Passed | `tests/e2e/header-help.spec.ts` |
| TC-31 | UI | Popup đăng nhập ↔ đăng ký ↔ quên mật khẩu; "Đăng tin" khi chưa đăng nhập | Chuyển chế độ trong cùng popup, giữ email khi lỗi, Esc đóng; đăng nhập xong về `/reports/new` | Đúng kỳ vọng. Các đường dẫn cũ `/login`, `/register`, `/forgot-password` chuyển hướng về popup đúng chế độ; nhánh "đã đăng nhập thì về trang đích" chưa có test tự động | Passed | `header-help.spec.ts`, `edge-cases.spec.ts` |
| TC-32 | UI | Nút Trợ giúp nổi và nội dung modal; footer | Ẩn khi cuộn, hiện lại ở đầu trang; modal có 2 nhóm bài, bài chi tiết, điểm tiếp nhận; footer đủ 4 cột | Đúng kỳ vọng | Passed | `header-help.spec.ts` + ảnh chụp từ script |
| TC-33 | UI | Trình duyệt giả lập `prefers-color-scheme: dark`, hoặc máy từng lưu `localStorage.theme = "dark"` | Giao diện vẫn sáng, `<html>` không có class `dark`, không có mục Sáng/Tối trong menu | Đúng; nền trang vẫn trắng | Passed | `header-help.spec.ts` + ảnh chụp từ script |
| TC-34 | UI/Bảo mật | Gửi yêu cầu nhận có và không kèm ảnh; người nhặt xem | Không ảnh vẫn gửi được; có ảnh thì người nhặt thấy ảnh tải được | Đúng cả hai | Passed | `tests/e2e/claim-images.spec.ts` |
| TC-35 | UI | Chọn ảnh thứ 4, file PDF, bỏ ảnh khỏi danh sách, bấm gửi khi ảnh còn đang tải | Từ chối kèm thông báo tiếng Việt; ảnh đã bỏ không gắn vào yêu cầu; nút gửi khóa khi đang tải | PDF bị từ chối, chọn 4 ảnh thì bỏ bớt 1 kèm thông báo; xóa 1/2 ảnh thì chỉ còn 1 ảnh gắn; nút gửi khóa khi đang tải. Ảnh > 5 MB chưa test riêng (dùng chung logic `ImagePicker` với form đăng tin) | Passed | `claim-images.spec.ts` |
| TC-36 | Bảo mật | URL công khai của ảnh minh chứng; người thứ ba mở trang yêu cầu nhận | Không truy cập được; 404, không lộ ảnh; chi tiết tin công khai không chứa ảnh | URL `/object/public/claim-images/...` không trả 2xx; người thứ ba 404; HTML chi tiết tin không chứa `claim-images` | Passed | `claim-images.spec.ts` + Supabase MCP (bucket không công khai, RLS bật) |
| TC-37 | Unit/Bảo mật | Gửi trực tiếp action với đường dẫn ảnh của người khác, ảnh trùng, đường dẫn sai dạng | Server báo lỗi theo field ảnh, không ghi yêu cầu | Cả ba bị từ chối. Trường hợp ảnh chưa tồn tại trong Storage chỉ xác nhận bằng đọc code | Passed | `src/lib/claims/claims.test.ts` |
| TC-38 | Responsive | Form có ảnh minh chứng, popup và header ở 320/390px, popover "Thời gian" ở 320px | Không tràn ngang, bố cục gọn | Đúng sau khi sửa BUG-07, BUG-08 | Passed | Playwright (viewport 320px) + ảnh chụp từ script; chưa thử iOS/WebKit thật |

## 4. Bug evidence

### BUG-01 — Thời gian hiện "sau 14 giây nữa"

- Biểu hiện: Tab "Yêu cầu tôi đã gửi" hiện yêu cầu vừa gửi là "sau 14 giây nữa".
- Các bước tái hiện: Gửi yêu cầu nhận rồi mở `/my?tab=sent` ngay.
- Kết quả mong đợi / thực tế: Mong đợi "vừa xong"; thực tế hiện thời điểm tương lai.
- Nguyên nhân gốc: `created_at` lấy `now()` của database, còn `timeAgo` so với đồng hồ máy chạy ứng dụng; đồng hồ máy chậm hơn database khoảng 14 giây.
- Fix: `timeAgo` coi lệch dưới 5 phút về tương lai và dưới 1 phút về quá khứ là "vừa xong" (`src/lib/labels.ts`).
- Verification: Test `timeAgo` trong `src/lib/reports/reports.test.ts` pass.
- Commit/evidence: `e8cdd04`.

### BUG-02 — Email có khoảng trắng/chữ hoa bị Zod từ chối

- Biểu hiện: `" A@GM.UIT.EDU.VN "` bị báo "Email không hợp lệ".
- Các bước tái hiện: `credentialsSchema.parse({ email: " A@GM.UIT.EDU.VN ", password: "12345678" })`.
- Kết quả mong đợi / thực tế: Mong đợi chuẩn hóa thành `a@gm.uit.edu.vn`; thực tế lỗi validation.
- Nguyên nhân gốc: Zod v4 `z.email().trim()` kiểm tra định dạng trước khi trim.
- Fix: `z.string().trim().toLowerCase().pipe(z.email(...))` trong `src/lib/auth/schemas.ts`.
- Verification: test Zod trong `src/lib/auth/auth.test.ts` pass.
- Commit/evidence: `e8cdd04`.

### BUG-03 — `npm run typecheck` lỗi `PageProps<"/login">` khi chưa build

- Biểu hiện: `TS2344: Type '"/login"' does not satisfy the constraint '"/"'`.
- Các bước tái hiện: Thêm route mới rồi chạy `npm run typecheck` trước `npm run build`.
- Kết quả mong đợi / thực tế: Mong đợi pass; thực tế dùng type route cũ trong `.next/types`.
- Nguyên nhân gốc: Type route của Next.js 16 chỉ được sinh khi `dev`/`build`/`typegen`.
- Fix: Đổi script `typecheck` thành `next typegen && tsc --noEmit`.
- Verification: `npm run typecheck` pass (và pass trong lần chạy ngày 2026-10-02).
- Commit/evidence: `e8cdd04`.

### BUG-04 — Tab "Tin của tôi" bị cắt chữ trên điện thoại

- Biểu hiện: Trên iPhone 13, tab thứ ba hiện "Yêu cầu t…" và phải cuộn ngang mới thấy.
- Các bước tái hiện: Mở `/my?tab=received` ở viewport 390px.
- Kết quả mong đợi / thực tế: Mong đợi đọc được cả 3 tab; thực tế tab cuối bị che.
- Nguyên nhân gốc: Nhãn dài ("Yêu cầu tôi nhận được") trong thanh segmented một hàng.
- Fix: Nhãn ngắn trên màn hẹp ("Đã gửi", "Nhận được"), giữ nhãn đầy đủ từ `sm` (`src/app/my/page.tsx`).
- Verification: Quét mobile lại, không tràn ngang.
- Commit/evidence: `e8cdd04`.

### BUG-05 — Bảng tin trên điện thoại quá dài

- Biểu hiện: Mỗi thẻ tin chiếm gần cả màn hình; 5 tin dài khoảng 8.500px.
- Các bước tái hiện: Mở `/` ở viewport 390px.
- Kết quả mong đợi / thực tế: Mong đợi lướt được nhiều tin; thực tế rất dài.
- Nguyên nhân gốc: Tỉ lệ ảnh thẻ 4:3 dùng chung cho mọi breakpoint.
- Fix: Ảnh 16:9 trên điện thoại, 4:3 từ `sm` (`src/components/reports/report-card.tsx`).
- Verification: Ảnh chụp mobile sau khi sửa.
- Commit/evidence: `e8cdd04`.

### BUG-06 — Thẻ gợi ý trùng khớp bị chồng chữ (lỗi do AI tạo ra)

- Biểu hiện: Ở mockup SCR-04, cột mô tả đè lên cột điểm ở desktop.
- Các bước tái hiện: Mở `04_potential_matches.html` ở 1440×900.
- Kết quả mong đợi / thực tế: Mong đợi ba cột tách rời; thực tế cột thông tin chỉ còn khoảng 80px.
- Nguyên nhân gốc: Container 1120px cộng cột luật tính điểm 320px làm vùng danh sách còn khoảng 575px, không đủ cho lưới `148px 1fr 260px`.
- Fix: Nới container lên 1280px, lưới thẻ `120px 1fr 248px`; dưới 1280px thẻ xếp chồng.
- Verification: Chụp lại bằng Playwright MCP ở 1440px và 390px (`claude_ui_mockups/screenshots/matches_desktop.png`, `matches_mobile.png`).
- Commit/evidence: `e8cdd04`.

### BUG-07 — Ô "Thời gian" của thanh tìm kiếm bị chồng nhau trên iPhone

- Biểu hiện: Hai ô "Từ ngày" / "Đến ngày" chồng lên nhau, ô "Đến ngày" tràn ra ngoài mép popup; nhãn dài "Trường & khu vực" xuống 3 dòng làm lệch hàng.
- Các bước tái hiện: Mở trang chủ trên iPhone (Safari) → bấm phân đoạn "Thời gian".
- Kết quả mong đợi / thực tế: Mong đợi hai ô nằm gọn trong popup; thực tế chồng và tràn.
- Nguyên nhân gốc: Popup dùng lưới 2 cột; `<input type="date">` trên iOS có chiều rộng nội tại lớn hơn nửa popup và không có `min-w-0`/`w-full` nên không co lại. Nhãn dài trong cột chỉ rộng khoảng 110px.
- Fix: Từ 744px trở xuống xếp hai ô theo chiều dọc, ô ngày `w-full min-w-0`; đổi nhãn thành "Vị trí" (hai điều này do người dùng chọn trong ba phương án AI đề xuất: xếp dọc, ép co 2 cột, bottom sheet).
- Verification: Test Playwright ở viewport 320px pass (Chromium). Chưa thử trên iOS Safari/WebKit thật; chưa xác nhận test này fail khi chưa sửa.
- Commit/evidence: ảnh chụp iPhone do người dùng gửi; `tests/e2e/search-filters.spec.ts`.

### BUG-08 — Nút menu bị tràn khỏi màn hình 320px khi đã đăng nhập

- Biểu hiện: Ở 320px, header đã đăng nhập (logo + Đăng tin + chuông + avatar + menu) rộng hơn màn hình, nút menu bị cắt.
- Các bước tái hiện: Đăng nhập, mở bảng tin ở 320px, kiểm tra `scrollWidth > innerWidth`.
- Kết quả mong đợi / thực tế: Mong đợi không tràn ngang; thực tế tràn ngang.
- Nguyên nhân gốc: Tách avatar và menu thành hai nút riêng làm header rộng thêm khoảng 90px so với nút ghép trước đó.
- Fix: Ẩn chữ "UniFound" dưới 380px (giữ biểu tượng) và giảm khoảng cách giữa các nút.
- Verification: Script Playwright ở 320px: không còn tràn ngang, ảnh chụp đủ 4 nút.
- Commit/evidence: ảnh chụp từ script (không lưu trong repo).

### Ghi nhận — một test E2E chập chờn

- Lần chạy đầy đủ đầu tiên sau khi làm header/popup, test "claim sai quyền" fail một lần (trang yêu cầu nhận hiện "Không tìm thấy trang"); chạy lại riêng và chạy lại toàn bộ đều pass. Chưa xác định nguyên nhân (nghi do dev server biên dịch lần đầu); trang này không nằm trong phần code đã sửa.

## 5. Triển khai và demo

- Nền tảng: Vercel. Build command `npm run build`.
- URL: https://unifound-blue.vercel.app/ (do nhóm trưởng deploy, ghi nhận ngày 2026-10-02). Chưa có kết quả E2E hay chạy tay đầy đủ trên URL này (TC-21 Pending).
- Biến môi trường (đúng tên ở `03_development.md` mục 4, không ghi giá trị): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `DATABASE_URL`, `ALLOWED_EMAIL_DOMAINS`. `SEED_DEMO_PASSWORD` chỉ cần khi chạy seed/E2E.
- Database: `npm run db:migrate` còn tạo bucket riêng tư `claim-images` và policy Storage cho ảnh minh chứng; migration này phải được áp dụng trên database mà bản deploy trỏ tới. Việc kiểm tra gửi yêu cầu kèm ảnh trên URL Vercel chưa thực hiện.
- Supabase Auth: cần thêm URL Vercel vào Site URL / Redirect URLs để liên kết xác nhận email và đặt lại mật khẩu (`/auth/callback`) trỏ đúng. Gửi mail thật nên cấu hình Custom SMTP (việc ngoài code).
- Demo data: `npm run db:seed` tạo 6 trường, danh mục, địa điểm và tin mẫu hư cấu.
- Luồng demo: Demo A đăng tin Nhặt được kèm câu hỏi xác minh → Demo B gửi yêu cầu → Demo A chấp nhận và đặt lịch hẹn → hai bên xác nhận → tin "Đã trả". Admin xem kiểm duyệt và thống kê.

## 6. Giới hạn của việc kiểm thử

- Nhiều phiên kiểm thử dùng thư viện Playwright thay cho Playwright MCP, nên bằng chứng là ảnh/log từ script; các thay đổi giao diện gần đây (thanh tìm kiếm, header/popup, ảnh minh chứng) cũng chưa được xem lại bằng Playwright MCP.
- Chưa thử trên iOS/Safari thật (BUG-07 chỉ kiểm bằng Chromium ở 320px); chưa xác nhận test BUG-07 fail khi chưa có bản sửa.
- Ảnh minh chứng: admin có quyền đọc ở tầng Storage nhưng giao diện chưa cho admin mở trang yêu cầu nhận để xem; ảnh bị bỏ khỏi form hoặc form bị hủy vẫn nằm trong Storage (chưa có tác vụ dọn).
- Quyền xem mục "Quản trị" trong menu của admin chỉ xác nhận bằng đọc code, chưa có test với tài khoản admin; nhánh "đã đăng nhập thì chuyển về trang đích" khi mở `/login` chưa có test tự động.
- Chưa chạy: gửi mail thật và đặt lại mật khẩu (TC-22), tài khoản `locked` sau đặt lại mật khẩu, đăng ký thật bằng 5 tên miền mới (TC-23), golden path trên URL Vercel (TC-21).
- E2E tạo tin thử trên database dev mỗi lần chạy; dữ liệu thử đã được dọn một lần, còn 2 hồ sơ mồ côi trong `public.users` chờ xử lý.
- Phân trang feed chưa kiểm trên UI vì dữ liệu seed chưa đủ 12 tin mỗi tab .
- Đây là kiểm thử của nhóm trên dữ liệu dev/demo, chưa có kiểm thử tải hay bảo mật chuyên sâu.
