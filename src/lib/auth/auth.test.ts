import { describe, expect, it } from "vitest";
import { isAllowedEmail, parseDomains } from "./email";
import { credentialsSchema, profileSchema } from "./schemas";

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
