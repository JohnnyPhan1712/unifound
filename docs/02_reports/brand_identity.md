# Nhận diện thương hiệu

Tài liệu chốt đề xuất về màu chủ đạo, palette, logo, typography và giọng văn của UniFound. Mỗi quyết định có lý do, dựa trên chương [01](01_overview.md), [02](02_requirements_design.md) và [03](03_development.md).

- Nền giao diện: [`DESIGN.md`](../../DESIGN.md) (phân tích hệ thống Airbnb). Giữ nguyên bố cục, spacing, bo góc, elevation và cách tổ chức component; **chỉ thay phần branding** mô tả dưới đây.
- Mockup áp dụng nhận diện: [`assets/claude_ui_mockups/index.html`](assets/claude_ui_mockups/index.html).
- Trạng thái: **đã được nhóm trưởng xác nhận** và dùng làm chuẩn giao diện.

## 1. Định vị và tính cách

UniFound là **bảng tin đồ thất lạc đáng tin của sinh viên trong trường** (chương 01, mục 1). Người mở ứng dụng thường đang lo lắng vì vừa mất đồ, hoặc đang cầm đồ của người khác và muốn trả nhanh. Thương hiệu vì vậy cần:

| Tính cách | Nghĩa trong giao diện | Căn cứ |
|---|---|---|
| **Bình tĩnh** | Màu trấn an, không dùng đỏ báo động cho hành động chính | Persona Minh: tin trôi, khó biết tin nào đáng kiểm tra |
| **Rõ ràng** | Lost/Found phân biệt ngay bằng icon + chữ + màu; mỗi màn hình nói rõ bước tiếp theo | Chương 02, mục 4 |
| **Trung thực** | Điểm trùng khớp luôn đi kèm lý do và câu nhắc "không phải xác nhận sở hữu" | Chương 02, mục 4 và 7 |
| **Tôn trọng riêng tư** | Không hiện số điện thoại/email; thông tin xác minh có nhãn khóa "chỉ chủ tin thấy" | Chương 02, mục 6 |

Vì vậy UniFound giữ đúng tinh thần Airbnb (thân thiện, nhiều khoảng trắng, một màu nhấn duy nhất) nhưng đổi **cảm xúc của màu nhấn** từ "ấm áp, du lịch" sang "tin cậy, trấn an".

## 2. Logo

### Ý tưởng

Logo mark là chữ **U** (UniFound, University) **ôm một chấm tròn** ở giữa. Chấm tròn là món đồ được tìm thấy; chữ U như hai bàn tay đang giữ nó an toàn chờ trả lại chủ. Ý nghĩa gói gọn luồng chính của sản phẩm: *tìm thấy → giữ an toàn → trả lại* (chương 01, mục 6).

| File | Dùng khi |
|---|---|
| [`logo_mark.svg`](assets/claude_ui_mockups/assets/logo_mark.svg) | Favicon, avatar ứng dụng, góc trái top nav (nền xanh, U trắng) |
| [`logo_mark_mono.svg`](assets/claude_ui_mockups/assets/logo_mark_mono.svg) | In đen trắng, watermark, nền màu không phải trắng |
| [`logo_wordmark.svg`](assets/claude_ui_mockups/assets/logo_wordmark.svg) | Slide, báo cáo, trang giới thiệu |

### Cấu trúc

- Khung: hình vuông bo góc `11/40` (≈ 28%), tức cùng họ "mềm, không góc cứng" với `rounded.md` của DESIGN.md.
- Chữ U: nét tròn đầu, dày `4.6/40`; chấm tròn bán kính `3.1/40`, nằm giữa hai nhánh.
- Wordmark: "UniFound" viết liền, chữ **U** và **F** hoa để đọc rõ hai phần *Uni* + *Found*; Be Vietnam Pro 700, letter-spacing −0.02em, toàn bộ màu `primary`. Airbnb cũng để wordmark một màu brand.

### Lý do chọn

