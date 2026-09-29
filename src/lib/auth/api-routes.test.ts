import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET as getMe } from "@/app/api/auth/me/route";
import { POST as registerPost } from "@/app/api/auth/register/route";
import { POST as forgotPasswordPost } from "@/app/api/auth/forgot-password/route";
import { POST as createReportPost } from "@/app/api/reports/route";
import { PUT as updateReportPut, DELETE as deleteReportDelete } from "@/app/api/reports/[id]/route";

describe("API Routes Security & Verification (CHG-008)", () => {
  describe("GET /api/auth/me", () => {
    it("should return 401 Unauthorized when no user session exists", async () => {
      const response = await getMe();
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/bạn cần đăng nhập/i);
    });
  });

  describe("POST /api/auth/register", () => {
    it("should return 400 Bad Request if validation fails (e.g. invalid email)", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: "invalid-email-format",
          password: "123",
          confirmPassword: "456",
        }),
      });

      const response = await registerPost(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toBeDefined();
    });

    it("should return 400 Bad Request if passwords do not match", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password456",
        }),
      });

      const response = await registerPost(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/không khớp/i);
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should return 400 Bad Request if email is invalid", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: "invalid-email" }),
      });

      const response = await forgotPasswordPost(req);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/hợp lệ/i);
    });
  });

  describe("Protected Reports APIs - Unauthenticated Access (Case 1)", () => {
    it("POST /api/reports should return 401 when user is not logged in", async () => {
      const req = new NextRequest("http://localhost:3000/api/reports", {
        method: "POST",
        body: JSON.stringify({
          type: "lost",
          title: "Mất ví tiền",
          category: "wallet-docs",
          location: "H1",
          description: "Mô tả chi tiết",
          eventDate: "2026-09-23",
        }),
      });

      const response = await createReportPost(req);
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/cần đăng nhập/i);
    });

    it("PUT /api/reports/:id should return 401 when user is not logged in", async () => {
      const req = new NextRequest("http://localhost:3000/api/reports/123", {
        method: "PUT",
        body: JSON.stringify({
          title: "Sửa tiêu đề bài đăng",
        }),
      });

      const params = Promise.resolve({ id: "10000000-0000-4000-b000-000000000001" });
      const response = await updateReportPut(req, { params });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/cần đăng nhập/i);
    });

    it("DELETE /api/reports/:id should return 401 when user is not logged in", async () => {
      const req = new NextRequest("http://localhost:3000/api/reports/123", {
        method: "DELETE",
      });

      const params = Promise.resolve({ id: "10000000-0000-4000-b000-000000000001" });
      const response = await deleteReportDelete(req, { params });
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body.success).toBe(false);
      expect(body.error).toMatch(/cần đăng nhập/i);
    });
  });
});
