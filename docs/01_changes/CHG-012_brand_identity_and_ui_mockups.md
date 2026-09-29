# CHG-012: Xác định nhận diện thương hiệu và mockup toàn bộ màn hình

- ID: `CHG-012`
- Trạng thái: `done`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Phan Ngọc Đức Huy` 
- Dependency: `không có` (chỉ đọc `docs/02_reports/01–03`, `DESIGN.md`, `docs/02_reports/assets/use_case_diagram.puml`)
- File/module dự kiến sửa/tạo:
  - Tạo `docs/02_reports/07_brand_identity.md`
  - Tạo thư mục `docs/02_reports/assets/ui_mockups/` (HTML/CSS/JS/SVG tĩnh)
  - Sửa `docs/02_reports/README.md` (thêm 1 dòng mục lục cho chương 07)
  - Sửa `docs/01_changes/README.md` (thêm dòng CHG-012, số CHG tiếp theo)
- Branch: chưa tạo (người dùng chưa yêu cầu branch/commit)
- Commit sau merge: ''

## Kết quả người dùng

Nhóm có một tài liệu nhận diện thương hiệu UniFound (màu, palette, logo, typography, kèm lý do) và bộ mockup HTML tĩnh cho toàn bộ màn hình MVP, xem được trực tiếp trên trình duyệt ở cả desktop và mobile.

## Phạm vi

### Bao gồm

- Tài liệu `07_brand_identity.md`: màu chủ đạo, palette (brand, neutral, semantic Lost/Found, trạng thái), logo, typography, shape/spacing, giọng văn UI; mỗi quyết định có lý do dựa trên chương 01–03.
- Logo dạng SVG (mark + wordmark).
- Mockup SCR-01 → SCR-05 (chương 02, mục 3) và màn hình đăng nhập/đăng ký (luồng chính chương 01, mục 6).
- Mỗi màn hình có trạng thái default, loading, empty, error/validation (chương 02, mục 3) và layout mobile.
- Trang `index.html` làm mục lục mockup.

### Các lưu ý (Tránh người dùng/agent hiểu nhầm task)

- Mockup là HTML tĩnh để tham khảo thiết kế, **không** sửa code ứng dụng trong `src/`.
- Nền giao diện giữ theo `DESIGN.md` (Airbnb); chỉ thay branding (màu brand, logo, font thay thế, nhãn nghiệp vụ). Không sinh lại `DESIGN.md`.
- Không đụng `docs/02_reports/assets/stitch_export/` và `use_case_diagram.puml` (chỉ đọc).
- Dữ liệu trong mockup là dữ liệu giả, không dùng dữ liệu cá nhân thật.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`
- `docs/02_reports/01_overview.md`, `02_requirements_design.md`, `03_development.md`
- `docs/02_reports/assets/use_case_diagram.puml`

## Acceptance criteria

- [x] `07_brand_identity.md` nêu màu chủ đạo, palette, logo, typography và lý do rõ ràng cho từng quyết định.
- [x] Palette đảm bảo tương phản chữ/nền đạt WCAG AA cho text thường (≥ 4.5:1) ở các cặp dùng cho chữ (TC-08).
- [x] Lost/Found phân biệt bằng icon + chữ, không chỉ bằng màu (chương 02, mục 4).
- [x] Có mockup SCR-01 → SCR-05 và màn hình đăng nhập/đăng ký.
- [x] Mỗi màn hình có loading, empty, validation/error và layout mobile. Ngoại lệ có chủ đích: form SCR-02 và AUTH không có trạng thái "empty"; thay vào đó là trạng thái đang gửi/đang xử lý và lỗi nhập liệu.
- [x] Match score luôn đi kèm lý do và câu nhắc "không phải xác nhận sở hữu" (chương 02, mục 4 và 7).
- [x] Thông tin xác minh claim chỉ hiển thị cho claimant và chủ Found Report (chương 02, mục 6): chỉ có ở vai trò "Đã gửi yêu cầu" và "Chủ tin" trong SCR-03, và ở tab "Yêu cầu đã gửi" của SCR-05.
- [x] Đã kiểm tra mockup bằng trình duyệt (desktop 1440×900 + mobile 390×844) và ghi evidence.
- [ ] `npm run typecheck`, `npm test`, `npm run build` đạt. **Chưa đạt do môi trường** (xem TC-10): `node_modules` cục bộ thiếu `@supabase/ssr` và `postgres`. Lỗi có sẵn, không liên quan thay đổi của CHG này (không sửa file nào trong `src/`).

### Evidence

