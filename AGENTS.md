<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Hướng dẫn cho AI Agent — UniFound

UniFound (Smart Lost & Found) là Mini Project web: Next.js, TypeScript, Supabase, Drizzle. Tài liệu và giao diện viết tiếng Việt; tên kỹ thuật dùng tiếng Anh không dấu. Trả lời người dùng bằng tiếng Việt.

## Tài liệu cần biết

| Cần gì | Đọc |
|---|---|
| **Bắt buộc đọc trước khi viết code/commit** (git, đặt tên, viết mã) | `docs/00_guides/code_conventions.md` |
| Tạo và thực hiện task/CHG, ghi log | `docs/00_guides/changes_workflow.md` |
| Lệnh git thực tế | `docs/00_guides/git_workflow.md` |
| Danh sách CHG và số CHG tiếp theo | `docs/01_changes/README.md` |
| Tra cứu báo cáo mà không đọc hết | `docs/02_reports/README.md` (mục lục) |
| Lệnh chạy, test, biến môi trường | `docs/02_reports/03_development.md` |
| Thiết kế UI/UX (nền Airbnb, chỉ đổi branding cho UniFound) | DESIGN.md |
| Tham khảo nghiệp vụ | [iLost](https://ilost.co/) |

## Công cụ UI (skill/MCP đã cài)

Nếu có task liên quan giao diện, dùng:

- **impeccable**: thiết kế/refine/review UI → luôn đọc `DESIGN.md` trước, giữ nền Airbnb, chỉ đổi branding UniFound; không tự sinh lại DESIGN.md nếu chưa được yêu cầu.
- **taste-skill**: nâng chất lượng thẩm mỹ (layout, typography, spacing) → không được lệch khỏi `DESIGN.md`.
- **Playwright MCP**: kiểm tra golden path + edge case UI trước khi báo xong (chạy app bằng `npm run dev`, chụp screenshot làm evidence ghi vào CHG).

Quy tắc: khi ghi `AI Tool` ở CHG, ghi đúng tên skill/MCP đã dùng; không đưa dữ liệu cá nhân thật vào ảnh chụp/log.

## Khi được giao thực hiện một task

1. Nếu người dùng chưa tạo CHG (hoặc chỉ đưa prompt yêu cầu làm luôn): tự tạo CHG trước khi code, theo template trong `changes_workflow.md`, số lấy từ `docs/01_changes/README.md`, rồi thêm dòng vào bảng ở README đó.
2. Chỉ làm trong phạm vi CHG; xử lý dependency theo `changes_workflow.md`.
3. Ghi AI Log, Bug, Test case vào CHG ngay khi phát sinh (mẫu ở template CHG).
4. Trước khi báo xong: chạy `npm run typecheck`, `npm test`, `npm run build`; cập nhật acceptance criteria và evidence trong CHG. Nếu có thay đổi UI, kiểm tra bằng Playwright MCP.
5. Không tự chuyển CHG sang `done`.

## Ghi log trung thực

- Không bịa AI Log, Verification hoặc kết quả test; chỉ ghi điều đã thực sự xảy ra và đã chạy.
- `Human Decision` (Accepted/Modified/Rejected) là quyết định của người dùng: chỉ đề xuất, ghi "chờ xác nhận" nếu chưa biết.
- `AI Tool` ghi đúng công cụ/model đang dùng.

## Khi được yêu cầu tổng hợp log cho báo cáo

Đọc các CHG rồi cập nhật `docs/02_reports/04_ai_development.md` và `docs/02_reports/05_testing_deployment.md` theo mục "Hỗ trợ người quản lý docs chọn log để báo cáo" trong `changes_workflow.md`. Chỉ chép log có thật, giữ nguyên Human Decision, ghi rõ CHG nguồn, chọn khoảng 5–10 AI log.

## Quy tắc chung

- Trạng thái trong docs/CHG có thể lạc hậu (người dùng tự kiểm tra lại): không dựa vào đó để kết luận việc đã xong; kiểm tra code thật.
- Không sửa `docs/00_guides/` và `docs/02_reports/` trừ khi được yêu cầu (ngoại lệ duy nhất: 04 và 05 khi được yêu cầu tổng hợp log).
- Không commit, push hoặc tạo PR trừ khi được yêu cầu. Không force push lên `main`, không `git reset --hard`. Branch và commit theo `code_conventions.md`.
- Không đưa secret, file `.env` hoặc dữ liệu cá nhân thật vào code, prompt hay log.
- Không tự ý sử dụng thư mục docs\02_reports\assets làm hướng dẫn thực hiện, trừ khi được yêu cầu tham khảo làm ngữ cảnh hoặc tài liệu hướng dẫn.
