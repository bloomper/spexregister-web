import {expect, test} from "./fixtures";
import type {Locator, Page} from "@playwright/test";

/** Opens the end-date calendar and picks a day next month, which is never in the past */
async function pickValidUntil(page: Page, sheet: Locator) {
    await sheet.getByRole("button", {name: "Gäller till och med"}).click();
    const calendar = page.locator('[data-slot="popover-content"]');
    await calendar.locator(".rdp-button_next").click();
    await calendar.locator("button[data-day]:not([disabled])").nth(10).click();
    await page.keyboard.press("Escape");
}


test("an admin sees the permission grants and can delete one", async ({page}) => {
    await page.goto("/admin/permissions");

    await expect(page.getByRole("heading", {name: "Behörigheter"})).toBeVisible();
    await expect(page.getByText("Det behövs ingen behörighet för det.", {exact: false})).toBeVisible();
    const row = page.getByRole("row").filter({hasText: "Alla i Nobel (1996)"});
    await expect(row).toBeVisible();
    await expect(row.getByText("Redigera")).toBeVisible();

    await row.getByRole("button").last().click();
    await page.getByRole("menuitem", {name: "Radera"}).click();
    const confirm = page.locator('[data-slot="alert-dialog-content"]');
    await confirm.getByRole("button", {name: "Radera"}).click();

    await expect(page.getByText("Raderingen lyckades")).toBeVisible();
    await expect(page.getByRole("row").filter({hasText: "Alla i Nobel (1996)"})).toHaveCount(0);
});

test("an admin grants a user rights on everyone in a spex", async ({page}) => {
    await page.goto("/admin/permissions");

    await page.getByRole("button", {name: "Ny behörighet"}).click();
    const dialog = page.locator('[data-slot="sheet-content"]');

    await dialog.getByRole("combobox", {name: "Användare"}).click();
    await page.getByRole("option", {name: "admin@example.com"}).click();
    await dialog.getByRole("combobox", {name: "Spex"}).click();
    await page.getByRole("option", {name: "Nobel (1996)"}).click();
    await dialog.getByRole("button", {name: "Spara"}).click();

    await expect(page.getByText("Behörigheten har skapats")).toBeVisible();
    await expect(page.getByRole("row").filter({hasText: "Alla i Nobel (1996)"}).first()).toBeVisible();
});

test("the grant form explains what is missing", async ({page}) => {
    await page.goto("/admin/permissions");

    await page.getByRole("button", {name: "Ny behörighet"}).click();
    const dialog = page.locator('[data-slot="sheet-content"]');
    await dialog.getByRole("button", {name: "Spara"}).click();

    await expect(dialog.getByText("Välj en användare")).toBeVisible();
    await expect(dialog.getByText("Välj ett spex")).toBeVisible();
});

test("the grant form shows the chosen labels and searches inside its pickers", async ({page}) => {
    await page.goto("/admin/permissions");

    await page.getByRole("button", {name: "Ny behörighet"}).click();
    const sheet = page.locator('[data-slot="sheet-content"]');

    await expect(sheet.getByRole("combobox", {name: "Ge till"})).toContainText("En användare");
    await expect(sheet.getByRole("combobox", {name: "Rättighet"})).toContainText("Redigera");
    await expect(sheet.getByRole("combobox", {name: "Omfattning"})).toContainText("Alla i ett spex");

    await sheet.getByRole("combobox", {name: "Användare"}).click();
    await page.getByPlaceholder("Sök användare på namn eller e-post").fill("redaktor");
    await expect(page.getByRole("option", {name: "admin@example.com"})).toHaveCount(0);
    await page.getByRole("option", {name: "redaktor@example.com"}).click();
    await expect(sheet.getByRole("combobox", {name: "Användare"})).toContainText("redaktor@example.com");
    await sheet.getByRole("button", {name: "Rensa Användare"}).click();
    await expect(sheet.getByRole("combobox", {name: "Användare"})).toContainText("Välj");
    await sheet.getByRole("combobox", {name: "Användare"}).click();
    await page.getByRole("option", {name: "admin@example.com"}).click();
    await expect(sheet.getByRole("combobox", {name: "Användare"})).toContainText("admin@example.com");

    await sheet.getByRole("combobox", {name: "Omfattning"}).click();
    await page.getByRole("option", {name: "En spexare"}).click();
    await sheet.getByRole("combobox", {name: "Spexare"}).click();
    await expect(page.getByText("Skriv minst två tecken")).toBeVisible();
    await page.getByPlaceholder("Sök spexare på namn").fill("Grace");
    await page.getByRole("option", {name: /Grace .*Hopper/}).click();
    await expect(sheet.getByRole("combobox", {name: "Spexare"})).toContainText("Hopper");

    await sheet.getByRole("combobox", {name: "Spexare"}).click();
    await expect(page.getByText("Skriv minst två tecken")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet.getByRole("combobox", {name: "Spexare"})).toContainText("Hopper");
});

