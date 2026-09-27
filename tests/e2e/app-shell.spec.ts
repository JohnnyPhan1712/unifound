import { expect, test } from "@playwright/test";

test("renders the app shell", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("UniFound");
  await expect(page.getByRole("link", { name: /UniFound/ })).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: "Tìm lại đồ nhanh hơn, trả lại đồ đúng người" }),
  ).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Điều hướng chính" });
  await expect(nav.getByRole("link", { name: "Tin mới" })).toHaveAttribute("aria-current", "page");
  await expect(nav.getByRole("link", { name: "Đăng tin" })).toBeVisible();
});
