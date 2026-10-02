# CHG-019: Gửi yêu cầu nhận đồ và xử lý (chấp nhận/từ chối)

- ID: `CHG-019`
- Trạng thái: `in_review`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `Trần Minh Chiến`
- Dependency: `CHG-016`, `CHG-017` (Tin của tôi), `CHG-018` (hạ tầng thông báo)
- File/module dự kiến sửa/tạo: `src/lib/claims/*` (state machine, submit, decide), `src/app/reports/[id]/claim`, `src/app/my` (tab yêu cầu), `src/app/claims/[id]`, `src/components/claims/*`, `src/db/schema.ts` (rà unique/partial index của `claims`)
- Branch: `không tạo branch` (một người thực hiện CHG-014 → CHG-023, push thẳng vào `main`)
- Commit: `e8cdd04` (trên `main`, commit chung cho CHG-014 → CHG-023)

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

- `AGENTS.md`, `docs/00_guides/conventions.md`, `DESIGN.md`
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

## Ghi chú triển khai

- Schema đã có từ CHG-014: `UNIQUE(report_id, claimant_id)` và partial unique index `claims(report_id) WHERE status = 'ACCEPTED'`.
- Thêm cột `claims.note` (ngoài ERD) cho ô "mô tả thêm" của S05.
- `src/lib/claims/rules.ts`:
  - State machine chỉ cho `PENDING→ACCEPTED/REJECTED` và `ACCEPTED→COMPLETED`.
  - `effectiveClaimStatus` coi `PENDING` từ 7 ngày trở lên là `EXPIRED` khi đọc; yêu cầu hết hạn không duyệt được.
  - `claimSubmitError` gom các luật gửi: chỉ tin `FOUND`, không gửi vào tin của mình, không gửi lần hai, tin phải `OPEN` và còn hạn.
- `decideClaim` chạy trong một transaction, khóa dòng tin bằng `SELECT … FOR UPDATE OF reports`:
  - Chấp nhận: claim → `ACCEPTED`, tin → `IN_PROGRESS`, các claim `PENDING` khác của tin → `REJECTED` ("đóng").
  - Từ chối: claim → `REJECTED`, tin vẫn `OPEN`.
  - Bắt lỗi vi phạm unique (23505) để báo lỗi thân thiện.
  - Thông báo gửi sau khi transaction commit.
- Chỉ chủ tin FOUND duyệt được; ADMIN không duyệt thay.
- Người thứ ba mở `/claims/[id]` nhận 404 để không lộ việc yêu cầu tồn tại.
- Người nhặt thấy "Đáp án bạn đã đặt" để so với câu trả lời. Trang là Server Component nên đáp án chỉ render cho chủ tin, không gửi xuống người gửi yêu cầu.
- Nút "Tôi đã thấy đồ này" trên tin LOST không làm, theo đúng ghi chú phạm vi.
- `/my` có 3 tab: tin đã đăng, yêu cầu đã gửi, yêu cầu nhận được (kèm số "chờ duyệt").

### Cập nhật 2026-10-01: form gửi yêu cầu nằm trong trang chi tiết

- Theo mockup, form "Gửi yêu cầu nhận lại" (câu hỏi xác minh, câu trả lời, mô tả thêm) nằm ngay cột bên phải trang chi tiết tin; trang `/reports/[id]/claim` vẫn còn và dùng cùng form. Người đã gửi thấy bốn bước tiến độ; chủ tin thấy danh sách yêu cầu kèm nút "Xem và duyệt".
- Việc duyệt vẫn làm ở `/claims/[id]` (đáp án đặt sẵn hiện cạnh câu trả lời) để giữ một nơi duy nhất xử lý quy tắc.
- Test E2E cập nhật theo luồng mới.

## AI Log

### AI-1 — State machine và transaction chấp nhận yêu cầu

- Nhiệm vụ (Task): Luật gửi yêu cầu, state machine, duyệt yêu cầu trong transaction bảo đảm tối đa một `ACCEPTED`.
- Công cụ AI (AI Tool): Claude Code (Claude Opus 5.5), Supabase MCP (select kiểm tra `claims`), plugin ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): FR09, FR10, quy tắc nghiệp vụ, mục 10a, `03_development.md` mục 6.
- Kết quả AI (AI Output):
  - Logic: `src/lib/claims/rules.ts`, `actions.ts`, `query.ts`.
  - Trang: `/reports/[id]/claim`, `/claims/[id]`, các tab ở `/my`.
- Quyết định của nhóm (Human Decision): Accepted (2026-10-02, theo ủy quyền). Hai điểm là đề xuất của AI đã được giữ:  claim "đóng" dùng trạng thái `REJECTED`, và ADMIN không duyệt thay chủ tin.
- Kiểm tra / Xác minh (Verification):
  - Vitest TC-019-01/02/03/08.
  - Playwright 4 tài khoản, có ca hai trình duyệt bấm "Chấp nhận" cùng lúc cho hai yêu cầu của cùng một tin.
  - Supabase MCP xác nhận chỉ một yêu cầu `ACCEPTED`.
