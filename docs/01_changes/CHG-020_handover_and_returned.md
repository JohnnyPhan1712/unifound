# CHG-020: Bàn giao (điểm hẹn, liên hệ) và xác nhận Đã trả

- ID: `CHG-020`
- Trạng thái: `done`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-019`
- File/module dự kiến sửa/tạo: `src/lib/claims/handover.ts`, `src/app/claims/[id]`, `src/components/claims/*`, `src/lib/notifications/*`
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

## Kết quả người dùng

Sau khi yêu cầu được chấp nhận, hai bên thấy thông tin liên hệ của nhau, người nhặt đề xuất điểm và giờ hẹn. Khi cả hai bấm xác nhận (đã trả / đã nhận), tin chuyển sang **Đã trả**.

## Phạm vi

### Bao gồm

- FR11/S08: chỉ khi claim `ACCEPTED` mới hiện `contact_info` của hai bên; người nhặt chọn `meet_location_id` (từ danh sách địa điểm) và `meet_time`; thông báo lịch hẹn cho người mất.
- FR12: người nhặt bấm "Đã trả đồ" (`finder_confirmed_at`), người mất bấm "Đã nhận đồ" (`owner_confirmed_at`); khi đủ cả hai, trong một transaction: claim `COMPLETED`, tin `RETURNED`; thông báo hoàn tất cho cả hai.
- Đúng actor cho từng nút; bấm lặp lại không lỗi; tin `RETURNED` không nhận thêm yêu cầu.
- Trạng thái và hành động tiếp theo rõ trên chi tiết claim và "Tin của tôi".

### Các lưu ý

- Không hiện liên hệ khi claim `PENDING/REJECTED/EXPIRED`.
- Không nhắn tin trong app, không GPS/bản đồ.
- Kiểm tra lại giờ hẹn hợp lệ (không ở quá khứ) bằng Zod.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR11, FR12, S08, mục 9 ghi chú Claim, mục 10a)

## Acceptance criteria

- [ ] Liên hệ hai bên chỉ hiện sau `ACCEPTED` và chỉ cho hai bên liên quan.
- [ ] Người nhặt đặt được điểm hẹn/giờ; người mất được thông báo; giờ ở quá khứ bị từ chối.
- [ ] Một bên xác nhận: claim vẫn `ACCEPTED`; đủ hai bên: claim `COMPLETED`, tin `RETURNED`.
- [ ] Sai actor (người mất bấm "Đã trả đồ", người ngoài bấm) bị từ chối, dữ liệu không đổi.
- [ ] Tin `RETURNED` không nhận yêu cầu mới; feed hiển thị đúng trạng thái.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## Ghi chú triển khai

- `src/lib/claims/handover.ts` gồm các hàm thuần:
  - `canSeeContacts`: chỉ `ACCEPTED` mới thấy liên hệ.
  - `handoverRole`: xác định vai trò. Người nhặt (`finder`) là chủ tin FOUND; người mất (`owner`) là người gửi yêu cầu.
  - `applyConfirmation`: ghi mốc xác nhận; bấm lặp lại thì giữ mốc cũ.
  - `meetingSchema`: Zod cho điểm hẹn và giờ hẹn, giờ hẹn phải ở tương lai.
- Server action `src/lib/claims/handover-actions.ts`:
  - `setMeeting`: chỉ người nhặt, khi claim `ACCEPTED`; thông báo `MEETING` cho người mất.
  - `confirmHandover`: khóa dòng claim trong transaction. Vai trò lấy từ danh tính người đăng nhập, không lấy từ nút bấm; người ngoài nhận 403. Đủ hai bên thì claim → `COMPLETED`, tin → `RETURNED`, cả hai nhận thông báo `RETURNED`. Một bên xác nhận thì bên kia được nhắc. Bấm lặp lại không ghi đè mốc cũ, không gửi lại thông báo.
- Liên hệ (họ tên, `contact_info`, email trường) chỉ hiện khi claim `ACCEPTED` và người xem là một trong hai bên. Sau khi `COMPLETED` thì không còn hiện, đúng TC-020-01.
- Danh sách điểm hẹn dùng lại `getCatalogOptions` (danh sách địa điểm), không có GPS.
- Tin `RETURNED` không nhận yêu cầu mới (dùng lại `claimSubmitError` của CHG-019); feed hiện nhãn "Đã trả".

## AI Log

### AI-1 — Bàn giao và xác nhận hai phía

- Nhiệm vụ (Task): Hiện liên hệ sau khi chấp nhận, đặt lịch hẹn, xác nhận hai bên rồi chuyển tin sang Đã trả.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Supabase MCP (select kiểm tra `claims`/`reports`), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): FR11, FR12, S08, mục 9 ghi chú Claim, mục 10a.
- Kết quả AI (AI Output):
  - Logic: `handover.ts`, `handover-actions.ts`, `getHandoverContacts`.
  - Giao diện: component `MeetingForm`/`ConfirmHandoverButton`, mục "Bàn giao đồ" trên `/claims/[id]`.
- Quyết định của nhóm (Human Decision): Accepted (2026-10-02, theo ủy quyền). Hai điểm là đề xuất của AI đã được giữ: hiện thêm email trường cạnh `contact_info`, và ẩn liên hệ sau khi `COMPLETED`.
- Kiểm tra / Xác minh (Verification):
  - Vitest TC-020-01/02/03.
  - Playwright 4 tài khoản. Để kiểm tra sai actor, chụp request "Đã nhận đồ" của B (hủy, không gửi) rồi phát lại bằng cookie của C → 403.
  - Supabase MCP xác nhận dữ liệu không đổi sau lần phát lại đó.
- Ứng viên đưa vào báo cáo: có

## Bug

Không có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-020-01 | Vitest: điều kiện hiện liên hệ theo trạng thái claim | Chỉ `ACCEPTED` | Lọc toàn bộ trạng thái → chỉ `ACCEPTED` | Passed | `src/lib/claims/handover.test.ts` |
| TC-020-02 | Vitest: xác nhận theo actor và điều kiện `COMPLETED` | Đúng quy tắc | Người ngoài không có vai trò; một bên → chưa hoàn tất; đủ hai bên → hoàn tất; bấm lặp lại giữ mốc cũ | Passed | `src/lib/claims/handover.test.ts` |
| TC-020-03 | Vitest: zod giờ hẹn (quá khứ, thiếu địa điểm) | Từ chối | Quá khứ → "Giờ hẹn phải ở tương lai."; thiếu địa điểm bị từ chối | Passed | `src/lib/claims/handover.test.ts` |
| TC-020-04 | UI: A đặt điểm hẹn, B xem lịch + liên hệ | Hiển thị đúng | Giờ quá khứ báo lỗi tại field; hẹn "Phòng bảo vệ cổng UIT" hợp lệ → B thấy lịch hẹn + liên hệ của A, có thông báo | Passed | Playwright, `020_handover_owner_desktop.png` |
| TC-020-05 | UI: A xác nhận trước, B xác nhận sau | Sau bước hai: `COMPLETED` + `RETURNED` | Sau A: claim vẫn `ACCEPTED` (DB: chỉ có mốc người nhặt); sau B: "Hoàn tất", tin "Đã trả"; phát lại lần xác nhận của B → "đã hoàn tất", không lỗi | Passed | Playwright + Supabase MCP, `020_completed_desktop.png` |
| TC-020-06 | Sai actor bấm xác nhận | Bị từ chối, không đổi dữ liệu | C phát lại request xác nhận của B → phản hồi chứa thông báo 403; DB không đổi (`owner_confirmed_at` vẫn rỗng). Người mất chỉ có nút "Đã nhận đồ", vai trò lấy từ danh tính chứ không từ nút | Passed | Playwright (replay) + Supabase MCP |
| TC-020-07 | Claim chưa chấp nhận: mở liên hệ | Không lộ | Claim `REJECTED` của C: HTML không có số liên hệ và không có mục bàn giao | Passed | Playwright |
| TC-020-08 | Gửi yêu cầu vào tin `RETURNED` | Bị từ chối | Không có nút "Đây là đồ của tôi"; mở URL gửi yêu cầu → "Tin này không còn nhận yêu cầu."; feed hiện nhãn "Đã trả" | Passed | Playwright |

## Hướng dẫn tự chạy

```
npm test
npm run typecheck
npm run build
npm run dev
```

1. Tiếp tục kịch bản CHG-019 (B đã được A chấp nhận).
2. A chọn điểm hẹn và giờ; B kiểm tra thông báo và liên hệ của A.
3. A bấm "Đã trả đồ", B bấm "Đã nhận đồ"; kiểm tra tin hiển thị Đã trả.

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- Giờ hẹn phải ở tương lai. Sau khi cả hai xác nhận, liên hệ không còn hiện (chỉ hiện khi yêu cầu đang `ACCEPTED`).
