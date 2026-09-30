---
name: UniFound
description: Bảng tin đồ thất lạc của sinh viên, tiếp nối ngôn ngữ Airbnb (thoáng, bo mềm, một màu nhấn) nhưng nhấn bằng teal trấn an và chữ Be Vietnam Pro cho tiếng Việt.
colors:
  primary: "#00685f"
  primary-hover: "#00554d"
  primary-soft: "#d9f4ef"
  lost: "#a73a00"
  lost-hover: "#842e00"
  lost-soft: "#ffdfd2"
  info: "#245b91"
  info-soft: "#e1efff"
  danger: "#b42318"
  danger-soft: "#fee4e2"
  ink: "#17212b"
  muted: "#596773"
  line: "#dce3e7"
  border-control: "#bcc7cd"
  surface: "#ffffff"
  surface-soft: "#f5f7f8"
  canvas: "#f7f9fa"
  on-primary: "#ffffff"
typography:
  h1:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "clamp(1.65rem, 4vw, 2.4rem)"
    fontWeight: 700
    lineHeight: 1.2
  h2:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 3vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.3
  h3:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
  eyebrow:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  badge:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
rounded:
  sm: "0.65rem"
  md: "0.8rem"
  lg: "1rem"
  xl: "1.4rem"
  full: "999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "0.65rem 1rem"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-lost:
    backgroundColor: "{colors.lost}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  button-secondary:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "1.25rem"
  control:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.7rem 0.8rem"
    height: "44px"
  type-badge-found:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-hover}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
  type-badge-lost:
    backgroundColor: "{colors.lost-soft}"
    textColor: "{colors.lost-hover}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
---

# Design System: UniFound

## Overview

**Creative North Star: "The Calm Noticeboard"**

UniFound là bảng tin của trường: thoáng, có trật tự, mọi tin theo một mẫu. Người mở app thường đang lo vì mất đồ hoặc đang cầm đồ của người khác, nên giao diện phải trấn an và nói rõ bước tiếp theo, không gây báo động. Nền tảng bố cục lấy từ Airbnb (nhiều khoảng trắng, một màu nhấn duy nhất, bo góc mềm, một tầng bóng), nhưng mọi giá trị cụ thể đã thay bằng những gì `src/app/globals.css` đang dùng.

Nhận diện: teal trấn an cho hành động chính, cam cho "Mất đồ", chữ Be Vietnam Pro để dấu tiếng Việt không chồng. Riêng tư là tính cách hiển thị được: thông tin xác minh có nhãn khóa, không lộ liên hệ bừa bãi.

**Key Characteristics:**
- Một màu nhấn (teal `{colors.primary}`) cho hành động chính; cam `{colors.lost}` chỉ dành cho nghĩa "Mất đồ".
- Nền canvas xám rất nhạt, thẻ trắng viền hairline, bo góc lớn.
- Loại tin phân biệt bằng icon + chữ + màu, không chỉ màu.
- Chỉ light mode.
- Tiếng Việt có dấu là ngôn ngữ giao diện; nút gọi đúng việc ("Gửi yêu cầu").

## Colors

Teal trấn an, một cam nghiệp vụ, neutral lạnh nhẹ.

