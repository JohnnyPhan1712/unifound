# CHG-033: Sửa lỗi form đăng tin Nhặt được bị chuyển thành Mất đồ khi báo lỗi

- ID: `CHG-033`
- Trạng thái: `in_review`
- Ngày tạo: `2026-10-05`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-015` (form đăng tin, `createReport`), `CHG-029` (nhãn/`required` của `ImagePicker` theo loại tin)
- File/module dự kiến sửa/tạo: `src/components/reports/report-form.tsx` (đồng bộ lựa chọn loại tin giữa state và DOM sau khi server trả lỗi), `src/lib/reports/reports.test.ts` hoặc `tests/e2e/` (test tái hiện lỗi). Không dự kiến sửa `actions.ts`, schema, database.
- Branch: `bug/nhat-duoc-nhung-thanh-nguoi-mat` (nhóm trưởng đã tạo; tên chưa theo mẫu `<loại>/<CHG>-<slug>` của `conventions.md`, nhóm trưởng xác nhận giữ nguyên 2026-10-05)

## Kết quả người dùng

Người dùng chọn **Tôi nhặt được đồ**, điền thiếu rồi bấm **Đăng tin**: form báo lỗi nhập thiếu nhưng **vẫn giữ loại Nhặt được** (thẻ chọn, nhãn, các ô Nơi đang giữ đồ / câu hỏi xác minh). Khi nhập đủ và gửi lại, tin được tạo đúng loại **Nhặt được**.

## Mô tả bug (cách hiểu của agent, chờ nhóm trưởng xác nhận)

**Tái hiện theo mô tả:**

1. Vào `/reports/new`, chọn "Tôi nhặt được đồ" (các ô riêng của FOUND hiện ra).
2. Bỏ trống một số trường bắt buộc, bấm "Đăng tin".
3. Server trả lỗi thiếu trường, form hiện khung "Còn N mục cần sửa trước khi lưu".
4. Sau lỗi, thẻ chọn loại **quay về "Tôi bị mất đồ"**, nhưng phần nhập của người nhặt (Nơi đang giữ đồ, câu hỏi/đáp án xác minh) **vẫn còn hiện** và vẫn nhập được.
5. Nhập tiếp rồi gửi: tin được tạo với `type = LOST` thay vì `FOUND`.

**Kết quả mong đợi:** sau lỗi, loại tin vẫn là Nhặt được; tin tạo ra đúng loại đã chọn.
**Kết quả thực tế:** giao diện không đồng bộ (thẻ chọn = Mất đồ, nội dung form = Nhặt được) và tin lưu sai loại.

## Nguyên nhân giả thuyết (chưa xác minh bằng chạy thật)

Trong `report-form.tsx`, loại tin có hai nguồn sự thật tách rời:

- State React `type` (`useState`, dòng 46) quyết định nội dung form (`found` → hiện ô riêng của FOUND, đổi nhãn) và chỉ được lấy từ `v.type` **một lần lúc mount**.
- Radio `name="type"` (dòng 85) là input điều khiển (`checked={type === t}`) và là thứ **thực sự được gửi lên server**.

`<form action={formAction}>` của React 19 **tự reset form** sau khi action chạy xong. Radio bị reset về giá trị mặc định ban đầu (`LOST`) trong DOM, trong khi state `type` vẫn là `FOUND` nên không có re-render nào đưa radio về lại. Kết quả khớp mô tả: thẻ chọn hiện Mất đồ, nội dung vẫn của Nhặt được, gửi tiếp thì `type=LOST`. Các ô còn lại (`defaultValue={v.*}`) không bị mất dữ liệu vì `state.values` được trả về từ server.

Cần xác minh bằng cách chạy thật (E2E/Playwright) trước khi sửa; nếu nguyên nhân khác thì cập nhật mục này.

## Phạm vi

### Bao gồm

- Xác nhận nguyên nhân bằng test tái hiện (E2E: chọn Nhặt được → gửi thiếu → kiểm tra radio đang chọn và giá trị `type` gửi đi ở lần gửi thứ hai).
- Sửa `report-form.tsx` để loại tin sau khi server trả lỗi khớp với loại đã chọn (cả giao diện lẫn giá trị gửi lên). Ưu tiên cách ngắn nhất, ví dụ để radio dùng `defaultChecked` theo `v.type` thay vì vừa điều khiển bằng `checked` vừa phụ thuộc state riêng, hoặc đặt `key` theo `v.type`; chọn sau khi xác nhận nguyên nhân.
- Kiểm tra cả hai chiều: FOUND → lỗi → vẫn FOUND; LOST → lỗi → vẫn LOST; chuyển loại bằng tay trước khi gửi vẫn hoạt động.
- Kiểm tra form sửa tin (`lockType`, dùng input ẩn `type`) không bị ảnh hưởng.
- Kiểm tra các trường khác (danh mục, địa điểm, ảnh đã tải) còn giữ nguyên sau lỗi như hiện tại; nếu phát hiện mất dữ liệu thì ghi nhận, không tự mở rộng phạm vi.

### Các lưu ý (Tránh hiểu nhầm)

- Đây là bug UI phía client; server (`createReport`, `createReportSchema`) xử lý đúng giá trị `type` nhận được nên không sửa. Không đổi schema database, không cần migration.
- Không thiết kế lại form hay đổi bố cục; giữ `DESIGN.md`.
- Không thêm dependency.
- Nếu muốn giữ ảnh đã chọn sau khi lỗi thì thuộc phạm vi khác, chỉ ghi nhận.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`
- `docs/01_changes/CHG-015_seed_and_create_report.md`, `docs/01_changes/CHG-029_lost_report_photo_optional.md`
- `src/components/reports/report-form.tsx`, `src/lib/reports/actions.ts`, `src/lib/action-state.ts`, `src/app/reports/new/page.tsx`
- Tài liệu Next.js trong `node_modules/next/dist/docs/` về form/server actions (React 19 reset form sau action) trước khi viết code.

