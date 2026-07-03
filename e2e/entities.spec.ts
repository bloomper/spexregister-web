import {expect, test} from "@playwright/test";

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

test("creating a tag submits the form and navigates to manage", async ({page}) => {
    await page.goto("/tags/create");

    await expect(page.getByRole("heading", {name: "Skapa tagg"})).toBeVisible();

    const sheet = page.locator('[data-slot="sheet-content"]');
    await sheet.getByRole("textbox").fill("Testtagg");
    await sheet.getByRole("button", {name: "Spara", exact: true}).click();

    await expect(page).toHaveURL(/\/tags\/manage/);
});
