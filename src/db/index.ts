import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

// Singleton connection để tránh tạo nhiều connection pools khi dev hot-reload (HMR)
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn =
  globalForDb.conn ??
  (connectionString
    ? postgres(connectionString, {
        prepare: false, // Tương thích với Supabase transaction pooler
      })
    : undefined);

if (process.env.NODE_ENV !== "production" && conn) {
  globalForDb.conn = conn;
}

/**
 * Drizzle Database Client instance
 * Nếu DATABASE_URL chưa được cấu hình (ví dụ khi chạy build tĩnh), proxy sẽ đưa ra thông báo rõ ràng
 * thay vì làm crash quá trình import module.
 */
export const db = conn
  ? drizzle(conn, { schema })
  : (new Proxy(
      {},
      {
        get(_target, prop) {
          throw new Error(
            `DATABASE_URL chưa được cấu hình. Không thể thực hiện thao tác database '${String(
              prop
            )}'. Vui lòng cấu hình DATABASE_URL trong .env.local hoặc biến môi trường.`
          );
        },
      }
    ) as ReturnType<typeof drizzle<typeof schema>>);

export * from "./schema";
