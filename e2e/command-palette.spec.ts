import {expect, test} from "@playwright/test";

test.describe("command palette", () => {
    test("opens from the header and jumps to a section", async ({page}) => {
        await page.goto("/");

        await page.getByRole("button", {name: "Öppna kommandopaletten"}).click();

        const palette = page.locator('[data-slot="dialog-content"]');
        await expect(palette).toBeVisible();

        await palette.getByText("Taggar", {exact: true}).click();

        await expect(page).toHaveURL(/\/tags$/);
    });

    test("opens with the keyboard shortcut and filters to a destination", async ({page}) => {
        await page.goto("/");

        // The shortcut is registered by the client component, so wait for it to have mounted
        // before pressing — otherwise the keypress races hydration and lands on nothing.
        await expect(page.getByRole("button", {name: "Öppna kommandopaletten"})).toBeVisible();

        await page.keyboard.press("ControlOrMeta+k");

        const palette = page.locator('[data-slot="dialog-content"]');
        await expect(palette).toBeVisible();

        await palette.getByPlaceholder(/Hoppa till/).fill("Tagg");
        await palette.getByText("Taggar", {exact: true}).click();

        await expect(page).toHaveURL(/\/tags$/);
    });

    test("omits the profile shortcut when the account has no linked spexare", async ({page}) => {
        await page.goto("/");

        await page.getByRole("button", {name: "Öppna kommandopaletten"}).click();

        const palette = page.locator('[data-slot="dialog-content"]');
        await expect(palette).toBeVisible();
        await expect(palette.getByText("Hem", {exact: true})).toBeVisible();
        await expect(palette.getByText("Min profil", {exact: true})).toHaveCount(0);
    });
});
