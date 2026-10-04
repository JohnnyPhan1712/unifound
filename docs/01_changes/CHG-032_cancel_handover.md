# CHG-032: Hủy bàn giao khi yêu cầu đã chấp nhận

- ID: `CHG-032`
- Trạng thái: `proposed`
- Ngày tạo: `2026-10-04`
- Người phụ trách: `chưa phân công`
- Dependency: `CHG-019` (chấp nhận yêu cầu, `canTransition`), `CHG-020` (bàn giao, `confirmHandover`), `CHG-017` (quy tắc sửa/đóng/xóa theo trạng thái), `CHG-007` (schema, migration)
- File/module dự kiến sửa/tạo: `src/db/schema.ts` (thêm `CANCELLED` vào `claimStatusEnum`) + migration Drizzle, `src/lib/claims/rules.ts` (`TRANSITIONS`: `ACCEPTED` → `CANCELLED`), `src/lib/claims/handover-actions.ts` (action `cancelHandover`), `src/components/claims/handover.tsx` (nút "Hủy bàn giao" có xác nhận), `src/app/claims/[id]/page.tsx` (thông báo trạng thái `CANCELLED`), `src/components/ui/badges.tsx` và `src/lib/labels.ts` (nhãn `CANCELLED`), `src/lib/claims/claims.test.ts` / `handover.test.ts`, `tests/e2e/` (thêm spec hủy bàn giao)
- Branch: 

## Kết quả người dùng

Khi hai bên không gặp được nhau, người nhặt hoặc người nhận bấm **Hủy bàn giao** ở trang bàn giao. Yêu cầu chuyển sang Đã hủy, tin quay về **Đang mở** để người nhặt nhận yêu cầu khác; bên còn lại được thông báo. Tin không còn kẹt ở "Đang bàn giao".

## Phạm vi

### Bao gồm

- **Trạng thái mới `CANCELLED` cho claim:** thêm vào `claimStatusEnum` bằng migration Drizzle (`db:generate` → `db:migrate`, không sửa schema trực tiếp bằng MCP). `TRANSITIONS.ACCEPTED` thành `["COMPLETED", "CANCELLED"]`; `CANCELLED` là trạng thái cuối.
- **Action `cancelHandover(id)`:** người nhặt (chủ tin) **hoặc** người gửi yêu cầu được hủy, dùng lại `handoverRole`. Trong một transaction, khóa dòng (`for update`) như `confirmHandover`: kiểm tra claim đang `ACCEPTED`, đặt claim `CANCELLED`, đặt tin `IN_PROGRESS` → `OPEN`, rồi thông báo cho bên còn lại (`CLAIM_DECISION`, link `/claims/{id}`). Bấm lặp lại hoặc claim đã `COMPLETED`/`CANCELLED` thì trả thông báo, không đổi dữ liệu.
- **Dữ liệu bàn giao:** giữ nguyên `meet_location_id`, `meet_time`, mốc xác nhận để làm lịch sử; thông tin liên hệ của hai bên **ngừng hiển thị** khi claim không còn `ACCEPTED`/`COMPLETED` (kiểm tra lại điều kiện hiện liên hệ ở `claims/[id]/page.tsx`).
- **Giao diện:** nút "Hủy bàn giao" (kiểu phụ/nguy hiểm, có bước xác nhận trước khi gửi) trong khối bàn giao khi claim `ACCEPTED`; trang yêu cầu `CANCELLED` có thông báo "Bàn giao đã bị hủy"; badge và nhãn tiếng Việt "Đã hủy"; "Tin của tôi" hiển thị đúng trạng thái sau khi tin về `OPEN`.
- **Test:** unit test chuyển trạng thái hợp lệ/không hợp lệ (`ACCEPTED` → `CANCELLED` được; `COMPLETED`/`CANCELLED`/`REJECTED`/`PENDING` → `CANCELLED` bị từ chối) và quyền hủy; E2E hủy bàn giao từ cả hai phía.

