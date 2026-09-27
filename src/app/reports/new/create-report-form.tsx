"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { ReportType } from "@/db";
import {
  REPORT_CATEGORY_LABELS,
  REPORT_LOCATION_LABELS,
  REPORT_TYPE_ICONS,
  labelEntries,
} from "../report-display";
import {
  CREATE_REPORT_FIELDS,
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  type CreateReportField,
} from "../report-fields";
import { createReport, type CreateReportState } from "./actions";

const initialState: CreateReportState = { attempt: 0 };

const typeChoices: Record<ReportType, { label: string; submit: string; activeClass: string }> = {
  lost: {
    label: "Tôi bị mất đồ",
    submit: "Đăng tin bị mất",
    activeClass: "has-checked:bg-lost has-checked:text-white",
  },
  found: {
    label: "Tôi nhặt được đồ",
    submit: "Đăng tin nhặt được",
    activeClass: "has-checked:bg-primary has-checked:text-white",
  },
};

export function CreateReportForm({
  maxEventDate,
  defaultType,
}: {
  maxEventDate: string;
  defaultType: ReportType;
}) {
  const [state, formAction, pending] = useActionState(createReport, initialState);
  const values = state.values ?? {};
  const [type, setType] = useState<ReportType>(
    values.type === "lost" || values.type === "found" ? values.type : defaultType,
  );
  const errorOf = (field: CreateReportField) => state.fieldErrors?.[field]?.[0];
  const firstInvalid = CREATE_REPORT_FIELDS.find((field) => errorOf(field));
  const fieldProps = (field: CreateReportField) => ({
    id: `report-${field}`,
    name: field,
    required: true,
    autoFocus: firstInvalid === field,
    "aria-invalid": errorOf(field) ? true : undefined,
    "aria-describedby": errorOf(field) ? `report-${field}-error` : undefined,
  });

  return (
    // Server-side validation is authoritative; noValidate keeps every message in the same language and place.
    // The key remounts the form after each attempt so the submitted values are restored as defaults.
    <form key={state.attempt} action={formAction} noValidate className="panel grid grid-cols-1 gap-4">
      {state.message && (
        <p role="alert" className="notice error font-semibold">
          <span aria-hidden="true">⚠</span>
          <span>{state.message}</span>
        </p>
      )}

      <fieldset aria-describedby={errorOf("type") ? "report-type-error" : undefined}>
        <legend className="sr-only">Loại tin</legend>
        <div className="grid grid-cols-1 gap-2 rounded-2xl bg-surface-soft p-1.5 sm:grid-cols-2">
          {(Object.entries(typeChoices) as [ReportType, (typeof typeChoices)[ReportType]][]).map(([value, choice]) => (
            <label
              key={value}
              className={`flex min-h-[50px] cursor-pointer items-center justify-center gap-2 rounded-xl font-bold text-muted has-focus-visible:outline-3 has-focus-visible:outline-primary/30 ${choice.activeClass}`}
            >
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="sr-only"
              />
              <span aria-hidden="true">{REPORT_TYPE_ICONS[value]}</span>
              {choice.label}
            </label>
          ))}
        </div>
        <FieldError field="type" message={errorOf("type")} />
      </fieldset>

      <p className="notice">
        <span aria-hidden="true">🔒</span>
        <span>
          Không đăng mã PIN, mật khẩu, số giấy tờ đầy đủ hoặc dấu hiệu bí mật dùng để xác minh chủ
          sở hữu.
        </span>
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid content-start gap-1.5">
          <FieldLabel field="title">Tên đồ vật</FieldLabel>
          <input
            {...fieldProps("title")}
            type="text"
            maxLength={TITLE_MAX_LENGTH}
            defaultValue={values.title}
            placeholder="Ví dụ: Tai nghe Sony màu bạc"
            className="control"
          />
          <FieldError field="title" message={errorOf("title")} />
        </div>

        <div className="grid content-start gap-1.5">
          <FieldLabel field="category">Danh mục</FieldLabel>
          <select {...fieldProps("category")} defaultValue={values.category ?? ""} className="control">
            <option value="" disabled>
              Chọn danh mục
            </option>
            {labelEntries(REPORT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError field="category" message={errorOf("category")} />
        </div>

        <div className="grid content-start gap-1.5">
          <FieldLabel field="location">Khu vực</FieldLabel>
          <select {...fieldProps("location")} defaultValue={values.location ?? ""} className="control">
            <option value="" disabled>
              Chọn khu vực trong trường
            </option>
            {labelEntries(REPORT_LOCATION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError field="location" message={errorOf("location")} />
        </div>

        <div className="grid content-start gap-1.5">
          <FieldLabel field="eventDate">Ngày xảy ra</FieldLabel>
          <input
            {...fieldProps("eventDate")}
            type="date"
            max={maxEventDate}
            defaultValue={values.eventDate}
            className="control"
          />
          <FieldError field="eventDate" message={errorOf("eventDate")} />
        </div>

        <div className="grid content-start gap-1.5 sm:col-span-2">
          <FieldLabel field="description">Mô tả công khai</FieldLabel>
          <textarea
            {...fieldProps("description")}
            aria-describedby={
              errorOf("description")
                ? "report-description-hint report-description-error"
                : "report-description-hint"
            }
            maxLength={DESCRIPTION_MAX_LENGTH}
            defaultValue={values.description}
            placeholder="Màu sắc, nhãn hiệu, vị trí cụ thể và hoàn cảnh phát hiện hoặc làm mất..."
            className="control"
          />
          <span id="report-description-hint" className="field-hint">
            Không đưa chi tiết bí mật mà chỉ chủ sở hữu thật mới biết.
          </span>
          <FieldError field="description" message={errorOf("description")} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2.5 pt-2 sm:flex-row sm:justify-end">
        <Link href="/" className="btn btn-ghost">
          Hủy
        </Link>
        <button
          type="submit"
          disabled={pending}
          className={`btn ${type === "lost" ? "btn-lost" : "btn-primary"}`}
        >
          {pending ? "Đang gửi…" : typeChoices[type].submit}
        </button>
      </div>
    </form>
  );
}

function FieldLabel({ field, children }: { field: CreateReportField; children: React.ReactNode }) {
  return (
    <label htmlFor={`report-${field}`} className="field-label">
      {children}{" "}
      <span className="text-danger" aria-hidden="true">
        *
      </span>
    </label>
  );
}

function FieldError({ field, message }: { field: CreateReportField; message?: string }) {
  if (!message) return null;
  return (
    <p id={`report-${field}-error`} className="error-text">
      {message}
    </p>
  );
}
