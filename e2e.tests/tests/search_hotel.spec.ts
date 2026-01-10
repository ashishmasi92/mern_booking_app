import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";
import { text } from "stream/consumers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let url = "http://localhost:5173";
test.beforeEach(async ({ page }) => {
  await page.goto(url);

  //  sign in
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("#loginuseremail").fill("rock@gmail.com");
  await page.locator("#loginuserpassword").fill("123456");
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(page.getByText("logged in successfully")).toBeVisible();

  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Log Out" })).toBeVisible();
});

test("should show hotel search", async ({ page }) => {
  await page.goto(url);
  await page.getByPlaceholder("where are you going").fill("xy");
  await page.getByRole("button", { name: "search" }).click();

  await expect(page.getByText(" 1 Hotels found in xy")).toBeVisible();
});
