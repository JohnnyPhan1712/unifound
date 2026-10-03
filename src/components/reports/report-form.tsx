"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CircleAlert, Lock, Package, Search } from "lucide-react";
import type { ActionState } from "@/lib/action-state";
import type { ReportType } from "@/db/schema";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Input, Select, Textarea } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";
import { ImagePicker } from "./image-picker";

export type CatalogOption = { id: string; name: string; group?: string; schoolId?: string };

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  categories: CatalogOption[];
  locations: CatalogOption[];
  maxDateTime: string;
  initial?: Record<string, string>;
  /** Có userId → hiện ô tải ảnh (form tạo tin). Form sửa giữ nguyên ảnh. */
  uploadFor?: string;
  lockType?: boolean;
  submitLabel: string;
  cancelHref?: string;
};

const FIELD_LABEL: Record<string, string> = {
  type: "Loại tin",
  title: "Tiêu đề",
  categoryId: "Danh mục",
  locationId: "Địa điểm",
  eventTime: "Thời điểm",
  description: "Mô tả",
  images: "Ảnh",
  keepingPlace: "Nơi đang giữ đồ",
  verifyQuestion: "Câu hỏi xác minh",
  verifyAnswer: "Đáp án xác minh",
};

export function ReportForm({ action, categories, locations, maxDateTime, initial = {}, uploadFor, lockType, submitLabel, cancelHref = "/" }: Props) {
  const [state, formAction] = useActionState(action, {});
  const v = { ...initial, ...state.values };
  const e = state.fieldErrors ?? {};
  const [type, setType] = useState<ReportType>((v.type as ReportType) || "LOST");
  const [uploading, setUploading] = useState(false);
  const found = type === "FOUND";
  const errorKeys = Object.keys(e).filter((k) => e[k]?.length);

  const groups = new Map<string, CatalogOption[]>();
  for (const l of locations) groups.set(l.group ?? "Khác", [...(groups.get(l.group ?? "Khác") ?? []), l]);

  return (
    <form action={formAction} noValidate>
     <div className="mx-auto max-w-[760px]">
      {errorKeys.length > 0 && (
        <div role="alert" className="mb-8 flex items-start gap-3 rounded-md bg-danger-soft px-4 py-3.5 text-[0.875rem] text-[#7a2210]">
          <CircleAlert className="mt-px size-5 shrink-0 text-danger" aria-hidden />
          <div className="grid gap-1.5">
            <strong>Còn {errorKeys.length} mục cần sửa trước khi lưu</strong>
            <ul className="list-disc pl-[18px]">
              {errorKeys.map((k) => (
                <li key={k}>
                  <a href={k === "images" ? "#images-label" : `#f-${k}`} className="text-[#7a2210]">
                    {FIELD_LABEL[k] ?? k}: {e[k]![0]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {errorKeys.length === 0 && <ActionMessage state={state} />}

      <div className="grid gap-8">
        <fieldset>
          <legend className="mb-2 text-[0.875rem] font-semibold">Bạn muốn đăng gì?</legend>
          {lockType && <input type="hidden" name="type" value={type} />}
          <div className="grid grid-cols-2 gap-3 max-[744px]:grid-cols-1">
            {(["LOST", "FOUND"] as const).map((t) => {
              const Icon = t === "LOST" ? Search : Package;
              return (
                <label key={t} className={`choice ${t === "LOST" ? "lost" : "found"} ${lockType && type !== t ? "hidden" : ""}`}>
                  <input type="radio" name={lockType ? undefined : "type"} value={t} checked={type === t} onChange={() => setType(t)} disabled={lockType} />
                  <span className="tile">
                    <Icon className="icon-lead size-8" strokeWidth={1.5} aria-hidden />
                    <span className="text-[1rem] font-semibold leading-tight">{t === "LOST" ? "Tôi bị mất đồ" : "Tôi nhặt được đồ"}</span>
                    <span className="text-[0.875rem] leading-snug text-muted">
                      {t === "LOST" ? "Tạo tin mất đồ để người nhặt được tìm thấy bạn." : "Tạo tin nhặt được để chủ đồ gửi yêu cầu nhận lại."}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {e.type && <p className="mt-2 text-[0.8125rem] font-medium text-danger">{e.type[0]}</p>}
        </fieldset>

        <div className="flex items-start gap-3 rounded-md bg-primary-soft px-4 py-3.5 text-[0.875rem] text-info">
          <CircleAlert className="mt-px size-5 shrink-0 text-primary-hover" aria-hidden />
          <span>
            {found
              ? "Mô tả chung (màu sắc, loại đồ). Chi tiết riêng chỉ chủ đồ biết hãy để dành cho câu hỏi xác minh."
              : "Ghi màu sắc, hãng, vật đi kèm để hệ thống gợi ý tin nhặt được phù hợp."}
          </span>
        </div>

        <Input
          label="Tiêu đề"
          name="title"
          placeholder={found ? "Ví dụ: Nhặt được thẻ sinh viên ở thư viện" : "Ví dụ: Mất ví da màu nâu ở căng tin"}
          defaultValue={v.title}
          error={e.title}
          hint="Từ 5 đến 120 ký tự."
          maxLength={120}
          required
        />

        <fieldset id="f-categoryId">
          <legend className="mb-2 text-[0.875rem] font-semibold">
            Danh mục{" "}
            <span className="text-danger" aria-hidden>
              *
            </span>
          </legend>
          <div className="grid grid-cols-3 gap-3 max-[744px]:grid-cols-2" aria-invalid={e.categoryId ? true : undefined}>
            {categories.map((c) => (
              <label key={c.id} className="choice">
                <input type="radio" name="categoryId" value={c.id} defaultChecked={v.categoryId === c.id} />
                <span className="tile !gap-2 !p-4">
                  <CategoryIcon name={c.name} className="size-6" />
                  <span className="text-[0.875rem] font-medium leading-tight">{c.name}</span>
                </span>
              </label>
            ))}
          </div>
          {e.categoryId && (
            <p className="mt-2 flex items-center gap-1.5 text-[0.8125rem] font-medium text-danger">
              <CircleAlert className="size-4" aria-hidden />
              {e.categoryId[0]}
            </p>
          )}
        </fieldset>

        <div className="grid grid-cols-2 gap-4 max-[744px]:grid-cols-1">
          <Select label={found ? "Nhặt được ở đâu" : "Mất ở đâu (gần đúng)"} name="locationId" defaultValue={v.locationId ?? ""} error={e.locationId} hint="Chọn khu vực gần nhất, không cần vị trí chính xác." required>
            <option value="" disabled>
              Chọn địa điểm
            </option>
            {[...groups].map(([group, list]) => (
              <optgroup key={group} label={group}>
                {list.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
          <Input
            label={found ? "Thời điểm nhặt được" : "Thời điểm mất (gần đúng)"}
            name="eventTime"
            type="datetime-local"
            max={maxDateTime}
            defaultValue={v.eventTime}
            error={e.eventTime}
            className="tabular"
            required
          />
        </div>

        <Textarea
          label="Mô tả"
          name="description"
          placeholder={found ? "Màu sắc, loại đồ, nơi nhặt… (không ghi chi tiết dành cho câu hỏi xác minh)" : "Nơi, thời điểm, đặc điểm dễ nhận ra, bên trong có gì…"}
          defaultValue={v.description}
          error={e.description}
          hint="Từ 10 đến 2000 ký tự. Không ghi số điện thoại, số thẻ hay mật khẩu."
          maxLength={2000}
          required
        />

        {uploadFor && (
          <ImagePicker
            userId={uploadFor}
            error={e.images}
            onBusyChange={setUploading}
            required={found}
            label={found ? "Ảnh đồ vật" : "Ảnh đồ vật (không bắt buộc)"}
            hint={found ? "" : " Có thể dùng ảnh cũ của món đồ."}
          />
        )}

        {found && (
          <div className="grid gap-6 rounded-md border border-line bg-surface-soft p-5">
            <Input label="Nơi đang giữ đồ" name="keepingPlace" placeholder="Ví dụ: Quầy thủ thư tầng 1" defaultValue={v.keepingPlace} error={e.keepingPlace} required />
            <div className="flex items-center gap-2 text-[0.875rem] font-semibold text-ink">
              <Lock className="size-4" aria-hidden />
              Xác minh riêng tư: câu hỏi chỉ hiện cho người gửi yêu cầu, đáp án không bao giờ hiện công khai.
            </div>
            <Input label="Câu hỏi xác minh" name="verifyQuestion" placeholder="Ví dụ: Trong ví có những thẻ gì?" defaultValue={v.verifyQuestion} error={e.verifyQuestion} maxLength={200} required />
            <Input label="Đáp án (chỉ bạn thấy)" name="verifyAnswer" defaultValue={v.verifyAnswer} error={e.verifyAnswer} maxLength={200} autoComplete="off" required />
          </div>
        )}
      </div>

     </div>

      <div className="sticky bottom-0 z-10 -mx-[var(--gutter)] mt-10 border-t border-line bg-canvas px-[var(--gutter)]">
        <div className="mx-auto flex h-20 max-w-[760px] items-center justify-between max-[744px]:h-[72px]">
          <Link href={cancelHref} className="btn btn-text">
            Hủy
          </Link>
          <div className="flex items-center gap-4">
            {uploading && <span className="text-[0.875rem] text-muted">Đang tải ảnh lên…</span>}
            <SubmitButton className="btn btn-primary" disabled={uploading} pendingText="Đang lưu…">
              {submitLabel}
            </SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}
