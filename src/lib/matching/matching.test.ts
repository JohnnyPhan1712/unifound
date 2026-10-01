import { describe, expect, it, vi } from "vitest";
import { isCandidate, keywords, MATCH_THRESHOLD, scorePair, shouldSuggest, type MatchInput } from "./score";
import { runMatchingSafely } from "./run";

const now = new Date("2026-10-01T10:00:00Z");
const day = 86_400_000;
const base: MatchInput = {
  id: "lost-1",
  userId: "u-a",
  type: "LOST",
  status: "OPEN",
  categoryId: "cat-wallet",
  locationId: "loc-canteen",
  locationName: "Căng tin UIT",
  schoolId: "uit",
  schoolName: "UIT",
  eventTime: new Date(now.getTime() - 2 * 3_600_000),
  createdAt: new Date(now.getTime() - 3_600_000),
  expiresAt: new Date(now.getTime() + 59 * day),
  title: "Ví",
  description: null,
};
const found = (patch: Partial<MatchInput> = {}): MatchInput => ({ ...base, id: "found-1", userId: "u-b", type: "FOUND", title: "Đồ", ...patch });
// Hai địa điểm khác nhau, khác trường → chỉ còn tiêu chí đang kiểm
const apart = { locationId: "loc-x", schoolId: null };

describe("TC-018-01 bước lọc", () => {
  it("nhận tin đối ứng hợp lệ", () => {
    expect(isCandidate(base, found(), now)).toBe(true);
  });
  it("loại cùng loại, khác danh mục, không OPEN, quá 14 ngày, hết hạn, tin của chính mình", () => {
    expect(isCandidate(base, found({ type: "LOST" }), now)).toBe(false);
    expect(isCandidate(base, found({ categoryId: "cat-keys" }), now)).toBe(false);
    expect(isCandidate(base, found({ status: "IN_PROGRESS" }), now)).toBe(false);
    expect(isCandidate(base, found({ createdAt: new Date(now.getTime() - 15 * day) }), now)).toBe(false);
    expect(isCandidate(base, found({ expiresAt: now }), now)).toBe(false);
    expect(isCandidate(base, found({ userId: "u-a" }), now)).toBe(false);
  });
  it("đúng 14 ngày vẫn được xét", () => {
    expect(isCandidate(base, found({ createdAt: new Date(now.getTime() - 14 * day) }), now)).toBe(true);
  });
});

describe("TC-018-02 từng mốc điểm", () => {
  const t = (offsetDays: number) => new Date(base.eventTime!.getTime() + offsetDays * day);
  it("cùng địa điểm +40, không cộng thêm điểm trường", () => {
    const r = scorePair(base, found({ eventTime: t(10) }));
    expect(r.score).toBe(40 + 5);
    expect(r.reasons[0]).toContain("Cùng địa điểm: Căng tin UIT (+40)");
  });
  it("khác địa điểm cùng trường +15; khác trường 0", () => {
    expect(scorePair(base, found({ locationId: "loc-lib", eventTime: t(10) })).score).toBe(15 + 5);
    expect(scorePair(base, found({ locationId: "loc-ktx", schoolId: null, eventTime: t(10) })).score).toBe(5);
  });
  it("thời gian ≤1 ngày +25, ≤3 ngày +15, còn lại +5", () => {
    expect(scorePair(base, found({ ...apart, eventTime: t(1) })).score).toBe(25);
    expect(scorePair(base, found({ ...apart, eventTime: t(-3) })).score).toBe(15);
    expect(scorePair(base, found({ ...apart, eventTime: t(3.01) })).score).toBe(5);
  });
  it("từ khóa +5 mỗi từ, tối đa +20; bỏ từ dừng và dấu câu", () => {
    const a = { ...base, eventTime: null, title: "Mất ví da màu nâu", description: "Có thẻ sinh viên!" };
    const b = { ...apart, eventTime: null, description: null };
    expect(scorePair(a, found({ ...b, title: "Nhặt được ví da" })).score).toBe(10);
    const many = found({ ...b, title: "ví da nâu thẻ sinh viên" });
    expect(scorePair(a, many).score).toBe(20);
    expect([...keywords("Mất ví, của tôi!")]).toEqual(["ví"]);
  });
});

describe("TC-018-03 ngưỡng 50", () => {
  it("49 không gợi ý, 50 gợi ý", () => {
    expect(MATCH_THRESHOLD).toBe(50);
    expect(shouldSuggest({ score: 49, reasons: [] })).toBe(false);
    expect(shouldSuggest({ score: 50, reasons: [] })).toBe(true);
  });
  it("cặp thật: cùng địa điểm + cùng ngày = 65 → gợi ý", () => {
    expect(scorePair(base, found()).score).toBe(65);
  });
});

describe("TC-018-04 deterministic, dữ liệu thiếu", () => {
  it("cùng input → cùng kết quả", () => {
    expect(scorePair(base, found())).toEqual(scorePair(base, found()));
  });
  it("thiếu mô tả/địa điểm/thời gian không lỗi, không cộng điểm", () => {
    const empty = { locationId: null, schoolId: null, eventTime: null, description: null, title: "" };
    const r = scorePair({ ...base, ...empty }, found(empty));
    expect(r).toEqual({ score: 0, reasons: [] });
  });
  it("điểm luôn trong 0–100", () => {
    const rich = { title: "a1 a2 a3 a4 a5 a6 a7 a8", description: "a9 a10" };
    const r = scorePair({ ...base, ...rich }, found(rich));
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.score).toBe(40 + 25 + 20);
  });
});

describe("TC-018-08 matching lỗi không làm hỏng đăng tin", () => {
  it("runMatchingSafely nuốt lỗi và trả false", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(runMatchingSafely("r1", async () => Promise.reject(new Error("db down")))).resolves.toBe(false);
    await expect(runMatchingSafely("r1", async () => 2)).resolves.toBe(true);
    spy.mockRestore();
  });
});
