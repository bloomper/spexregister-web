import {expect, test} from "@playwright/test";

test("the history of a tag lists its revisions and their field changes", async ({page}) => {
    await page.goto("/tags/manage");

    await page.getByText("Hedersmedlem").first().click();

    const dialog = page.locator('[data-slot="dialog-content"]');
    await expect(dialog).toBeVisible();

    await dialog.getByRole("button", {name: "Historik"}).click();

    await expect(dialog.getByText("Uppdaterad")).toBeVisible();
    await expect(dialog.getByText("admin@example.com").first()).toBeVisible();

    await dialog.getByRole("button", {name: "1", exact: true}).click();

    await expect(dialog.getByText("Namn")).toBeVisible();
    await expect(dialog.getByText("Hedersledamot")).toBeVisible();
});

test("an admin can restore a revision from the history", async ({page}) => {
    await page.goto("/tags/manage");

    await page.getByText("Hedersmedlem").first().click();

    const dialog = page.locator('[data-slot="dialog-content"]');
    await dialog.getByRole("button", {name: "Historik"}).click();

    await dialog.getByRole("button", {name: "Återställ"}).first().click();

    const confirm = page.locator('[data-slot="alert-dialog-content"]');
    await expect(confirm.getByText("Återställ den här versionen?")).toBeVisible();

    await confirm.getByRole("button", {name: "Återställ"}).click();

    await expect(page.getByText("Versionen återställdes")).toBeVisible();
});

test("the change log says what a revision changed and why", async ({page}) => {
    await page.goto("/change-log");

    const restored = page.getByRole("row").filter({hasText: "Återställning"});
    await expect(restored).toBeVisible();

    await restored.click();

    await expect(page.getByText("Del av en ändring av Spexare ”Ada Lovelace”")).toBeVisible();
    // The reason shows twice by design: on the row, so the list can be scanned, and in the panel.
    await expect(page.getByText("Återställd från version 1")).toHaveCount(2);
    await expect(page.getByText("Smeknamn")).toBeVisible();
    await expect(page.getByText("Countess", {exact: true})).toBeVisible();
    await expect(page.getByText("The Countess", {exact: true})).toBeVisible();
    await expect(page.getByText("Mölndal", {exact: true})).toBeVisible();
});

test("the change log filters by user, origin and date", async ({page}) => {
    await page.goto("/change-log");

    await expect(page.getByRole("row")).toHaveCount(3); // header plus both revisions

    await page.getByRole("button", {name: /Alla ursprung/}).click();
    await page.getByRole("button", {name: "Återställning"}).click();
    await page.keyboard.press("Escape");

    await expect(page.getByRole("row")).toHaveCount(2);
    await expect(page.getByText("anna@example.com")).toBeVisible();

    // Scoped to the page: the origin popover keeps a reset button of its own in the DOM.
    await page.getByRole("main").getByRole("button", {name: "Återställ filter"}).click();
    await expect(page.getByRole("row")).toHaveCount(3);

    await page.locator("#audit-from").fill("2026-09-18");

    await expect(page.getByRole("row")).toHaveCount(2);
    await expect(page.getByText("admin@example.com")).toBeHidden();
});

test("an audit event links straight to the record it changed", async ({page}) => {
    await page.goto("/change-log");

    await page.getByRole("row").filter({hasText: "Återställning"}).click();

    await page.getByRole("link", {name: "Adress: Öppna posten"}).click();

    await expect(page).toHaveURL(/\/spexare\?open=1&tab=addresses/);
    await expect(page.locator('[data-slot="dialog-content"]').getByText("Ada Lovelace").first()).toBeVisible();
});