### Các lưu ý (Tránh hiểu nhầm)

- **Chỉ hủy khi claim đang `ACCEPTED`.** Claim `PENDING` đã có từ chối/hết hạn; `COMPLETED` là cuối, không hoàn tác.
- **Không hồi sinh các yêu cầu bị đóng:** khi chấp nhận, các yêu cầu `PENDING` khác đã thành `REJECTED`. Sau khi hủy, tin về `OPEN` để nhận yêu cầu **mới**; người đã bị hủy hoặc bị đóng không gửi lại được vì quy tắc "mỗi người một yêu cầu cho mỗi tin" (FR09) giữ nguyên.
- **Tin hết hạn 60 ngày vẫn về `OPEN` trong dữ liệu** nhưng hiển thị như đã đóng theo quy tắc `expires_at` hiện có; không thêm xử lý riêng.
- Tin `LOST` không có claim nên không liên quan.
- **Phương án thay thế đã cân nhắc:** dùng lại `REJECTED` cho trường hợp hủy thì không cần migration, nhưng thống kê và người dùng không phân biệt được "bị từ chối" với "bàn giao thất bại". Chọn thêm `CANCELLED`; nếu nhóm muốn bỏ migration thì đổi sang `REJECTED` và bỏ các mục nhãn/badge mới.
- Không thêm lý do hủy, không thêm hạn tự động hủy (không có tác vụ nền), không thêm dependency.
- Sau khi CHG xong, cập nhật `docs/02_reports/assets/state_diagram_claim.puml`, `state_diagram_report.puml` và mục 12 của `02_requirements_design.md` (gỡ ghi chú hạn chế "kẹt `IN_PROGRESS`"). Người dùng đã đồng ý cập nhật các file này (2026-10-04), làm ở cuối CHG sau khi code xong; không sửa phần khác của `docs/02_reports/`.
- Giữ `DESIGN.md`; không dùng dữ liệu cá nhân thật trong test/ảnh chụp.

## File/tài liệu cần đọc trước khi thực hiện

- `AGENTS.md`, `DESIGN.md`, `docs/00_guides/conventions.md`, `docs/00_guides/changes_workflow.md`, `docs/00_guides/git_workflow.md`
- `docs/01_changes/CHG-019_claim_submit_and_decision.md`, `docs/01_changes/CHG-020_handover_and_returned.md`
- `src/lib/claims/rules.ts`, `src/lib/claims/actions.ts`, `src/lib/claims/handover-actions.ts`, `src/lib/claims/handover.ts`, `src/components/claims/handover.tsx`, `src/app/claims/[id]/page.tsx`, `src/lib/auth/permissions.ts`, `src/db/schema.ts`
- `docs/02_reports/assets/state_diagram_claim.puml`, `docs/02_reports/assets/state_diagram_report.puml`
- Supabase skills / `docs/02_reports/03_development.md` (mục Database workflow) khi tạo migration

## Acceptance criteria

