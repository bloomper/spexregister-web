import {expect, test} from "@playwright/test";

test.describe("impex", () => {
    test("the manage page lists a completed, downloadable job", async ({page}) => {
        await page.goto("/impex/manage");

        await expect(page.getByRole("heading", {name: "Importera/Exportera"})).toBeVisible();
        await expect(page.getByText("Avslutad").first()).toBeVisible();

        await page.getByRole("button", {name: "Öppna meny"}).first().click();
        await expect(page.getByRole("menuitem", {name: "Ladda ner"})).toBeVisible();
    });

    test("exporting from the manage table starts a job and polls it to completion", async ({page}) => {
        await page.goto("/spexare/manage");

        await page.getByRole("button", {name: "Exportera"}).click();
        await page.getByRole("menuitem", {name: "Excel", exact: true}).click();

        await expect(page.getByText("Export slutförd")).toBeVisible();
    });
});
