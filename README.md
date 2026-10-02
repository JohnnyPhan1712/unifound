# UniFound

**UniFound — Smart Lost & Found** là bảng tin đồ thất lạc cho sinh viên các trường ĐHQG-HCM khu vực Thủ Đức: đăng tin **Mất đồ** / **Nhặt được**, nhận gợi ý tin có thể khớp (kèm điểm và lý do), gửi yêu cầu nhận đồ có câu hỏi xác minh riêng tư, hẹn bàn giao và xác nhận **Đã trả**.

Mini Project AI-assisted Web Development.

- Live demo: https://unifound-blue.vercel.app/
- Repository: https://github.com/JohnnyPhan1712/unifound

## Thông tin nhóm

| STT | Họ và tên | MSSV | Vai trò |
|---|---|---|---|
| 1 | Phan Ngọc Đức Huy | 24520695 | Trưởng nhóm |
| 2 | Dương Đăng Khang | 24520731 | Thành viên |
| 3 | Đỗ Hữu Phát | 24521290 | Thành viên |
| 4 | Nguyễn Thế Anh | 24520117 | Thành viên |
| 5 | Trần Minh Chiến | 24520219 | Thành viên |
| 6 | Lê Anh Quân | 24521430 | Thành viên |

## Tài liệu

| Nội dung | Đường dẫn |
|---|---|
| Tổng quan, phạm vi, user story | [`docs/02_reports/01_overview.md`](docs/02_reports/01_overview.md) |
| Yêu cầu, UI/UX, kiến trúc, ERD, matching rule | [`docs/02_reports/02_requirements_design.md`](docs/02_reports/02_requirements_design.md) |
| Stack, biến môi trường, quy trình database và triển khai | [`docs/02_reports/03_development.md`](docs/02_reports/03_development.md) |
| Công cụ AI, AI log, so sánh hai AI | [`docs/02_reports/04_ai_development.md`](docs/02_reports/04_ai_development.md) |
| Test case, bug, triển khai và demo | [`docs/02_reports/05_testing_deployment.md`](docs/02_reports/05_testing_deployment.md) |
| Kết quả, đóng góp, bài học | [`docs/02_reports/06_results.md`](docs/02_reports/06_results.md) |
| Nhận diện thương hiệu | [`docs/02_reports/brand_identity.md`](docs/02_reports/brand_identity.md) |
| Thiết kế giao diện | [`DESIGN.md`](DESIGN.md) |

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

**Yêu cầu:** Node.js LTS (dự án phát triển trên Node.js 24), npm đi kèm Node.js, một project Supabase.

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

## Scripts

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy dev server |
| `npm run build` / `npm start` | Build và chạy bản production |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm test` | Unit test (Vitest) |
| `npm run test:e2e` | E2E Playwright (golden path + edge case); tự bật dev server nếu chưa chạy |
| `npm run db:generate` | Sinh migration từ `src/db/schema.ts` |
| `npm run db:migrate` | Áp dụng migration |
| `npm run db:push` | Đồng bộ schema trực tiếp (chỉ dùng khi cần, ưu tiên migration có phiên bản) |
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
├── docs/               # 00_guides (quy trình), 02_reports (báo cáo)
└── DESIGN.md           # Design system (token, component)
```

Quy trình làm việc và quy ước: [`AGENTS.md`](AGENTS.md), [`docs/00_guides/`](docs/00_guides/).
