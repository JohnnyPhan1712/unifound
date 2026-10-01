import { z } from "zod";

const optionalId = z.uuid().or(z.literal("").transform(() => undefined)).optional();
const name = (max: number) =>
  z
    .string({ error: "Nhập tên." })
    .trim()
    .min(2, "Tên tối thiểu 2 ký tự.")
    .max(max, `Tên tối đa ${max} ký tự.`);

export const categorySchema = z.object({ id: optionalId, name: name(80) });

export const locationSchema = z.object({
  id: optionalId,
  name: name(120),
  type: z.string({ error: "Nhập loại địa điểm." }).trim().min(2, "Nhập loại địa điểm, ví dụ: Phòng học, KTX.").max(40, "Loại tối đa 40 ký tự."),
  // Rỗng = địa điểm dùng chung (KTX, nhà văn hóa…)
  schoolId: z.uuid("Trường không hợp lệ.").or(z.literal("").transform(() => null)),
});
