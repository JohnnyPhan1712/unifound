import { z } from "zod";
import { imageList, MAX_CLAIM_IMAGES } from "@/lib/reports/schemas";

export const claimSchema = z.object({
  answerText: z
    .string({ error: "Nhập câu trả lời xác minh." })
    .trim()
    .min(1, "Nhập câu trả lời xác minh.")
    .max(500, "Câu trả lời tối đa 500 ký tự."),
  note: z
    .string()
    .trim()
    .max(1000, "Mô tả thêm tối đa 1000 ký tự.")
    .optional()
    .transform((v) => v || null),
  // Ảnh minh chứng không bắt buộc
  images: imageList(0, MAX_CLAIM_IMAGES),
});

export const decisionSchema = z.object({
  id: z.uuid(),
  decision: z.enum(["ACCEPTED", "REJECTED"]),
});
