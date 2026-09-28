"use client";

import Form from "next/form";
import Link from "next/link";
import type { ReportCategory, ReportLocation, ReportType } from "@/db";
import {
  REPORT_CATEGORY_LABELS,
  REPORT_LOCATION_LABELS,
  REPORT_TYPE_ICONS,
  REPORT_TYPE_LABELS,
  labelEntries,
} from "./report-display";
import { SEARCH_MAX_LENGTH } from "./report-fields";

type FilterValues = {
  q?: string;
  type?: ReportType;
  category?: ReportCategory;
  location?: ReportLocation;
};

const typeOptions: [string, string][] = [
  ["", "Tất cả"],
  ...labelEntries(REPORT_TYPE_LABELS).map(
    ([value, label]) => [value, `${REPORT_TYPE_ICONS[value]} ${label}`] as [string, string],
  ),
];

export function ReportFilterForm({
  filters,
  active,
}: {
  filters: FilterValues;
  active: boolean;
}) {
  return (
    <Form
      action="/"
      role="search"
      aria-label="Tìm kiếm và lọc tin"
      className="panel grid grid-cols-1 gap-4"
      onChange={(event) => {
        const target = event.target;
        const appliesImmediately =
          target instanceof HTMLSelectElement ||
          (target instanceof HTMLInputElement && target.type === "radio");
        if (appliesImmediately) event.currentTarget.requestSubmit();
      }}
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
          >
            ⌕
          </span>
          <label htmlFor="filter-q" className="sr-only">
            Từ khóa
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={filters.q}
            maxLength={SEARCH_MAX_LENGTH}
            placeholder="Tìm tên đồ vật hoặc mô tả..."
            autoComplete="off"
            className="control pl-10"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Tìm
        </button>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <fieldset className="segmented w-full min-w-0 overflow-x-auto sm:w-auto">
          <legend className="sr-only">Lọc theo loại tin</legend>
          {typeOptions.map(([value, label]) => (
            <label key={value || "all"} className="chip flex-1 sm:flex-none">
              <input
                type="radio"
                name="type"
                value={value}
                defaultChecked={(filters.type ?? "") === value}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </fieldset>
        {active && (
          <Link href="/" className="btn btn-ghost btn-small self-start sm:self-auto">
            Đặt lại bộ lọc
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FilterSelect
          id="filter-category"
          name="category"
          label="Danh mục"
          allLabel="Tất cả danh mục"
          value={filters.category}
          options={labelEntries(REPORT_CATEGORY_LABELS)}
        />
        <FilterSelect
          id="filter-location"
          name="location"
          label="Khu vực"
          allLabel="Tất cả khu vực"
          value={filters.location}
          options={labelEntries(REPORT_LOCATION_LABELS)}
        />
      </div>
    </Form>
  );
}

function FilterSelect({
  id,
  name,
  label,
  allLabel,
  value,
  options,
}: {
  id: string;
  name: string;
  label: string;
  allLabel: string;
  value: string | undefined;
  options: [string, string][];
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select id={id} name={name} defaultValue={value ?? ""} className="control">
        <option value="">{allLabel}</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
