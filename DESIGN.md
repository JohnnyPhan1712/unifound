---
name: UniFound
description: Bảng tin đồ thất lạc của sinh viên UIT, nền ngôn ngữ Airbnb (thoáng, bo mềm, một màu nhấn) đổi branding sang UniFound Blue, Mất đồ cam, Nhặt được xanh lục, chữ Be Vietnam Pro.
colors:
  primary: "#2d5bd7"
  primary-hover: "#1f47b8"
  primary-disabled: "#c9d6f7"
  primary-soft: "#eef3ff"
  lost: "#9a3d0b"
  lost-soft: "#fff1e6"
  found: "#0b6b4a"
  found-soft: "#e6f6ef"
  found-accent: "#1fa774"
  pending: "#8a5700"
  pending-soft: "#fff7e0"
  pending-accent: "#e0a100"
  danger: "#c13515"
  danger-soft: "#fff0ec"
  danger-hover: "#a82c10"
  danger-wash: "#fffaf8"
  ink: "#222222"
  body: "#3f3f3f"
  muted: "#6a6a6a"
  muted-soft: "#929292"
  line: "#dddddd"
  line-soft: "#ebebeb"
  border-control: "#c1c1c1"
  surface: "#ffffff"
  surface-soft: "#f7f7f7"
  surface-strong: "#f2f2f2"
  on-primary: "#ffffff"
typography:
  h1:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.25
  h2:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: 1.3
  h3:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
  caption:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
  lead:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
  title-sm:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
  title-md:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
  title-lg:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
  headline:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 600
  score:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 700
  score-sm:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
  badge:
    fontFamily: "Be Vietnam Pro, Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
rounded:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "32px"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  button-text:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "14px 12px"
    height: "56px"
  type-badge-found:
    backgroundColor: "{colors.found-soft}"
    textColor: "{colors.found}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
  type-badge-lost:
    backgroundColor: "{colors.lost-soft}"
    textColor: "{colors.lost}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
---

# Design System: UniFound

## Overview

**Creative North Star: "The Calm Noticeboard"**

UniFound là bảng tin của trường: thoáng, có trật tự, mọi tin theo một mẫu. Người mở app thường đang lo vì mất đồ hoặc đang cầm đồ của người khác, nên giao diện phải trấn an và nói rõ bước tiếp theo, không gây báo động. Nền bố cục lấy từ Airbnb (nhiều khoảng trắng, một màu nhấn, thẻ không viền, ô tìm kiếm dạng pill, một tầng bóng) và chỉ đổi branding: màu nhấn xanh dương, hai màu nghiệp vụ cam/xanh lục, font Be Vietnam Pro.

Nguồn tham chiếu trực quan: bộ mockup `docs/02_reports/assets/claude_ui_mockups/` (CHG-012) và `docs/02_reports/07_brand_identity.md`. Token trong `src/app/globals.css` lấy từ `uf.css` của mockup. Cập nhật 2026-10-01: đổi từ teal sang UniFound Blue theo mockup.

**Key Characteristics:**
- Một màu nhấn (xanh dương `{colors.primary}`) cho hành động chính; cam và xanh lục chỉ mang nghĩa Mất đồ / Nhặt được.
- Nền trắng, thẻ tin không viền; khối thông tin (rail, panel) có viền hairline và một tầng bóng.
- Loại tin phân biệt bằng icon + chữ + màu, không chỉ màu.
- Chỉ light mode.
- Tiếng Việt có dấu là ngôn ngữ giao diện; nút gọi đúng việc ("Gửi yêu cầu").

## Colors

