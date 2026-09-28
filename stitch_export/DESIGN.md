---
name: Campus Utility Direct
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4947'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#006194'
  on-tertiary: '#ffffff'
  tertiary-container: '#007bb9'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system powers a high-efficiency campus utility engineered for fast scanning, immediate reporting, and high-trust resolution of lost items. Built around the principles of purposeful utility, clarity over ornamentation, and instant friction-free interaction, the aesthetic leans into structured, modern functionalism with crisp tactile feedback.

The target audience comprises college students, campus security, and faculty administrators who need immediate clarity in high-stress moments (having misplaced high-value items or rushing between lectures). The emotional tone must inspire reliability, civic responsibility, and calm assurance without feeling bureaucratic or promotional. Visual clutter is eliminated in favor of information hierarchy, structured metadata tags, and sharp state indicators.

## Colors

The color architecture is built around functional signposting rather than purely decorative accents:

- **Canvas & Surfaces**:
  - Global Canvas: `#F8FAFC` (Slate 50) delivers an easy-on-the-eyes, soft utility background that prevents eye fatigue.
  - Surface Card / Modal / Popover: `#FFFFFF` (Pure White) with crisp 1px borders to isolate modules.
  - Subtle Surface Alt: `#F1F5F9` (Slate 100) for input backdrops, sticky table headers, and disabled states.

- **Brand & Action Signals**:
  - **Primary (Found & Resolution Teal)**: `#0D9488` (Teal 600) represents recovered items, success verifications, and primary system confirmations. Interactive hover: `#0F766E` (Teal 700). Soft tint fill: `#F0FDFA` (Teal 50).
  - **Secondary (Lost & Urgency Coral)**: `#EA580C` (Orange 600) denotes active lost item reports requiring immediate campus visibility. Interactive hover: `#C2410C` (Orange 700). Soft tint fill: `#FFF7ED` (Orange 50).
  - **Tertiary / Informative Blue**: `#0284C7` (Sky 600) handles location markers, building drop-zones, and guidance hints.

- **Content & Typography**:
  - Primary Text: `#0F172A` (Slate 900) for maximum legible contrast.
  - Secondary Text: `#475569` (Slate 600) for metadata, timestamps, and field descriptions.
  - Muted / Placeholder Text: `#94A3B8` (Slate 400) for empty states and subtle borders.

- **Status Framework**:
  - Success (Returned / Claimed): `#16A34A` / Surface tint `#F0FDF4`
  - Warning (Expiring / Unverified Claim): `#D97706` / Surface tint `#FFFBEB`
  - Error (Disputed / Closed): `#DC2626` / Surface tint `#FEF2F2`

## Typography

The typography strategy leverages **Be Vietnam Pro** across all typographic hierarchies, ensuring native rendering precision for bilingual Vietnamese-English campus content, clear diacritics, and optimal horizontal spacing. **JetBrains Mono** is reserved exclusively for item verification pins, claim ticket IDs, and security locker codes.

- **Display & Headings**: Strict, compact line heights avoid excessive whitespace in data grids and split-view cards. Weights stay anchored between 600 (SemiBold) and 700 (Bold).
- **Body & Data Rows**: Base scale sits at 14px (`body-md`) with a 20px line-height, optimized for dense listing viewports and quick-glance information architecture.
- **Labels & Tags**: Applied in uppercase or semi-bold sentence case at 11px and 12px with a slight positive letter-spacing (`+0.02em`) to guarantee quick recognition on status badges and location tags.

## Layout & Spacing

The layout is built on a responsive 12-column utility grid that prioritizes high information density without visual crowding.

- **Desktop (>= 1024px)**: 12 columns, `gutter-lg` (24px), page margin `margin-lg` (32px), constrained to a maximum content container width of 1280px. Dual-pane viewports (e.g., sticky filter pane on the left, card grid or list on the right) are the default pattern for browsing items.
- **Tablet (768px - 1023px)**: 8 columns, `gutter` (16px), margin `margin-md` (24px). Left-hand filters collapse into an off-canvas drawer.
- **Mobile (< 768px)**: 4 columns, `gutter` (16px), margin `margin` (16px). Single-column feeds with bottom sticky action sheets for quick submission of "Báo mất" (Report Lost) or "Nhặt được" (Report Found).

The internal spacing follows a strict 4px/8px scale, with `space-md` (12px) and `space-lg` (16px) serving as primary padding for feed cards and list rows to keep vertical consumption fast.

## Elevation & Depth

This system intentionally departs from heavy drop shadows to preserve utility-grade sharpness. Visual depth is established through micro-borders and subtle, low-blur ambient offsets:

