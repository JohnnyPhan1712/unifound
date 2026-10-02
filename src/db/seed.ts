import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import fs from "node:fs";
import * as schema from "./schema";
import { expiresAtFrom } from "../lib/reports/expiry";

// Dữ liệu demo hư cấu: không có PII hay thông tin xác minh thật.

if (fs.existsSync(".env.local")) process.loadEnvFile(".env.local");
else if (fs.existsSync(".env")) process.loadEnvFile(".env");

const { schools, categories, locations, users, reports } = schema;

const SCHOOLS = [
  { code: "UIT", name: "Trường ĐH Công nghệ Thông tin", emailDomain: "gm.uit.edu.vn" },
  { code: "HCMUS", name: "Trường ĐH Khoa học Tự nhiên", emailDomain: "student.hcmus.edu.vn" },
  { code: "HCMUT", name: "Trường ĐH Bách khoa", emailDomain: "hcmut.edu.vn" },
  { code: "USSH", name: "Trường ĐH Khoa học Xã hội và Nhân văn", emailDomain: "hcmussh.edu.vn" },
  { code: "IU", name: "Trường ĐH Quốc tế", emailDomain: "student.hcmiu.edu.vn" },
  { code: "UEL", name: "Trường ĐH Kinh tế - Luật", emailDomain: "st.uel.edu.vn" },
];

const CATEGORIES = [
  "Ví / giấy tờ",
  "Thẻ sinh viên",
  "Điện thoại",
  "Laptop / máy tính bảng",
  "Tai nghe / phụ kiện điện tử",
  "Chìa khóa",
  "Bình nước",
  "Sách / tài liệu",
  "Quần áo / phụ kiện",
  "Khác",
];

// [tên, loại, mã trường | null nếu dùng chung]
const LOCATIONS: [string, string, string | null][] = [
  ["Tòa A", "Phòng học", "UIT"],
  ["Tòa B", "Phòng học", "UIT"],
  ["Tòa C", "Phòng học", "UIT"],
  ["Tòa E", "Phòng học", "UIT"],
  ["Thư viện UIT", "Thư viện", "UIT"],
  ["Căng tin UIT", "Căng tin", "UIT"],
  ["Nhà xe UIT", "Nhà xe", "UIT"],
  ["Sân thể thao UIT", "Sân thể thao", "UIT"],
  ["Phòng bảo vệ cổng UIT", "Điểm bảo vệ", "UIT"],
  ["Thư viện KHTN Linh Trung", "Thư viện", "HCMUS"],
  ["KTX khu A ĐHQG", "KTX", null],
  ["KTX khu B ĐHQG", "KTX", null],
  ["Nhà văn hóa Sinh viên", "Khác", null],
];

// Tài khoản demo đã xác nhận email sẵn (không gửi mail); mật khẩu lấy từ SEED_DEMO_PASSWORD.
const DEMO_USERS = [
  { key: "a", email: "unifound.demo1@gm.uit.edu.vn", fullName: "Sinh viên Demo A", studentCode: "20000001", contact: "Zalo demo 0900 000 001", role: "USER" as const },
  { key: "b", email: "unifound.demo2@gm.uit.edu.vn", fullName: "Sinh viên Demo B", studentCode: "20000002", contact: "Zalo demo 0900 000 002", role: "USER" as const },
  { key: "c", email: "unifound.demo3@gm.uit.edu.vn", fullName: "Sinh viên Demo C", studentCode: "20000003", contact: "Zalo demo 0900 000 003", role: "USER" as const },
  { key: "admin", email: "unifound.admin@uit.edu.vn", fullName: "Quản trị Demo", studentCode: null, contact: null, role: "ADMIN" as const },
];

type SeedReport = {
  id: string;
  owner: string;
  type: "LOST" | "FOUND";
  title: string;
  category: string;
  location: string;
  description: string;
  daysAgo: number;
  keepingPlace?: string;
  verifyQuestion?: string;
  verifyAnswer?: string;
};

