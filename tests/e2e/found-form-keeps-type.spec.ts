import { expect, test } from "@playwright/test";
import { DEMO, FIXTURE, loginAs } from "./helpers";

for (const [type, label] of [
  ["FOUND", "Tôi nhặt được đồ"],
  ["LOST", "Tôi bị mất đồ"],
] as const) {
  test(`form đăng tin giữ nguyên loại ${type} sau khi server báo lỗi`, async ({ browser }) => {
    const page = await loginAs(browser, DEMO.owner);
    await page.goto("/reports/new?type=LOST");
    await page.waitForLoadState("networkidle");
    await page.getByLabel(label).check();

    await page.locator("main form").getByRole("button", { name: "Đăng tin" }).click();
    await expect(page.getByText("mục cần sửa trước khi lưu")).toBeVisible({ timeout: 90_000 });

    await expect(page.getByLabel(label)).toBeChecked();
    await expect(page.getByLabel("Nơi đang giữ đồ")).toHaveCount(type === "FOUND" ? 1 : 0);
  });
}

test("sửa lỗi rồi gửi lại: tin được tạo đúng loại Nhặt được", async ({ browser }) => {
  const page = await loginAs(browser, DEMO.finder);
  await page.goto("/reports/new?type=LOST");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Tôi nhặt được đồ").check();
  const submit = page.locator("main form").getByRole("button", { name: "Đăng tin" });
  await submit.click();
  await expect(page.getByText("mục cần sửa trước khi lưu")).toBeVisible({ timeout: 90_000 });

  await page.getByLabel("Tiêu đề").fill(`Nhặt ví sau lỗi E2E ${Date.now()}`);
  await page.locator("#f-categoryId label", { hasText: "Ví / giấy tờ" }).click();
  await page.getByLabel("Nhặt được ở đâu").selectOption({ label: "Thư viện UIT" });
  await page.getByLabel("Mô tả").fill("Ví vải màu xám, nhặt được trên bàn tầng 2. Tin tạo bởi E2E.");
  await page.locator("input[type=file]").setInputFiles(FIXTURE);
  await expect(page.locator("input[name=images]")).not.toHaveValue("[]");
  await page.getByLabel("Nơi đang giữ đồ").fill("Quầy thủ thư tầng 1");
  await page.getByLabel("Câu hỏi xác minh").fill("Trong ví có thẻ gì?");
  await page.getByLabel("Đáp án (chỉ bạn thấy)").fill("Thẻ thư viện E2E");
  await submit.click();
  await expect(page).toHaveURL(/\/reports\/[0-9a-f-]{36}\?created=1/, { timeout: 240_000 });
  await expect(page.getByText("Ngày nhặt được")).toBeVisible();
});