- Ứng viên đưa vào báo cáo: có

## Bug

### BUG-1 — Thời gian hiện "sau 14 giây nữa"

- Biểu hiện: Tab "Yêu cầu tôi đã gửi" hiện yêu cầu vừa gửi là "sau 14 giây nữa".
- Các bước tái hiện: Gửi yêu cầu rồi mở `/my?tab=sent` ngay.
- Kết quả mong đợi / thực tế: Mong đợi "vừa xong" / thực tế hiện thời điểm tương lai.
- Nguyên nhân gốc: `created_at` lấy `now()` của DB, còn `timeAgo` so với đồng hồ máy chạy app; đồng hồ máy chậm hơn DB khoảng 14 giây.
- Fix: `timeAgo` coi lệch dưới 5 phút về tương lai và dưới 1 phút về quá khứ là "vừa xong" (`src/lib/labels.ts`).
- Verification: Test `timeAgo` trong `src/lib/reports/reports.test.ts` pass.
- Commit/issue: `e8cdd04`.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-019-01 | Vitest: state machine claim (hợp lệ/không hợp lệ) | Chỉ chuyển trạng thái cho phép | Duyệt toàn bộ cặp trạng thái, chỉ còn đúng 3 chuyển hợp lệ | Passed | `src/lib/claims/claims.test.ts` |
| TC-019-02 | Vitest: luật gửi (tin mình, tin đóng, trùng) | Từ chối đúng | Tin của mình, tin LOST, gửi lần hai, tin RETURNED/CLOSED/HIDDEN/IN_PROGRESS, tin hết hạn đều bị từ chối; Zod câu trả lời | Passed | `src/lib/claims/claims.test.ts` |
| TC-019-03 | Vitest: hết hạn 7 ngày | `EXPIRED` đúng ranh giới | 7 ngày − 1 ms → `PENDING`; đúng 7 ngày → `EXPIRED`; không áp dụng cho `ACCEPTED` | Passed | `src/lib/claims/claims.test.ts` |
| TC-019-04 | Vitest/DB: hai `ACCEPTED` cùng tin | Bị chặn bởi partial unique index | Hai phiên của A bấm "Chấp nhận" đồng thời cho 2 yêu cầu của cùng tin → DB còn 1 `ACCEPTED`, 1 `REJECTED`, tin `IN_PROGRESS`. Ca này chứng minh khóa dòng trong transaction; index `claims_one_accepted_per_report` có trong migration 0002 làm lớp chặn cuối, chưa ép riêng lỗi 23505 | Passed | Playwright + Supabase MCP (select) |
| TC-019-05 | UI: B gửi yêu cầu vào tin của A | Lưu, A có thông báo | Yêu cầu `PENDING`, hiện ở "Yêu cầu tôi đã gửi" của B; chuông A "1 chưa đọc" | Passed | Playwright, `019_received_desktop.png` |
| TC-019-06 | UI: A chấp nhận nhiều claim | Chỉ một ACCEPTED, còn lại đóng | Chấp nhận B → B "Đã chấp nhận", C "Bị từ chối" (không còn nút duyệt), tin "Đang bàn giao"; C nhận thông báo "đã chọn một yêu cầu khác" | Passed | Playwright, `019_claim_finder_desktop.png` |
| TC-019-07 | UI: A từ chối | Tin vẫn mở, B có thông báo | Tin vẫn "Đang mở"; B nhận "không được chấp nhận" | Passed | Playwright + MCP |
| TC-019-08 | Người thứ ba mở URL yêu cầu | Bị từ chối (403/404) | Admin (không liên quan) mở `/claims/<id>` → 404, HTML không có câu trả lời; người gửi yêu cầu không nhận được đáp án đúng trong HTML/RSC | Passed | Playwright |
| TC-019-09 | B gửi lần hai / A tự gửi vào tin mình | Bị từ chối với thông báo đúng | B: "Bạn đã gửi yêu cầu cho tin này…"; A không thấy nút "Đây là đồ của tôi", mở URL → "Bạn không thể gửi yêu cầu vào tin của chính mình." | Passed | Playwright |

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

Ghi chú khi tự chạy (bổ sung sau khi thực hiện):

- Mở app bằng `http://localhost:3000` (không dùng `127.0.0.1`). Tài khoản demo: `unifound.demo1/2/3@gm.uit.edu.vn` (A/B/C) và `unifound.admin@uit.edu.vn`, mật khẩu là `SEED_DEMO_PASSWORD` trong `.env.local`.
- A, B, C = Demo A/B/C; D (người ngoài) dùng tài khoản admin hoặc tài khoản khác không liên quan.
