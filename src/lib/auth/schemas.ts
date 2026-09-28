import { z } from "zod";

// Schema validation cho Authentication
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = z
  .object({
    email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng nhập lại mật khẩu"),
    fullName: z.string().min(2, "Họ và tên tối thiểu 2 ký tự").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export type AuthActionResult<T = unknown> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

// Schema validation cho Reports API (CHG-008)
export const reportCreateSchema = z.object({
  type: z.enum(["lost", "found"]),
  title: z.string().min(3, "Tiêu đề tối thiểu 3 ký tự").max(255),
  category: z.enum([
    "electronics",
    "wallet-docs",
    "keys",
    "clothing",
    "study",
    "other",
  ]),
  location: z.enum([
    "H1",
    "H2",
    "H3",
    "H6",
    "parking",
    "canteen",
    "sports",
    "other",
  ]),
  description: z.string().min(5, "Mô tả tối thiểu 5 ký tự"),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sự kiện phải có định dạng YYYY-MM-DD"),
  imageUrl: z.string().url("URL hình ảnh không hợp lệ").optional().nullable(),
});

export const reportUpdateSchema = reportCreateSchema.partial();

export type ReportCreateInput = z.infer<typeof reportCreateSchema>;
export type ReportUpdateInput = z.infer<typeof reportUpdateSchema>;