// id cố định để chạy seed nhiều lần không tạo trùng
const REPORTS: SeedReport[] = [
  { id: "5eed0000-0000-4000-8000-000000000001", owner: "a", type: "LOST", title: "Mất ví da màu nâu", category: "Ví / giấy tờ", location: "Căng tin UIT", description: "Ví da nâu gập đôi, bên trong có thẻ sinh viên và ít tiền mặt. Có thể rơi lúc ăn trưa.", daysAgo: 2 },
  { id: "5eed0000-0000-4000-8000-000000000002", owner: "b", type: "FOUND", title: "Nhặt được thẻ sinh viên", category: "Thẻ sinh viên", location: "Thư viện UIT", description: "Thẻ sinh viên UIT để quên ở bàn tầng 2 thư viện.", daysAgo: 1, keepingPlace: "Quầy thủ thư tầng 1", verifyQuestion: "Họ tên in trên thẻ bắt đầu bằng chữ gì?", verifyAnswer: "Chữ T (dữ liệu demo)" },
  { id: "5eed0000-0000-4000-8000-000000000003", owner: "c", type: "LOST", title: "Rơi tai nghe không dây màu trắng", category: "Tai nghe / phụ kiện điện tử", location: "Tòa B", description: "Hộp tai nghe trắng, có dán sticker hình con mèo. Rơi trong phòng B1.12 sau giờ học.", daysAgo: 3 },
  { id: "5eed0000-0000-4000-8000-000000000004", owner: "b", type: "FOUND", title: "Nhặt được chùm chìa khóa xe", category: "Chìa khóa", location: "Nhà xe UIT", description: "Chùm 3 chìa khóa có móc khóa hình gấu bông xanh, rơi gần cổng nhà xe.", daysAgo: 4, keepingPlace: "Phòng bảo vệ cổng UIT", verifyQuestion: "Móc khóa hình gì và màu gì?", verifyAnswer: "Gấu bông xanh (dữ liệu demo)" },
  { id: "5eed0000-0000-4000-8000-000000000005", owner: "a", type: "LOST", title: "Quên bình nước giữ nhiệt", category: "Bình nước", location: "Sân thể thao UIT", description: "Bình giữ nhiệt màu đen 500ml, nắp bị trầy. Quên sau buổi đá bóng chiều.", daysAgo: 6 },
  { id: "5eed0000-0000-4000-8000-000000000006", owner: "c", type: "FOUND", title: "Nhặt được sách Giải tích 1", category: "Sách / tài liệu", location: "Tòa A", description: "Sách Giải tích 1 có ghi chú bút chì, để quên trong phòng A2.04.", daysAgo: 5, keepingPlace: "Đang giữ, hẹn gặp ở sảnh tòa A", verifyQuestion: "Trang bìa trong có ghi gì?", verifyAnswer: "Tên lớp (dữ liệu demo)" },
  { id: "5eed0000-0000-4000-8000-000000000007", owner: "b", type: "LOST", title: "Mất điện thoại ốp lưng xanh", category: "Điện thoại", location: "KTX khu A ĐHQG", description: "Điện thoại ốp lưng silicon xanh dương, màn hình có vết nứt nhỏ góc trên.", daysAgo: 8 },
  { id: "5eed0000-0000-4000-8000-000000000008", owner: "a", type: "FOUND", title: "Nhặt được áo khoác đồng phục", category: "Quần áo / phụ kiện", location: "Tòa E", description: "Áo khoác đồng phục khoa, size M, để trên ghế hành lang tầng 3.", daysAgo: 9, keepingPlace: "Văn phòng khoa tầng 1 tòa E", verifyQuestion: "Trong túi áo có gì?", verifyAnswer: "Một cây bút (dữ liệu demo)" },
];

