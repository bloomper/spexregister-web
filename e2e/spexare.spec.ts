import {expect, test} from "@playwright/test";

test.describe("spexare grid", () => {
    test("renders the list from the backend", async ({page}) => {
        await page.goto("/spexare");

        await expect(page.getByText("Ada Lovelace")).toBeVisible();
        await expect(page.getByText("Alan Turing")).toBeVisible();
        await expect(page.getByText("Grace Hopper")).toBeVisible();
    });

    test("search filters the list to matching people", async ({page}) => {
        await page.goto("/spexare");
        await expect(page.getByText("Alan Turing")).toBeVisible();

        await page.getByPlaceholder(/Filtrera på förnamn/).fill("Ada");

        await expect(page.getByText("Ada Lovelace")).toBeVisible();
        await expect(page.getByText("Alan Turing")).toBeHidden();
        await expect(page.getByText("Grace Hopper")).toBeHidden();
    });

    test("opening a card lazy-loads the detail dialog", async ({page}) => {
        await page.goto("/spexare");

        await page.getByText("Ada Lovelace").click();

        const dialog = page.locator('[data-slot="dialog-content"]');
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole("heading", {name: "Ada Lovelace"}).first()).toBeVisible();
    });

    test("infinite scroll loads the next page of results", async ({page}) => {
        await page.goto("/spexare");

        // Scoped and count-asserted on purpose. This has failed once with the locator resolving to
        // two card titles; asserting the count first reports that as "expected 1, received 2"
        // instead of an opaque strict-mode violation, so a duplicate render stays visible.
        const grid = page.getByRole("main");
        const lastOfFirstPage = grid.getByText("Testperson 23", {exact: true});
        const firstOfNextPage = grid.getByText("Testperson 24", {exact: true});

        await expect(lastOfFirstPage).toHaveCount(1);
        await expect(lastOfFirstPage).toBeVisible();
        await expect(firstOfNextPage).toHaveCount(0);

        await lastOfFirstPage.scrollIntoViewIfNeeded();

        await expect(firstOfNextPage).toBeVisible();
        await expect(firstOfNextPage).toHaveCount(1);
    });

    test("editing a card opens the edit form sheet seeded with the person", async ({page}) => {
        await page.goto("/spexare");

        const card = page.locator('[data-slot="card"]').filter({hasText: "Ada Lovelace"});
        await card.hover();
        await card.getByRole("button", {name: "Ändra"}).click();

        await expect(page.getByText("Ändra spexare")).toBeVisible();
        await expect(page.locator("#spexare-general-form input").first()).toHaveValue("Ada");
    });
});
