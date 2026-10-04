"use client";

import { useActionState } from "react";
import { CalendarCheck, PackageCheck, XCircle } from "lucide-react";
import { cancelHandover, confirmHandover, setMeeting } from "@/lib/claims/handover-actions";
import { Input, Select } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";
import type { CatalogOption } from "@/components/reports/report-form";

export function MeetingForm({
  id,
  locations,
  minDateTime,
  initial,
}: {
  id: string;
  locations: CatalogOption[];
  minDateTime: string;
  initial: { meetLocationId?: string; meetTime?: string };
}) {
  const [state, action] = useActionState(setMeeting, {});
  const v = { ...initial, ...state.values };
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <ActionMessage state={state} />
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Điểm hẹn" name="meetLocationId" defaultValue={v.meetLocationId ?? ""} error={e.meetLocationId} required>
          <option value="" disabled>
            Chọn địa điểm
          </option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </Select>
        <Input label="Giờ hẹn" name="meetTime" type="datetime-local" min={minDateTime} defaultValue={v.meetTime} error={e.meetTime} required />
      </div>
      <div>
        <SubmitButton className="btn btn-secondary" pendingText="Đang lưu…">
          <CalendarCheck className="size-4" aria-hidden />
          {initial.meetLocationId ? "Đổi lịch hẹn" : "Lưu lịch hẹn"}
        </SubmitButton>
      </div>
    </form>
  );
}

export function CancelHandoverButton({ id }: { id: string }) {
  const [state, action] = useActionState(cancelHandover, {});
  return (
    <form
      action={action}
      className="flex flex-col gap-2"
      onSubmit={(e) => !confirm("Hủy bàn giao? Yêu cầu sẽ bị đóng, tin quay về Đang mở và bạn không thể gửi lại yêu cầu cho tin này.") && e.preventDefault()}
    >
      <ActionMessage state={state} />
      <input type="hidden" name="id" value={id} />
      <div>
        <SubmitButton className="btn btn-secondary" pendingText="Đang hủy…">
          <XCircle className="size-4" aria-hidden />
          Hủy bàn giao
        </SubmitButton>
      </div>
    </form>
  );
}

export function ConfirmHandoverButton({ id, label }: { id: string; label: string }) {
  const [state, action] = useActionState(confirmHandover, {});
  return (
    <form
      action={action}
      className="flex flex-col gap-2"
      onSubmit={(e) => !confirm(`${label}? Chỉ bấm khi việc bàn giao đã thật sự diễn ra.`) && e.preventDefault()}
    >
      <ActionMessage state={state} />
      <input type="hidden" name="id" value={id} />
      <div>
        <SubmitButton pendingText="Đang xác nhận…">
          <PackageCheck className="size-4" aria-hidden />
          {label}
        </SubmitButton>
      </div>
    </form>
  );
}