async function upsertAuthUser(db: ReturnType<typeof drizzle>, email: string, password: string): Promise<string> {
  const found = await db.execute<{ id: string }>(sql`select id from auth.users where email = ${email}`);
  if (found[0]) return found[0].id;
  // Cùng cấu trúc bản ghi mà Supabase Auth tạo khi đăng ký; các token để chuỗi rỗng vì GoTrue không nhận NULL.
  const rows = await db.execute<{ id: string }>(sql`
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change)
    values ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', ${email},
      extensions.crypt(${password}, extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
    returning id`);
  const id = rows[0].id;
  await db.execute(sql`
    insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (${id}, ${id}, ${JSON.stringify({ sub: id, email, email_verified: true })}::jsonb, 'email', now(), now(), now())`);
  return id;
}

async function main() {
  const url = process.env.DATABASE_URL;
  const password = process.env.SEED_DEMO_PASSWORD;
  if (!url) throw new Error("Thiếu DATABASE_URL trong .env.local");
  if (!password || password.length < 8) throw new Error("Thiếu SEED_DEMO_PASSWORD (tối thiểu 8 ký tự) trong .env.local");

  const conn = postgres(url, { max: 1, prepare: false });
  const db = drizzle(conn, { schema });

  try {
    for (const s of SCHOOLS) {
      await db.insert(schools).values(s).onConflictDoUpdate({ target: schools.code, set: { name: s.name, emailDomain: s.emailDomain } });
    }
    const schoolRows = await db.select().from(schools);
    const schoolId = (code: string | null) => (code ? schoolRows.find((s) => s.code === code)!.id : null);

    for (const name of CATEGORIES) await db.insert(categories).values({ name }).onConflictDoNothing();
    for (const [name, type, code] of LOCATIONS) {
      await db.insert(locations).values({ name, type, schoolId: schoolId(code) }).onConflictDoNothing();
    }
    const categoryRows = await db.select().from(categories);
    const locationRows = await db.select().from(locations);

    const userIds: Record<string, string> = {};
    for (const u of DEMO_USERS) {
      const id = await upsertAuthUser(db, u.email, password);
      userIds[u.key] = id;
      const profile = {
        fullName: u.fullName,
        studentCode: u.studentCode,
        contactInfo: u.contact,
        role: u.role,
        schoolId: u.email.endsWith("@gm.uit.edu.vn") ? schoolId("UIT") : null,
      };
      await db.insert(users).values({ id, email: u.email, ...profile }).onConflictDoUpdate({ target: users.id, set: profile });
    }

    const now = Date.now();
    for (const r of REPORTS) {
      const createdAt = new Date(now - r.daysAgo * 86_400_000);
      await db
        .insert(reports)
        .values({
          id: r.id,
          userId: userIds[r.owner],
          type: r.type,
          title: r.title,
          description: r.description,
          categoryId: categoryRows.find((c) => c.name === r.category)!.id,
          locationId: locationRows.find((l) => l.name === r.location)!.id,
          eventTime: new Date(createdAt.getTime() - 3 * 3_600_000),
          keepingPlace: r.keepingPlace ?? null,
          verifyQuestion: r.verifyQuestion ?? null,
          verifyAnswer: r.verifyAnswer ?? null,
          createdAt,
          expiresAt: expiresAtFrom(createdAt),
        })
        .onConflictDoNothing();
    }

    const counts = await db.execute(sql`select
      (select count(*) from schools) schools, (select count(*) from categories) categories,
      (select count(*) from locations) locations, (select count(*) from users) users, (select count(*) from reports) reports`);
    console.log("[SEED] Xong:", counts[0]);
    console.log("[SEED] Tài khoản demo:", DEMO_USERS.map((u) => `${u.email} (${u.role})`).join(", "));
  } finally {
    await conn.end();
  }
}

main().catch((error) => {
  console.error("[SEED ERROR]", error);
  process.exit(1);
});
