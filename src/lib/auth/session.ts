import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schools, users, type User } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { emailDomain } from "./email";

/** Tạo bản ghi users (role USER) cho tài khoản Supabase Auth nếu chưa có; gán trường theo tên miền email. */
export async function ensureUserRow(id: string, email: string): Promise<User> {
  const [existing] = await db.select().from(users).where(eq(users.id, id));
  if (existing) return existing;

  const [school] = await db
    .select({ id: schools.id })
    .from(schools)
    .where(eq(schools.emailDomain, emailDomain(email)));
  await db
    .insert(users)
    .values({ id, email: email.toLowerCase(), schoolId: school?.id ?? null })
    .onConflictDoNothing();
  const [row] = await db.select().from(users).where(eq(users.id, id));
  return row;
}

/** User đang đăng nhập (kể cả bị khóa). Gọi nhiều lần trong một request chỉ truy vấn một lần. */
export const getSessionUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub || typeof claims.email !== "string") return null;
  return ensureUserRow(claims.sub, claims.email);
});

/** User đang đăng nhập và không bị khóa; tài khoản khóa được coi như khách. */
export async function getCurrentUser(): Promise<User | null> {
  const user = await getSessionUser();
  return user?.status === "active" ? user : null;
}

export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.status === "locked") redirect("/login?error=locked");
  return user;
}

export function isAdmin(user: Pick<User, "role" | "status"> | null): boolean {
  return user?.role === "ADMIN" && user.status === "active";
}
