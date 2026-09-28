import { z } from "zod";

export const createClaimSchema = z.object({
  reportId: z.string().uuid("ID báo cáo không hợp lệ"),
  proof: z
    .string()
    .min(10, "Vui lòng nhập chi tiết đặc điểm (ít nhất 10 ký tự)")
    .max(1000, "Mô tả quá dài (tối đa 1000 ký tự)"),
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;
