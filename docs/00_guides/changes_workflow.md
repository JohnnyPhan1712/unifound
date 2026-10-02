# Quy trình quản lý thay đổi

CHG ghi lại lý do, phạm vi, quyết định và việc kiểm tra của một công việc đáng kể. **Một CHG tương ứng một Task**, không tương ứng máy móc với từng file hoặc từng commit.

Một CHG có thể có nhiều commit, nhưng chỉ có một người phụ trách cuối cùng. CHG đồng thời là **nhật ký bằng chứng của Task** — nơi ghi AI Development Log, bug discovery và test case của người làm.

## Khi cần CHG

Tạo CHG cho tài liệu nền tảng, quyết định kỹ thuật, kiến trúc, schema/API, luồng nghiệp vụ, feature, tích hợp, kiểm thử release hoặc deployment. Không cần CHG riêng cho typo hay format nhỏ; ghi cùng công việc đang làm.

## Tạo Task mới

1. Lấy số CHG tiếp theo từ `docs/01_changes/README.md` (hiện là `CHG-NNN`).
2. Copy template ở cuối tài liệu này, điền thông tin cần thiết.
3. Thêm dòng vào bảng CHG trong `docs/01_changes/README.md`.

Người tạo CHG ghi rõ **Người phụ trách** (người làm) sau khi thống nhất.

> Các CHG-001 → CHG-011 theo quy trình cũ, không còn áp dụng; không dùng chúng làm mẫu.

### Hai cách tạo CHG

- **Nhóm trưởng tạo để giao việc:** CHG ở `proposed`. Nhóm trưởng xem từng CHG, chỉnh nếu cần rồi tự chuyển `approved` hoặc nhờ agent chuyển hàng loạt. Người phụ trách làm theo checklist "Trước khi làm" bên dưới.
- **Agent tạo khi được nhờ sửa file project (liên quan tech stack):** CHG đóng vai trò plan để người dùng xem trước. Sau khi người dùng bảo bắt đầu, agent tự làm luôn, tự cập nhật trạng thái (`approved` → `in_progress`) và khi xong chuyển `in_review`, không tự chuyển `done`. Trong lúc tạo CHG dạng plan, agent không hỏi lại và không sửa docs ngoài CHG và README của CHG.

### Ngoại lệ: một người làm chuỗi CHG liên tiếp

Khi nhóm trưởng giao một chuỗi CHG liên tiếp cho đúng một người (hiện là CHG-014 → CHG-023), được phép không tạo branch riêng mà commit/push thẳng vào `main`. Ngoại lệ này phải được ghi ở trường `Branch` của từng CHG và không áp dụng cho CHG khác nếu nhóm trưởng chưa cho phép. Vẫn không force push lên `main`.

## Trước khi làm (Definition of Ready)

Checklist cho người phụ trách trước khi chuyển `in_progress`:

- [ ] Đã đọc `File/tài liệu cần đọc trước khi thực hiện` và guide liên quan.
- [ ] Người tạo CHG tự xác nhận status thành `approved`.
- [ ] Đã tạo branch từ `main` theo tên `<loại>/<CHG>-<slug>` (vd: `feat/CHG-011-claim-flow`), trừ ngoại lệ ở mục "Tạo Task mới".
- [ ] Đã cập nhật trạng thái CHG thành `in_progress` và ghi Branch, ngày bắt đầu.

## Định danh và trạng thái

- File: `CHG-NNN_lower_snake_case.md`.
- Lấy số tiếp theo từ `docs/01_changes/README.md`; không tái sử dụng ID.
- Trạng thái: `proposed` → `approved` → `in_progress` → `in_review` → `done`; dùng `waiting_for_integration` khi phần độc lập đã xong nhưng còn chờ dependency, `blocked` khi không thể tiếp tục và `rejected` khi bị hủy.

## Phân công và tránh xung đột

- Mỗi Task/CHG có một `Owner` chịu trách nhiệm về phạm vi, review và đóng công việc. 
- Trước khi chuyển sang `in_progress`, phải khai báo các file/module dự kiến sửa, reviewer, dependency và các Task có thể chạm cùng khu vực.
- Không để hai Task đồng thời sửa cùng migration, schema, cấu hình hoặc cùng một vùng tài liệu trung tâm nếu chưa thống nhất thứ tự thực hiện.
- Nếu hai Task bắt buộc dùng chung file, chia rõ vùng sở hữu hoặc tạo một Task tích hợp; dependency phải được ghi trong CHG.
- Không format, đổi tên hoặc refactor ngoài phạm vi vì việc đó làm tăng diện tích conflict và khó review.

## Trong khi làm — Ghi log

Ghi log ngay trong CHG của Task khi vừa xảy ra; không ghi giả lệnh hay thêm dòng phụ. Log là append-only; nếu sửa quyết định, thêm dòng "Cập nhật <ngày>" thay vì xoá.

### AI Log

Ghi khi dùng AI cho việc có ý nghĩa: yêu cầu, UI/UX, kiến trúc, chức năng, code, test case hoặc phương án sửa lỗi. Ví dụ:
- Prompt AI để thiết kế component.
- Output AI sai/thiếu → bạn sửa lại hoặc từ chối.
- Output AI được chấp nhận sau khi xác minh.

Bỏ qua: câu hỏi cú pháp, dịch, sửa chính tả. Không đưa secret hoặc dữ liệu cá nhân nhạy cảm vào prompt/log.

Dùng mẫu 6 trường (ở template cuối file).

### Bug

