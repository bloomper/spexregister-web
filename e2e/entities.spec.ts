import {type Page} from "@playwright/test";
import {expect, test} from "./fixtures";

const managePages = [
    {name: "news", url: "/news/manage", heading: "Nyheter", row: "Premiär 2026"},
    {name: "spex", url: "/spex/manage", heading: "Spex", row: "Nobel"},
    {name: "spex categories", url: "/spex/categories/manage", heading: "Spexkategorier", row: "Chalmersspexet"},
    {name: "tasks", url: "/tasks/manage", heading: "Funktioner", row: "Ensemblist"},
    {name: "task categories", url: "/tasks/categories/manage", heading: "Funktionskategorier", row: "Kommitté"},
    {name: "tags", url: "/tags/manage", heading: "Taggar", row: "Hedersmedlem"},
    {name: "users", url: "/users/manage", heading: "Användare", row: "admin@example.com"},
];

for (const {name, url, heading, row} of managePages) {
    test(`${name} manage page renders the list from the backend`, async ({page}) => {
        await page.goto(url);

        await expect(page.getByRole("heading", {name: heading, exact: true})).toBeVisible();
        await expect(page.getByText(row).first()).toBeVisible();
    });
}

test("creating a tag submits the form and lists it on the manage page", async ({page}) => {
    await page.goto("/tags/create");

    await expect(page.getByRole("heading", {name: "Skapa tagg"})).toBeVisible();

    const sheet = page.locator('[data-slot="sheet-content"]');
    await sheet.getByRole("textbox").fill("Testtagg");
    await sheet.getByRole("button", {name: "Spara", exact: true}).click();

    await expect(page).toHaveURL(/\/tags\/manage/);
    await expect(page.locator("tbody").getByText("Testtagg")).toBeVisible();
});

test("creating a tag without a name is refused with a validation message", async ({page}) => {
    await page.goto("/tags/create");

    const sheet = page.locator('[data-slot="sheet-content"]');
    await sheet.getByRole("button", {name: "Spara", exact: true}).click();

    await expect(sheet.getByText("Fältet är obligatoriskt")).toBeVisible();
    await expect(page).toHaveURL(/\/tags\/create/);
});

const rowActions = async (page: Page, rowText: string, action: string) => {
    await page.locator("tbody tr").filter({hasText: rowText}).getByRole("button").last().click();
    await page.getByRole("menuitem", {name: action}).click();
};

test("editing a tag from the manage table updates its row", async ({page}) => {
    await page.goto("/tags/manage");

    await rowActions(page, "Grundare", "Ändra");

    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(sheet.getByRole("textbox")).toHaveValue("Grundare");
    await sheet.getByRole("textbox").fill("Grundare och eldsjäl");
    await sheet.getByRole("button", {name: "Spara", exact: true}).click();

    await expect(page.getByText("Uppdateringen lyckades").first()).toBeVisible();
    await expect(page.locator("tbody").getByText("Grundare och eldsjäl")).toBeVisible();
});

const deletions = [
    {name: "tag", url: "/tags/manage", row: "Grundare", other: "Hedersmedlem"},
    {name: "task", url: "/tasks/manage", row: "Scenmästare", other: "Ensemblist"},
    {name: "news item", url: "/news/manage", row: "Nya lokaler", other: "Premiär 2026"},
];

for (const {name, url, row, other} of deletions) {
    test(`deleting a ${name} from the manage table removes its row`, async ({page}) => {
        await page.goto(url);
        await expect(page.locator("tbody").getByText(row)).toBeVisible();

        await rowActions(page, row, "Radera");
        await page.getByRole("alertdialog").getByRole("button", {name: "Radera"}).click();

        await expect(page.getByText("Raderingen lyckades").first()).toBeVisible();
        await expect(page.locator("tbody").getByText(row)).toHaveCount(0);
        await expect(page.locator("tbody").getByText(other)).toBeVisible();
    });
}

test("renaming a task from the manage table updates its row", async ({page}) => {
    await page.goto("/tasks/manage");

    await rowActions(page, "Scenmästare", "Ändra");

    const sheet = page.locator('[data-slot="sheet-content"]');
    const name = sheet.getByRole("textbox").first();
    await expect(name).toHaveValue("Scenmästare");
    await name.fill("Inspicient");
    await sheet.getByRole("button", {name: "Spara", exact: true}).click();

    await expect(page.getByText("Uppdateringen lyckades").first()).toBeVisible();
    await expect(page.locator("tbody").getByText("Inspicient")).toBeVisible();
});