- **Nhận ra ở 16px:** chỉ có hai hình (U và chấm), không có chi tiết nhỏ. Đã xem trực tiếp mark ở 16, 32, 64 và 160px bằng Playwright khi kiểm tra mockup.
- **Không dùng kính lúp hay ghim bản đồ:** kính lúp đã được dùng làm icon cho tin **Mất đồ**, còn ghim bản đồ gợi GPS, mà GPS nằm ngoài phạm vi MVP (chương 01, mục 4). Nếu dùng hai hình này cho logo sẽ nhầm với chức năng.
- **Một màu brand:** giống quy tắc "single accent" của DESIGN.md.

### Quy tắc sử dụng

- Vùng an toàn quanh logo tối thiểu bằng ½ chiều cao mark.
- Kích thước tối thiểu: mark 16px, wordmark 96px chiều ngang.
- Không đổi màu mark sang cam/xanh lục (hai màu đó dành cho Lost/Found), không thêm bóng, không xoay, không kéo méo.
- Wordmark SVG hiện dùng thẻ `<text>`. Khi xuất ra ngoài web (slide, in ấn), cần **outline chữ thành path**, vì SVG nhúng dạng `<img>` không tải được web font và sẽ hiện font hệ thống.

## 3. Màu chủ đạo

### UniFound Blue `#2D5BD7`

Thay cho Rausch `#FF385C` của Airbnb ở mọi vị trí DESIGN.md dùng `colors.primary`: nút CTA chính, search orb, link thương hiệu, wordmark.

**Lý do chọn xanh dương:**

1. **Không nhầm với lỗi và cảnh báo.** Rausch là hồng đỏ, rất gần màu lỗi `#C13515`. Với Airbnb thì không sao, nhưng UniFound có nhiều thông báo lỗi và thao tác nguy hiểm (validation, xóa tin, từ chối claim, chương 02 mục 1). Nếu nút chính cũng đỏ, người dùng khó phân biệt "hành động chính" với "cảnh báo". Tỉ lệ tương phản giữa `#2D5BD7` và Rausch chỉ 1.66:1, nhưng khác hẳn về sắc độ (hue), nên hai màu không bị lẫn.
2. **Tách khỏi màu Lost/Found.** Hai nhãn nghiệp vụ cần hai màu riêng (cam và xanh lục, mục 4). Màu brand phải nằm ở vùng sắc độ thứ ba để ba lớp nghĩa *hành động / mất / nhặt được* không chồng nhau. Xanh dương cách xa cả cam lẫn xanh lục trên vòng màu.
3. **Trấn an người đang lo.** Xanh dương gắn với sự tin cậy và bình tĩnh, hợp với người vừa mất đồ (persona chương 01). Màu này cũng quen thuộc trong môi trường học đường.
4. **Đạt WCAG AA.** Chữ trắng trên `#2D5BD7` đạt **5.85:1** (AA cần ≥ 4.5:1). Chữ `#2D5BD7` trên nền trắng cũng đạt 5.85:1, nên dùng được làm link.

**Vì sao không giữ nguyên Rausch:** yêu cầu là "chỉ đổi branding", và màu nhấn chính là phần nhận diện rõ nhất. Giữ Rausch sẽ khiến UniFound trông như bản sao Airbnb, và vướng lý do 1 ở trên.

## 4. Palette

Token đặt theo cùng tên và vai trò với DESIGN.md để khi áp dụng chỉ cần đổi giá trị.

### Brand

| Token | Hex | Dùng cho | Tương phản |
|---|---|---|---|
| `primary` | `#2D5BD7` | CTA chính, search orb, link, wordmark | Trắng trên nền: 5.85:1 |
| `primary-active` | `#1F47B8` | Hover/pressed của CTA | Trắng trên nền: 7.92:1 |
| `primary-disabled` | `#C9D6F7` | CTA bị vô hiệu | Chủ ý thấp (1.45:1), như Airbnb |
| `primary-soft` | `#EEF3FF` | Nền thông báo thông tin, vùng chọn text | Chữ `#1F47B8`: 7.13:1 |

