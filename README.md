# UniFound

UniFound là bảng tin đồ thất lạc cho sinh viên UIT: đăng tin **Mất đồ** / **Nhặt được**, nhận gợi ý tin có thể khớp (kèm điểm và lý do), gửi yêu cầu nhận đồ có câu hỏi xác minh riêng tư, hẹn bàn giao và xác nhận **Đã trả**.

URL demo: `TBD` (chưa deploy, xem [CHG-023](docs/01_changes/CHG-023_e2e_deploy_readme.md)).

## Tính năng

- **Tài khoản:** đăng ký/đăng nhập bằng email trường (`ALLOWED_EMAIL_DOMAINS`), xác nhận email qua Supabase Auth, quên/đặt lại mật khẩu qua email, hồ sơ (họ tên, MSSV, trường, liên hệ riêng tư).
- **Tin đăng:** 1–5 ảnh (Supabase Storage), tin Nhặt được có nơi giữ đồ + câu hỏi/đáp án xác minh, tự hết hạn sau 60 ngày; sửa/đóng/xóa tin của mình.
- **Bảng tin:** hai tab, tìm kiếm full-text PostgreSQL, lọc theo danh mục/trường/địa điểm/khoảng ngày, phân trang.
- **Gợi ý phù hợp:** chấm điểm deterministic (địa điểm, trường, thời gian, từ khóa; lưu từ 50 điểm), luôn kèm lý do, nút "Không phải".
- **Nhận đồ & bàn giao:** gửi yêu cầu → người nhặt chấp nhận/từ chối → lộ liên hệ hai bên, đặt điểm hẹn → hai bên xác nhận → Đã trả.
- **Thông báo trong web** cho gợi ý, yêu cầu, kết quả duyệt, lịch hẹn, ẩn tin.
- **Quản trị:** kiểm duyệt báo cáo vi phạm (ẩn tin/bỏ qua), khóa/mở khóa tài khoản, danh mục & địa điểm, thống kê.

## Công nghệ

Next.js 16 (App Router, Server Actions, `proxy.ts`) · React 19 · TypeScript · Tailwind CSS 4 · Zod · Drizzle ORM + PostgreSQL (Supabase) · Supabase Auth (`@supabase/ssr`) · Supabase Storage · lucide-react · Vitest · Playwright · Vercel.

## Cài đặt và chạy

**Yêu cầu:** Node.js 24.x, npm 11.x, một project Supabase.

```bash
git clone <repo-url>
cd unifound
npm ci
cp .env.example .env.local   # điền giá trị thật, KHÔNG commit
npm run db:migrate           # tạo schema, bucket ảnh, policy
npm run db:seed              # trường, danh mục, địa điểm, tài khoản demo, tin mẫu
npm run dev                  # http://localhost:3000
```

Mở bằng `http://localhost:3000` (Next.js 16 chặn tài nguyên dev khi mở qua `127.0.0.1`).

### Biến môi trường

| Biến | Phạm vi | Mục đích |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client + server | Publishable (anon) key |
| `DATABASE_URL` | server | Kết nối Postgres cho Drizzle (transaction pooler) |
| `ALLOWED_EMAIL_DOMAINS` | server | Tên miền email hợp lệ, phân tách bằng dấu phẩy, hiện gồm `gm.uit.edu.vn,uit.edu.vn,hcmut.edu.vn,student.hcmus.edu.vn,hcmussh.edu.vn,student.hcmiu.edu.vn,st.uel.edu.vn`; đặt cùng giá trị trên Vercel |
| `SEED_DEMO_PASSWORD` | chỉ seed/E2E | Mật khẩu chung của tài khoản demo do seed tạo (≥ 8 ký tự) |

Supabase Auth đang bật "Confirm email": đăng ký thật cần bấm link trong mail. Khi dùng với sinh viên thật nên cấu hình Custom SMTP trong Supabase vì dịch vụ mail mặc định giới hạn rất thấp.

### Tài khoản demo

`npm run db:seed` tạo sẵn các tài khoản **hư cấu, đã xác nhận email** (không gửi mail), mật khẩu là giá trị `SEED_DEMO_PASSWORD`:

| Email | Vai trò |
|---|---|
| `unifound.demo1@gm.uit.edu.vn` | Sinh viên (Demo A) |
| `unifound.demo2@gm.uit.edu.vn` | Sinh viên (Demo B) |
| `unifound.demo3@gm.uit.edu.vn` | Sinh viên (Demo C) |
| `unifound.admin@uit.edu.vn` | Quản trị viên |

## Scripts

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` / `npm start` | Build và chạy bản production |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm test` | Unit test (Vitest) |
| `npm run test:e2e` | E2E Playwright (golden path + edge case); tự bật dev server nếu chưa chạy |
| `npm run db:generate` | Sinh migration từ `src/db/schema.ts` |
| `npm run db:migrate` | Áp dụng migration |
| `npm run db:seed` | Nạp dữ liệu demo (chạy lại không trùng) |

E2E cần Chromium của Playwright: `npx playwright install chromium`. Test đăng nhập bằng tài khoản demo nên cần `SEED_DEMO_PASSWORD` trong `.env.local`; mỗi lần chạy tạo thêm vài tin thử trên database đang trỏ tới. Chạy trên bản deploy: `E2E_BASE_URL=https://... npm run test:e2e`.

## Cấu trúc thư mục

```
unifound/
├── src/
│   ├── app/            # Route (S01–S13), loading/error/not-found
│   ├── components/     # ui/ (field, badge, notice…), layout/, reports/, claims/, matching/, admin/
│   ├── lib/            # Logic server: auth, reports, matching, claims, notifications, flags, admin
│   ├── db/             # Drizzle schema, client, migrate, seed
│   ├── utils/supabase/ # Supabase client cho server/trình duyệt
│   └── proxy.ts        # Refresh session + chặn trang cần đăng nhập
├── drizzle/            # Migration SQL có phiên bản
├── tests/e2e/          # Playwright
├── docs/               # Tài liệu dự án, CHG
└── DESIGN.md           # Design system (token, component)
```

Quy trình làm việc và quy ước: [`AGENTS.md`](AGENTS.md), [`docs/00_guides/`](docs/00_guides/).
