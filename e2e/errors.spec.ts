import {type Page} from "@playwright/test";
import {expect, test} from "./fixtures";

const rowActions = async (page: Page, rowText: string, action: string) => {
    await page.locator("tbody tr").filter({hasText: rowText}).getByRole("button").last().click();
    await page.getByRole("menuitem", {name: action}).click();
};

test.describe("When the server refuses", () => {
    test("a failed save of a spexare is shown and the form keeps what was typed", async ({page, mock}) => {
        await mock.failNext("SpexareCreate", "INTERNAL_ERROR");
        await page.goto("/spexare/create");

        await page.locator("#spexare-general-form input").nth(0).fill("Nina");
        await page.locator("#spexare-general-form input").nth(1).fill("Novakova");
        await page.getByRole("button", {name: "Spara", exact: true}).click();

        await expect(page.getByText("Fel inträffade").first()).toBeVisible();
        await expect(page).toHaveURL(/\/spexare\/create/);
        await expect(page.locator("#spexare-general-form input").nth(0)).toHaveValue("Nina");

        await page.getByRole("button", {name: "Spara", exact: true}).click();
        await expect(page).toHaveURL(/\/spexare\/manage/);
    });

    test("a tag someone else changed meanwhile is not saved", async ({page, mock}) => {
        await mock.failNext("TagUpdate", "CONFLICT");
        await page.goto("/tags/manage");

        await rowActions(page, "Grundare", "Ändra");
        const sheet = page.locator('[data-slot="sheet-content"]');

        await sheet.getByRole("textbox").fill("Grundare och eldsjäl");
        await sheet.getByRole("button", {name: "Spara", exact: true}).click();

        await expect(page.getByText("Fel inträffade").first()).toBeVisible();
        await expect(page.locator("tbody").getByText("Grundare och eldsjäl")).toHaveCount(0);
    });

    test("a refused deletion leaves the row in place", async ({page, mock}) => {
        await mock.failNext("TagDelete", "FORBIDDEN");
        await page.goto("/tags/manage");

        await rowActions(page, "Grundare", "Radera");
        await page.getByRole("alertdialog").getByRole("button", {name: "Radera"}).click();

        await expect(page.getByText("Fel inträffade").first()).toBeVisible();
        await expect(page.getByText("Raderingen lyckades")).toHaveCount(0);
        await expect(page.locator("tbody").getByText("Grundare")).toBeVisible();
    });

    test("a list that cannot be loaded says so", async ({page, mock}) => {
        await mock.failNext("TagPagedFull", "INTERNAL_ERROR");
        await page.goto("/tags/manage");

        await expect(page.getByText(/Kunde inte ladda data|Något gick fel|Fel inträffade/).first()).toBeVisible();
    });
});