### Semantic nghiệp vụ

| Token | Chữ / nền | Dùng cho | Tương phản chữ/nền |
|---|---|---|---|
| `lost` / `lost-soft` | `#9A3D0B` / `#FFF1E6` | Nhãn **Mất đồ** + icon kính lúp | 6.23:1 |
| `found` / `found-soft` | `#0B6B4A` / `#E6F6EF` | Nhãn **Nhặt được** + icon hộp | 5.84:1 |
| `pending` / `pending-soft` | `#8A5700` / `#FFF7E0` | Trạng thái đang chờ xử lý | 5.70:1 |
| `error` | `#C13515` | Lỗi validation, nút xóa (giữ nguyên DESIGN.md) | Trên trắng: 5.54:1 |

**Lý do cho Lost = cam, Found = xanh lục:**

- Cam mang cảm giác "cần chú ý, đang thiếu" nhưng không mạnh bằng đỏ (đỏ dành cho lỗi). Xanh lục mang cảm giác "đã có, an toàn", đúng nghĩa món đồ đã được nhặt và đang được giữ.
- Chương 02 mục 4 yêu cầu **không phân biệt chỉ bằng màu**. Vì vậy nhãn luôn gồm ba lớp: icon riêng (kính lúp / hộp), chữ ("Mất đồ" / "Nhặt được") và màu. Người mù màu đỏ–lục vẫn phân biệt được qua icon và chữ.
- Trên thẻ bảng tin, màu nền nhạt của loại tin (`lost-soft`/`found-soft`) phủ cả vùng minh họa. Nhờ đó người dùng quét feed nhận ra loại tin ngay cả khi chưa đọc nhãn.

### Trạng thái

Trạng thái dùng **hình dạng khác nhãn loại tin**: pill viền hairline + chấm màu, còn nhãn loại tin là pill nền đặc + icon. Nhờ vậy "Mất đồ" và "Chờ xử lý" không bị lẫn dù cùng tông ấm.

| Nhóm nghĩa | Chấm màu | Ghi chú |
|---|---|---|
| Đang mở | `primary` | Tin đang hiển thị, nhận yêu cầu |
| Đang chờ xử lý | `pending-accent` `#E0A100` | Có claim chờ chủ tin |
| Đã chấp nhận | `found-accent` `#1FA774` | Chờ trao trả |
| Đã trả lại | Pill nền `ink`, chữ trắng, icon ✓ | Trạng thái kết thúc tốt, nên nổi nhất |
| Bị từ chối | `error` | Chỉ cho claim |
| Đã đóng | `muted-soft` | Chữ `muted` |

Giá trị enum thật lấy từ `src/db/schema.ts` (`report_status`, `claim_status`), theo quy ước ở `conventions.md`. Bảng trên chỉ quy định màu cho từng nhóm nghĩa, không thay nguồn enum.

### Neutral (giữ nguyên DESIGN.md)

`ink #222222` (chữ chính, 15.91:1 trên trắng), `body #3F3F3F`, `muted #6A6A6A` (5.41:1), `muted-soft #929292`, `hairline #DDDDDD`, `hairline-soft #EBEBEB`, `border-strong #C1C1C1`, `canvas #FFFFFF`, `surface-soft #F7F7F7`, `surface-strong #F2F2F2`.

Lý do giữ nguyên: đây là phần tạo nên cảm giác "90% trắng + mực, một điểm nhấn" của Airbnb. Đổi phần này nghĩa là đổi nền thiết kế, vượt yêu cầu "chỉ đổi branding".

### Chế độ sáng/tối

MVP chỉ có **light mode**, giống Airbnb (DESIGN.md: không có dark mode trên web). Lý do theo bối cảnh sử dụng: sinh viên chủ yếu mở ứng dụng ban ngày trong trường, ở hành lang, căn tin hay bãi xe. Dark mode chưa có trong phạm vi chương 01.

