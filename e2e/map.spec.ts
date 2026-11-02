import {expect, test} from "./fixtures";

test.describe("map", () => {
    test.beforeEach(async ({page}) => {
        await page.route("https://tile.openstreetmap.org/**", (route) => route.fulfill({status: 204}));
    });

    test("shows the located spexare and opens one", async ({page}) => {
        await page.goto("/spexare/map");

        await expect(page.getByText("2 av 2 spexare")).toBeVisible();

        await page.getByTitle("Ada \"Countess\" Lovelace").click();

        const dialog = page.locator('[data-slot="dialog-content"]');

        await expect(dialog).toBeVisible();
        await expect(dialog.getByText("Spexkarriär")).toBeVisible();
    });

    test("shows the markers again after navigating away and back", async ({page}) => {
        await page.goto("/spexare/map");
        await expect(page.getByTitle("Ada \"Countess\" Lovelace")).toBeVisible();

        await page.getByRole("link", {name: "Sök", exact: true}).click();
        await expect(page).toHaveURL(/\/spexare\/search/);

        await page.getByRole("link", {name: "Karta", exact: true}).click();
        await expect(page).toHaveURL(/\/spexare\/map/);

        await expect(page.getByTitle("Ada \"Countess\" Lovelace")).toBeVisible();
        await expect(page.getByTitle("Grace \"Amazing Grace\" Hopper")).toBeVisible();
    });

    test("filters the markers by name", async ({page}) => {
        await page.goto("/spexare/map");

        await page.getByLabel("Filtrera på namn...").fill("grace");

        await expect(page.getByText("1 av 2 spexare")).toBeVisible();
        await expect(page.getByTitle("Grace \"Amazing Grace\" Hopper")).toBeVisible();
        await expect(page.getByTitle("Ada \"Countess\" Lovelace")).toHaveCount(0);
    });
});
