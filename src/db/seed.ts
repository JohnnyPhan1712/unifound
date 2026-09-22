import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import fs from "node:fs";
import { users, reports, claims } from "./schema";

// Nạp biến môi trường từ .env.local nếu có
if (fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

/**
 * Seed data phục vụ phát triển cục bộ và kiểm thử luồng MVP
 * Cam kết: Hoàn toàn không chứa dữ liệu cá nhân thật (PII), secret hay thông tin xác minh nhạy cảm thật.
 */

const DEMO_USERS = [
  {
    id: "00000000-0000-4000-a000-000000000001",
    email: "student.a@unifound.demo",
    fullName: "Sinh viên A",
    avatarUrl: null,
  },
  {
    id: "00000000-0000-4000-a000-000000000002",
    email: "student.b@unifound.demo",
    fullName: "Sinh viên B",
    avatarUrl: null,
  },
  {
    id: "00000000-0000-4000-a000-000000000003",
    email: "student.c@unifound.demo",
    fullName: "Sinh viên C",
    avatarUrl: null,
  },
];

function getRelativeDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

const DEMO_REPORTS = [
  {
    id: "10000000-0000-4000-b000-000000000001",
    userId: "00000000-0000-4000-a000-000000000001", // Sinh viên A
    type: "lost" as const,
    title: "Ví da nam màu đen",
    category: "wallet-docs" as const,
    location: "H6" as const,
    eventDate: getRelativeDate(1),
    description: "Ví da gấp đôi màu đen, có ngăn kéo khóa nhỏ. Có thể rơi ở khu bàn đọc tầng 2 thư viện.",
    imageUrl: null,
    status: "open" as const,
  },
  {
    id: "10000000-0000-4000-b000-000000000002",
    userId: "00000000-0000-4000-a000-000000000002", // Sinh viên B
    type: "found" as const,
    title: "Ví da đen nhặt ở thư viện",
    category: "wallet-docs" as const,
    location: "H6" as const,
    eventDate: getRelativeDate(0),
    description: "Nhặt được một chiếc ví gấp màu đen gần dãy bàn sát cửa sổ. Đang được giữ an toàn.",
    imageUrl: null,
    status: "open" as const,
  },
  {
    id: "10000000-0000-4000-b000-000000000003",
    userId: "00000000-0000-4000-a000-000000000001", // Sinh viên A
    type: "lost" as const,
    title: "Tai nghe Sony màu bạc",
    category: "electronics" as const,
    location: "H1" as const,
    eventDate: getRelativeDate(2),
    description: "Hộp sạc màu bạc có ốp silicon trong suốt và một vết xước nhỏ ở cạnh.",
    imageUrl: null,
    status: "open" as const,
  },
  {
    id: "10000000-0000-4000-b000-000000000004",
    userId: "00000000-0000-4000-a000-000000000002", // Sinh viên B
    type: "found" as const,
    title: "Chùm chìa khóa xe máy",
    category: "keys" as const,
    location: "parking" as const,
    eventDate: getRelativeDate(0),
    description: "Chùm chìa khóa có khóa xe máy và thẻ gửi xe, nhặt tại lối đi dãy B.",
    imageUrl: null,
    status: "pending" as const,
  },
  {
    id: "10000000-0000-4000-b000-000000000005",
    userId: "00000000-0000-4000-a000-000000000001", // Sinh viên A
    type: "found" as const,
    title: "Áo khoác đồng phục xanh đen",
    category: "clothing" as const,
    location: "canteen" as const,
    eventDate: getRelativeDate(1),
    description: "Áo khoác size L được để quên trên ghế gần cửa ra vào căn tin.",
    imageUrl: null,
    status: "open" as const,
  },
  {
    id: "10000000-0000-4000-b000-000000000006",
    userId: "00000000-0000-4000-a000-000000000002", // Sinh viên B
    type: "found" as const,
    title: "Máy tính Casio có sticker",
    category: "study" as const,
    location: "H2" as const,
    eventDate: getRelativeDate(5),
    description: "Máy tính màu đen có vài sticker hoạt hình ở mặt sau.",
    imageUrl: null,
    status: "returned" as const,
  },
  {
    id: "10000000-0000-4000-b000-000000000007",
    userId: "00000000-0000-4000-a000-000000000003", // Sinh viên C
    type: "lost" as const,
    title: "Bình giữ nhiệt xanh nhạt",
    category: "other" as const,
    location: "H3" as const,
    eventDate: getRelativeDate(8),
    description: "Bình 500 ml màu xanh nhạt, có quai silicon và sticker hoa nhỏ ở đáy.",
    imageUrl: null,
    status: "closed" as const,
  },
];

const DEMO_CLAIMS = [
  {
    id: "20000000-0000-4000-c000-000000000001",
    reportId: "10000000-0000-4000-b000-000000000004", // Chùm chìa khóa của User B
    claimantId: "00000000-0000-4000-a000-000000000003", // User C gửi yêu cầu nhận
    proof: "Khóa xe có bọc silicon đen bị sứt một góc và thẻ gửi xe có bốn số cuối 2184.",
    status: "pending" as const,
  },
  {
    id: "20000000-0000-4000-c000-000000000002",
    reportId: "10000000-0000-4000-b000-000000000006", // Máy tính Casio của User B
    claimantId: "00000000-0000-4000-a000-000000000001", // User A đã nhận lại thành công
    proof: "Trong nắp trượt có sticker hình mèo máy màu xanh và chữ ký tắt ở góc dưới.",
    status: "accepted" as const,
  },
];

export async function seed() {
  const connectionString = process.env.DATABASE_URL;
  const isPlaceholder =
    !connectionString ||
    connectionString.includes("<") ||
    connectionString.includes(">") ||
    connectionString.includes("[password]");

  if (isPlaceholder) {
    console.warn("\n========================================================");
    console.warn("[SEED WARNING] DATABASE_URL chưa được cấu hình giá trị thực tế!");
    console.warn("Giá trị hiện tại trong .env.local vẫn chứa placeholder (<project-ref>, <password>,...).");
    console.warn("Vui lòng cấu hình DATABASE_URL thực tế trong .env.local để nạp dữ liệu mẫu vào cơ sở dữ liệu.");
    console.warn("========================================================\n");
    return;
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log("[SEED] Bắt đầu nạp dữ liệu mẫu an toàn...");

  try {
    // 1. Seed users
    for (const u of DEMO_USERS) {
      await db.insert(users).values(u).onConflictDoNothing({ target: users.id });
    }
    console.log(`[SEED] Đã tạo ${DEMO_USERS.length} người dùng demo.`);

    // 2. Seed reports
    for (const r of DEMO_REPORTS) {
      await db.insert(reports).values(r).onConflictDoNothing({ target: reports.id });
    }
    console.log(`[SEED] Đã tạo ${DEMO_REPORTS.length} báo cáo Lost/Found demo.`);

    // 3. Seed claims
    for (const c of DEMO_CLAIMS) {
      await db.insert(claims).values(c).onConflictDoNothing({ target: claims.id });
    }
    console.log(`[SEED] Đã tạo ${DEMO_CLAIMS.length} yêu cầu nhận đồ (claims) demo.`);

    console.log("[SEED] Hoàn tất nạp dữ liệu thành công!");
  } catch (error) {
    console.error("[SEED ERROR] Lỗi khi nạp dữ liệu:", error);
    throw error;
  } finally {
    await client.end();
  }
}

// Chạy trực tiếp nếu file được gọi từ CLI
if (require.main === module || process.argv[1]?.includes("seed")) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
