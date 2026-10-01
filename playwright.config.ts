import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

// Test E2E đăng nhập bằng tài khoản demo do `npm run db:seed` tạo (mật khẩu: SEED_DEMO_PASSWORD).
if (fs.existsSync(".env.local")) process.loadEnvFile(".env.local");

// E2E_BASE_URL cho phép chạy lại golden path trên bản deploy (vd. URL Vercel) mà không bật dev server.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  // Các bước của golden path dùng chung dữ liệu, chạy tuần tự cho ổn định
  fullyParallel: false,
  workers: 1,
  timeout: 180_000,
  expect: { timeout: 20_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