- Ảnh chụp: `docs/02_reports/assets/ui_mockups/screenshots/` (11 ảnh desktop + mobile, chụp bằng Playwright MCP sau khi sửa BUG-1, BUG-2). Riêng ảnh SCR-02 lỗi nhập liệu desktop chụp trước khi sửa BUG-2 nên đã bỏ; ảnh mobile cùng trạng thái là bản sau khi sửa.
- Console trình duyệt: 0 error, 0 warning trong toàn bộ phiên kiểm tra.

## AI Log

### AI-1 — Xác định nhận diện thương hiệu (màu, logo, typography)

- Nhiệm vụ (Task): đề xuất màu chủ đạo, palette, logo, typography cho UniFound, dựa trên chương 01–03, giữ nền Airbnb của `DESIGN.md`.
- Công cụ AI (AI Tool): Claude Code (model Claude Opus 5.5, `claude-opus-5-5`); skill `impeccable` (đọc `reference/craft-floor.md`).
- Đầu vào / Ngữ cảnh (Input/Context): `AGENTS.md`, `DESIGN.md`, `docs/02_reports/01–03`, `use_case_diagram.puml`, enum trong `src/db/schema.ts`, rule mật khẩu trong `src/lib/auth/schemas.ts`.
- Kết quả AI (AI Output): `07_brand_identity.md`. Nội dung chính: primary `#2D5BD7` thay Rausch (tránh nhầm với màu lỗi, tách khỏi màu Lost/Found); Lost = cam `#9A3D0B`, Found = xanh lục `#0B6B4A`, luôn đi kèm icon + chữ; font Be Vietnam Pro (hỗ trợ tốt dấu tiếng Việt, OFL) với fallback Inter; logo "chữ U ôm chấm tròn"; điểm trùng khớp là điểm nhấn thay rating display của Airbnb.
- Quyết định của nhóm (Human Decision): chờ xác nhận.
- Kiểm tra / Xác minh (Verification): tính tỉ lệ tương phản WCAG bằng script (TC-08); xem logo ở 16/32/64/160px bằng Playwright (TC-09).
- Ứng viên đưa vào báo cáo: có (quyết định UI/UX quan trọng, có phần giải thích).

### AI-2 — Dựng mockup HTML tĩnh cho toàn bộ màn hình

- Nhiệm vụ (Task): tạo mockup SCR-01 → SCR-05 và AUTH, có trạng thái loading/empty/error/vai trò và layout mobile.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5); skill `impeccable`; Playwright MCP để kiểm tra.
- Đầu vào / Ngữ cảnh (Input/Context): như AI-1, cộng `07_brand_identity.md`.
- Kết quả AI (AI Output): `docs/02_reports/assets/ui_mockups/`: 6 màn hình + `index.html`, `assets/uf.css` (token theo tài liệu 07), `assets/uf.js` (icon SVG, thanh chuyển trạng thái mockup, tab, dialog, bộ đếm ký tự), 3 file logo SVG. HTML được sinh bằng một script Python tạm (không commit) để dùng chung header/footer; file HTML kết quả là tĩnh và sửa trực tiếp được.
- Quyết định của nhóm (Human Decision): chờ xác nhận.
- Kiểm tra / Xác minh (Verification): Playwright MCP, desktop + mobile (TC-01 → TC-07). Lần kiểm tra đầu phát hiện BUG-1, BUG-2 và hai lỗi nhỏ (chip bị xuống dòng trên mobile, thiếu vạch ngăn giữa ô email và mật khẩu); đã sửa rồi chụp lại.
- Ứng viên đưa vào báo cáo: có (có bug do AI tạo ra, được phát hiện qua kiểm tra và sửa).

### Ghi chú quy trình

- Lệnh `impeccable context` báo dự án chưa có `PRODUCT.md` và đề nghị chạy `init` trước. AI **không chạy** `init`, vì tạo `PRODUCT.md` nằm ngoài phạm vi CHG, và yêu cầu (nền Airbnb, chỉ đổi branding theo chương 01–03) đã đủ rõ. Chờ người dùng quyết định có cần `PRODUCT.md` hay không.
- Chưa dùng `taste-skill`.

## Bug

### BUG-1 — Thẻ gợi ý trùng khớp bị chồng chữ ở desktop

- Biểu hiện: ở SCR-04, cột mô tả của thẻ đè lên cột điểm; tiêu đề và mô tả tràn sang khối điểm.
- Các bước tái hiện: mở `04_potential_matches.html` ở viewport 1440×900.
- Kết quả mong đợi / thực tế: mong đợi ba cột (plate, thông tin, điểm) tách rời. Thực tế cột thông tin chỉ còn khoảng 80px nên chữ tràn.
- Nguyên nhân gốc: container `narrow` (1120px, đã gồm padding 80px) cộng cột luật tính điểm 320px làm vùng danh sách còn khoảng 575px, không đủ chỗ cho lưới `148px 1fr 260px`.
- Fix: nới `.container.narrow` lên 1280px; lưới thẻ đổi thành `120px 1fr 248px`; dưới 1280px thẻ chuyển sang dạng xếp chồng (khối điểm nằm dưới).
- Verification: chụp lại SCR-04 ở 1440px và 390px, không còn chồng chữ (`screenshots/matches_desktop.png`, `matches_mobile.png`).
- Commit/issue: chưa commit.

