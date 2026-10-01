# CHG-018: Gợi ý tin phù hợp (matching) và thông báo trong web

- ID: `CHG-018`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-015` (tạo tin), `CHG-016` (chi tiết tin)
- File/module dự kiến sửa/tạo: `src/lib/matching/*`, `src/lib/notifications/*`, `src/lib/reports/create.ts` (gọi matching sau khi lưu), `src/app/matches`, `src/app/notifications`, `src/components/layout/*` (badge chuông), `src/db/schema.ts` (rà `matches`, `notifications`)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `chưa có` (ghi hash commit trên `main` sau khi push)

## Kết quả người dùng

Sau khi đăng tin, hệ thống tự tìm tin đối ứng và lưu gợi ý kèm điểm và lý do. Hai bên nhận thông báo trong web, xem danh sách gợi ý, bấm "Không phải" để bỏ gợi ý, và xem/đánh dấu đã đọc thông báo.

## Phạm vi

### Bao gồm

- FR08: matching rule-based theo `02_requirements_design.md` mục 11: lọc (đối ứng, cùng danh mục, `OPEN`, trong 14 ngày) rồi chấm điểm (cùng địa điểm +40, cùng trường +15 khi khác địa điểm, thời gian +25/+15/+5, từ khóa tối đa +20); `score >= 50` lưu `matches` (`SUGGESTED`) kèm danh sách lý do.
- Chạy ngay sau khi lưu tin; thất bại của matching không làm hỏng việc đăng tin.
- Deterministic, field thiếu không cộng điểm và không lỗi; score trong 0–100.
- FR13 (phần gợi ý): thông báo cho cả hai bên khi có match mới.
- S06: màn "Gợi ý phù hợp": danh sách match kèm score và lý do, nút "Xem chi tiết" và "Không phải" (`DISMISSED`, không gợi ý lại).
- S09: trang thông báo, đánh dấu đã đọc (từng cái/tất cả), badge số chưa đọc ở header.
- Hạ tầng thông báo dùng lại cho CHG-019/020/021.

### Các lưu ý

- Gợi ý chỉ để kiểm tra, không hiển thị như xác nhận sở hữu.
- Không thêm AI/embedding/ML.
- Trọng số chỉnh sau khi thử với dữ liệu seed; ghi lại nếu đổi.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR08, FR13, S06, S09, mục 10b, mục 11)

## Acceptance criteria

- [ ] Hàm chấm điểm thuần, deterministic, có unit test bao phủ từng tiêu chí và ngưỡng 50.
- [ ] Đăng cặp LOST/FOUND cùng danh mục, cùng địa điểm, gần thời gian → có match lưu với score và lý do.
- [ ] Cặp không đủ điều kiện lọc hoặc dưới ngưỡng không được lưu.
- [ ] Cả hai bên nhận thông báo; badge chưa đọc đúng; đánh dấu đã đọc hoạt động.
- [ ] "Không phải" đổi `DISMISSED` và match không hiện lại.
- [ ] Dữ liệu thiếu (mô tả/địa điểm rỗng) không gây lỗi.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-018-01 | Vitest: bước lọc (cùng loại, khác danh mục, không OPEN, quá 14 ngày) | Bị loại đúng | | Pending | |
| TC-018-02 | Vitest: từng mốc điểm (địa điểm, trường, thời gian, từ khóa) | Đúng bảng điểm | | Pending | |
| TC-018-03 | Vitest: ngưỡng 49 vs 50 | 49 không lưu, 50 lưu | | Pending | |
| TC-018-04 | Vitest: cùng input hai lần / field thiếu | Cùng kết quả, không lỗi | | Pending | |
| TC-018-05 | Đăng LOST rồi FOUND khớp (UI, 2 tài khoản) | Có match, hai bên có thông báo | | Pending | screenshot |
| TC-018-06 | Bấm "Không phải" | `DISMISSED`, không hiện lại | | Pending | |
| TC-018-07 | Đánh dấu đã đọc, badge giảm | Đúng số lượng | | Pending | |
| TC-018-08 | Matching lỗi giả lập | Tin vẫn được lưu | | Pending | |

## Hướng dẫn tự chạy

```
npm test
npm run typecheck
npm run build
npm run dev
```

1. Tài khoản A đăng tin LOST (ví, cùng địa điểm, hôm nay).
2. Tài khoản B đăng tin FOUND cùng danh mục/địa điểm.
3. Cả A và B thấy thông báo; mở "Gợi ý phù hợp" xem score và lý do; thử "Không phải".
