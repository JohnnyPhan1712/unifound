"use client";

import { CircleAlert } from "lucide-react";
import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

type Base = { label: string; name: string; error?: string[]; hint?: ReactNode; className?: string };

function Wrapper({
  id,
  label,
  error,
  hint,
  className,
  required,
  counter,
  children,
}: Base & { id: string; required?: boolean; counter?: ReactNode; children: ReactNode }) {
  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      <label htmlFor={id} className="text-[0.875rem] font-semibold">
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {(hint || counter) && !error?.length && (
        <div id={`${id}-hint`} className="flex justify-between gap-3 text-[0.8125rem] leading-snug text-muted">
          <span>{hint}</span>
          {counter}
        </div>
      )}
      {error?.length ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-[0.8125rem] font-medium leading-snug text-danger">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {error[0]}
        </p>
      ) : null}
    </div>
  );
}

function aria(id: string, base: Pick<Base, "error" | "hint">, extra?: boolean) {
  return {
    id,
    "aria-invalid": base.error?.length ? true : undefined,
    "aria-describedby": base.error?.length ? `${id}-error` : base.hint || extra ? `${id}-hint` : undefined,
  };
}

function Counter({ len, max }: { len: number; max: number }) {
  return (
    <span className={`tabular ${len > max ? "font-semibold text-danger" : ""}`}>
      {len}/{max}
    </span>
  );
}

export function Input({ label, name, error, hint, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = rest.id ?? `f-${name}`;
  const [len, setLen] = useState(String(rest.defaultValue ?? "").length);
  const counter = rest.maxLength ? <Counter len={len} max={rest.maxLength} /> : undefined;
  return (
    <Wrapper {...{ id, label, name, error, hint, className, required: rest.required, counter }}>
      <input
        {...rest}
        name={name}
        {...aria(id, { error, hint }, Boolean(counter))}
        className="control"
        onChange={(e) => {
          setLen(e.target.value.length);
          rest.onChange?.(e);
        }}
      />
    </Wrapper>
  );
}

export function Textarea({ label, name, error, hint, className, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = rest.id ?? `f-${name}`;
  const [len, setLen] = useState(String(rest.defaultValue ?? "").length);
  const counter = rest.maxLength ? <Counter len={len} max={rest.maxLength} /> : undefined;
  return (
    <Wrapper {...{ id, label, name, error, hint, className, required: rest.required, counter }}>
      <textarea
        {...rest}
        name={name}
        {...aria(id, { error, hint }, Boolean(counter))}
        className="control"
        onChange={(e) => {
          setLen(e.target.value.length);
          rest.onChange?.(e);
        }}
      />
    </Wrapper>
  );
}

export function Select({ label, name, error, hint, className, children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = rest.id ?? `f-${name}`;
  return (
    <Wrapper {...{ id, label, name, error, hint, className, required: rest.required }}>
      <select {...rest} name={name} {...aria(id, { error, hint })} className="control">
        {children}
      </select>
    </Wrapper>
  );
}
