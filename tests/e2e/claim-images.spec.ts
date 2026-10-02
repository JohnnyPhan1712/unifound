import { expect, test } from "@playwright/test";
import path from "node:path";
import { DEMO, FIXTURE, loginAs, postFoundReport } from "./helpers";

const FIXTURE_2 = path.join(__dirname, "fixtures", "item-2.png");

// CHG-028: ảnh minh chứng đính kèm yêu cầu nhận lại (bucket riêng tư).
test("yêu cầu kèm ảnh: người nhặt thấy, người ngoài không thấy, URL công khai không mở được", async ({ browser, request }) => {
  const finder = await loginAs(browser, DEMO.finder);
  const reportId = await postFoundReport(finder, `Tin ảnh minh chứng E2E ${Date.now()}`);

  const owner = await loginAs(browser, DEMO.owner);
  await owner.goto(`/reports/${reportId}`);
  await owner.waitForLoadState("networkidle");
  const form = owner.locator("aside form");
  await form.getByLabel("Câu trả lời của bạn").fill("Thẻ thư viện");

  // Form hiển thị mục ảnh không bắt buộc; thêm 2 ảnh, xóa 1, nút gửi mở lại sau khi tải xong
  await expect(form.getByText("Ảnh minh chứng (không bắt buộc)")).toBeVisible();
  await form.locator("input[type=file]").setInputFiles([FIXTURE, FIXTURE_2]);
  await expect(form.locator("input[name=images]")).not.toHaveValue("[]");
  await expect(form.getByRole("button", { name: "Gửi yêu cầu" })).toBeEnabled();
  await form.getByRole("button", { name: "Bỏ ảnh này" }).first().click();
  await expect(form.getByRole("button", { name: "Bỏ ảnh này" })).toHaveCount(1);
  await form.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(owner).toHaveURL(/\/claims\/[0-9a-f-]{36}\?sent=1/);
  const claimUrl = owner.url().replace(/\?.*$/, "");
  await expect(owner.getByAltText("Ảnh minh chứng 1")).toBeVisible();

  // Người nhặt thấy ảnh (ảnh thật sự tải được, không vỡ)
  await finder.goto(claimUrl);
  const img = finder.getByAltText("Ảnh minh chứng 1");
  await expect(img).toBeVisible();
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);

  // Bucket riêng tư: URL công khai không dùng được
  const src = (await img.getAttribute("src"))!;
  const objectPath = new URL(src).pathname.split("/object/sign/")[1];
  const publicUrl = `${new URL(src).origin}/storage/v1/object/public/${objectPath}`;
  expect((await request.get(publicUrl)).ok()).toBe(false);

  // Người thứ ba không mở được yêu cầu; ảnh không lộ ở chi tiết tin công khai
  const other = await loginAs(browser, DEMO.other);
  await other.goto(claimUrl);
  await expect(other.getByText("Không tìm thấy trang")).toBeVisible();
  await other.goto(`/reports/${reportId}`);
  expect(await other.content()).not.toContain("claim-images");
});

test("gửi yêu cầu không kèm ảnh vẫn được, trang yêu cầu không có mục ảnh", async ({ browser }) => {
  const finder = await loginAs(browser, DEMO.finder);
  const reportId = await postFoundReport(finder, `Tin không ảnh minh chứng E2E ${Date.now()}`);
  const owner = await loginAs(browser, DEMO.owner);
  await owner.goto(`/reports/${reportId}`);
  await owner.waitForLoadState("networkidle");
  await owner.getByLabel("Câu trả lời của bạn").fill("Thẻ thư viện");
  await owner.getByRole("button", { name: "Gửi yêu cầu" }).click();
  await expect(owner).toHaveURL(/\/claims\/[0-9a-f-]{36}\?sent=1/);
  await expect(owner.getByText("Ảnh minh chứng")).toHaveCount(0);
});

test("ảnh sai định dạng hoặc vượt 3 ảnh bị từ chối ngay trên form", async ({ browser }) => {
  const finder = await loginAs(browser, DEMO.finder);
  const reportId = await postFoundReport(finder, `Tin kiểm tra ảnh E2E ${Date.now()}`);
  const owner = await loginAs(browser, DEMO.owner);
  await owner.goto(`/reports/${reportId}`);
  await owner.waitForLoadState("networkidle");
  const form = owner.locator("aside form");
  await form.locator("input[type=file]").setInputFiles({ name: "ghi-chu.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") });
  await expect(form.getByText("không phải ảnh JPG, PNG hoặc WEBP")).toBeVisible();
  await form.locator("input[type=file]").setInputFiles([FIXTURE, FIXTURE, FIXTURE_2, FIXTURE_2]);
  await expect(form.getByText("Tối đa 3 ảnh; đã bỏ bớt 1 ảnh.")).toBeVisible();
  await expect(form.getByRole("button", { name: "Bỏ ảnh này" })).toHaveCount(3);
});