### BUG-2 — Icon trong hộp tóm tắt lỗi bị đẩy lên dòng riêng

- Biểu hiện: ở SCR-02, trạng thái "Lỗi nhập liệu", icon cảnh báo nằm một dòng, danh sách lỗi nằm dòng dưới.
- Các bước tái hiện: mở `02_create_report.html#state=validation`.
- Kết quả mong đợi / thực tế: mong đợi icon nằm cạnh nội dung như các `.notice` khác. Thực tế icon và nội dung xếp dọc.
- Nguyên nhân gốc: `.err-summary { display: grid }` ghi đè `.notice { display: flex }` trên cùng phần tử.
- Fix: chuyển `display: grid` sang phần tử con (`.err-summary > div`).
- Verification: `screenshots/create_validation_mobile.png` (chụp sau khi sửa).
- Commit/issue: chưa commit.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-01 | SCR-01 desktop/mobile, lọc theo loại tin và danh mục | Grid 4 cột → 1 cột; nhãn Lost/Found có icon + chữ; số tin cập nhật khi lọc | Đúng như mong đợi | Passed | `feed_desktop.png`, `feed_mobile.png` |
| TC-02 | SCR-02 lỗi nhập liệu | Lỗi hiện ngay tại field + hộp tóm tắt; bộ đếm ký tự hiển thị | Đúng sau khi sửa BUG-2 | Passed | `create_validation_mobile.png` |
| TC-03 | SCR-03 các vai trò (khách, sinh viên, người gửi claim, chủ tin, quản trị) | Hành động đúng theo quyền; thông tin xác minh chỉ hiện với claimant/chủ tin | Đúng như mong đợi | Passed | `detail_owner_desktop.png`, `detail_user_mobile.png` |
| TC-04 | SCR-04 điểm + lý do + câu nhắc sở hữu | Mỗi thẻ có điểm, ✓/✗ từng tín hiệu, câu nhắc luôn hiển thị | Đúng sau khi sửa BUG-1 | Passed | `matches_desktop.png`, `matches_mobile.png` |
| TC-05 | SCR-05 hai tab và bước tiếp theo | Mỗi dòng có trạng thái + hướng dẫn bước tiếp theo | Đúng như mong đợi | Passed | `my_desktop.png`, `my_mobile.png` |
| TC-06 | AUTH trạng thái sai mật khẩu | Thông báo lỗi nêu cách khắc phục; ô nhập viền lỗi | Đúng sau khi thêm vạch ngăn giữa hai ô | Passed | `auth_error_desktop.png` |
| TC-07 | Console trình duyệt khi duyệt toàn bộ mockup | Không có lỗi JS | 0 error, 0 warning | Passed | Playwright `browser_console_messages` |
| TC-08 | Tương phản màu chữ/nền | ≥ 4.5:1 cho mọi cặp dùng cho chữ | Thấp nhất 5.41:1 (`muted` trên trắng); primary 5.85:1 | Passed | Script tính WCAG; số liệu trong `07_brand_identity.md` mục 4 |
| TC-09 | Logo ở 16/32/64/160px | Nhận ra hình U + chấm ở 16px | Đạt | Passed | Kiểm tra bằng Playwright (ảnh không lưu) |
| TC-10 | `npm run typecheck`, `npm test`, `npm run build` | Đạt | Lỗi: thiếu module `@supabase/ssr`, `postgres` trong `node_modules`; `npm test` có 3 file lỗi import, 17/17 test chạy được thì đạt | Failed (môi trường) | Output terminal 2026-09-30; cần chạy `npm ci` rồi chạy lại |

## Hướng dẫn tự chạy

Mở trực tiếp `docs/02_reports/assets/ui_mockups/index.html` bằng trình duyệt (không cần `npm run dev`). Cần mạng để tải font Be Vietnam Pro từ Google Fonts; không có mạng thì trình duyệt dùng font dự phòng.

Thanh tối phía trên mỗi màn hình là điều khiển mockup (không thuộc giao diện sản phẩm): bấm để chuyển trạng thái/vai trò, hoặc dùng hash URL, ví dụ `03_report_detail.html#role=owner&state=default`.