### Primary
- **UniFound Blue** (#2d5bd7): CTA chính, ô tìm kiếm tròn, link thương hiệu, wordmark, chấm "Đang mở". Hover #1f47b8, vô hiệu #c9d6f7, nền nhạt #eef3ff (thông báo thông tin).

### Nghiệp vụ
- **Cam Mất đồ** (#9a3d0b, nền #fff1e6): nhãn, icon và vùng minh họa tin Mất đồ.
- **Xanh lục Nhặt được** (#0b6b4a, nền #e6f6ef, nhấn #1fa774): nhãn, icon và vùng minh họa tin Nhặt được; chấm "Đã chấp nhận".
- **Chờ xử lý** (#8a5700, nền #fff7e0, nhấn #e0a100): yêu cầu đang chờ, cảnh báo.

### Neutral
- **Ink** (#222222) chữ chính, **Body** (#3f3f3f), **Muted** (#6a6a6a), **Muted soft** (#929292).
- **Line** (#dddddd), **Line soft** (#ebebeb), **Viền ô nhập** (#c1c1c1).
- **Surface** (#ffffff), **Surface soft** (#f7f7f7), **Surface strong** (#f2f2f2).

### Semantic
- **Danger** (#c13515, nền #fff0ec): lỗi validation, hành động nguy hiểm (xóa).

### Named Rules
**The One Voice Rule.** Xanh dương là giọng hành động duy nhất; cam và xanh lục không bao giờ làm CTA chung.
**The Not-Just-Color Rule.** Mất đồ / Nhặt được luôn đi kèm icon (kính lúp / hộp) và chữ.

## Typography

**Font:** Be Vietnam Pro (fallback Inter, system-ui), nạp qua `next/font`.

- **h1** 700, clamp 1.5–1.75rem; **h2** 600, 1.3125rem; **h3** 600, 1.0625rem; tiêu đề trang chi tiết 1.625rem (1.375rem trên điện thoại); điểm gợi ý 3.5rem (2.75rem trên điện thoại).
- Bậc phụ: caption 0.8125rem (gợi ý, thông tin phụ), lead 0.9375rem, tiêu đề khối 1.125 / 1.25 / 1.375rem.
- **Body** 400, 16px, line-height 1.5; giữ đoạn mô tả quanh 65–70 ký tự/dòng.
- **Label** 600, 0.875rem; **Badge** 600, 0.75rem.
- Số liệu dùng `tabular-nums`.

### Named Rules
**The Diacritic Rule.** Không hạ chữ tiếng Việt xuống dưới ~12px và không ép line-height dưới 1.2.

## Layout

Container tối đa 1440px, lề ngang 80px (≥1128px), 40px (≤1128px), 24px (≤744px). Header cao 80px (64px trên điện thoại), lưới 3 cột: logo, tab loại tin giữa, hành động bên phải. Bảng tin 4 cột, giảm còn 3 / 2 / 1 theo độ rộng. Trang chi tiết: nội dung chính và cột hành động cố định rộng 372px, trên điện thoại chuyển thành một cột kèm thanh hành động cố định cuối màn hình. Form tối đa 760px; thẻ đăng nhập 568px. Spacing bội số 4px; mục tiêu chạm tối thiểu 42–48px.

## Elevation & Depth

Phẳng mặc định; sâu đến từ viền hairline và **một** tầng bóng: `rgba(0,0,0,.02) 0 0 0 1px, rgba(0,0,0,.04) 0 2px 6px, rgba(0,0,0,.1) 0 4px 8px` (panel, rail, ô tìm kiếm, chip đang chọn, nhãn loại tin trên ảnh).

### Named Rules
**The One Soft Tier Rule.** Không thêm tầng bóng thứ hai; nhấn mạnh bằng viền và màu.

## Shapes

Bo góc 4 / 8 / 14 / 20 / 32 / pill. Nút và ô nhập 8px, thẻ/panel/rail 14px, vùng minh họa tin 14px, nhãn và tab dạng pill. Ô tìm kiếm là pill cao 66px.

## Components

### Buttons
- Cao 48px (nhỏ 36px), bo 8px, chữ 500. **Primary** nền xanh dương chữ trắng; **Secondary** viền ink nền trắng; **Text** chữ ink gạch chân (Sửa, Xóa, Hủy); **Danger** nền #c13515.
- Disabled: primary đổi sang #c9d6f7; không nhấc khi hover, `scale(.98)` khi nhấn.

### Inputs / Fields
- Cao tối thiểu 56px, viền #c1c1c1, bo 8px; focus viền ink kèm viền trong 1px (không glow màu). Lỗi: viền danger + icon + chữ nêu vấn đề và cách sửa. Nhãn luôn hiện (không chỉ placeholder); có bộ đếm ký tự khi có giới hạn.
- Chọn dạng ô (loại tin, danh mục): ô viền hairline, đang chọn viền ink + nền surface-soft.

### Cards
- **Thẻ tin:** không viền; vùng minh họa 4:3 (16:10 trên điện thoại), nhãn loại tin dạng pill trắng có bóng ở góc trên trái, pill trạng thái ở góc dưới, bên dưới là tiêu đề đậm một dòng, "địa điểm · danh mục", ngày.
- **Category plate** (khi chưa có ảnh): nền nhạt theo loại tin, icon danh mục lớn ở giữa, hoa văn chấm mờ.
- **Panel / rail:** nền trắng, viền hairline, bo 14px, một tầng bóng.

### Badges
- **Loại tin:** pill có icon; nền nhạt theo loại khi đứng riêng, nền trắng có bóng khi nằm trên ảnh.
- **Trạng thái:** pill viền hairline + chấm màu (mở xanh dương, chờ vàng, đã chấp nhận xanh lục, từ chối đỏ, đóng xám); "Đã trả" nền ink chữ trắng kèm dấu tích.

### Navigation
- Tab loại tin giữa header (Tất cả / Mất đồ / Nhặt được) có icon trong ô bo 8px và gạch chân ink cho mục đang chọn. Menu tài khoản dạng pill (icon menu + avatar) mở popover.
- Tab dạng viên thuốc cho "Tin và yêu cầu của tôi" kèm bộ đếm.

### Notices
- Ba biến thể: info (xanh nhạt), cảnh báo (vàng nhạt), lỗi (đỏ nhạt), thành công (xanh lục nhạt); bo 14px, có icon.

## Do's and Don'ts

### Do:
- **Do** dùng xanh dương cho hành động chính; cam chỉ cho Mất đồ, xanh lục chỉ cho Nhặt được.
- **Do** kèm icon và chữ cho mọi nhãn loại tin và trạng thái.
- **Do** để mỗi màn hình nói rõ bước tiếp theo, kể cả trạng thái trống.
- **Do** giữ WCAG AA và tôn trọng `prefers-reduced-motion`.

### Don't:
- **Don't** dùng đỏ cho hành động chính; đỏ chỉ dành cho lỗi và hành động nguy hiểm.
- **Don't** hiện số điện thoại hoặc email trước khi người nhặt chấp nhận; thông tin xác minh phải có nhãn riêng tư.
- **Don't** thêm tầng bóng mới hoặc gradient trang trí ngoài ảnh minh họa test/placeholder.
- **Don't** làm dark mode trong MVP.
- **Don't** để điểm trùng khớp đứng một mình; luôn kèm lý do và lời nhắc "không phải xác nhận sở hữu".
