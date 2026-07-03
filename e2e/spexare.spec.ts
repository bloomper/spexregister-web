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

        await expect(page.getByText("Testperson 23")).toBeVisible();
        await expect(page.getByText("Testperson 24", {exact: true})).toHaveCount(0);

        await page.getByText("Testperson 23").scrollIntoViewIfNeeded();

        await expect(page.getByText("Testperson 24", {exact: true})).toBeVisible();
    });

    test("editing a card opens the edit form sheet seeded with the person", async ({page}) => {
        await page.goto("/spexare");

        const card = page.locator('[data-slot="card"]').filter({hasText: "Ada Lovelace"});
        await card.hover();
        await card.getByRole("button").first().click();

        await expect(page.getByText("Ändra spexare")).toBeVisible();
        await expect(page.locator("#spexare-general-form input").first()).toHaveValue("Ada");
    });
});
