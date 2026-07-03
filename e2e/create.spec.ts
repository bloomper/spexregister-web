import {expect, test} from "@playwright/test";

test("creating a spexare submits the form and navigates to manage", async ({page}) => {
    await page.goto("/spexare/create");

    await expect(page.getByRole("heading", {name: "Skapa spexare"})).toBeVisible();

    await page.locator("#spexare-general-form input").nth(0).fill("Nina");
    await page.locator("#spexare-general-form input").nth(1).fill("Novakova");

    await page.getByRole("button", {name: "Spara", exact: true}).click();

    await expect(page).toHaveURL(/\/spexare\/manage/);
});