test("the end date can be cleared", async ({page}) => {
    await page.goto("/admin/permissions");

    await page.getByRole("button", {name: "Ny behörighet"}).click();
    const sheet = page.locator('[data-slot="sheet-content"]');

    await expect(sheet.getByRole("button", {name: "Ta bort slutdatum"})).toHaveCount(0);
    const validUntil = sheet.getByRole("button", {name: "Gäller till och med"});
    await expect(validUntil).toContainText("Välj datum");
    await pickValidUntil(page, sheet);
    await expect(validUntil).not.toContainText("Välj datum");
    await sheet.getByRole("button", {name: "Ta bort slutdatum"}).click();
    await expect(validUntil).toContainText("Välj datum");
    await expect(sheet.getByRole("button", {name: "Ta bort slutdatum"})).toHaveCount(0);
});

test("roles are shown by name", async ({page}) => {
    await page.goto("/admin/permissions");

    await page.getByRole("button", {name: "Ny behörighet"}).click();
    const sheet = page.locator('[data-slot="sheet-content"]');

    await sheet.getByRole("combobox", {name: "Ge till"}).click();
    await page.getByRole("option", {name: "Alla med en roll"}).click();
    await sheet.getByRole("combobox", {name: "Roll"}).click();
    await expect(page.getByRole("option", {name: "Användare"})).toBeVisible();
    await expect(page.getByRole("option", {name: "Administratör"})).toBeVisible();
    await page.getByRole("option", {name: "Redaktör"}).click();
    await expect(sheet.getByRole("combobox", {name: "Roll"})).toContainText("Redaktör");
});

test("an admin changes the permission and end date of a grant", async ({page}) => {
    await page.goto("/admin/permissions");

    await page.getByRole("button", {name: "Ny behörighet"}).click();
    const create = page.locator('[data-slot="sheet-content"]');
    await create.getByRole("combobox", {name: "Användare"}).click();
    await page.getByRole("option", {name: "redaktor@example.com"}).click();
    await create.getByRole("combobox", {name: "Spex"}).click();
    await page.getByRole("option", {name: "Nobel (1996)"}).click();
    await create.getByRole("button", {name: "Spara"}).click();
    await expect(page.getByText("Behörigheten har skapats")).toBeVisible();

    const row = page.getByRole("row").filter({hasText: "redaktor@example.com"}).first();
    await row.getByRole("button").last().click();
    await page.getByRole("menuitem", {name: "Ändra"}).click();
    const edit = page.locator('[data-slot="sheet-content"]');
    await expect(edit.getByText("Ändra behörighet")).toBeVisible();
    await expect(edit.getByText("Alla i Nobel (1996)")).toBeVisible();

    await edit.getByRole("combobox", {name: "Rättighet"}).click();
    await page.getByRole("option", {name: "Läsa"}).click();
    await pickValidUntil(page, edit);
    await edit.getByRole("button", {name: "Spara"}).click();

    await expect(page.getByText("Uppdateringen lyckades")).toBeVisible();
    await expect(row.getByText("Läsa")).toBeVisible();
    await expect(row).not.toContainText("Inget slutdatum");
});

test("the grants can be filtered by permission", async ({page}) => {
    await page.goto("/admin/permissions");
    await expect(page.getByRole("row").filter({hasText: "Alla i Nobel (1996)"}).first()).toBeVisible();

    await page.getByRole("button", {name: "Rättighet"}).click();
    await page.locator('[data-slot="popover-content"]').getByRole("button", {name: "Redigera"}).click();
    await page.keyboard.press("Escape");

    await expect(page.getByRole("row").filter({hasText: "Redigera"})).toHaveCount(0);
    await page.getByRole("button", {name: "Återställ"}).click();
    await expect(page.getByRole("row").filter({hasText: "Redigera"}).first()).toBeVisible();
});
