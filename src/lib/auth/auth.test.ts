import { describe, expect, it } from "vitest";
import { isAllowedEmail, parseDomains } from "./email";
import { credentialsSchema, newPasswordSchema, profileSchema, registerSchema } from "./schemas";

const domains = parseDomains(" gm.uit.edu.vn, UIT.edu.vn ,,");

describe("TC-014-01 kiểm tra domain email", () => {
  it("chuẩn hóa danh sách domain", () => {
    expect(domains).toEqual(["gm.uit.edu.vn", "uit.edu.vn"]);
  });
  it("nhận domain trong danh sách, không phân biệt hoa/thường", () => {
    expect(isAllowedEmail("23520001@gm.uit.edu.vn", domains)).toBe(true);
    expect(isAllowedEmail("GV@UIT.EDU.VN", domains)).toBe(true);
  });
  it("từ chối domain ngoài danh sách, domain con, đuôi giả và rỗng", () => {
    expect(isAllowedEmail("a@gmail.com", domains)).toBe(false);
    expect(isAllowedEmail("a@sub.uit.edu.vn", domains)).toBe(false);
    expect(isAllowedEmail("a@uit.edu.vn.evil.com", domains)).toBe(false);
    expect(isAllowedEmail("", domains)).toBe(false);
    expect(isAllowedEmail("khongcoacong", domains)).toBe(false);
    expect(isAllowedEmail("a@gm.uit.edu.vn", [])).toBe(false);
  });
});

describe("TC-014-02 Zod hồ sơ và đăng nhập", () => {
  const valid = { fullName: "Nguyễn Văn A", studentCode: "23520001", schoolId: "", contactInfo: "" };

  it("nhận hồ sơ hợp lệ, trường tùy chọn rỗng thành null", () => {
    const r = profileSchema.parse(valid);
    expect(r).toEqual({ fullName: "Nguyễn Văn A", studentCode: "23520001", schoolId: null, contactInfo: null });
  });
  it("từ chối họ tên quá ngắn, MSSV sai định dạng, schoolId không phải uuid", () => {
    const r = profileSchema.safeParse({ fullName: " A ", studentCode: "12ab", schoolId: "x", contactInfo: "" });
    expect(r.success).toBe(false);
    const fields = Object.keys(r.error!.flatten().fieldErrors);
    expect(fields.sort()).toEqual(["fullName", "schoolId", "studentCode"]);
  });
  it("từ chối liên hệ quá 120 ký tự", () => {
    expect(profileSchema.safeParse({ ...valid, contactInfo: "x".repeat(121) }).success).toBe(false);
  });
  it("đăng nhập: email sai và mật khẩu ngắn bị từ chối", () => {
    expect(credentialsSchema.safeParse({ email: "abc", password: "1234567" }).success).toBe(false);
    expect(credentialsSchema.parse({ email: " A@GM.UIT.EDU.VN ", password: "12345678" }).email).toBe("a@gm.uit.edu.vn");
  });
});

describe("TC-024-01 tên miền các trường ĐHQG-HCM", () => {
  const domains = parseDomains(
    "gm.uit.edu.vn,uit.edu.vn,hcmut.edu.vn,student.hcmus.edu.vn,hcmussh.edu.vn,student.hcmiu.edu.vn,st.uel.edu.vn"
  );
  it("nhận email của 5 trường mới", () => {
    for (const email of ["a@hcmut.edu.vn", "a@student.hcmus.edu.vn", "a@hcmussh.edu.vn", "a@student.hcmiu.edu.vn", "a@st.uel.edu.vn"]) {
      expect(isAllowedEmail(email, domains)).toBe(true);
    }
  });
  it("từ chối đuôi giả và tên miền gần giống", () => {
    for (const email of ["a@hcmut.edu.vn.evil.com", "a@evil-hcmut.edu.vn", "a@mail.hcmut.edu.vn", "a@hcmus.edu.vn", "a@uel.edu.vn"]) {
      expect(isAllowedEmail(email, domains)).toBe(false);
    }
  });
});

describe("TC-024-02 Zod mật khẩu mới", () => {
  it("chấp nhận mật khẩu hợp lệ và khớp", () => {
    expect(newPasswordSchema.safeParse({ password: "12345678", confirmPassword: "12345678" }).success).toBe(true);
  });
  it("từ chối quá ngắn, quá dài hoặc không khớp", () => {
    expect(newPasswordSchema.safeParse({ password: "1234567", confirmPassword: "1234567" }).success).toBe(false);
    expect(newPasswordSchema.safeParse({ password: "a".repeat(73), confirmPassword: "a".repeat(73) }).success).toBe(false);
    const r = newPasswordSchema.safeParse({ password: "12345678", confirmPassword: "87654321" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path).toEqual(["confirmPassword"]);
  });
});

describe("TC-031 Zod đăng ký có họ tên", () => {
  const base = { email: "a@gm.uit.edu.vn", password: "12345678" };
  const nameErr = (fullName?: string) => registerSchema.safeParse({ ...base, fullName }).error?.flatten().fieldErrors.fullName;

  it("trim họ tên hợp lệ", () => {
    expect(registerSchema.parse({ ...base, fullName: "  Nguyễn Văn A " }).fullName).toBe("Nguyễn Văn A");
  });
  it("từ chối thiếu, 1 ký tự và 121 ký tự", () => {
    expect(nameErr(undefined)).toBeDefined();
    expect(nameErr(" A ")).toBeDefined();
    expect(nameErr("x".repeat(121))).toBeDefined();
  });
});
