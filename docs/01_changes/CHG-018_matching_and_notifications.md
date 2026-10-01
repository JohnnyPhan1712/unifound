# CHG-018: Gợi ý tin phù hợp (matching) và thông báo trong web

- ID: `CHG-018`
- Trạng thái: `in_review`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-015` (tạo tin), `CHG-016` (chi tiết tin)
- File/module dự kiến sửa/tạo: `src/lib/matching/*`, `src/lib/notifications/*`, `src/lib/reports/create.ts` (gọi matching sau khi lưu), `src/app/matches`, `src/app/notifications`, `src/components/layout/*` (badge chuông), `src/db/schema.ts` (rà `matches`, `notifications`)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

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

## Ghi chú triển khai

- `src/lib/matching/score.ts` là hàm thuần, chạy theo hai bước:
  - **Lọc** (`isCandidate`): tin đối ứng, cùng danh mục, đang `OPEN`, còn hạn, đăng trong 14 ngày.
  - **Chấm điểm** (`scorePair`): cùng địa điểm +40; nếu khác địa điểm mà cùng trường thì +15; thời gian cách nhau ≤ 1 ngày +25, ≤ 3 ngày +15, còn lại +5; từ khóa +5 mỗi từ trùng, tối đa +20. Điểm được chặn trong khoảng 0–100.
  - Trọng số giữ nguyên như `02_requirements_design.md` mục 11, chưa chỉnh.
- Hai bổ sung cần nhóm xác nhận:
  1. Không gợi ý tin của chính người đăng.
  2. Từ khóa: chữ thường, chuẩn hóa Unicode, bỏ dấu câu, bỏ từ dừng tiếng Việt hay gặp ("mất", "nhặt", "được", "màu", "của"…) và bỏ từ 1 ký tự.
- `runMatching` (`src/lib/matching/run.ts`) chạy ngay sau khi lưu tin trong `createReport`, bọc trong `runMatchingSafely`: lỗi chỉ ghi log, tin vẫn được lưu. Lọc thô bằng SQL rồi lọc lại bằng `isCandidate` để luật chỉ nằm ở một chỗ.
- Lý do cộng điểm lưu ở cột `matches.reasons` (jsonb). `UNIQUE(lost, found)` + `on conflict do nothing` nên cặp đã `DISMISSED` không được gợi ý lại.
- `/matches` chỉ hiện gợi ý `SUGGESTED` khi cả hai tin còn `OPEN`/`IN_PROGRESS` và còn hạn. Mỗi gợi ý luôn kèm lý do và câu "không phải xác nhận sở hữu".
- Một trong hai chủ tin bấm "Không phải" là cặp đó bị bỏ cho cả hai bên.
- Trạng thái `USED` có trong enum nhưng chưa dùng (không có yêu cầu nào chuyển sang `USED`).
- Hạ tầng thông báo (`src/lib/notifications`):
  - `notify()` dùng lại cho CHG-019/020/021.
  - Thêm cột `link` (ngoài ERD) để nút "Xem" mở đúng nội dung và tự đánh dấu đã đọc.
  - Có đánh dấu đã đọc từng cái và tất cả, badge số chưa đọc trên chuông ở header.

## AI Log

### AI-1 — Hàm chấm điểm matching và unit test

- Nhiệm vụ (Task): Hiện thực rule mục 11 thành hàm thuần có lý do, kèm unit test từng tiêu chí và ngưỡng.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): FR08, mục 10b, mục 11, CHG-018.
- Kết quả AI (AI Output): `isCandidate`, `keywords`, `scorePair`, `shouldSuggest` và 16 test case.
- Quyết định của nhóm (Human Decision): chờ xác nhận. Hai bổ sung "không gợi ý tin của chính mình" và "danh sách từ dừng" là đề xuất của AI.
- Kiểm tra / Xác minh (Verification):
  - Lần chạy đầu có 5 test fail. Nguyên nhân là fixture test sai: hai tin cùng tiêu đề "Ví" nên tự cộng +5 từ khóa, và cùng `locationId` nên tự cộng +40. Hàm chấm điểm không sai.
  - Đã sửa fixture (tách địa điểm, đổi tiêu đề) → 42/42 test pass.
  - Cặp thật trên UI được 85 điểm, lý do đúng như bảng điểm.
- Ứng viên đưa vào báo cáo: có (ví dụ output AI cần chỉnh: test sai do dữ liệu mẫu, không phải do logic)

### AI-2 — Lưu gợi ý, thông báo và màn hình S06/S09

- Nhiệm vụ (Task): Chạy matching sau khi đăng tin, gửi thông báo cho cả hai bên, trang gợi ý và trang thông báo.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Supabase MCP (select kiểm tra `matches`/`notifications`).
- Đầu vào / Ngữ cảnh (Input/Context): FR13, S06, S09, DESIGN.md (điểm luôn kèm lý do).
- Kết quả AI (AI Output):
  - `src/lib/matching/run.ts`, `query.ts`, `actions.ts`.
  - `src/lib/notifications/*`, `/matches`, `/notifications`, chuông ở header.
- Quyết định của nhóm (Human Decision): chờ xác nhận.
- Kiểm tra / Xác minh (Verification): Playwright với 3 tài khoản (bảng dưới); Supabase MCP xác nhận đúng 1 cặp được lưu, 2 thông báo `MATCH`, trạng thái `DISMISSED` sau khi bấm "Không phải".
- Ứng viên đưa vào báo cáo: có

## Bug

Không có lỗi trong code. Lần chạy test đầu fail do fixture test, đã ghi ở AI-1.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-018-01 | Vitest: bước lọc (cùng loại, khác danh mục, không OPEN, quá 14 ngày) | Bị loại đúng | Loại đúng cả 6 trường hợp (thêm hết hạn và tin của chính mình); đúng 14 ngày vẫn được xét | Passed | `src/lib/matching/matching.test.ts` |
| TC-018-02 | Vitest: từng mốc điểm (địa điểm, trường, thời gian, từ khóa) | Đúng bảng điểm | +40 / +15 / 0; +25 / +15 / +5; từ khóa +10 và chặn ở +20 | Passed | `src/lib/matching/matching.test.ts` |
| TC-018-03 | Vitest: ngưỡng 49 vs 50 | 49 không lưu, 50 lưu | `shouldSuggest` 49 → false, 50 → true | Passed | `src/lib/matching/matching.test.ts` |
| TC-018-04 | Vitest: cùng input hai lần / field thiếu | Cùng kết quả, không lỗi | Kết quả giống hệt; thiếu địa điểm/thời gian/mô tả → `{score: 0, reasons: []}`; điểm ≤ 100 | Passed | `src/lib/matching/matching.test.ts` |
| TC-018-05 | Đăng LOST rồi FOUND khớp (UI, 2 tài khoản) | Có match, hai bên có thông báo | A đăng LOST, B đăng FOUND cùng danh mục/địa điểm → 85 điểm, 3 lý do; chuông A và B đều "1 chưa đọc"; C đăng tin khác danh mục → không có gợi ý, chuông C không đổi | Passed | Playwright, `018_matches_desktop.png`, `018_notifications_desktop.png` |
| TC-018-06 | Bấm "Không phải" | `DISMISSED`, không hiện lại | Dòng gợi ý biến mất; A và B đều về empty state "Chưa có gợi ý nào"; DB `DISMISSED` | Passed | Playwright + Supabase MCP (select) |
| TC-018-07 | Đánh dấu đã đọc, badge giảm | Đúng số lượng | B: "1 chưa đọc" → "Đã đọc" → chuông không còn số; A bấm "Xem" → mở `/matches`, chuông về 0 | Passed | Playwright |
| TC-018-08 | Matching lỗi giả lập | Tin vẫn được lưu | `runMatchingSafely` với hàm matching ném lỗi → trả `false`, không ném; trong `createReport` tin đã commit trước khi chạy matching | Passed | `src/lib/matching/matching.test.ts` |

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

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- A = Demo A, B = Demo B. Ví dụ: A đăng "Mất tai nghe bluetooth đen" (danh mục Tai nghe / phụ kiện điện tử, Thư viện UIT), B đăng tin Nhặt được tương tự → khoảng 85 điểm.
