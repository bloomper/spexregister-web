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

    test("seeds the facet selection from the URL", async ({page}) => {
        await page.goto("/spexare/search?f.deceased=true");

        await expect(page.getByText("Alan Turing")).toBeVisible();
        await expect(page.getByText("Ada Lovelace")).toBeHidden();
        await expect(page.getByText("Grace Hopper")).toBeHidden();
    });

    test("writes a facet selection into the URL so the search can be shared", async ({page}) => {
        await page.goto("/spexare/search");
        await expect(page.getByText("Ada Lovelace")).toBeVisible();

        await page.getByRole("button", {name: /Avliden/}).click();
        await page.getByRole("button", {name: /^Ja/}).click();

        await expect(page).toHaveURL(/f\.deceased=true/);
        await expect(page.getByText("Alan Turing")).toBeVisible();
        await expect(page.getByText("Ada Lovelace")).toBeHidden();
    });

    test("keeps the search controls reachable when nothing matches", async ({page}) => {
        await page.goto("/spexare/search?q=ingentingalls");

        await expect(page.getByText("Ada Lovelace")).toBeHidden();
        // The reset control only renders inside the grid, so its presence proves the grid
        // still owns the empty state rather than being swapped out for a bare placeholder.
        await expect(page.getByRole("button", {name: /Återställ/})).toBeVisible();
    });
});
