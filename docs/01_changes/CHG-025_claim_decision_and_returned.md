# CHG-025: Xử lý Claim (Accept/Reject) và đánh dấu Returned

- ID: `CHG-025`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-024`
- File/module dự kiến sửa/tạo: `src/lib/claims/{transitions,decisions}.ts`, `src/lib/reports/status.ts`, `src/components/claims/ClaimReviewPanel.tsx`, `src/db/seed.ts` (chỉ thêm seed claim nhiều trạng thái)
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Chủ Found Report xem các claim gửi đến (kèm thông tin xác minh), Accept hoặc Reject, và đánh dấu Returned sau khi trao trả đồ.

## Phạm vi

### Bao gồm

- State machine thuần: Claim `Pending → Accepted | Rejected | Closed`; Report chỉ sang `Returned` khi có claim `Accepted`; mọi chuyển khác bị từ chối.
- Accept trong một transaction: claim được chọn → `Accepted`, các claim còn lại của report → `Rejected`/`Closed`; tối đa 1 `Accepted` (đã có partial unique index).
- Chỉ chủ Found report được xem thông tin xác minh, Accept/Reject, đánh dấu Returned.
- Panel xử lý claim ở trang chi tiết; xác nhận trước khi Accept và Returned.
- Chuyển sai actor/sai trạng thái → từ chối, dữ liệu không đổi.

### Các lưu ý

- Không có chat hay Moderator.
- ADMIN không được xem thông tin xác minh hoặc xử lý claim thay chủ report, trừ khi có quyết định mới (mặc định: không).
- Không làm trang My Reports (CHG-026).

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` FR-05/06, mục 6 (Claim)
- `src/db/schema.ts` (index `unique_accepted_claim_per_report`)
- `src/lib/claims/*` từ CHG-024

## Acceptance criteria

- [ ] Chủ Found report Accept/Reject claim Pending thành công.
- [ ] Accept một claim → claim khác của cùng report tự chuyển Rejected/Closed; không bao giờ có 2 Accepted.
- [ ] Returned chỉ đặt được khi có claim Accepted, và chỉ bởi chủ report.
- [ ] Actor không phải chủ report (kể cả USER khác, claimant) bị từ chối, dữ liệu không đổi.
- [ ] Chuyển trạng thái sai (Rejected→Accepted, Returned→Pending...) bị từ chối.
- [ ] Thông tin xác minh chỉ chủ report và claimant xem được.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-025-01 | Vitest bảng chuyển trạng thái claim hợp lệ/không hợp lệ | Đúng từng cặp | | Pending | |
| TC-025-02 | Vitest điều kiện Returned (có/không Accepted) | Đúng | | Pending | |
| TC-025-03 | Vitest phân quyền actor (owner/claimant/other/admin) | Đúng | | Pending | |
| TC-025-04 | Integration Accept với 3 claim Pending | 1 Accepted, 2 còn lại Rejected/Closed | | Pending | |
| TC-025-05 | E2E accept → returned | Report hiển thị Returned | | Pending | |
| TC-025-06 | E2E reject | Claim Rejected, report vẫn mở | | Pending | |
| TC-025-07 | E2E claimant thử Accept | Bị từ chối, dữ liệu không đổi | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run dev     # user A (chủ Found) xử lý claim của B và C
npm test
npm run test:e2e -- claim-decision
```
