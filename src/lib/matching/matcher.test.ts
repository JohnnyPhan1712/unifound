import { describe, it, expect } from "vitest";
import {
  scoreMatch,
  findPotentialMatches,
  extractKeywords,
  daysBetween,
  MatchableReport,
  MATCH_RULES,
  MATCH_REASON_TEXTS,
} from "./index";

describe("Matching Module (CHG-010 / DEC-003)", () => {
  const baseLost: MatchableReport = {
    id: "lost-1",
    type: "lost",
    title: "Mất ví da màu đen",
    category: "wallet-docs",
    location: "H1",
    eventDate: "2026-09-20",
    description: "Ví da nam Pedro để quên tại phòng học H1.02",
    status: "open",
  };

  const baseFound: MatchableReport = {
    id: "found-1",
    type: "found",
    title: "Nhặt được ví da nam",
    category: "wallet-docs",
    location: "H1",
    eventDate: "2026-09-21",
    description: "Nhặt được ví Pedro màu đen rơi ở sảnh H1",
    status: "open",
  };

  describe("scoreMatch - Quy tắc 30/30/20/20", () => {
    it("đạt 100 điểm tối đa khi khớp toàn bộ 4 tiêu chí (TC-005)", () => {
      const result = scoreMatch(baseLost, baseFound);

      expect(result.score).toBe(100);
      expect(result.reasons).toHaveLength(4);
      expect(result.reasons).toContain(MATCH_REASON_TEXTS.SAME_CATEGORY);
      expect(result.reasons).toContain(MATCH_REASON_TEXTS.SAME_LOCATION);
      expect(result.reasons).toContain(MATCH_REASON_TEXTS.WITHIN_THREE_DAYS);
      expect(result.reasons).toContain(MATCH_REASON_TEXTS.SHARED_KEYWORD);
    });

    it("chỉ cộng 30 điểm khi chỉ cùng category", () => {
      const found: MatchableReport = {
        ...baseFound,
        location: "canteen",
        eventDate: "2026-09-10", // lệch 10 ngày (> 3 ngày)
        title: "Giấy tờ tùy thân",
        description: "Thẻ thư viện vô danh",
      };

      const result = scoreMatch(baseLost, found);
      expect(result.score).toBe(30);
      expect(result.reasons).toEqual([MATCH_REASON_TEXTS.SAME_CATEGORY]);
    });

    it("chỉ cộng 30 điểm khi chỉ cùng location", () => {
      const found: MatchableReport = {
        ...baseFound,
        category: "electronics", // khác category
        eventDate: "2026-09-01",
        title: "Cáp sạc điện thoại",
        description: "Dây cáp type C màu trắng",
      };

      const result = scoreMatch(baseLost, found);
      expect(result.score).toBe(30);
      expect(result.reasons).toEqual([MATCH_REASON_TEXTS.SAME_LOCATION]);
    });

    it("chỉ cộng 20 điểm ngày khi chênh lệch <= 3 ngày", () => {
      const found: MatchableReport = {
        ...baseFound,
        category: "electronics",
        location: "sports",
        eventDate: "2026-09-23", // lệch đúng 3 ngày (20 đến 23)
        title: "Bình giữ nhiệt",
        description: "Bình nước locknlock màu xanh",
      };

      const result = scoreMatch(baseLost, found);
      expect(result.score).toBe(20);
      expect(result.reasons).toEqual([MATCH_REASON_TEXTS.WITHIN_THREE_DAYS]);
    });

    it("không cộng điểm ngày khi chênh lệch 4 ngày trở lên (TC-006)", () => {
      const found: MatchableReport = {
        ...baseFound,
        category: "electronics",
        location: "sports",
        eventDate: "2026-09-24", // lệch 4 ngày
        title: "Bình giữ nhiệt",
        description: "Bình locknlock",
      };

      const result = scoreMatch(baseLost, found);
      expect(result.score).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it("chỉ cộng 20 điểm từ khóa khi có từ khóa tương đồng (>= 4 ký tự)", () => {
      const found: MatchableReport = {
        ...baseFound,
        category: "electronics",
        location: "sports",
        eventDate: "2026-09-01",
        title: "Tìm chủ món đồ pedro", // "pedro" >= 4 ký tự
        description: "Nhặt được một món đồ",
      };

      const result = scoreMatch(baseLost, found);
      expect(result.score).toBe(20);
      expect(result.reasons).toEqual([MATCH_REASON_TEXTS.SHARED_KEYWORD]);
    });

    it("xử lý tiếng Việt có dấu và không dấu khi so khớp từ khóa", () => {
      const lost: MatchableReport = {
        ...baseLost,
        title: "Mất tai nghe Bluetooth Sony",
        description: "Màu đen, có hộp sạc",
      };
      const found: MatchableReport = {
        ...baseFound,
        category: "clothing",
        location: "parking",
        eventDate: "2026-09-01",
        title: "Nhat duoc tai nghe bluetooth",
        description: "Hop sac mau den",
      };

      const result = scoreMatch(lost, found);
      expect(result.score).toBe(20);
      expect(result.reasons).toContain(MATCH_REASON_TEXTS.SHARED_KEYWORD);
    });

    it("tính chất bất biến (deterministic): cùng input luôn cho cùng output", () => {
      const run1 = scoreMatch(baseLost, baseFound);
      const run2 = scoreMatch(baseLost, baseFound);
      expect(run1).toEqual(run2);
    });
  });

  describe("Quy tắc so sánh cặp và tính hợp lệ", () => {
    it("trả về 0 điểm nếu so sánh giữa hai tin Lost (Lost - Lost)", () => {
      const lost2: MatchableReport = { ...baseLost, id: "lost-2" };
      const result = scoreMatch(baseLost, lost2);
      expect(result.score).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it("trả về 0 điểm nếu so sánh giữa hai tin Found (Found - Found)", () => {
      const found2: MatchableReport = { ...baseFound, id: "found-2" };
      const result = scoreMatch(baseFound, found2);
      expect(result.score).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });

    it("trả về 0 điểm nếu truyền ngược thứ tự (Found vào lost, Lost vào found)", () => {
      const result = scoreMatch(baseFound, baseLost);
      expect(result.score).toBe(0);
      expect(result.reasons).toHaveLength(0);
    });
  });

  describe("Xử lý dữ liệu thiếu hoặc không hợp lệ (Edge cases)", () => {
    it("không crash và không cộng điểm giả khi description là null hoặc undefined", () => {
      const lost: MatchableReport = {
        ...baseLost,
        description: null,
      };
      const found: MatchableReport = {
        ...baseFound,
        description: undefined,
      };

      expect(() => scoreMatch(lost, found)).not.toThrow();
      const result = scoreMatch(lost, found);
      // Vẫn cộng 30 (category) + 30 (location) + 20 (date) = 80
      expect(result.score).toBe(80);
    });

    it("không crash khi ngày bị sai định dạng và không tính điểm ngày", () => {
      const lost: MatchableReport = {
        ...baseLost,
        eventDate: "invalid-date",
      };
      const result = scoreMatch(lost, baseFound);
      expect(result.reasons).not.toContain(MATCH_REASON_TEXTS.WITHIN_THREE_DAYS);
    });

    it("không crash khi category hoặc location rỗng", () => {
      const lost: MatchableReport = {
        ...baseLost,
        category: "",
        location: "",
      };
      const result = scoreMatch(lost, baseFound);
      expect(result.reasons).not.toContain(MATCH_REASON_TEXTS.SAME_CATEGORY);
      expect(result.reasons).not.toContain(MATCH_REASON_TEXTS.SAME_LOCATION);
    });
  });

  describe("findPotentialMatches - Ngưỡng 50 điểm và sắp xếp", () => {
    it("chỉ trả về các tin đạt score >= 50 và sắp xếp giảm dần theo điểm", () => {
      const match100: MatchableReport = { ...baseFound, id: "found-100" };

      // Cùng category (30) + cùng date (20) = 50 điểm (đạt ngưỡng)
      const match50: MatchableReport = {
        ...baseFound,
        id: "found-50",
        location: "canteen",
        title: "Một món đồ khác",
        description: "Không có từ khóa trùng",
      };

      // Chỉ có date (20) + keyword (20) = 40 điểm (dưới ngưỡng 50)
      const match40: MatchableReport = {
        ...baseFound,
        id: "found-40",
        category: "study",
        location: "canteen",
      };

      // Đã trao trả (returned) -> phải bị loại trừ
      const matchReturned: MatchableReport = {
        ...baseFound,
        id: "found-returned",
        status: "returned",
      };

      // Đã đóng (closed) -> phải bị loại trừ
      const matchClosed: MatchableReport = {
        ...baseFound,
        id: "found-closed",
        status: "closed",
      };

      const candidates = [match40, match50, matchReturned, matchClosed, match100];
      const results = findPotentialMatches(baseLost, candidates);

      expect(results).toHaveLength(2);
      expect(results[0].report.id).toBe("found-100");
      expect(results[0].score).toBe(100);
      expect(results[1].report.id).toBe("found-50");
      expect(results[1].score).toBe(50);
    });

    it("trả về mảng rỗng nếu tin cần tìm không phải là 'lost'", () => {
      const results = findPotentialMatches(baseFound, [baseFound]);
      expect(results).toEqual([]);
    });

    it("trả về mảng rỗng khi không có tin nào đạt ngưỡng 50 điểm", () => {
      const lowCandidate: MatchableReport = {
        ...baseFound,
        category: "other",
        location: "other",
        eventDate: "2026-01-01",
        title: "Khác hoàn toàn",
        description: "Không liên quan gì",
      };
      const results = findPotentialMatches(baseLost, [lowCandidate]);
      expect(results).toEqual([]);
    });
  });

  describe("Hàm phụ trợ normalize (daysBetween, extractKeywords)", () => {
    it("daysBetween tính chính xác số ngày bất kể thứ tự trước sau", () => {
      expect(daysBetween("2026-09-20", "2026-09-23")).toBe(3);
      expect(daysBetween("2026-09-23", "2026-09-20")).toBe(3);
      expect(daysBetween("2026-09-20", "2026-09-20")).toBe(0);
      expect(daysBetween(null, "2026-09-20")).toBeNull();
    });

    it("extractKeywords bỏ qua các từ ngắn dưới 4 ký tự", () => {
      // "vi" (2 ký tự), "da" (2 ký tự) bị loại; "pedro" (5 ký tự) được giữ
      const keywords = extractKeywords("Ví da Pedro");
      expect(keywords.has("vi")).toBe(false);
      expect(keywords.has("da")).toBe(false);
      expect(keywords.has("pedro")).toBe(true);
    });
  });
});