Khi gặp và sửa bug đáng kể (không phải typo), ghi đủ 7 trường: Biểu hiện, Các bước tái hiện, Kết quả mong đợi/thực tế, Nguyên nhân gốc, Fix, Verification, Commit/issue.

### Test case

Khi viết/chạy test, thêm dòng vào bảng: test name, kết quả mong đợi, trạng thái (Passed/Failed/Pending), evidence (file test, commit).

## Quy tắc cho AI khi xử lý dependency

- AI chỉ thực hiện phạm vi của CHG hiện tại; không tự làm thay scope của CHG khác.
- Dependency không nhất thiết ngăn việc bắt đầu. AI có thể làm phần độc lập, unit test, mock hoặc interface đã thống nhất.
- AI không được tự sửa schema, auth helper, component hoặc module thuộc ownership của CHG khác để hoàn tất công việc của mình.
- Khi dependency chưa sẵn sàng, AI phải ghi rõ trong CHG:
	- `Đang chờ`: CHG nào;
	- `Đã hoàn thành`: phần độc lập nào;
	- `Chưa thể tích hợp`: phần nào;
	- `Điều kiện tiếp tục`: contract, merge hoặc evidence cần có.
- Dùng `waiting_for_integration` khi phần độc lập đã hoàn thành và chỉ còn chờ ghép với dependency. Dùng `blocked` khi dependency hoặc quyết định còn thiếu khiến không thể tiếp tục phần đang làm.
- Không chuyển `done` chỉ vì code cục bộ đã chạy; `done` yêu cầu acceptance criteria, integration, test, review, merge và evidence đầy đủ.

## Sau khi làm, trước `done` (Definition of Done)

Checklist cho reviewer/người tạo CHG trước khi chuyển `done`:

- [ ] Acceptance criteria đều đạt, bằng chứng kiểm tra (test, UI, log, evidence) đã ghi trong CHG.
- [ ] Đã ghi log phát sinh (AI Log, Bug, Test case) trong CHG; nếu không có ghi "Không có".
- [ ] Branch đã cập nhật từ `main`, conflict đã được xử lý.
- [ ] Code đã merge vào `main`.
- [ ] Đã cập nhật dòng CHG trong `docs/01_changes/README.md` (Branch, PR, Commit sau merge).
- [ ] Đã ghi Commit sau merge trong CHG.

## Quy trình tổng quát

1. **Tạo Task mới** (mục "Tạo Task mới" ở trên). 
2. **Trước khi làm**: checklist "Trước khi làm" ở trên. 
3. **Thực hiện**: làm theo phạm vi CHG, ghi log ngay khi phát sinh (mục "Trong khi làm" ở trên).
4. **Nếu có dependency**: làm phần độc lập trước, ghi rõ phần chờ, dùng `waiting_for_integration` hoặc `blocked` thay vì mở rộng sang CHG khác.
5. **Chạy kiểm tra**: test, sửa bug nếu cần, ghi bằng chứng trong CHG.
6. **Reviewer duyệt**: reviewer kiểm tra log/test/bug/acceptance criteria, cấp xác nhận, merge PR.
7. **Hoàn tất**: checklist "Definition of Done" ở trên, chuyển CHG sang `done`. 

## Hỗ trợ người quản lý docs chọn log để báo cáo

Team Lead (Huy) đọc phần log trong các CHG `done`, chọn ~5–10 AI log tốt nhất để chép vào `docs/02_reports/04_ai_development.md`, tương tự bug/test sang `docs/02_reports/05_testing_deployment.md`. Nhắc nhở kiểm tra:

- [ ] >= 1 AI output được đánh giá có chủ đích: sai/thiếu → `Modified`/`Rejected`, hoặc `Accepted` kèm giải thích + evidence xác minh.
- [ ] >= 2 output/quyết định quan trọng có AI hỗ trợ (yêu cầu, UI/UX, kiến trúc, chức năng, code, test case, phương án sửa lỗi) có phần `Giải thích` rõ.
- [ ] Mỗi log được chọn ghi rõ CHG/Owner nguồn.

## Template CHG

```markdown
# CHG-NNN: Tên công việc

- ID: `CHG-NNN`
- Trạng thái: `proposed`
- Ngày tạo: `YYYY-MM-DD`
- Người phụ trách: `chưa phân công`
- Dependency: `không có`
- File/module dự kiến sửa/tạo: `chưa xác định`
- Branch: 

## Kết quả người dùng

[1-2 câu mô tả kết quả người dùng thấy]

## Phạm vi

### Bao gồm

### Các lưu ý (Tránh người dùng/agent hiểu nhầm task) (Có thể cần ghi hoặc không)

## File/tài liệu cần đọc trước khi thực hiện

## Acceptance criteria

- [ ]

## AI Log

### AI-1 — <tên nhiệm vụ>

- Nhiệm vụ (Task): 
- Công cụ AI (AI Tool): 
- Đầu vào / Ngữ cảnh (Input/Context): 
- Kết quả AI (AI Output): 
- Quyết định của nhóm (Human Decision): `Accepted` | `Modified` | `Rejected` — lý do
- Kiểm tra / Xác minh (Verification): phương pháp + bằng chứng
- Ứng viên đưa vào báo cáo: có | không

## Bug

### BUG-1 — <tên>

- Biểu hiện: 
- Các bước tái hiện: 
- Kết quả mong đợi / thực tế: 
- Nguyên nhân gốc: 
- Fix: 
- Verification: 
- Commit/issue: 

## Test case

| ID | Test | Kết quả mong đợi | Kết quả thực tế | Trạng thái | Evidence |
|---|---|---|---|---|---|

## Hướng dẫn tự chạy

```
