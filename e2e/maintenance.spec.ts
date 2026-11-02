import {expect, test} from "./fixtures";

test.describe("maintenance", () => {
    test("lists the maintenance jobs with their schedules", async ({page}) => {
        await page.goto("/admin/maintenance");

        await expect(page.getByText("Användarsynk")).toBeVisible();
        await expect(page.getByText("0 */5 * * * ?")).toBeVisible();
        await expect(page.getByText("Körs", {exact: true})).toBeVisible();
    });

    test("runs the user sync", async ({page}) => {
        await page.goto("/admin/maintenance");

        const card = page.locator("[data-slot='card']").filter({hasText: "Användarsynk"});

        await card.getByRole("button", {name: "Kör nu"}).click();

        await expect(page.getByText("Användarsynk har startat. Det körs i bakgrunden.")).toBeVisible();
    });

    test("cannot start a job that is running", async ({page}) => {
        await page.goto("/admin/maintenance");

        const card = page.locator("[data-slot='card']").filter({hasText: "Kartpositioner"});

        await expect(card.getByRole("button", {name: "Kör nu"})).toBeDisabled();
    });
});
