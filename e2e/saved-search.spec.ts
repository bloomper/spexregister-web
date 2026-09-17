import {expect, test} from "@playwright/test";

test.describe("saved searches", () => {
    test("saves the current search and reapplies it later", async ({page}) => {
        await page.goto("/spexare/search?q=Grace");
        await expect(page.getByText("Grace Hopper")).toBeVisible();

        await page.getByRole("button", {name: /Spara sökning/}).click();

        const dialog = page.locator('[data-slot="dialog-content"]');
        await expect(dialog).toBeVisible();
        await dialog.getByPlaceholder(/inaktiva medlemmar/).fill("Mina Graces");
        await dialog.getByRole("button", {name: "Spara", exact: true}).click();

        await expect(page.getByText("Sökningen sparades")).toBeVisible();

        // Leave the search behind entirely, then bring it back from the saved list.
        await page.goto("/spexare/search");
        await expect(page.getByText("Ada Lovelace")).toBeVisible();

        await page.getByRole("button", {name: /Sparade sökningar/}).click();
        await page.getByText("Mina Graces").click();

        await expect(page).toHaveURL(/q=Grace/);
        await expect(page.getByText("Grace Hopper")).toBeVisible();
        await expect(page.getByText("Ada Lovelace")).toBeHidden();
    });

    test("updates an existing saved search to the current search", async ({page}) => {
        await page.goto("/spexare/search?q=Grace");
        await expect(page.getByText("Grace Hopper")).toBeVisible();

        await page.getByRole("button", {name: /Spara sökning/}).click();
        const dialog = page.locator('[data-slot="dialog-content"]');
        await dialog.getByPlaceholder(/inaktiva medlemmar/).fill("Mina favoriter");
        await dialog.getByRole("button", {name: "Spara", exact: true}).click();
        await expect(page.getByText("Sökningen sparades")).toBeVisible();

        // Refine to a different search, then point the saved one at it without retyping the name.
        await page.goto("/spexare/search?q=Ada");
        await expect(page.getByText("Ada Lovelace")).toBeVisible();

        await page.getByRole("button", {name: /Sparade sökningar/}).click();
        await page.getByRole("button", {name: /Uppdatera Mina favoriter/}).click();
        await expect(page.getByText("Sökningen uppdaterades")).toBeVisible();

        await page.goto("/spexare/search");
        await page.getByRole("button", {name: /Sparade sökningar/}).click();
        await page.getByText("Mina favoriter").click();

        await expect(page).toHaveURL(/q=Ada/);
        await expect(page.getByText("Ada Lovelace")).toBeVisible();
    });

    test("renames a saved search inline", async ({page}) => {
        await page.goto("/spexare/search?q=Grace");
        await expect(page.getByText("Grace Hopper")).toBeVisible();

        await page.getByRole("button", {name: /Spara sökning/}).click();
        const dialog = page.locator('[data-slot="dialog-content"]');
        await dialog.getByPlaceholder(/inaktiva medlemmar/).fill("Ursprungligt namn");
        await dialog.getByRole("button", {name: "Spara", exact: true}).click();
        await expect(page.getByText("Sökningen sparades")).toBeVisible();

        await page.getByRole("button", {name: /Sparade sökningar/}).click();
        await page.getByRole("button", {name: /Byt namn på Ursprungligt namn/}).click();

        const input = page.getByRole("textbox", {name: /Byt namn på Ursprungligt namn/});
        await input.fill("Nytt namn");
        await input.press("Enter");

        await expect(page.getByText("Namnet ändrades")).toBeVisible();

        await page.reload();
        await page.getByRole("button", {name: /Sparade sökningar/}).click();

        await expect(page.getByText("Nytt namn")).toBeVisible();
        await expect(page.getByText("Ursprungligt namn")).toHaveCount(0);
    });

    test("narrows the existing searches as the name is typed and reuses one", async ({page}) => {
        const dialog = page.locator('[data-slot="dialog-content"]');

        const saveAs = async (searchName: string) => {
            await page.getByRole("button", {name: /Spara sökning/}).click();
            await expect(dialog).toBeVisible();
            await dialog.getByPlaceholder(/inaktiva medlemmar/).fill(searchName);
            await dialog.getByRole("button", {name: "Spara", exact: true}).click();
            await expect(page.getByText("Sökningen sparades").first()).toBeVisible();
        };

        await page.goto("/spexare/search?q=Grace");
        await expect(page.getByText("Grace Hopper")).toBeVisible();

        await saveAs("Zeta alfa");
        await saveAs("Zeta beta");

        await page.getByRole("button", {name: /Spara sökning/}).click();
        await expect(dialog).toBeVisible();

        // Stays out of the way on open, despite the field being autofocused.
        const suggestions = dialog.getByLabel("Befintliga sökningar");
        await expect(suggestions).toHaveCount(0);

        await dialog.getByRole("combobox").click();
        await expect(suggestions.getByText("Zeta alfa")).toBeVisible();
        await expect(suggestions.getByText("Zeta beta")).toBeVisible();

        await dialog.getByPlaceholder(/inaktiva medlemmar/).fill("alfa");

        await expect(suggestions.getByText("Zeta alfa")).toBeVisible();
        await expect(suggestions.getByText("Zeta beta")).toHaveCount(0);

        // Picking one fills the name, which turns the save into an overwrite.
        await suggestions.getByText("Zeta alfa").click();
        await expect(dialog.getByRole("button", {name: "Uppdatera"})).toBeVisible();

        // Arrow keys move through the list and Enter takes the highlighted one.
        const nameField = dialog.getByRole("combobox");
        await nameField.fill("Zeta");
        await nameField.press("ArrowDown");
        await nameField.press("Enter");
        await expect(nameField).toHaveValue("Zeta alfa");

        // With nothing highlighted, Enter saves what was typed rather than a suggestion.
        await nameField.fill("Zeta gamma");
        await nameField.press("Enter");
        await expect(page.getByText("Sökningen sparades").first()).toBeVisible();
    });

    test("refuses to save when there is no search to save", async ({page}) => {
        await page.goto("/spexare/search");
        await expect(page.getByText("Ada Lovelace")).toBeVisible();

        await page.getByRole("button", {name: /Spara sökning/}).click();

        await expect(page.getByText("Det finns ingen sökning att spara")).toBeVisible();
        await expect(page.locator('[data-slot="dialog-content"]')).toHaveCount(0);
    });
});
