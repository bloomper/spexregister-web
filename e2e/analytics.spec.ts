import {expect, test} from "@playwright/test";

test("the analytics page renders the role-appropriate sections", async ({page}) => {
    await page.goto("/analytics");

    await expect(page.getByRole("heading", {name: "Analys"})).toBeVisible();

    // The signed-in E2E user is an administrator, so every section is present.
    for (const tab of ["Deltagande", "Demografi", "Livscykel", "Datakvalitet", "Drift"]) {
        await expect(page.getByRole("tab", {name: tab})).toBeVisible();
    }

    await expect(page.getByText("Spexare per spexår")).toBeVisible();
});

test("a chart bar opens the matching filtered search", async ({page}) => {
    await page.goto("/analytics");

    await page.getByRole("tab", {name: "Demografi"}).click();

    const countryCard = page.locator('[data-slot="card"]').filter({hasText: "Per land"});
    await countryCard.locator(".recharts-rectangle").first().click();

    await expect(page).toHaveURL(/\/spexare\/search\?f\.countries=se/);
});

test("a data-quality row opens the records carrying that gap", async ({page}) => {
    await page.goto("/analytics");

    await page.getByRole("tab", {name: "Datakvalitet"}).click();
    await page.getByRole("link", {name: /Saknar bild/}).click();

    await expect(page).toHaveURL(/\/spexare\/search\?f\.quality=noImage/);
});

test("the home page shows the headline chart and links onward", async ({page}) => {
    await page.goto("/");

    await expect(page.getByRole("heading", {name: "Analys"})).toBeVisible();
    await page.getByRole("link", {name: "Visa all analys"}).click();

    await expect(page).toHaveURL(/\/analytics$/);
});
