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

    await expect(dialog.getByText("Namn:")).toBeVisible();
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
