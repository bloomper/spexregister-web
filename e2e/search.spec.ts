import {expect, test} from "@playwright/test";

test.describe("spexare search page", () => {
    test("renders all people with an empty query", async ({page}) => {
        await page.goto("/spexare/search");

        await expect(page.getByText("Ada Lovelace")).toBeVisible();
        await expect(page.getByText("Alan Turing")).toBeVisible();
        await expect(page.getByText("Grace Hopper")).toBeVisible();
    });

    test("narrows the results to the ?q= query", async ({page}) => {
        await page.goto("/spexare/search?q=Grace");

        await expect(page.getByText("Grace Hopper")).toBeVisible();
        await expect(page.getByText("Ada Lovelace")).toBeHidden();
        await expect(page.getByText("Alan Turing")).toBeHidden();
    });
});
