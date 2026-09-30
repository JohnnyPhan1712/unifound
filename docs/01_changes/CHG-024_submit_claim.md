# CHG-024: Gửi Claim kèm thông tin xác minh riêng tư

- ID: `CHG-024`
- Trạng thái: `proposed`
- Ngày tạo: `2026-09-30`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-016`, `CHG-020`
- File/module dự kiến sửa/tạo: `src/lib/claims/{schema,rules,actions}.ts`, `src/components/claims/ClaimForm.tsx`, `src/db/seed.ts` (chỉ thêm seed claim Pending)
- Branch: 
- Commit sau merge: 

## Kết quả người dùng

Người dùng đã đăng nhập gửi claim cho một Found Report của người khác, kèm thông tin xác minh chỉ chủ report và bản thân xem được.

## Phạm vi

### Bao gồm

- Zod schema claim: thông tin xác minh (bắt buộc, giới hạn độ dài).
- Rule thuần `canSubmitClaim(user, report, existingClaims)`: chỉ Found report, chưa Returned, không phải report của mình, chưa có claim Pending/Accepted của chính user.
- Server action tạo claim `Pending`, gắn `claimantId` từ session.
- Form claim ở trang chi tiết (slot), thông báo thành công/lỗi.
- Bảo đảm thông tin xác minh không xuất hiện trong feed, trang chi tiết công khai hay matching.

### Các lưu ý

- Chưa Accept/Reject/Returned (CHG-025) và chưa có trang My Reports (CHG-026).
- Code claim cũ (CHG-011 `rejected`) đã được xóa ở CHG-013; viết mới.
- Seed claim là phần bổ sung nhỏ vào `seed.ts`; không sửa phần seed của CHG-018.

## File/tài liệu cần đọc trước khi thực hiện

- `docs/02_reports/02_requirements_design.md` FR-05, mục 6 (Claim)
- `src/db/schema.ts` (bảng claims, enum claim_status)

## Acceptance criteria

- [ ] Claim hợp lệ được lưu `Pending` đúng claimant và report.
- [ ] Không claim được report của chính mình, Lost report, report đã Returned; server từ chối.
- [ ] Không gửi trùng khi đã có claim Pending/Accepted.
- [ ] Anon bị từ chối.
- [ ] Thông tin xác minh không có trong response công khai của feed/detail/matches.
- [ ] Form có label, lỗi tại field.
- [ ] `npm run typecheck`, `npm test`, `npm run build` pass.

## AI Log

Chưa có.

## Bug

Chưa có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-024-01 | Vitest schema claim (rỗng, quá dài, hợp lệ) | Đúng lỗi/pass | | Pending | |
| TC-024-02 | Vitest `canSubmitClaim` các ca own/Lost/Returned/trùng | Từ chối đúng lý do | | Pending | |
| TC-024-03 | Vitest action khi anon | Từ chối, không ghi DB | | Pending | |
| TC-024-04 | E2E gửi claim hợp lệ | Thông báo thành công, có bản ghi Pending | | Pending | |
| TC-024-05 | E2E chủ report mở detail của mình | Không thấy form claim | | Pending | |
| TC-024-06 | Kiểm tra nội dung feed/detail công khai | Không chứa thông tin xác minh | | Pending | |

## Hướng dẫn tự chạy

```
npm run db:seed
npm run dev     # đăng nhập user B, mở Found report của user A, gửi claim
npm test
npm run test:e2e -- claim-submit
```
