"use client";

import { useActionState } from "react";
import { saveCategory, saveLocation } from "@/lib/admin/catalog";
import { Input, Select } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";

export function CategoryForm({ id, name = "" }: { id?: string; name?: string }) {
  const [state, action] = useActionState(saveCategory, {});
  const prefix = id ? `cat-${id}` : "cat-new";
  return (
    <form action={action} className="flex flex-col gap-2" noValidate>
      {id && <input type="hidden" name="id" value={id} />}
      <div className="flex items-end gap-2">
        <Input
          id={`${prefix}-name`}
          label={id ? "Tên danh mục" : "Thêm danh mục"}
          name="name"
          defaultValue={state.values?.name ?? name}
          error={state.fieldErrors?.name}
          className="flex-1"
          maxLength={80}
          required
        />
        <SubmitButton className="btn btn-secondary" pendingText="Đang lưu…">
          {id ? "Lưu" : "Thêm"}
        </SubmitButton>
      </div>
      <ActionMessage state={state.fieldErrors ? {} : state} />
    </form>
  );
}

type School = { id: string; name: string };

export function LocationForm({
  id,
  initial = {},
  schools,
}: {
  id?: string;
  initial?: { name?: string; type?: string; schoolId?: string };
  schools: School[];
}) {
  const [state, action] = useActionState(saveLocation, {});
  const v = { ...initial, ...state.values };
  const e = state.fieldErrors ?? {};
  const prefix = id ? `loc-${id}` : "loc-new";
  return (
    <form action={action} className="flex flex-col gap-3" noValidate>
      {id && <input type="hidden" name="id" value={id} />}
      <div className="grid gap-3 sm:grid-cols-3">
        <Input id={`${prefix}-name`} label="Tên địa điểm" name="name" defaultValue={v.name} error={e.name} maxLength={120} required />
        <Input id={`${prefix}-type`} label="Loại" name="type" placeholder="Phòng học, KTX…" defaultValue={v.type} error={e.type} maxLength={40} required />
        <Select id={`${prefix}-school`} label="Trường" name="schoolId" defaultValue={v.schoolId ?? ""} error={e.schoolId}>
          <option value="">Dùng chung</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </div>
      <ActionMessage state={state.fieldErrors ? {} : state} />
      <div>
        <SubmitButton className="btn btn-secondary" pendingText="Đang lưu…">
          {id ? "Lưu thay đổi" : "Thêm địa điểm"}
        </SubmitButton>
      </div>
    </form>
  );
}
