import { expect, test, type Page } from "@playwright/test";

// Relies on the safe demo data from `npm run db:seed` (CHG-007).
const WALLET_FOUND = "Ví da đen nhặt ở thư viện";
const WALLET_LOST = "Ví da nam màu đen";
const CALCULATOR = "Máy tính Casio có sticker";
const WALLET_FOUND_OWNER_EMAIL = "student.b@unifound.demo";

function searchForm(page: Page) {
  return page.getByRole("search", { name: "Tìm kiếm và lọc tin" });
}

test.describe("public report discovery", () => {
  test("guest can search the feed by keyword", async ({ page }) => {
    await page.goto("/");

    await searchForm(page).getByLabel("Từ khóa").fill("Casio");
    await searchForm(page).getByRole("button", { name: "Tìm" }).click();

    await expect(page).toHaveURL(/q=Casio/);
    await expect(page.getByRole("heading", { name: CALCULATOR })).toBeVisible();
    await expect(page.getByRole("heading", { name: WALLET_LOST })).toHaveCount(0);
  });

  test("type chips and selects apply filters immediately", async ({ page }) => {
    await page.goto("/?q=V%C3%AD");

    await searchForm(page).locator("label", { hasText: "Đồ nhặt được" }).click();
    await expect(page).toHaveURL(/type=found/);
    await expect(searchForm(page).getByRole("radio", { name: /Đồ nhặt được/ })).toBeChecked();
    await searchForm(page).getByLabel("Khu vực").selectOption({ label: "Thư viện H6" });
    await expect(page).toHaveURL(/location=H6/);

    await expect(page.getByRole("heading", { name: WALLET_FOUND })).toBeVisible();
    await expect(page.getByRole("heading", { name: WALLET_LOST })).toHaveCount(0);
  });

  test("shows an empty state with a way to reset filters", async ({ page }) => {
    await page.goto("/?q=khong-ton-tai-trong-du-lieu-mau");

    await expect(page.getByRole("heading", { name: "Không tìm thấy tin phù hợp" })).toBeVisible();
    await page.getByRole("link", { name: "Đặt lại bộ lọc" }).last().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(searchForm(page).getByLabel("Từ khóa")).toHaveValue("");
  });

  test("guest can open a report detail without seeing private owner data", async ({ page }) => {
    await page.goto(`/?q=${encodeURIComponent(WALLET_FOUND)}`);
    await page.getByRole("link", { name: new RegExp(WALLET_FOUND) }).click();

    await expect(page.getByRole("heading", { level: 1, name: WALLET_FOUND })).toBeVisible();
    await expect(page.getByText("Ví / giấy tờ")).toBeVisible();
    await expect(page.getByText("Thư viện H6")).toBeVisible();
    await expect(page.locator("body")).not.toContainText(WALLET_FOUND_OWNER_EMAIL);
  });

  test("unknown report ids show a not-found state", async ({ page }) => {
    await page.goto("/reports/not-a-report");
    await expect(page.getByRole("heading", { name: "Không tìm thấy tin" })).toBeVisible();

    await page.goto("/reports/10000000-0000-4000-b000-999999999999");
    await expect(page.getByRole("heading", { name: "Không tìm thấy tin" })).toBeVisible();
  });

  test("guest is asked to sign in instead of seeing the create form", async ({ page }) => {
    await page.goto("/reports/new?type=found");

    await expect(page.getByRole("heading", { name: "Bạn cần đăng nhập để đăng tin" })).toBeVisible();
    await expect(page.getByRole("button", { name: /Đăng tin/ })).toHaveCount(0);
  });
});

test.describe("mobile layout", () => {
  test.use({ viewport: { width: 375, height: 740 } });

  for (const path of ["/", `/?q=${encodeURIComponent(WALLET_FOUND)}`, "/reports/new"]) {
    test(`does not overflow horizontally on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
