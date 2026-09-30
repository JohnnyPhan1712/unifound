# CHG-023: Màn hình Potential Matches (SCR-04)

- ID: `CHG-023`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-020`, `CHG-022`, `CHG-018`
- File/module dự kiến sửa/tạo: `src/app/reports/[id]/matches/page.tsx`, `src/lib/matching/queries.ts`, `src/components/matches/{MatchCard,MatchSummary}.tsx`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Từ một report, người dùng xem danh sách report có khả năng liên quan kèm điểm và lý do, để ưu tiên kiểm tra.

## Phạm vi

### Bao gồm

- Query candidate ngược type (Lost↔Found), chưa đóng/Returned, tính điểm bằng engine CHG-022 khi đọc (không tạo bảng Match).
- Trang `/reports/[id]/matches` theo mockup `04_potential_matches.html`: score, lý do cộng điểm, link tới report kia.
- Khối gợi ý ngắn (top 3) gắn vào slot ở trang chi tiết.
- Dòng lưu ý: gợi ý để kiểm tra, không phải xác nhận sở hữu.
- Loading, empty (không có match), error.

### Các lưu ý

- Không sửa công thức điểm (thuộc CHG-022).
- Không lộ thông tin riêng tư của report khác ngoài dữ liệu công khai.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` FR-04, SCR-04, mục 4, 7
- `src/lib/matching/*`; mockup `04_potential_matches.html`, `DESIGN.md`

## Acceptance criteria

- [ ] Chỉ cặp score ≥50 được hiển thị, kèm score và lý do.
- [ ] Sắp xếp theo score giảm dần.
- [ ] Report không có match → empty state rõ ràng.
- [ ] Có dòng lưu ý "không phải xác nhận sở hữu".
- [ ] Dữ liệu seed hiển thị đúng các cặp đã thiết kế ở CHG-018.
- [ ] Trang công khai; id không tồn tại → 404.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-023-01 | Vitest lọc candidate (cùng type bị loại, Returned bị loại) | Danh sách đúng | | Pending | |
| TC-023-02 | E2E report seed có cặp khớp | Thấy match + score + lý do | | Pending | |
| TC-023-03 | E2E cặp sát ngưỡng (<50) | Không xuất hiện | | Pending | |
| TC-023-04 | E2E report không có match | Empty state | | Pending | |
| TC-023-05 | E2E khối top 3 ở trang chi tiết | Hiển thị và link đúng | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run dev     # mở report Lost có cặp khớp → /reports/[id]/matches
npm test
npm run test:e2e -- matches
```
