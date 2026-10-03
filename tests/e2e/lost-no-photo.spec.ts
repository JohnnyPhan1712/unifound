import { expect, test } from "@playwright/test";
import { DEMO, loginAs } from "./helpers";

test("tin Mất đồ đăng được không cần ảnh; tin Nhặt được vẫn bắt buộc ảnh", async ({ browser }) => {
  const page = await loginAs(browser, DEMO.owner);
  await page.goto("/reports/new?type=LOST");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Ảnh đồ vật (không bắt buộc)")).toBeVisible();

  await page.getByLabel("Tiêu đề").fill(`Mất ví không ảnh E2E ${Date.now()}`);
  await page.locator("#f-categoryId label", { hasText: "Ví / giấy tờ" }).click();
  await page.getByLabel("Mất ở đâu (gần đúng)").selectOption({ label: "Thư viện UIT" });
  await page.getByLabel("Mô tả").fill("Ví vải màu xám, mất quanh thư viện. Tin tạo bởi E2E.");
  await page.locator("main form").getByRole("button", { name: "Đăng tin" }).click();
  await expect(page).toHaveURL(/\/reports\/[0-9a-f-]{36}\?created=1/, { timeout: 90_000 });

  // Đổi sang Nhặt được mà không ảnh → bị từ chối ở server
  await page.goto("/reports/new?type=FOUND");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Ảnh đồ vật (không bắt buộc)")).toHaveCount(0);
  await page.getByLabel("Tiêu đề").fill("Nhặt ví không ảnh E2E");
  await page.locator("#f-categoryId label", { hasText: "Ví / giấy tờ" }).click();
  await page.getByLabel("Nhặt được ở đâu").selectOption({ label: "Thư viện UIT" });
  await page.getByLabel("Mô tả").fill("Ví vải màu xám, nhặt được trên bàn. Tin tạo bởi E2E.");
  await page.getByLabel("Nơi đang giữ đồ").fill("Quầy thủ thư tầng 1");
  await page.getByLabel("Câu hỏi xác minh").fill("Trong ví có thẻ gì?");
  await page.getByLabel("Đáp án (chỉ bạn thấy)").fill("Thẻ thư viện E2E");
  await page.locator("main form").getByRole("button", { name: "Đăng tin" }).click();
  await expect(page.getByText("Cần ít nhất 1 ảnh.").first()).toBeVisible({ timeout: 90_000 });
  await expect(page).not.toHaveURL(/created=1/);
});
