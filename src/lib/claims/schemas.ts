import { z } from "zod";

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
});

export const decisionSchema = z.object({
  id: z.uuid(),
  decision: z.enum(["ACCEPTED", "REJECTED"]),
});
