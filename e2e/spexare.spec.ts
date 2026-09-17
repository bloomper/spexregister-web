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

    test("the detail dialog opens on the career overview and can fall back to a table", async ({page}) => {
        await page.goto("/spexare");
        await page.getByText("Ada Lovelace").click();

        const dialog = page.locator('[data-slot="dialog-content"]');
        await expect(dialog).toBeVisible();

        // 3 spex across 3 active years, 2015-2020.
        await expect(dialog.getByText("2015–2020")).toBeVisible();
        // Skådespelare twice plus Orkester is 2 distinct functions, carrying 2 roles.
        const tile = (label: string) =>
            dialog.getByText(label, {exact: true}).locator("xpath=..").locator("dd");
        await expect(tile("Funktioner")).toHaveText("2");
        await expect(tile("Roller")).toHaveText("2");
        // The years Ada took part in are hoverable; the gap years are not.
        await expect(dialog.getByRole("button", {name: "Spex 2016"})).toBeVisible();
        await expect(dialog.getByRole("button", {name: "Spex 2018"})).toHaveCount(0);
        await expect(dialog.getByText("Vasaspexet")).toBeVisible();

        await dialog.getByRole("button", {name: "Visa som tabell"}).click();

        await expect(dialog.getByRole("cell", {name: "Bacchus"})).toBeVisible();
        await expect(dialog.getByRole("cell", {name: "Skådespelare (Greve)"})).toBeVisible();
        // Memberships are unrelated to the spex career and stay out of the overview.
        await expect(dialog.getByRole("cell", {name: "Fullvärdig"})).toHaveCount(0);
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

    test("a long career stays inside the dialog and splits a year with two categories", async ({page}) => {
        await page.goto("/spexare");
        await page.getByText("Grace Hopper").click();

        const dialog = page.locator('[data-slot="dialog-content"]');
        // 25 years from the first production to the last, mostly gaps.
        await expect(dialog.getByText("1991–2015")).toBeVisible();

        // The strip must scroll inside the dialog rather than widen it: a grid item without
        // min-w-0 pushed the column past max-w-2xl and clipped the tiles and the toggle.
        const box = await dialog.boundingBox();
        expect(box!.width).toBeLessThanOrEqual(680);
        await expect(dialog.getByRole("button", {name: "Visa som tabell"})).toBeVisible();
        await expect(dialog.getByText("Roller")).toBeVisible();

        // 2015 holds both a Veraspexet and a Bobspexet production.
        const shared = dialog.getByRole("button", {name: "Spex 2015"});
        await expect(shared).toHaveCSS("background-image", /linear-gradient/);
    });
});

test.describe("my profile", () => {
    test("leads with the career overview above the edit form", async ({page}) => {
        await page.goto("/my-profile");

        await expect(page.getByText("Spexkarriär")).toBeVisible();
        await expect(page.getByText("2015–2020")).toBeVisible();
        await expect(page.getByRole("button", {name: "Spex 2016"})).toBeVisible();
        await expect(page.getByText("Förnamn")).toBeVisible();
    });
});
