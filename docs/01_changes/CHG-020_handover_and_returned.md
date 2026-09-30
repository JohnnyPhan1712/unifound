# CHG-020: Bàn giao (điểm hẹn, liên hệ) và xác nhận Đã trả

- ID: `CHG-020`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-019`
- File/module dự kiến sửa/tạo: `src/lib/claims/handover.ts`, `src/app/claims/[id]`, `src/components/claims/*`, `src/lib/notifications/*`
- Branch: 
- Commit sau merge: 

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

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR11, FR12, S08, mục 9 ghi chú Claim, mục 10a)

## Acceptance criteria

- [ ] Liên hệ hai bên chỉ hiện sau `ACCEPTED` và chỉ cho hai bên liên quan.
- [ ] Người nhặt đặt được điểm hẹn/giờ; người mất được thông báo; giờ ở quá khứ bị từ chối.
- [ ] Một bên xác nhận: claim vẫn `ACCEPTED`; đủ hai bên: claim `COMPLETED`, tin `RETURNED`.
- [ ] Sai actor (người mất bấm "Đã trả đồ", người ngoài bấm) bị từ chối, dữ liệu không đổi.
- [ ] Tin `RETURNED` không nhận yêu cầu mới; feed hiển thị đúng trạng thái.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-020-01 | Vitest: điều kiện hiện liên hệ theo trạng thái claim | Chỉ `ACCEPTED` | | Pending | |
| TC-020-02 | Vitest: xác nhận theo actor và điều kiện `COMPLETED` | Đúng quy tắc | | Pending | |
| TC-020-03 | Vitest: zod giờ hẹn (quá khứ, thiếu địa điểm) | Từ chối | | Pending | |
| TC-020-04 | UI: A đặt điểm hẹn, B xem lịch + liên hệ | Hiển thị đúng | | Pending | screenshot |
| TC-020-05 | UI: A xác nhận trước, B xác nhận sau | Sau bước hai: `COMPLETED` + `RETURNED` | | Pending | |
| TC-020-06 | Sai actor bấm xác nhận | Bị từ chối, không đổi dữ liệu | | Pending | |
| TC-020-07 | Claim chưa chấp nhận: mở liên hệ | Không lộ | | Pending | |
| TC-020-08 | Gửi yêu cầu vào tin `RETURNED` | Bị từ chối | | Pending | |

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
