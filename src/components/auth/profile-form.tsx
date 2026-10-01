"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";
import { updateProfile } from "@/lib/auth/actions";
import { Input, Select } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";

type Profile = { fullName: string; studentCode: string; schoolId: string; contactInfo: string };

export function ProfileForm({ profile, schools }: { profile: Profile; schools: { id: string; name: string }[] }) {
  const [state, action] = useActionState(updateProfile, {});
  const v = { ...profile, ...state.values };
  const e = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <ActionMessage state={state} />
      <Input label="Họ và tên" name="fullName" autoComplete="name" defaultValue={v.fullName} error={e.fullName} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="MSSV"
          name="studentCode"
          inputMode="numeric"
          placeholder="23520001"
          defaultValue={v.studentCode}
          error={e.studentCode}
        />
        <Select label="Trường" name="schoolId" defaultValue={v.schoolId} error={e.schoolId}>
          <option value="">Chưa chọn</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>
      <Input
        label="Liên hệ (Zalo hoặc SĐT)"
        name="contactInfo"
        placeholder="Zalo 09xx xxx xxx"
        defaultValue={v.contactInfo}
        error={e.contactInfo}
        hint={
          <span className="inline-flex items-center gap-1">
            <LockKeyhole className="size-3.5" aria-hidden />
            Riêng tư: chỉ hiện cho người bạn đã chấp nhận yêu cầu nhận đồ.
          </span>
        }
      />
      <div>
        <SubmitButton pendingText="Đang lưu…">Lưu hồ sơ</SubmitButton>
      </div>
    </form>
  );
}
