import { expect, test } from "@playwright/test";
import { DEMO, loginAs, postFoundReport } from "./helpers";

test("email ngoài trường bị server từ chối", async ({ page }) => {
  await page.goto("/register");
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Email sinh viên").fill("someone@gmail.com");
  await page.getByLabel(/^Mật khẩu/).fill("matkhau123");
  await page.getByLabel("Nhập lại mật khẩu").fill("matkhau123");
  await page.getByRole("button", { name: "Tạo tài khoản" }).click();
  await expect(page.getByText("Chỉ nhận email do trường cấp")).toBeVisible();
  await expect(page).toHaveURL(/\/register/);
});

test("khách không vào được trang cần đăng nhập", async ({ page }) => {
  await page.goto("/reports/new");
  await expect(page).toHaveURL(/\/login\?next=%2Freports%2Fnew/);
});

test("claim sai quyền: tự gửi vào tin mình, người ngoài mở yêu cầu", async ({ browser }) => {
  const finder = await loginAs(browser, DEMO.finder);
  const reportId = await postFoundReport(finder, `Tin kiểm tra quyền E2E ${Date.now()}`);

  // Chủ tin không có nút và không gửi được yêu cầu vào tin của mình
  await expect(finder.getByText("Gửi yêu cầu nhận lại")).toHaveCount(0);
  await finder.goto(`/reports/${reportId}/claim`);
  await expect(finder.getByText("Bạn không thể gửi yêu cầu vào tin của chính mình.")).toBeVisible();

  // Người mất gửi yêu cầu; người thứ ba mở URL yêu cầu → 404, không thấy câu trả lời
  const owner = await loginAs(browser, DEMO.owner);
  await owner.goto(`/reports/${reportId}`);
  await owner.waitForLoadState("networkidle");
  await owner.getByLabel("Câu trả lời của bạn").fill("Câu trả lời riêng tư E2E");
  await owner.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(owner).toHaveURL(/\/claims\/[0-9a-f-]{36}/);
  const claimUrl = owner.url().replace(/\?.*$/, "");

  const other = await loginAs(browser, DEMO.other);
  await other.goto(claimUrl);
  await expect(other.getByText("Không tìm thấy trang")).toBeVisible();
  expect(await other.content()).not.toContain("Câu trả lời riêng tư E2E");
});
