import { expect, test } from "@playwright/test";
import { DEMO, loginAs } from "./helpers";

const hydrated = (page: import("@playwright/test").Page) => page.waitForLoadState("networkidle");

test("header: avatar rồi menu; menu khách chỉ có Đăng nhập, Đăng ký, Trợ giúp", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  const buttons = page.locator("header .flex.items-center.justify-end").locator("a[aria-label='Đăng nhập'], button[aria-label='Mở menu']");
  await expect(buttons).toHaveCount(2);
  await expect(buttons.nth(0)).toHaveAttribute("aria-label", "Đăng nhập");
  await expect(buttons.nth(1)).toHaveAttribute("aria-label", "Mở menu");
  await expect(page.locator("header").getByRole("link", { name: "Đăng nhập", exact: true })).toHaveCount(1); // chỉ avatar, không còn nút rời

  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.getByRole("menuitem")).toHaveText(["Đăng nhập", "Đăng ký", "Trợ giúp"]);
});

test("popup: đăng nhập → quên mật khẩu → quay lại đăng nhập → đăng ký", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  await page.getByRole("link", { name: "Đăng nhập", exact: true }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Chào mừng đến UniFound" })).toBeVisible();

  await dialog.getByRole("link", { name: "Quên mật khẩu?" }).click();
  await expect(dialog.getByRole("heading", { name: "Đặt lại mật khẩu" })).toBeVisible();
  await dialog.getByLabel("Email sinh viên").fill("khong-hop-le@gmail.com");
  await dialog.getByRole("button", { name: "Gửi hướng dẫn đặt lại mật khẩu" }).click();
  await expect(dialog.getByText("Chỉ nhận email do trường cấp")).toBeVisible();
  await expect(dialog.getByLabel("Email sinh viên")).toHaveValue("khong-hop-le@gmail.com"); // giữ lại email khi lỗi

  await dialog.getByRole("link", { name: "Quay lại đăng nhập" }).click();
  await expect(dialog.getByRole("heading", { name: "Chào mừng đến UniFound" })).toBeVisible();
  await dialog.getByRole("link", { name: "Đăng ký" }).click();
  await expect(dialog.getByRole("heading", { name: "Tạo tài khoản" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("URL cũ /login, /register, /forgot-password mở đúng popup", async ({ page }) => {
  for (const [url, heading] of [
    ["/login?next=%2Fmy", "Chào mừng đến UniFound"],
    ["/register", "Tạo tài khoản"],
    ["/forgot-password?error=expired", "Đặt lại mật khẩu"],
  ]) {
    await page.goto(url);
    await expect(page.getByRole("dialog").getByRole("heading", { name: heading })).toBeVisible();
  }
  await expect(page.getByRole("dialog").getByText("Liên kết đã hết hạn")).toBeVisible();
});

test("“Đăng tin” khi chưa đăng nhập mở popup, đăng nhập xong về /reports/new", async ({ page }) => {
  const password = process.env.SEED_DEMO_PASSWORD;
  test.skip(!password, "Cần SEED_DEMO_PASSWORD");
  await page.goto("/");
  await hydrated(page);
  await page.locator("header").getByRole("link", { name: "Đăng tin" }).first().click();
  const dialog = page.getByRole("dialog", { name: "Đăng nhập" });
  await dialog.getByLabel("Email sinh viên").fill(DEMO.finder);
  await dialog.locator("input[name=password]").fill(password!);
  await dialog.getByRole("button", { name: "Đăng nhập" }).click();
  await expect(page).toHaveURL(/\/reports\/new$/);
});

test("đã đăng nhập: avatar chỉ mở hồ sơ; mọi mục tài khoản và Đăng xuất nằm ở menu", async ({ browser }) => {
  const page = await loginAs(browser, DEMO.finder);
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.getByRole("menuitem")).toHaveText([/Tin và yêu cầu của tôi/, "Gợi ý trùng khớp", /^Thông báo/, "Đăng tin mới", "Trợ giúp", "Đăng xuất"]);
  await page.keyboard.press("Escape");

  await page.getByRole("link", { name: /^Hồ sơ của/ }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByRole("menuitem", { name: "Đăng xuất" })).toBeHidden(); // không có menu thả xuống từ avatar

  await page.getByRole("button", { name: "Mở menu" }).click();
  await page.getByRole("menuitem", { name: "Đăng xuất" }).click();
  await expect(page.getByRole("link", { name: "Đăng nhập", exact: true }).first()).toBeVisible();
});

test("trợ giúp nổi: ẩn khi cuộn, hiện lại ở đầu trang; modal tiếng Việt có bài viết", async ({ page }) => {
  await page.goto("/");
  await hydrated(page);
  const fab = page.getByRole("link", { name: "Trợ giúp" });
  await expect(fab).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(fab).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(fab).toBeVisible();

  await fab.click();
  const dialog = page.getByRole("dialog", { name: "Trung tâm trợ giúp UniFound" });
  await expect(dialog.getByRole("heading", { name: "Tôi bị mất đồ" })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Tôi nhặt được đồ" })).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Điểm tiếp nhận đồ trực tiếp" })).toBeVisible();
  await dialog.getByRole("button", { name: "Cách đăng tin Nhặt được" }).click();
  await expect(dialog.getByRole("heading", { name: "Cách đăng tin Nhặt được" })).toBeVisible();
  await dialog.getByRole("button", { name: "Tất cả bài viết" }).click();
  await dialog.getByRole("button", { name: "Đóng" }).click();
  await expect(dialog).toBeHidden();
});

test("footer 4 cột đủ nội dung", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  for (const name of ["Khám phá", "Khuôn viên liên kết", "Điểm tiếp nhận trực tiếp"]) {
    await expect(footer.getByRole("heading", { name })).toBeVisible();
  }
  await expect(footer.getByText("UniFound giúp sinh viên")).toBeVisible();
  await footer.getByRole("link", { name: "Tin Mất đồ" }).click();
  await expect(page).toHaveURL(/type=LOST/);
});

test("không còn chế độ Tối: hệ điều hành tối và giá trị theme cũ đều bị bỏ qua", async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: "dark" });
  await ctx.addInitScript(() => localStorage.setItem("theme", "dark"));
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(255, 255, 255)");
  await hydrated(page);
  await page.getByRole("button", { name: "Mở menu" }).click();
  await expect(page.getByRole("menuitem", { name: /Chế độ/ })).toHaveCount(0);
});
