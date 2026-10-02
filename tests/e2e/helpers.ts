import { expect, type Browser, type Page } from "@playwright/test";
import path from "node:path";

export const DEMO = {
  finder: "unifound.demo2@gm.uit.edu.vn",
  owner: "unifound.demo1@gm.uit.edu.vn",
  other: "unifound.demo3@gm.uit.edu.vn",
};

export const FIXTURE = path.join(__dirname, "fixtures", "item-1.jpg");

export async function loginAs(browser: Browser, email: string): Promise<Page> {
  const password = process.env.SEED_DEMO_PASSWORD;
  if (!password) throw new Error("Thiếu SEED_DEMO_PASSWORD (chạy `npm run db:seed` với biến này trong .env.local)");
  const page = await (await browser.newContext()).newPage();
  page.on("dialog", (d) => d.accept());
  await page.goto("/?auth=login");
  await page.waitForLoadState("networkidle");
  const dialog = page.getByRole("dialog", { name: "Đăng nhập" });
  await dialog.getByLabel("Email sinh viên").fill(email);
  await dialog.locator("input[name=password]").fill(password);
  await dialog.getByRole("button", { name: "Đăng nhập" }).click();
  await expect(dialog).toBeHidden();
  return page;
}

/** Đăng tin Nhặt được kèm 1 ảnh; trả id tin. */
export async function postFoundReport(page: Page, title: string) {
  await page.goto("/reports/new?type=FOUND");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Tiêu đề").fill(title);
  await page.locator("#f-categoryId label", { hasText: "Ví / giấy tờ" }).click();
  await page.getByLabel("Nhặt được ở đâu").selectOption({ label: "Thư viện UIT" });
  await page.getByLabel("Mô tả").fill("Ví vải màu xám, nhặt được trên bàn tầng 2 thư viện. Tin tạo bởi E2E.");
  await page.locator("input[type=file]").setInputFiles(FIXTURE);
  await expect(page.locator("input[name=images]")).not.toHaveValue("[]");
  await page.getByLabel("Nơi đang giữ đồ").fill("Quầy thủ thư tầng 1");
  await page.getByLabel("Câu hỏi xác minh").fill("Trong ví có thẻ gì?");
  await page.getByLabel("Đáp án (chỉ bạn thấy)").fill("Thẻ thư viện E2E");
  await page.locator("main form").getByRole("button", { name: "Đăng tin" }).click();
  await expect(page).toHaveURL(/\/reports\/[0-9a-f-]{36}\?created=1/);
  return page.url().match(/reports\/([0-9a-f-]{36})/)![1];
}
