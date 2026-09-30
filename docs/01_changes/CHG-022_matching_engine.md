# CHG-022: Matching engine rule-based

- ID: `CHG-022`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-014` (chỉ dùng kiểu dữ liệu từ schema đã chỉnh ở CHG-014; có thể làm song song với CHG-015→021)
- File/module dự kiến sửa/tạo: `src/lib/matching/{score,keywords,types}.ts`, `src/lib/matching/*.test.ts`
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Hệ thống có hàm tính điểm và lý do khớp giữa một Lost Report và một Found Report, kết quả nhất quán và giải thích được (chưa có giao diện).

## Phạm vi

### Bao gồm

- `scorePair(lost, found)` → `{ score, reasons[], isMatch }` theo bảng điểm: category 30, location 30, ngày lệch ≤3 ngày 20, keyword title/description 20; tối đa 100.
- `isMatch = score >= 50`; `findMatches(target, candidates)` chỉ ghép Lost↔Found, sắp xếp score giảm dần, ổn định khi bằng điểm.
- Tách keyword: chuẩn hóa hoa/thường, bỏ dấu tiếng Việt khi so, loại stopword; công thức điểm keyword được ghi rõ và cố định.
- Field thiếu/null không cộng điểm, không ném lỗi.

### Các lưu ý

- Hàm thuần, không truy cập DB, không AI/embedding/ML.
- Không làm UI hay query (CHG-023).
- Chỉ xét location giống nhau; không có khu vực gần.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` FR-04, mục 7 (Matching rule)
- `src/db/schema.ts`

## Acceptance criteria

- [ ] Từng tín hiệu cộng đúng điểm; tổng không vượt 100.
- [ ] Biên ngày: lệch 3 ngày được điểm, 4 ngày không; tính đối xứng (Lost trước/sau Found).
- [ ] Biên ngưỡng: 49 không match, 50 match.
- [ ] Chỉ ghép Lost với Found; cùng type trả không match.
- [ ] Dữ liệu thiếu không lỗi, không cộng điểm sai.
- [ ] Cùng input → cùng output; thứ tự kết quả ổn định.
- [ ] Mỗi điểm đều có lý do tương ứng trong `reasons`.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-022-01 | Category giống nhau | +30, có reason | | Pending | |
| TC-022-02 | Location giống nhau | +30, có reason | | Pending | |
| TC-022-03 | Ngày lệch 3 ngày / 4 ngày | +20 / +0 | | Pending | |
| TC-022-04 | Keyword trùng nhiều/ít/không | Điểm keyword đúng công thức | | Pending | |
| TC-022-05 | Tổng 100 khi khớp mọi tín hiệu | score=100 | | Pending | |
| TC-022-06 | Score 49 và 50 | isMatch false / true | | Pending | |
| TC-022-07 | Hai report cùng type | Không match | | Pending | |
| TC-022-08 | Field thiếu/null | Không lỗi, không cộng điểm | | Pending | |
| TC-022-09 | Gọi hai lần cùng input | Kết quả bằng nhau | | Pending | |
| TC-022-10 | `findMatches` sắp xếp và tie-break | Thứ tự ổn định | | Pending | |

## Hướng dẫn tự chạy

```
npm test -- matching
npm run typecheck
```
