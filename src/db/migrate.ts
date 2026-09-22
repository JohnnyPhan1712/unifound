import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import fs from "node:fs";

// Nạp biến môi trường từ .env.local nếu có
if (fs.existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (fs.existsSync(".env")) {
  process.loadEnvFile(".env");
}

export async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  const isPlaceholder =
    !connectionString ||
    connectionString.includes("<") ||
    connectionString.includes(">") ||
    connectionString.includes("[password]");

  if (isPlaceholder) {
    console.error("\n========================================================");
    console.error("[MIGRATE ERROR] DATABASE_URL chưa được cấu hình giá trị thực tế!");
    console.error("Giá trị hiện tại trong .env.local vẫn chứa placeholder (<project-ref>, <password>,...).");
    console.error("Vui lòng thay thế bằng chuỗi kết nối thực tế từ Supabase Dashboard > Project Settings > Database.");
    console.error("Ví dụ: postgresql://postgres.abcdefgh:MySecretPassword@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres");
    console.error("========================================================\n");
    process.exit(1);
  }

  console.log("[MIGRATE] Đang kết nối tới cơ sở dữ liệu PostgreSQL...");
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  try {
    console.log("[MIGRATE] Đang áp dụng các migration từ thư mục ./drizzle ...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("[MIGRATE] Áp dụng migration thành công 100%! Cơ sở dữ liệu đã sẵn sàng.");
  } catch (error) {
    console.error("[MIGRATE ERROR] Có lỗi xảy ra trong quá trình migration:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

if (require.main === module || process.argv[1]?.includes("migrate")) {
  runMigration()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
