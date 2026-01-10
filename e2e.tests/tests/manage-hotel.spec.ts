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

// test("should allow user to add hotel", async ({ page }) => {
//   await page.goto(`${url}/add-hotel`);

//   await expect(page.getByRole("heading", { name: "Add Hotel" })).toBeVisible();

//   await page.locator("[name='name']").fill("text_hotel");
//   await page.locator("[name='city']").fill("las vagas");
//   await page.locator("[name='country']").fill("USA");
//   await page
//     .locator("[name='description']")
//     .fill(
//       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
//     );
//   await page.locator("[name='pricePerNight']").fill("120");
//   await page.selectOption("select[name='starRating']", "3");
//   await page.getByText("Budget").click();
//   await page.getByLabel("Free Wifi").check();
//   await page.locator("[name='adultCount']").fill("2");
//   await page.locator("[name='childCount']").fill("2");

//   await page.setInputFiles("[name='imageFiles']", [
//     path.resolve(__dirname, "pic", "img_1.jpg"),
//     // path.resolve(__dirname,"pic","img_2.jpg"),
//   ]);
//   await page.getByRole("button", { name: "Save" }).click();

//   await expect(page.getByText("hotel added successfully")).toBeVisible({
//     timeout: 29000,
//   });
// });

test("should edit hotel", async ({ page }) => {
  await page.goto(`${url}/my-hotels`);

  await expect(page.getByRole("heading", { name: "Add Hotel" })).toBeVisible();

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector("[name='name']", { state: "attached" });
  await expect(page.locator("[name='name']")).toHaveValue("s");
  await page.locator("[name='name']").fill("s updated");
  await page.getByRole("button", { name: "Save" }).click();

  const toast = page.getByText("hotel updated!", { exact: true });
  await expect(toast).toBeVisible({ timeout: 5000 });
});