## Acceptance criteria

- [x] Chọn Nhặt được, gửi thiếu trường: form báo lỗi, thẻ chọn vẫn là Nhặt được, nội dung form vẫn của Nhặt được. (E2E TC-033-01)
- [x] Sau lỗi, nhập đủ và gửi lại: tin tạo ra có `type = FOUND`. (E2E TC-033-02)
- [x] Chọn Mất đồ, gửi thiếu: vẫn là Mất đồ. (E2E TC-033-03; phần gửi lại tin LOST dùng cùng luồng với `lost-no-photo.spec.ts`, đã pass trước khi mạng chậm.)
- [ ] Đổi loại bằng tay trước khi gửi, và đổi loại sau khi đã báo lỗi, vẫn hoạt động đúng.
- [ ] Form sửa tin (`lockType`) không đổi hành vi.
- [x] Có test tái hiện lỗi (fail trước khi sửa, pass sau khi sửa).
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` pass; golden path E2E hiện có không hỏng. (4 lệnh pass; golden path chưa chạy pass lại sau fix do mạng tới database chậm, xem Ghi nhận.)
- [ ] Kiểm tra giao diện bằng Playwright MCP (desktop và 320px), screenshot làm evidence.

## AI Log

### AI-1 — Phân tích bug và lập plan

- Nhiệm vụ (Task): hiểu bug "Nhặt được bị chuyển thành Mất đồ khi báo lỗi" và tạo CHG plan.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), skill ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): mô tả bug của nhóm trưởng; `report-form.tsx`, `actions.ts`, `action-state.ts`, `reports/new/page.tsx`, CHG-029.
- Kết quả AI (AI Output): giả thuyết radio bị reset sau action lệch với state `type`; test đầu (vào bằng `?type=FOUND`) pass nên chưa tái hiện, đổi sang bấm chọn thẻ thì tái hiện được; sửa `checked` → `defaultChecked`.
- Quyết định của nhóm (Human Decision): chờ xác nhận
- Kiểm tra / Xác minh (Verification): E2E `found-form-keeps-type.spec.ts` fail trước, pass sau khi sửa; lint/typecheck/test/build pass.
- Ứng viên đưa vào báo cáo: có

## Bug

### BUG-1 — Form Nhặt được bị chuyển thành Mất đồ sau khi báo lỗi

- Biểu hiện: xem mục "Mô tả bug".
- Các bước tái hiện: xem mục "Mô tả bug" (chưa tái hiện bằng chạy thật).
- Kết quả mong đợi / thực tế: xem mục "Mô tả bug".
- Nguyên nhân gốc: đã xác minh bằng E2E. Radio loại tin dùng `checked={type === t}` (điều khiển bằng state); React 19 reset form sau action nên radio trong DOM quay về giá trị mặc định ban đầu (LOST), còn state `type` vẫn FOUND. Chỉ xảy ra khi người dùng bấm chọn loại (vào bằng `?type=FOUND` thì mặc định đã là FOUND nên không lỗi).
- Fix: `report-form.tsx` đổi `checked={type === t}` thành `defaultChecked={v.type === t}`; `v.type` lấy từ `state.values` do server trả lại nên reset khôi phục đúng loại.
- Verification: test `found-form-keeps-type.spec.ts` fail trước khi sửa (radio Nhặt được bị bỏ chọn sau lỗi), pass sau khi sửa (FOUND và LOST).
- Commit/issue: chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-033-01 | E2E: chọn Nhặt được, gửi thiếu trường | Có khung lỗi; radio "Tôi nhặt được đồ" vẫn được chọn; ô Nơi đang giữ đồ vẫn hiện | Radio Nhặt được vẫn được chọn sau lỗi (trước fix: bị bỏ chọn) | Passed | `found-form-keeps-type.spec.ts` (fail trước fix, pass sau fix) |
| TC-033-02 | E2E: sau lỗi, nhập đủ và gửi lại | Tin tạo ra có loại Nhặt được | Tạo tin thành công, trang chi tiết có "Ngày nhặt được" và "Yêu cầu nhận lại" (đặc trưng tin Nhặt được) | Passed | `found-form-keeps-type.spec.ts` |
| TC-033-03 | E2E: chọn Mất đồ, gửi thiếu rồi gửi lại | Vẫn là Mất đồ, tin tạo đúng LOST | Giữ Mất đồ sau lỗi (phần gửi lại chưa test riêng) | Passed | `found-form-keeps-type.spec.ts` (LOST) |
| TC-033-04 | Đổi loại Mất đồ ↔ Nhặt được trước khi gửi, và sau khi đã báo lỗi | Nội dung form và radio luôn khớp nhau | Chưa chạy | Pending | — |
| TC-033-05 | Mở `/reports/new?type=FOUND`, gửi thiếu | Vẫn là Nhặt được sau lỗi | Chưa chạy | Pending | — |
| TC-033-06 | Form sửa tin (`lockType`) lưu thiếu/đủ | Không đổi hành vi, loại tin không đổi | Chưa chạy | Pending | — |
| TC-033-07 | Giao diện 320px sau khi báo lỗi | Không tràn ngang, thẻ chọn đúng trạng thái | Chưa chạy | Pending | — |

### Ghi nhận

- `found-form-keeps-type.spec.ts` (3 test) pass sau fix; `lint`, `typecheck`, `npm test` (82), `build` pass.
- E2E toàn bộ không sạch do **mạng tới database chậm**, không do CHG này: đo trực tiếp mỗi truy vấn ~0,3–0,4 giây, transaction 2 câu ~1,7 giây, nên `createReport` (kiểm tra, ghi tin, matching, thông báo) vượt 20–90 giây. Lượt 1 (mạng cũ): 22 pass, 3 fail; lượt sau (mạng mới): `golden-path`, `edge-cases` (claim), `claim-images` (3 test), `lost-no-photo` lỗi `toHaveURL` timeout ở bước đăng tin.
- Đối chứng: tạm hoàn tác bản sửa thì `claim-images` vẫn lỗi y hệt (2 test), nên lỗi không do `defaultChecked`. Golden path và edge-cases từng pass khi chạy riêng (1,1–1,4 phút/test).
- Cần chạy lại `npx playwright test` trên mạng nhanh (hoặc dữ liệu E2E ít hơn) để có evidence golden path sau fix. Chưa kiểm tra bằng Playwright MCP/320px.

## Hướng dẫn tự chạy

```
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test   # cần SEED_DEMO_PASSWORD trong .env.local
npm run dev           # xem tay: đăng nhập → Đăng tin mới → Tôi nhặt được đồ → bỏ trống vài ô → Đăng tin; kiểm tra thẻ chọn loại sau khi báo lỗi
```