- **Border Strategy**: High-contrast, precise 1px borders (`#E2E8F0`) frame every card, form control, and modal window. Surface separation relies on `#FFFFFF` against the `#F8FAFC` base rather than heavy shadows.
- **Elevation 0 (Flat)**: Embedded containers, table headers, and inactive inputs use `border: 1px solid #E2E8F0` with zero shadow.
- **Elevation 1 (Card & Row Level)**: Default lost/found item cards use `box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.05)`, reinforced by the 1px border. Hover states introduce a subtle border shift to `#CBD5E1` and `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07)`.
- **Elevation 2 (Dropdowns & Popovers)**: Context menus and campus building selector overlays use `box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **Elevation 3 (Modals & Claim Slips)**: Verification dialogues and image lightboxes utilize `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`, anchored by a 40% opacity slate backdrop overlay (`rgba(15, 23, 42, 0.4)`).

## Shapes

The design system enforces a compact, purposeful radius philosophy capped at a maximum of 8px. This structural shape language evokes technical precision, organizational trust, and operational clarity.

- **Base Radius (rounded-sm / 4px)**: Checkboxes, status badges, compact icon badges, and micro-tags.
- **Intermediate Radius (rounded-md / 6px)**: Standard text fields, select inputs, secondary action buttons, and dropdown menus.
- **Maximum Radius (rounded-lg / 8px)**: Item cards, image preview thumbnails, quick-action navigation bars, and confirmation modals.
- **Pill Exceptions**: Strictly disallowed for layout containers and form elements. Only full-round (9999px) pills are permitted for distinct status chips (e.g., "Đang xác minh", "Đã nhận lại") to differentiate metadata indicators from interactive buttons.

## Components

### Buttons
- **Primary (Found / Positive Action)**: Background `#0D9488`, text `#FFFFFF`, radius 6px, height 38px (compact) or 44px (default). Hover: `#0F766E`. Active: `#115E59`.
- **Urgent / Lost Primary**: Background `#EA580C`, text `#FFFFFF`, radius 6px. Hover: `#C2410C`. Used exclusively for "Đăng tin mất đồ" and high-priority report submissions.
- **Secondary (Outline)**: 1px border `#E2E8F0`, background `#FFFFFF`, text `#0F172A`. Hover: `#F8FAFC` background with border `#CBD5E1`.
- **Ghost / Tertiary**: No border, background transparent, text `#475569`. Hover: `#F1F5F9` background, text `#0F172A`.

### Status Chips & Metadata Badges
- Non-interactive pill badges (`padding: 2px 8px`, `fontSize: 11px`, `fontWeight: 600`).
- **Lost Chip**: Text `#EA580C`, background `#FFF7ED`, border `1px solid #FFEDD5`.
- **Found Chip**: Text `#0D9488`, background `#F0FDFA`, border `1px solid #CCFBF1`.
- **Resolved Chip**: Text `#16A34A`, background `#F0FDF4`, border `1px solid #DCFCE7`.
- **Location Tag**: Text `#0F172A`, background `#F1F5F9`, border `1px solid #E2E8F0`, featuring a 12px pinpoint icon.

### Form Inputs & Selects
- Height 40px, padding horizontal 12px, border `1px solid #E2E8F0`, background `#FFFFFF`, radius 6px, text `#0F172A`.
- **Focus State**: Border color `#0D9488`, box-shadow `0 0 0 3px rgba(13, 148, 136, 0.15)`.
- **Error State**: Border color `#DC2626`, box-shadow `0 0 0 3px rgba(220, 38, 38, 0.15)`.
- Includes instant clear buttons and inline keyboard shortcuts (`/` for quick campus search).

### Cards (Feed Items)
- Background `#FFFFFF`, border `1px solid #E2E8F0`, radius 8px, padding 12px or 16px.
- Thumbnail: Fixed aspect ratio (4:3 or 1:1), radius 6px, border `1px solid #F1F5F9`.
- Header: Split row containing Item Title (`title-md`) and Category Badge.
- Body: Timestamp (relative format, e.g., "15 phút trước"), Campus Building / Room code (bold secondary text).
- Footer: Claim action or "Chi tiết" button flush with micro divider.

### Checkboxes & Radio Controls
- Checkbox: 16x16px square, radius 4px, border `1.5px solid #CBD5E1`. Checked state: background `#0D9488`, border-color `#0D9488`, white tick icon.
- Radio: 16x16px circle, checked state border `#0D9488` with `#0D9488` center pip.

### Campus-Specific Utility Components
- **Drop-off Point Card**: Compact white card highlighting official campus turnover points (Security Booth, Youth Union Office, Library Desk) with operating hours and live handover status.
- **Verification Match Bar**: Two-column verification module comparing user-reported attributes vs. found item attributes (Color, Serial ID, Unique Scratches) using check/cross iconography.