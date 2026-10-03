import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db, schools } from "@/db";
import { ProfileForm } from "@/components/auth/profile-form";
import { Notice } from "@/components/ui/notice";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Hồ sơ" };

export default async function ProfilePage({ searchParams }: PageProps<"/profile">) {
  const user = await requireUser();
  const { welcome } = await searchParams;
  const schoolList = await db.select({ id: schools.id, name: schools.name }).from(schools).orderBy(asc(schools.name));

  return (
    <div className="mx-auto w-full max-w-[760px] pb-8 pt-10">
      <h1 className="mb-1">Hồ sơ cá nhân</h1>
      <p className="mb-6 text-muted">
        Đăng nhập bằng <span className="font-semibold text-ink">{user.email}</span>
        {user.role === "ADMIN" && " · Quản trị viên"}
      </p>
      {welcome && (
        <div className="mb-4">
          <Notice tone="success">Tạo tài khoản thành công. Bổ sung MSSV và thông tin liên hệ để người nhặt đồ liên lạc được với bạn.</Notice>
        </div>
      )}
      <div className="panel sm:p-8">
        <ProfileForm
          schools={schoolList}
          profile={{
            fullName: user.fullName ?? "",
            studentCode: user.studentCode ?? "",
            schoolId: user.schoolId ?? "",
            contactInfo: user.contactInfo ?? "",
          }}
        />
      </div>
    </div>
  );
}
