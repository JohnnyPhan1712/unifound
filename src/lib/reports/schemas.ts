import { z } from "zod";

export const MAX_IMAGES = 5;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const IMAGE_BUCKET = "report-images";
// Ảnh minh chứng của yêu cầu nhận lại: bucket riêng tư, tối đa 3 ảnh
export const CLAIM_IMAGE_BUCKET = "claim-images";
export const MAX_CLAIM_IMAGES = 3;

/** Giá trị <input type="datetime-local"> hiểu theo giờ Việt Nam. */
export function parseLocalDateTime(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const d = new Date(`${value}:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Ngược lại: Date → chuỗi datetime-local giờ Việt Nam (để điền lại form sửa). */
export function toLocalDateTime(d: Date): string {
  return new Date(d.getTime() + 7 * 3_600_000).toISOString().slice(0, 16);
}

const text = (min: number, max: number, label: string) =>
  z
    .string({ error: `Nhập ${label}.` })
    .trim()
    .min(min, min <= 1 ? `Nhập ${label}.` : `${label[0].toUpperCase() + label.slice(1)} tối thiểu ${min} ký tự.`)
    .max(max, `${label[0].toUpperCase() + label.slice(1)} tối đa ${max} ký tự.`);

const eventTime = z
  .string({ error: "Chọn thời điểm." })
  .transform((v, ctx) => {
    const d = parseLocalDateTime(v);
    if (!d) {
      ctx.addIssue({ code: "custom", message: "Chọn thời điểm mất hoặc nhặt được." });
      return z.NEVER;
    }
    // Cho lệch 5 phút vì đồng hồ máy người dùng
    if (d.getTime() > Date.now() + 5 * 60_000) {
      ctx.addIssue({ code: "custom", message: "Thời điểm không được ở tương lai." });
      return z.NEVER;
    }
    return d;
  });

/** Chuỗi JSON từ input ẩn `images` → mảng đường dẫn, kiểm tra số lượng. */
export const imageList = (min: number, max: number) =>
  z
    .string()
    .optional()
    .transform((v, ctx) => {
      try {
        const arr: unknown = JSON.parse(v || "[]");
        if (Array.isArray(arr) && arr.every((x) => typeof x === "string")) return arr as string[];
      } catch {}
      ctx.addIssue({ code: "custom", message: "Danh sách ảnh không hợp lệ." });
      return z.NEVER;
    })
    .pipe(z.array(z.string()).min(min, "Cần ít nhất 1 ảnh.").max(max, `Tối đa ${max} ảnh.`));

const images = imageList(1, MAX_IMAGES);

const common = {
  title: text(5, 120, "tiêu đề"),
  categoryId: z.uuid("Chọn danh mục."),
  locationId: z.uuid("Chọn địa điểm."),
  description: text(10, 2000, "mô tả"),
  eventTime,
};

const found = {
  keepingPlace: text(3, 200, "nơi đang giữ đồ"),
  verifyQuestion: text(5, 200, "câu hỏi xác minh"),
  verifyAnswer: text(1, 200, "đáp án xác minh"),
};

const typeError = { error: "Chọn loại tin: Mất đồ hoặc Nhặt được." };
const lost = z.object({ type: z.literal("LOST"), ...common });
const foundReport = z.object({ type: z.literal("FOUND"), ...common, ...found });

export const createReportSchema = z.discriminatedUnion(
  "type",
  [lost.extend({ images }), foundReport.extend({ images })],
  typeError
);
/** Form sửa tin (CHG-017): ảnh giữ nguyên. */
export const updateReportSchema = z.discriminatedUnion("type", [lost, foundReport], typeError);

/** Đường dẫn ảnh phải nằm trong thư mục của chính user (khớp policy Storage). */
export function isOwnImagePath(path: string, userId: string): boolean {
  return /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path) && path.startsWith(`${userId}/`);
}
