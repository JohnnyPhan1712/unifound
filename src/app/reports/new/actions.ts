"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, reports } from "@/db";
import { CREATE_REPORT_FIELDS, type CreateReportField } from "../report-fields";
import { validateCreateReport } from "../report-validation";
import { getSignedInUserId } from "./current-user";

export type CreateReportState = {
  attempt: number;
  message?: string;
  fieldErrors?: Partial<Record<CreateReportField, string[]>>;
  values?: Partial<Record<CreateReportField, string>>;
};

const FOREIGN_KEY_VIOLATION = "23503";

export async function createReport(
  previousState: CreateReportState,
  formData: FormData,
): Promise<CreateReportState> {
  const attempt = previousState.attempt + 1;
  const values = Object.fromEntries(
    CREATE_REPORT_FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  ) as Record<CreateReportField, string>;

  // The owner always comes from the server session, never from submitted form data.
  const userId = await getSignedInUserId();
  if (!userId) {
    return {
      attempt,
      values,
      message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi gửi tin.",
    };
  }

  const validation = validateCreateReport(values);
  if (!validation.success) {
    return {
      attempt,
      values,
      fieldErrors: validation.fieldErrors,
      message: "Tin chưa được lưu. Vui lòng sửa các trường được đánh dấu.",
    };
  }

  let reportId: string;
  try {
    const [created] = await db
      .insert(reports)
      .values({ ...validation.data, userId })
      .returning({ id: reports.id });
    reportId = created.id;
  } catch (error) {
    if (getPostgresErrorCode(error) === FOREIGN_KEY_VIOLATION) {
      return {
        attempt,
        values,
        message:
          "Tài khoản của bạn chưa được liên kết hồ sơ UniFound nên chưa thể lưu tin. Vui lòng liên hệ nhóm phát triển.",
      };
    }
    console.error("createReport failed", error);
    return {
      attempt,
      values,
      message: "Không thể lưu tin lúc này. Vui lòng thử lại.",
    };
  }

  revalidatePath("/");
  redirect(`/reports/${reportId}`);
}

// Drizzle wraps driver errors, so the Postgres SQLSTATE may sit on a nested cause.
function getPostgresErrorCode(error: unknown): string | undefined {
  for (let current: unknown = error; current instanceof Error; current = current.cause) {
    if ("code" in current && typeof current.code === "string") return current.code;
  }
  return undefined;
}
