import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Email không hợp lệ.")),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự.").max(72, "Mật khẩu tối đa 72 ký tự."),
});

export const emailSchema = credentialsSchema.pick({ email: true });

export const newPasswordSchema = credentialsSchema
  .pick({ password: true })
  .extend({ confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Mật khẩu nhập lại không khớp." });

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((v) => v || null);

const fullName = z.string().trim().min(2, "Họ tên tối thiểu 2 ký tự.").max(120, "Họ tên tối đa 120 ký tự.");

export const registerSchema = credentialsSchema.extend({ fullName });

export const profileSchema = z.object({
  fullName,
  studentCode: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "MSSV gồm 8 chữ số, ví dụ 23520001.")
    .or(z.literal("").transform(() => null)),
  schoolId: z.uuid("Trường không hợp lệ.").or(z.literal("").transform(() => null)),
  contactInfo: optionalText(120, "Liên hệ tối đa 120 ký tự."),
});

export type ProfileInput = z.infer<typeof profileSchema>;
