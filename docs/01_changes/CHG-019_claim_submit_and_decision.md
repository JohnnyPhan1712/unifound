# CHG-019: Gửi yêu cầu nhận đồ và xử lý (chấp nhận/từ chối)

- ID: `CHG-019`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-016`, `CHG-017` (Tin của tôi), `CHG-018` (hạ tầng thông báo)
- File/module dự kiến sửa/tạo: `src/lib/claims/*` (state machine, submit, decide), `src/app/reports/[id]/claim`, `src/app/my` (tab yêu cầu), `src/app/claims/[id]`, `src/components/claims/*`, `src/db/schema.ts` (rà unique/partial index của `claims`)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `chưa có` (ghi hash commit trên `main` sau khi push)

## Kết quả người dùng

Người mất đồ mở tin Nhặt được, trả lời câu hỏi xác minh và gửi yêu cầu. Người nhặt xem câu trả lời, chấp nhận hoặc từ chối; chấp nhận thì các yêu cầu khác của tin tự đóng. Cả hai thấy trạng thái trong "Tin của tôi" và nhận thông báo.

## Phạm vi

### Bao gồm

- S05/FR09: form yêu cầu (hiện câu hỏi xác minh, ô trả lời, ô mô tả thêm). Luật server: không gửi vào tin của mình, tin `RETURNED/CLOSED/HIDDEN`/hết hạn không nhận, mỗi người một yêu cầu/tin (`UNIQUE(report_id, claimant_id)`).
- FR10/S08 (phần xem & duyệt): người nhặt xem câu trả lời; Chấp nhận (claim `ACCEPTED`, tin `IN_PROGRESS`, các claim `PENDING` còn lại đóng, trong một transaction, tối đa một `ACCEPTED` qua partial unique index) hoặc Từ chối (`REJECTED`, tin vẫn mở).
- Claim `PENDING` quá 7 ngày coi là `EXPIRED` khi truy vấn (không tác vụ nền).
- S07 tab 2 "Yêu cầu tôi đã gửi" và tab 3 "Yêu cầu tôi nhận được".
- Thông báo: yêu cầu mới (cho người nhặt), kết quả duyệt (cho người gửi).
- Chỉ claimant và chủ tin FOUND liên quan thấy câu trả lời xác minh.

### Các lưu ý

- Chưa hiện thông tin liên hệ, chưa hẹn/xác nhận trả (CHG-020).
- Claim không phải bằng chứng sở hữu; không hiện đáp án đúng cho claimant.
- Nút "Tôi đã thấy đồ này" trên tin LOST không thuộc phạm vi CHG này trừ khi ghi rõ khi triển khai.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `docs/00_guides/code_conventions.md`, `DESIGN.md`
- `docs/02_reports/02_requirements_design.md` (FR09, FR10, quy tắc nghiệp vụ, S05, S07, S08, mục 10a)
- `docs/02_reports/03_development.md` (mục 6 ràng buộc toàn vẹn)

## Acceptance criteria

- [ ] Gửi yêu cầu hợp lệ lưu `PENDING` và hiện ở "Yêu cầu tôi đã gửi"; người nhặt nhận thông báo.
- [ ] Gửi vào tin của chính mình, tin đã đóng/trả, hoặc gửi lần hai bị từ chối với thông báo đúng.
- [ ] Chấp nhận: claim `ACCEPTED`, tin `IN_PROGRESS`, claim khác của tin bị đóng; chỉ chủ tin FOUND làm được.
- [ ] Từ chối: `REJECTED`, tin vẫn `OPEN`, người gửi nhận thông báo.
- [ ] Chuyển trạng thái sai/actor sai bị từ chối, dữ liệu không đổi.
- [ ] Claim quá 7 ngày hiển thị/xử lý như `EXPIRED`.
- [ ] Người thứ ba không xem được câu trả lời xác minh.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-019-01 | Vitest: state machine claim (hợp lệ/không hợp lệ) | Chỉ chuyển trạng thái cho phép | | Pending | |
| TC-019-02 | Vitest: luật gửi (tin mình, tin đóng, trùng) | Từ chối đúng | | Pending | |
| TC-019-03 | Vitest: hết hạn 7 ngày | `EXPIRED` đúng ranh giới | | Pending | |
| TC-019-04 | Vitest/DB: hai `ACCEPTED` cùng tin | Bị chặn bởi partial unique index | | Pending | |
| TC-019-05 | UI: B gửi yêu cầu vào tin của A | Lưu, A có thông báo | | Pending | screenshot |
| TC-019-06 | UI: A chấp nhận nhiều claim | Chỉ một ACCEPTED, còn lại đóng | | Pending | |
| TC-019-07 | UI: A từ chối | Tin vẫn mở, B có thông báo | | Pending | |
| TC-019-08 | Người thứ ba mở URL yêu cầu | Bị từ chối (403/404) | | Pending | |

## Hướng dẫn tự chạy

```
npm test
npm run typecheck
npm run build
npm run dev
```

1. A đăng tin FOUND (câu hỏi xác minh). B và C đăng nhập, gửi yêu cầu.
2. A mở "Yêu cầu tôi nhận được", chấp nhận B; kiểm tra yêu cầu của C bị đóng.
3. Thử B gửi lần hai, A tự gửi vào tin mình, D (người ngoài) mở URL yêu cầu.
