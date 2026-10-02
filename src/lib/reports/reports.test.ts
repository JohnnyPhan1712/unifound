import { describe, expect, it } from "vitest";
import { expiresAtFrom, isExpired } from "./expiry";
import { createReportSchema, isOwnImagePath, parseLocalDateTime, toLocalDateTime, updateReportSchema } from "./schemas";

const uid = "11111111-1111-4111-8111-111111111111";
const img = (n: number) => `${uid}/2222222${n}-2222-4222-8222-222222222222.jpg`;
const base = {
  type: "LOST",
  title: "Mất ví da màu nâu",
  categoryId: "33333333-3333-4333-8333-333333333333",
  locationId: "44444444-4444-4444-8444-444444444444",
  description: "Ví da nâu gập đôi có thẻ sinh viên.",
  eventTime: "2026-09-30T08:15",
  images: JSON.stringify([img(1)]),
};
const errorsOf = (input: object) => {
  const r = createReportSchema.safeParse(input);
  return r.success ? {} : r.error.flatten().fieldErrors;
};

describe("TC-015-01 Zod tạo tin", () => {
  it("nhận tin LOST hợp lệ và chuyển thời điểm theo giờ Việt Nam", () => {
    const r = createReportSchema.parse(base);
    expect(r.eventTime.toISOString()).toBe("2026-09-30T01:15:00.000Z");
    expect(r.images).toEqual([img(1)]);
  });
  it("thiếu tiêu đề", () => {
    expect(errorsOf({ ...base, title: "  " })).toHaveProperty("title");
  });
  it("loại tin sai", () => {
    expect(createReportSchema.safeParse({ ...base, type: "STOLEN" }).success).toBe(false);
  });
  it("0 ảnh và 6 ảnh", () => {
    expect(errorsOf({ ...base, images: "[]" })).toHaveProperty("images");
    expect(errorsOf({ ...base, images: JSON.stringify([1, 2, 3, 4, 5, 6].map(img)) })).toHaveProperty("images");
    expect(errorsOf({ ...base, images: JSON.stringify([1, 2, 3, 4, 5].map(img)) })).toEqual({});
  });
  it("danh sách ảnh không phải JSON", () => {
    expect(errorsOf({ ...base, images: "abc" })).toHaveProperty("images");
  });
  it("FOUND thiếu câu hỏi/đáp án/nơi giữ", () => {
    const e = errorsOf({ ...base, type: "FOUND" });
    expect(Object.keys(e).sort()).toEqual(["keepingPlace", "verifyAnswer", "verifyQuestion"]);
  });
  it("thời điểm ở tương lai hoặc sai định dạng", () => {
    expect(errorsOf({ ...base, eventTime: "2999-01-01T00:00" })).toHaveProperty("eventTime");
    expect(errorsOf({ ...base, eventTime: "30/09/2026" })).toHaveProperty("eventTime");
  });
  it("schema sửa tin không yêu cầu ảnh", () => {
    const noImages: Partial<typeof base> = { ...base };
    delete noImages.images;
    expect(updateReportSchema.safeParse(noImages).success).toBe(true);
  });
  it("ảnh phải nằm trong thư mục của chính user", () => {
    expect(isOwnImagePath(img(1), uid)).toBe(true);
    expect(isOwnImagePath(img(1), "99999999-9999-4999-8999-999999999999")).toBe(false);
    expect(isOwnImagePath(`${uid}/../x.jpg`, uid)).toBe(false);
  });
});

describe("TC-015-02 hạn 60 ngày", () => {
  it("expires_at = created_at + 60 ngày", () => {
    const created = new Date("2026-10-01T00:00:00Z");
    expect(expiresAtFrom(created).toISOString()).toBe("2026-11-30T00:00:00.000Z");
  });
  it("hết hạn đúng ranh giới", () => {
    const exp = new Date("2026-11-30T00:00:00Z");
    expect(isExpired(exp, new Date("2026-11-29T23:59:59Z"))).toBe(false);
    expect(isExpired(exp, exp)).toBe(true);
  });
  it("chuyển qua lại datetime-local", () => {
    const d = parseLocalDateTime("2026-10-01T23:30")!;
    expect(toLocalDateTime(d)).toBe("2026-10-01T23:30");
  });
});

describe("shortName", () => {
  it("tên gọi + chữ cái đầu họ, không lộ họ tên đầy đủ", async () => {
    const { shortName } = await import("@/lib/labels");
    expect(shortName("Nguyễn Văn Lan")).toBe("Lan N.");
    expect(shortName("  Minh ")).toBe("Minh");
    expect(shortName(null)).toBe("Sinh viên");
  });
});

describe("timeAgo", () => {
  it("lệch đồng hồ vài giây vẫn hiển thị vừa xong", async () => {
    const { timeAgo } = await import("@/lib/labels");
    const now = new Date("2026-10-01T10:00:00Z");
    expect(timeAgo(new Date(now.getTime() + 14_000), now)).toBe("vừa xong");
    expect(timeAgo(new Date(now.getTime() - 30_000), now)).toBe("vừa xong");
    expect(timeAgo(new Date(now.getTime() - 3 * 3_600_000), now)).toBe("3 giờ trước");
  });
});