- [ ] Người nhặt và người nhận đều thấy nút "Hủy bàn giao" khi claim `ACCEPTED`, có bước xác nhận; người không liên quan không hủy được (server trả từ chối).
- [ ] Hủy thành công: claim `CANCELLED`, tin `IN_PROGRESS` → `OPEN` trong cùng một transaction; tin hiện lại trên bảng tin và nhận được yêu cầu mới.
- [ ] Bên còn lại nhận thông báo trong web có link tới trang yêu cầu; thông tin liên hệ không còn hiển thị sau khi hủy.
- [ ] Không hủy được claim ở trạng thái khác `ACCEPTED`; bấm lặp lại không đổi dữ liệu, không gửi thông báo trùng.
- [ ] Hủy khi một bên đã xác nhận trả/nhận vẫn hợp lệ và không để tin ở `IN_PROGRESS`.
- [ ] Có migration Drizzle cho `CANCELLED`; dữ liệu cũ không bị ảnh hưởng.
- [ ] Badge/nhãn tiếng Việt "Đã hủy" hiển thị đúng ở trang yêu cầu và "Tin của tôi".
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` đều pass; `/ponytail-review` không còn mục over-engineering.
- [ ] Kiểm tra giao diện bằng Playwright MCP (desktop và 320px), screenshot làm evidence.

## AI Log

### AI-1 — Phân tích hạn chế kẹt `IN_PROGRESS` và lập kế hoạch CHG

- Nhiệm vụ (Task): kiểm tra code thật để xác nhận tin kẹt ở `IN_PROGRESS` và đề xuất cách sửa.
- Công cụ AI (AI Tool): Claude Code (Sonnet 5.5), skill ponytail.
- Đầu vào / Ngữ cảnh (Input/Context): `rules.ts`, `permissions.ts`, `actions.ts`, `handover-actions.ts`, `admin/actions.ts`, `02_requirements_design.md`.
- Kết quả AI (AI Output): xác nhận `IN_PROGRESS` chỉ thoát được sang `RETURNED`/`HIDDEN`; `close` chỉ cho `OPEN`, `delete` chặn `IN_PROGRESS`; claim `ACCEPTED` chỉ sang `COMPLETED`. Đề xuất thao tác "Hủy bàn giao" với trạng thái `CANCELLED` mới.
- Quyết định của nhóm (Human Decision): chờ xác nhận
- Kiểm tra / Xác minh (Verification): đối chiếu trực tiếp các file trên; chưa có thay đổi code.
- Ứng viên đưa vào báo cáo: không

## Bug

Không có.

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|
| TC-032-01 | Unit: `canTransition` với `CANCELLED` | Chỉ `ACCEPTED` → `CANCELLED` hợp lệ; `PENDING`/`REJECTED`/`COMPLETED`/`EXPIRED`/`CANCELLED` → `CANCELLED` bị từ chối | Chưa chạy | Pending | — |
| TC-032-02 | Người nhặt hủy bàn giao | Claim `CANCELLED`, tin `OPEN`, người nhận được thông báo | Chưa chạy | Pending | — |
| TC-032-03 | Người nhận hủy bàn giao | Claim `CANCELLED`, tin `OPEN`, người nhặt được thông báo | Chưa chạy | Pending | — |
| TC-032-04 | Người không liên quan gọi `cancelHandover` | Bị từ chối (forbidden), dữ liệu không đổi | Chưa chạy | Pending | — |
| TC-032-05 | Hủy claim `COMPLETED` hoặc `PENDING` | Bị từ chối, dữ liệu không đổi | Chưa chạy | Pending | — |
| TC-032-06 | Bấm hủy hai lần liên tiếp | Lần hai chỉ báo đã hủy, không thông báo trùng | Chưa chạy | Pending | — |
| TC-032-07 | Một bên đã xác nhận trả/nhận rồi hủy | Hủy được; mốc xác nhận không làm claim thành `COMPLETED` | Chưa chạy | Pending | — |
| TC-032-08 | Sau hủy, người khác gửi yêu cầu mới vào tin | Gửi được; người bị hủy không gửi lại được | Chưa chạy | Pending | — |
| TC-032-09 | Liên hệ sau hủy | Thông tin liên hệ hai bên không còn hiển thị | Chưa chạy | Pending | — |
| TC-032-10 | Giao diện nút hủy ở 320px và desktop | Không tràn ngang, có bước xác nhận, thao tác bằng bàn phím | Chưa chạy | Pending | — |

## Hướng dẫn tự chạy

```
npm run db:generate   # sau khi thêm CANCELLED vào schema, kiểm tra file migration sinh ra
npm run db:migrate
npm run lint
npm run typecheck
npm test
npm run build
npx playwright test   # cần SEED_DEMO_PASSWORD trong .env.local
npm run dev           # xem tay: dùng 2 tài khoản demo, chấp nhận một yêu cầu rồi bấm "Hủy bàn giao" ở trang /claims/<id>
```
