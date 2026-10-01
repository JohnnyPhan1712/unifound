import { z } from "zod";

export const flagSchema = z.object({
  reason: z
    .string({ error: "Nhập lý do báo cáo." })
    .trim()
    .min(5, "Lý do tối thiểu 5 ký tự.")
    .max(500, "Lý do tối đa 500 ký tự."),
});
