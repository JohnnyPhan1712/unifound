# CHG-021: Báo cáo vi phạm và kiểm duyệt (admin)

- ID: `CHG-021`
- Trạng thái: `in_review`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-016`, `CHG-018` (thông báo), `CHG-014` (guard/role)
- File/module dự kiến sửa/tạo: `src/lib/flags/*`, `src/lib/admin/*`, `src/app/admin/layout.tsx`, `src/app/admin/moderation`, `src/components/reports/flag-button.tsx`, `src/lib/auth/*` (khóa tài khoản)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

## Kết quả người dùng

Sinh viên báo cáo tin spam/sai sự thật kèm lý do. Quản trị viên vào khu vực quản trị, xem hàng đợi báo cáo, ẩn tin hoặc bỏ qua, và khóa/mở khóa tài khoản.

## Phạm vi

### Bao gồm

- FR14: nút "Báo cáo" trên chi tiết tin (đăng nhập, có lý do, mỗi người một báo cáo/tin); lưu `flags` (`NEW`).
- S12: trang kiểm duyệt: danh sách flags `NEW`, xem tin, "Ẩn tin" (`HIDDEN`) hoặc "Bỏ qua" (flag `HANDLED`); tin ẩn biến khỏi feed.
- FR15 (phần khóa): khóa/mở khóa user (`locked`/`active`); user khóa không đăng nhập/thao tác được (tận dụng chặn ở CHG-014).
- Guard `/admin`: chỉ `ADMIN`; server kiểm tra ở mọi action.
- Thông báo cho chủ tin khi tin bị ẩn.

### Các lưu ý

- Kiểm duyệt sau khi đăng (tin lên ngay).
- Tài khoản `ADMIN` được cấp sẵn (seed/Supabase), không có UI cấp quyền.
- Danh mục/địa điểm và thống kê ở CHG-022.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR14, FR15, S12, mục 1 vai trò)

## Acceptance criteria

- [ ] Người dùng báo cáo được tin; báo cáo trùng bị từ chối; thiếu lý do báo lỗi.
- [ ] Admin thấy hàng đợi flags và xử lý được (ẩn tin / bỏ qua).
- [ ] Tin bị ẩn không hiện trong feed và chi tiết công khai.
- [ ] Khóa tài khoản làm user không đăng nhập/thao tác được; mở khóa khôi phục.
- [ ] `USER` vào `/admin` hoặc gọi action admin bị từ chối (403).
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## Ghi chú triển khai

- **Báo cáo vi phạm (FR14):** `src/lib/flags/actions.ts` (`flagReport`).
  - Yêu cầu đăng nhập; lý do 5–500 ký tự (Zod).
  - Mỗi người chỉ báo cáo một tin một lần, nhờ `UNIQUE(report_id, reporter_id)`. Báo cáo lần hai nhận thông báo thân thiện.
  - Không báo cáo được tin của chính mình. Nút nằm trong `<details>` ở trang chi tiết; khách thấy link "Đăng nhập để báo cáo".
- **Khu vực `/admin`:** `layout.tsx` hiện màn 403 nếu không phải ADMIN. Ngoài ra:
  - mỗi trang admin tự gọi `getAdmin()`;
  - mỗi server action (`src/lib/admin/actions.ts`) tự kiểm tra lại quyền và trả 403.
- **Trang `/admin/moderation`:** hàng đợi flag `NEW`, gom theo tin. Ba thao tác:
  - "Ẩn tin": tin → `HIDDEN`, flag → `HANDLED` trong một transaction, chủ tin nhận thông báo `REPORT_HIDDEN`;
  - "Bỏ qua": flag → `HANDLED`, tin giữ nguyên;
  - "Khóa chủ tin".
- **Trang `/admin/users`:** khóa / mở khóa tài khoản (FR15).
  - Không tự khóa mình, không khóa ADMIN khác.
  - Tài khoản bị khóa: đăng nhập bị đăng xuất lại kèm thông báo; phiên đang mở bị `requireUser()` chuyển về `/login?error=locked`; header coi như khách (dùng lại cơ chế CHG-014).
- `/admin` tạm chuyển sang `/admin/moderation`; CHG-022 làm trang tổng quan.
- Header có mục "Quản trị" cho ADMIN.

## AI Log

### AI-1 — Báo cáo vi phạm và kiểm duyệt admin

- Nhiệm vụ (Task): Lưu flag, hàng đợi kiểm duyệt, ẩn tin / bỏ qua, khóa / mở khóa tài khoản, guard `/admin`.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): FR14, FR15, S12, mục 1 vai trò, CHG-021.
- Kết quả AI (AI Output):
  - Logic: `src/lib/flags/*`, `src/lib/admin/{guard,actions,queries}.ts`.
  - Trang: `src/app/admin/{layout,moderation,users}`.
  - Component: `flag-button.tsx`, `admin/action-form.tsx`.
- Quyết định của nhóm (Human Decision): chờ xác nhận. Ba điểm là đề xuất của AI:
  - không cho báo cáo tin của chính mình;
  - "Ẩn tin" đóng luôn mọi flag `NEW` của tin;
  - không khóa được ADMIN.
- Kiểm tra / Xác minh (Verification):
  - Vitest TC-021-01/02.
  - Playwright với 4 tài khoản. Chụp request "Bỏ qua" của admin rồi phát lại bằng cookie của USER → 403.
- Ứng viên đưa vào báo cáo: có

## Bug

Không có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-021-01 | Vitest: quyền admin cho từng action | Chỉ ADMIN được phép | Chỉ ADMIN `active` được; ADMIN bị khóa, USER, khách bị từ chối; không tự khóa mình, không khóa ADMIN khác | Passed | `src/lib/admin/admin.test.ts` |
| TC-021-02 | Vitest: Zod lý do báo cáo | Từ chối rỗng/quá dài | Rỗng, < 5 ký tự, > 500 ký tự bị từ chối | Passed | `src/lib/admin/admin.test.ts` |
| TC-021-03 | UI: báo cáo tin, báo cáo lần hai | Lưu lần 1, từ chối lần 2 | Lý do rỗng → lỗi tại field; lần 1 "Đã gửi báo cáo"; lần 2 "Bạn đã báo cáo tin này rồi"; chủ tin không thấy nút báo cáo | Passed | Playwright, `021_flag_sent.png` |
| TC-021-04 | UI: admin ẩn tin | Tin biến khỏi feed, chủ tin có thông báo | Không còn trên feed; khách mở chi tiết → 404; chủ tin thấy "Tin này đã bị quản trị viên ẩn" và có thông báo | Passed | Playwright, `021_moderation_desktop.png` |
| TC-021-05 | UI: admin bỏ qua | Flag `HANDLED`, tin vẫn hiện | Tin biến khỏi hàng đợi, vẫn có trên feed | Passed | Playwright |
| TC-021-06 | UI: admin khóa user | User không đăng nhập/thao tác được | Đăng nhập → "Tài khoản đã bị khóa…"; phiên đang mở vào `/my` → màn đăng nhập báo khóa, header về khách; mở khóa → đăng nhập và dùng lại được | Passed | Playwright, `021_locked_login.png`, `021_users_desktop.png` |
| TC-021-07 | USER mở `/admin` | Bị chặn | USER mở `/admin/moderation` → "Không có quyền truy cập (403)", không có mục Quản trị trên header; phát lại action "Bỏ qua" bằng cookie USER → phản hồi 403 | Passed | Playwright |

## Hướng dẫn tự chạy

```
npm test
npm run typecheck
npm run build
npm run dev
```

1. Đăng nhập USER, báo cáo một tin.
2. Đăng nhập ADMIN (tài khoản cấp sẵn), mở `/admin/moderation`, ẩn tin và kiểm tra feed.
3. Khóa một user rồi thử đăng nhập bằng user đó; mở khóa.

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- ADMIN = `unifound.admin@uit.edu.vn`. Trang: `/admin/moderation`, `/admin/users`.