## 5. Typography

### Be Vietnam Pro (thay Airbnb Cereal VF)

```text
font-family: "Be Vietnam Pro", Inter, -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
```

**Lý do:**

1. **Tiếng Việt là ngôn ngữ giao diện** (AGENTS.md, chương 01). Be Vietnam Pro được thiết kế riêng cho tiếng Việt: dấu chồng như "ổ", "ự", "ẫ" được đặt đúng vị trí, không đè lên dòng trên, kể cả ở cỡ 12–13px (nhãn trạng thái, caption).
2. **Cùng tinh thần với Cereal.** Đây là sans-serif geometric-humanist, bo tròn nhẹ, hợp với shape language "mềm" của Airbnb.
3. **Miễn phí, giấy phép SIL OFL**, có trên Google Fonts, hỗ trợ đủ 400/500/600/700. Airbnb Cereal là font độc quyền nên không dùng được.
4. **Inter là fallback**, đúng gợi ý thay thế trong DESIGN.md ("Note on Font Substitutes"), và cũng hỗ trợ tiếng Việt.

Mockup hiện tải font từ Google Fonts. Khi làm ứng dụng thật, nên dùng `next/font` để tự host (subset `vietnamese` + `latin`), tránh phụ thuộc CDN.

### Thang chữ

Giữ nguyên thang và nguyên tắc của DESIGN.md (weight vừa phải, hierarchy nhờ khoảng trắng). Chỉ điều chỉnh những chỗ có lý do:

| Vai trò | Cỡ / weight | Thay đổi so với DESIGN.md và lý do |
|---|---|---|
| Tiêu đề trang (h1) | 28px / 700 | Giữ `display-xl` |
| Tiêu đề chi tiết tin | 26px / 600 | DESIGN.md dùng 22/500. Tăng lên vì tin **không có ảnh** (xem mục 6), tiêu đề phải gánh phần thị giác mà ảnh đảm nhận ở Airbnb |
| Tiêu đề mục | 21px / 600 | Giữ `display-md`, giảm weight 700 → 600 vì chữ có dấu ở 700 dễ nặng |
| Tiêu đề thẻ | 15–16px / 600 | Giữ `title-md` |
| Nội dung | 16px / 400, line-height 1.5 | Giữ `body-md`. Đoạn mô tả giới hạn ~68 ký tự/dòng |
| Meta, caption | 13–14px / 400–500 | Giữ `body-sm`, `caption` |
| Nhãn Lost/Found, trạng thái | 12px / 600 | Gần `badge` (11px). Tăng 1px để dấu tiếng Việt rõ hơn |
| **Điểm trùng khớp** | 56px / 700, tracking −0.04em | Thay `rating-display` (64px) của Airbnb, xem mục 7 |

Số liệu (điểm, ngày, bộ đếm ký tự) dùng `font-variant-numeric: tabular-nums` để các số thẳng cột khi so sánh.

## 6. Hình ảnh và icon

- **MVP không có ảnh món đồ.** Data model ở chương 02 mục 6 không có field ảnh. Airbnb dựa vào ảnh để tạo cảm giác, nên UniFound thay bằng **category plate**: khối bo góc `rounded.md`, nền màu nhạt theo loại tin, icon danh mục lớn ở giữa, thêm hoa văn chấm mờ để không trống trải. Nhờ vậy vẫn giữ được bố cục thẻ "hình ở trên, thông tin ở dưới" của Airbnb.
- **Icon:** nét 1.75px, đầu nét tròn, lưới 24px, vẽ bằng SVG, một bộ thống nhất. Mỗi danh mục trong danh sách cố định (chương 02 mục 6) có một icon riêng: Điện tử → điện thoại, Ví/giấy tờ → ví, Chìa khóa → chìa, Quần áo/phụ kiện → áo, Sách/dụng cụ → sách, Khác → ba chấm.
- **Không dùng emoji** thay icon, không dùng ảnh stock.

## 7. Điểm nhấn riêng (signature moment)

