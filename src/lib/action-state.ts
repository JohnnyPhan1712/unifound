import { z } from "zod";

/** Kết quả trả về chung của server action dùng với useActionState. */
export type ActionState = {
  ok?: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  values?: Record<string, string>;
};

export const idle: ActionState = {};

export function invalid(error: z.ZodError, values?: Record<string, string>): ActionState {
  return {
    message: "Vui lòng kiểm tra lại các trường được đánh dấu.",
    fieldErrors: z.flattenError(error).fieldErrors as ActionState["fieldErrors"],
    values,
  };
}

export const forbidden: ActionState = { message: "Bạn không có quyền thực hiện thao tác này (403)." };

/** Chuyển FormData thành object chuỗi (bỏ file) để parse bằng Zod và giữ lại giá trị form khi lỗi. */
export function formValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$")) out[key] = value;
  });
  return out;
}