### Primary
- **Teal trấn an** (#00685f): CTA chính, link nhấn, eyebrow, viền focus của ô nhập, nhãn "Nhặt được". Hover #00554d, nền nhạt #d9f4ef.

### Secondary
- **Cam Mất đồ** (#a73a00): nút và nhãn cho tin Mất đồ, vùng minh họa tin Mất đồ. Hover #842e00, nền nhạt #ffdfd2.

### Neutral
- **Ink lạnh** (#17212b): chữ chính.
- **Muted** (#596773): chữ phụ, gợi ý trường nhập, ghost button.
- **Line** (#dce3e7): viền hairline của panel, segmented, divider.
- **Viền ô nhập** (#bcc7cd): viền control, đậm hơn line để ô nhập nhận ra được.
- **Canvas** (#f7f9fa) / **Surface** (#ffffff) / **Surface soft** (#f5f7f8): sàn trang, thẻ, vùng chọn.

### Semantic
- **Danger** (#b42318, nền #fee4e2): lỗi validation, hành động hủy.
- **Info** (#245b91, nền #e1efff): thông báo thông tin.
- Cảnh báo dùng nền hổ phách nhạt (#fff4df, chữ #62401e) trong `.notice`; chưa là token.

### Named Rules
**The One Voice Rule.** Teal là giọng hành động duy nhất; cam chỉ mang nghĩa Mất đồ, không dùng làm CTA chung.
**The Not-Just-Color Rule.** Mất đồ / Nhặt được luôn đi kèm icon và chữ, vì hai màu này không được là kênh phân biệt duy nhất.

## Typography

**Display / Body Font:** Be Vietnam Pro (fallback system-ui, sans-serif), nạp qua `next/font`.

**Character:** hình học thân thiện, dấu tiếng Việt đặt đúng chỗ ở cả cỡ nhỏ. Không có font riêng cho tiêu đề; thang chữ do một font gánh.

### Hierarchy
- **h1** (700, clamp 1.65–2.4rem, 1.2): tiêu đề trang.
- **h2** (700, clamp 1.35–1.75rem, 1.3): tiêu đề mục.
- **h3** (700, 1.05rem, 1.4): tiêu đề thẻ.
- **Body** (400, 14px, 1.55): nội dung mặc định; giữ đoạn mô tả quanh 65–70 ký tự/dòng.
- **Label** (600, 0.82rem): nhãn trường nhập, nút nhỏ.
- **Eyebrow** (700, 0.75rem, +0.06em, in hoa): mào đầu mục, màu primary.
- **Badge** (700, 0.7rem): nhãn loại tin, trạng thái.

### Named Rules
**The Diacritic Rule.** Không hạ dòng chữ tiếng Việt xuống dưới ~12px và không ép line-height dưới 1.2, để dấu không bị cắt hay đè.

## Layout

Bố cục theo tinh thần Airbnb: nội dung căn giữa, container rộng vừa (khoảng 1080–1280px), khoảng trắng rộng ở các dải trang, thẻ xếp dày hơn. Spacing bội số 4px; khoảng 1–1.5rem trong panel và form; form auth rộng tối đa 460px. Responsive dựa trên nguyên tắc giảm cột chứ không reflow hàng: điện thoại 1 cột, tablet 2, desktop nhiều hơn. Mục tiêu chạm tối thiểu 42–44px. Các giá trị breakpoint chính xác chưa chốt trong code.

## Elevation & Depth

Phẳng mặc định; sâu đến từ nền canvas xám nhạt với thẻ trắng và viền hairline. Một tầng bóng rất nhẹ cho panel và chip đang chọn.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 4px 18px rgb(30 50 60 / 0.045)`): panel, auth card.
- **Chip chọn** (`box-shadow: 0 2px 8px rgb(30 50 60 / 0.08)`): mục đang chọn trong segmented.

### Named Rules
**The One Soft Tier Rule.** Không thêm tầng bóng thứ ba; trạng thái nhấn mạnh bằng viền và màu.

## Shapes

Mềm, không góc cứng. Nút và ô nhập bo 0.8rem (~13px), segmented 0.9rem, chip 0.65rem, vùng trống 1rem, panel và thẻ 1.4rem (~22px), nhãn là pill 999px. Panel viền 1px `{colors.line}`.

## Components

### Buttons
- **Shape:** bo 0.8rem, cao tối thiểu 42px (nhỏ 36px), chữ weight 650.
- **Primary:** nền teal, chữ trắng; hover đậm hơn (#00554d) và nhấc 1px.
- **Lost:** cùng hình dạng, nền cam, chỉ cho hành động thuộc luồng Mất đồ.
- **Secondary / Ghost:** secondary nền `surface-soft` viền line; ghost chữ muted, hover có nền.
- **Disabled:** mờ 60%, không nhấc.

### Chips / Segmented
- Segmented: nền `surface-soft`, viền line, bo 0.9rem; chip đang chọn nền trắng chữ teal kèm bóng nhẹ.

### Cards / Containers
- **Panel:** nền trắng, viền line, bo 1.4rem, padding 1.25rem, bóng Panel.
- **Report visual:** vùng minh họa dùng gradient nhạt theo loại tin (teal nhạt cho Nhặt được, cam nhạt cho Mất đồ); là placeholder khi tin chưa có ảnh (theo 01_overview, mỗi tin có 1–5 ảnh).
- **Empty state:** viền đứt nét, chỉ ra bước tiếp theo.

### Inputs / Fields
- **Style:** nền trắng, viền #bcc7cd, bo 0.8rem, cao ≥44px, textarea ≥110px.
- **Focus:** viền teal kèm vòng mờ 3px; focus-visible toàn cục vòng teal mờ 3px, offset 2px.
- **Error:** viền danger + chữ lỗi danger; thông báo lỗi nêu vấn đề và cách sửa.

### Badges
- **Loại tin:** pill nền nhạt + chữ đậm (teal cho Nhặt được, cam cho Mất đồ), luôn có icon.
- **Trạng thái:** pill nền `surface-soft` viền line; trạng thái đang hoạt động dùng nền `primary-soft`.

### Notices
- Ba biến thể: cảnh báo (hổ phách), info (xanh dương nhạt), error (đỏ nhạt), bo 0.8rem, có icon.

## Do's and Don'ts

### Do:
- **Do** dùng teal cho hành động chính và cam chỉ cho nghĩa Mất đồ.
- **Do** kèm icon và chữ cho mọi nhãn loại tin và trạng thái.
- **Do** để mỗi màn hình nói rõ bước tiếp theo, kể cả trạng thái trống.
- **Do** giữ WCAG AA và tôn trọng `prefers-reduced-motion`.
- **Do** dùng chữ tiếng Việt có dấu và nút gọi đúng việc.

### Don't:
- **Don't** dùng đỏ cho hành động chính; đỏ chỉ dành cho lỗi và hành động nguy hiểm.
- **Don't** hiện số điện thoại hoặc email trước khi người nhặt chấp nhận; thông tin xác minh phải có nhãn riêng tư.
- **Don't** thêm tầng shadow mới hay gradient trang trí ngoài vùng minh họa loại tin.
- **Don't** làm dark mode trong MVP.
- **Don't** để điểm trùng khớp đứng một mình; luôn kèm lý do và lời nhắc "không phải xác nhận sở hữu".