Airbnb chỉ có một chỗ dùng chữ thật to: số đánh giá "4.81" (64px), vì đó là tín hiệu tin cậy cao nhất. Ở UniFound, vị trí này thuộc về **điểm trùng khớp** (chương 02 mục 7): số điểm 56px, kèm "/100", thanh điểm và danh sách lý do cộng/không cộng điểm.

Cách trình bày tuân theo hai ràng buộc của chương 02:

- Điểm **luôn đi kèm lý do**: từng tín hiệu (danh mục, khu vực, ngày, từ khóa) hiện ✓/✗ và số điểm.
- Luôn có câu nhắc **"Điểm không phải bằng chứng sở hữu"** cạnh danh sách, nên điểm không bị hiểu là xác nhận chủ đồ.

## 8. Hình khối, khoảng cách, elevation

Giữ nguyên DESIGN.md: bo góc 8 / 14 / 20 / 32 / pill, spacing theo bội số 4px, section 64px, **một mức shadow duy nhất**, scrim 50%, touch target ≥ 48px cho CTA. Focus ring 2px màu `ink` (theo mô tả focus của text-input trong DESIGN.md), không dùng glow màu.

## 9. Giọng văn giao diện

- Xưng hô trung tính: "bạn"; câu ngắn, nói rõ hành động. Nút gọi đúng việc nó làm: "Gửi yêu cầu", "Đánh dấu đã trả lại", không dùng "OK" hay "Xác nhận" chung chung.
- Thông báo lỗi nêu **vấn đề + cách sửa**: "Ngày xảy ra không được sau hôm nay (30/09/2026)."
- Trạng thái trống luôn chỉ bước tiếp theo: "Bạn chưa đăng tin nào" → nút "Đăng tin mới".

| Thuật ngữ kỹ thuật | Nhãn trên giao diện |
|---|---|
| Lost Report | Tin mất đồ, nhãn "Mất đồ" |
| Found Report | Tin nhặt được, nhãn "Nhặt được" |
| Claim | Yêu cầu nhận lại |
| Verification info | Thông tin xác minh (riêng tư) |
| Potential Matches | Gợi ý trùng khớp |
| Returned | Đã trả lại |
| My Reports | Tin và yêu cầu của tôi |

## 10. Tóm tắt thay đổi so với DESIGN.md

| Hạng mục | Airbnb (DESIGN.md) | UniFound |
|---|---|---|
| Màu nhấn | Rausch `#FF385C` | UniFound Blue `#2D5BD7` |
| Màu nhấn active/disabled | `#E00B41` / `#FFD1DA` | `#1F47B8` / `#C9D6F7` |
| Màu nghiệp vụ | Không có | Lost cam, Found xanh lục, Pending hổ phách |
| Font | Airbnb Cereal VF | Be Vietnam Pro (fallback Inter) |
| Logo | Airbnb Bélo | Mark "U ôm chấm tròn" + wordmark UniFound |
| Top nav giữa | Homes / Experiences / Services | Tất cả / Mất đồ / Nhặt được |
| Thẻ | Ảnh chụp | Category plate (nền theo loại tin + icon danh mục) |
| Chữ to nhất | Rating 64px | Điểm trùng khớp 56px |
| Sub-brand Luxe/Plus | Có token | Bỏ, không dùng |
| Layout, spacing, radius, shadow, neutral | — | **Giữ nguyên** |

## 11. Việc còn mở

- Nhóm xác nhận hoặc điều chỉnh màu `primary` và logo trước khi áp dụng vào `src/`.
- Cập nhật token trong `DESIGN.md` (hoặc thêm phần override) theo tài liệu này; chưa làm vì chưa được yêu cầu sửa DESIGN.md.
- Outline wordmark thành path cho slide/in ấn.
- Chương 02 chưa chốt cách hai bên liên hệ sau khi claim được `Accepted` (MVP không có chat). Mockup SCR-05 đang ghi chú điểm này.
