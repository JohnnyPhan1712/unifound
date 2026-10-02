import { expect, test } from "@playwright/test";

// CHG-025: thanh tìm kiếm & bộ lọc bảng tin. Không cần đăng nhập, chỉ cần dữ liệu seed.
const bar = (page: import("@playwright/test").Page) => page.getByRole("search");

test("TC-025-01 4 phân đoạn, nhãn Danh mục, không còn dải icon danh mục", async ({ page }) => {
  await page.goto("/");
  const s = bar(page);
  await expect(s.getByText("Tìm kiếm", { exact: true })).toBeVisible();
  await expect(s.getByRole("button", { name: /Danh mục/ })).toBeVisible();
  await expect(s.getByRole("button", { name: /Vị trí/ })).toBeVisible();
  await expect(s.getByRole("button", { name: /Thời gian/ })).toBeVisible();
  await expect(page.getByText("Đồ vật", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Lọc theo danh mục" })).toHaveCount(0);
});

test("TC-025-02 một popover mở một lúc, Esc và click ngoài đóng, thanh sticky khi cuộn", async ({ page }) => {
  await page.goto("/");
  const s = bar(page);
  const cat = s.getByRole("button", { name: /Danh mục/ });
  const time = s.getByRole("button", { name: /Thời gian/ });
  await cat.click();
  await expect(s.getByText("Tất cả danh mục")).toBeVisible();
  await time.click();
  await expect(s.getByText("Tất cả danh mục")).toBeHidden();
  await expect(s.getByLabel("Từ ngày")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(s.getByLabel("Từ ngày")).toBeHidden();
  await cat.click();
  await page.mouse.click(5, 400);
  await expect(s.getByText("Tất cả danh mục")).toBeHidden();

  await page.evaluate(() => window.scrollTo(0, 600));
  await expect.poll(async () => (await s.boundingBox())!.y).toBeLessThanOrEqual(1);
});

test("TC-025-03 từ khóa + danh mục + ngày → URL, chip, xóa từng chip và xóa tất cả", async ({ page }) => {
  await page.goto("/");
  const s = bar(page);
  await s.getByRole("button", { name: /Danh mục/ }).click();
  await s.getByText("Chìa khóa", { exact: true }).click();
  await s.getByRole("button", { name: /Thời gian/ }).click();
  await s.getByLabel("Từ ngày").fill("2026-01-01");
  await s.getByPlaceholder("Tai nghe, ví, chìa khóa…").fill("chìa");
  await s.getByRole("button", { name: "Tìm kiếm", exact: true }).click();
  await expect(page).toHaveURL(/q=ch%C3%ACa/);
  await expect(page).toHaveURL(/category=[0-9a-f-]{36}/);
  await expect(page).toHaveURL(/from=2026-01-01/);
  const chips = page.getByRole("list", { name: "Bộ lọc đang bật" });
  await expect(chips.getByRole("listitem")).toHaveCount(3);

  await page.getByRole("link", { name: "Bỏ “chìa”" }).click();
  await expect(chips.getByRole("listitem")).toHaveCount(2);
  await page.getByRole("link", { name: "Xóa tất cả" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(chips).toHaveCount(0);
});

test("TC-025-04 không có gợi ý tìm kiếm sau khi gõ", async ({ page }) => {
  await page.goto("/");
  const input = bar(page).getByPlaceholder("Tai nghe, ví, chìa khóa…");
  await expect(input).toHaveAttribute("type", "text");
  await expect(input).toHaveAttribute("autocomplete", "off");
  await input.fill("v");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await expect(bar(page).getByText(/Gợi ý/)).toHaveCount(0);
});

test("TC-025-05 chọn trường chỉ còn khu vực của trường đó", async ({ page }) => {
  await page.goto("/");
  const s = bar(page);
  await s.getByRole("button", { name: /Vị trí/ }).click();
  const location = s.getByLabel("Khu vực");
  await expect(location.getByRole("option", { name: "Thư viện KHTN Linh Trung" })).toHaveCount(1);
  await s.getByLabel("Trường", { exact: true }).selectOption({ label: "Trường ĐH Công nghệ Thông tin" });
  await expect(location.getByRole("option", { name: "Thư viện UIT" })).toHaveCount(1);
  await expect(location.getByRole("option", { name: "Thư viện KHTN Linh Trung" })).toHaveCount(0);
  await expect(location.getByRole("option", { name: "KTX khu A ĐHQG" })).toHaveCount(0);
});

test("TC-025-06 mobile: đủ 4 tiêu chí, popover không tràn màn hình", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  const s = bar(page);
  for (const name of [/Danh mục/, /Vị trí/, /Thời gian/]) await expect(s.getByRole("button", { name })).toBeVisible();
  await expect(s.getByPlaceholder("Tai nghe, ví, chìa khóa…")).toBeVisible();
  await s.getByRole("button", { name: /Vị trí/ }).click();
  const box = (await s.getByLabel("Trường", { exact: true }).boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("TC-025-07 dark mode: thanh tìm kiếm không còn nền trắng, chữ sáng", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const pill = bar(page).locator("div.rounded-full").first();
  const bg = await pill.evaluate((el) => getComputedStyle(el).backgroundColor);
  const fg = await bar(page).getByPlaceholder("Tai nghe, ví, chìa khóa…").evaluate((el) => getComputedStyle(el).color);
  const lum = (c: string) => c.match(/\d+/g)!.slice(0, 3).map(Number).reduce((a, b) => a + b, 0);
  expect(lum(bg)).toBeLessThan(200);
  expect(lum(fg)).toBeGreaterThan(400);
});

test("TC-025-08 mobile: hai ô ngày xếp dọc, nằm trong popover, không chồng nhau", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const s = bar(page);
  await s.getByRole("button", { name: /Thời gian/ }).click();
  const from = (await s.getByLabel("Từ ngày").boundingBox())!;
  const to = (await s.getByLabel("Đến ngày").boundingBox())!;
  const pop = (await s.getByLabel("Từ ngày").locator("xpath=ancestor::div[contains(@class,'absolute')][1]").boundingBox())!;
  for (const b of [from, to]) {
    expect(b.x).toBeGreaterThanOrEqual(pop.x);
    expect(b.x + b.width).toBeLessThanOrEqual(pop.x + pop.width);
  }
  expect(to.y).toBeGreaterThanOrEqual(from.y + from.height);
});
