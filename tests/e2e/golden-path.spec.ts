import { expect, test } from "@playwright/test";
import { DEMO, loginAs, postFoundReport } from "./helpers";

// Luồng chính: đăng nhập → đăng tin → gửi yêu cầu → chấp nhận → hai bên xác nhận → Đã trả.
test("golden path: tin Nhặt được về đúng chủ", async ({ browser }) => {
  const title = `Nhặt được ví xám E2E ${Date.now()}`;

  const finder = await loginAs(browser, DEMO.finder);
  const reportId = await postFoundReport(finder, title);

  // Đáp án xác minh không lộ trên chi tiết công khai
  const guest = await (await browser.newContext()).newPage();
  await guest.goto(`/reports/${reportId}`);
  await expect(guest.getByRole("heading", { level: 1 })).toHaveText(title);
  expect(await guest.content()).not.toContain("Thẻ thư viện E2E");

  // Người mất gửi yêu cầu
  const owner = await loginAs(browser, DEMO.owner);
  await owner.goto(`/reports/${reportId}`);
  await owner.waitForLoadState("networkidle");
  // Form gửi yêu cầu nằm ngay cột bên phải trang chi tiết
  await expect(owner.getByText("Trong ví có thẻ gì?")).toBeVisible();
  await owner.getByLabel("Câu trả lời của bạn").fill("Thẻ thư viện");
  await owner.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(owner).toHaveURL(/\/claims\/[0-9a-f-]{36}\?sent=1/);
  const claimUrl = owner.url().replace(/\?.*$/, "");
  // Chưa được chấp nhận thì chưa có liên hệ
  await expect(owner.getByText("Bàn giao đồ")).toHaveCount(0);

  // Người nhặt chấp nhận
  await finder.goto(claimUrl);
  await finder.getByRole("button", { name: "Chấp nhận" }).click();
  await expect(finder.getByRole("heading", { name: "Bàn giao đồ" })).toBeVisible();
  await finder.getByLabel("Điểm hẹn").selectOption({ label: "Thư viện UIT" });
  await finder.getByLabel("Giờ hẹn").fill("2030-01-15T10:00");
  await finder.getByRole("button", { name: "Lưu lịch hẹn" }).click();
  await expect(finder.getByText("Đã lưu lịch hẹn")).toBeVisible();

  // Hai bên xác nhận
  await finder.getByRole("button", { name: "Đã trả đồ" }).click();
  await expect(finder.getByText("Chờ bên còn lại xác nhận")).toBeVisible();

  await owner.goto(claimUrl);
  await expect(owner.getByText("Thư viện UIT · 10:00 15/01/2030")).toBeVisible();
  await owner.getByRole("button", { name: "Đã nhận đồ" }).click();
  await expect(owner.locator("main .status").first()).toHaveText("Hoàn tất");

  // Tin chuyển sang Đã trả và không nhận yêu cầu mới
  await guest.goto(`/reports/${reportId}`);
  await expect(guest.locator("main").getByText("Đã trả")).toBeVisible();
  await expect(guest.getByText("Gửi yêu cầu nhận lại")).toHaveCount(0);
});
