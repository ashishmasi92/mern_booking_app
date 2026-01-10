import {test,expect} from "@playwright/test"

let url = "http://localhost:5173"

// test("should allow the user to sign in",async ({page})=>{

//     await page.goto(url);
// //   get the sign in button
// await page.getByRole("link",{name:"Sign In"}).click();
// await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();
// await page.locator("#loginuseremail").fill("rock@gmail.com")
// await page.locator("#loginuserpassword").fill("123456")
// await page.getByRole("button",{name:"Submit"}).click();

// await expect(page.getByText("logged in successfully")).toBeVisible();
// // await expect(page.getByRole("heading",{name:"Sign In"}))

// await expect(page.getByRole("link",{name:"My Bookings"})).toBeVisible()
// await expect(page.getByRole("link",{name:"My Hotels"})).toBeVisible()
// await expect(page.getByRole("button",{name:"Log Out"})).toBeVisible()


// });



test("should allow user to register", async ({page})=>{
await page.goto(url);

  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account" }).click();

  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstname");
  await page.locator("[name=lastName]").fill("test_lastname");

  const email = `test_${Date.now()}@gmail.com`;
  await page.locator("[name=email]").fill(email);

  await page.locator("[name=password]").fill("123456");
  await page.locator("[name=confirmPassword]").fill("123456");

  await page.getByRole("button", { name: "Submit" }).click();

  
  // ✅ success UI
  await expect(
    page.getByText("register successfully")
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "My Bookings" })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "My Hotels" })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Log Out" })
  ).toBeVisible()

});
