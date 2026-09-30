# CHG-015: Nền tảng UI — design tokens, layout shell, component dùng chung

- ID: `CHG-015`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-013`, `CHG-014`
- File/module dự kiến sửa/tạo: `src/app/globals.css`, `src/app/layout.tsx`, `src/components/ui/*` (Button, Input, Select, Textarea, Badge, Card, EmptyState, ErrorState, Skeleton), `src/components/layout/*` (Header, Footer, MobileNav)
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Mọi trang có chung header/footer đúng nhận diện UniFound, điều hướng được trên desktop và mobile; các component nền tảng dùng lại được cho các màn hình sau.

## Phạm vi

### Bao gồm

- Design tokens (màu, font, spacing, radius) theo `DESIGN.md` và mockup CHG-012, cấu hình trong Tailwind/`globals.css`.
- Layout shell: header (logo, link Feed / Tạo report / My Reports, chỗ cho trạng thái đăng nhập), footer, menu mobile.
- Component UI dùng chung ở trên, có label + trạng thái lỗi + focus rõ cho form control.
- Mẫu trạng thái loading (skeleton), empty, error dùng chung.
- Nhãn Lost/Found phân biệt bằng chữ + icon, không chỉ bằng màu.

### Các lưu ý

- Chưa có logic đăng nhập: header chỉ có slot cho auth, CHG-016 sẽ gắn vào.
- Không làm nội dung trang Feed/Detail (thuộc CHG-019/020).
- Code UI cũ đã được xóa ở CHG-013; CHG này viết mới trên skeleton sạch.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` mục 3, 4; `docs/02_reports/07_brand_identity.md`
- `DESIGN.md`; mockup `docs/02_reports/assets/claude_ui_mockups/` (tham chiếu UI)
- `docs/00_guides/code_conventions.md`
- Skill: impeccable, taste-skill; kiểm tra bằng Playwright MCP

## Acceptance criteria

- [ ] Token màu/font/spacing khớp DESIGN.md, không hard-code màu rải rác trong component.
- [ ] Header/footer hiển thị đúng trên desktop và mobile (menu mobile mở/đóng được bằng bàn phím).
- [ ] Mỗi component UI có trạng thái default/focus/disabled/error.
- [ ] Có ví dụ EmptyState, ErrorState, Skeleton dùng lại được.
- [ ] Badge Lost/Found đọc được khi không phân biệt màu.
- [ ] `npm run typecheck`, `npm test`, `npm run build` đều pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-015-01 | Vitest render Button/Input/Badge | Render đúng label, prop disabled/error | | Pending | |
| TC-015-02 | Playwright viewport 1280px | Header đủ link, footer hiển thị | | Pending | screenshot |
| TC-015-03 | Playwright viewport 375px, mở menu mobile bằng phím | Menu mở/đóng, không tràn ngang | | Pending | screenshot |
| TC-015-04 | Tab qua form control mẫu | Focus ring thấy rõ, thứ tự hợp lý | | Pending | |

## Hướng dẫn tự chạy

```
npm run dev        # mở http://localhost:3000, thu nhỏ cửa sổ xuống 375px kiểm tra menu
npm test
npm run typecheck
npm run build
```
