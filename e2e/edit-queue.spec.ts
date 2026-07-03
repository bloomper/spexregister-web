import {expect, test} from "@playwright/test";

test("bulk-editing via the queue: warn on unsaved changes, save one, save & next", async ({page}) => {
    const discarded = `Kastad ${Date.now()}`;
    const savedFirst = `Hedersmedlem ${Date.now()}`;
    const savedAgain = `Hedersmedlem omsparad ${Date.now()}`;

    await page.goto("/tags/manage");

    await page.getByRole("checkbox", {name: "Välj alla"}).click();

    for (const checkbox of await page.getByRole("checkbox", {name: "Välj", exact: true}).all()) {
        await expect(checkbox).toBeChecked();
    }

    await page.getByRole("button", {name: /Lägg till redigeringskö/}).click();

    const queueButton = page.getByRole("button", {name: "Öppna redigeringskö"});
    await expect(queueButton).toBeVisible();
    await queueButton.click();

    const drawer = page.locator('[data-slot="sheet-content"]');
    await expect(drawer).toBeVisible();

    const nameInput = drawer.getByRole("textbox").first();
    const unsavedDialog = page.getByRole("alertdialog");

    await expect(drawer.getByText("1 / 2")).toBeVisible();
    const firstName = await nameInput.inputValue();

    await drawer.getByRole("button", {name: "Nästa", exact: true}).click();
    await expect(drawer.getByText("2 / 2")).toBeVisible();
    await expect(nameInput).toHaveValue("Grundare");

    await drawer.getByRole("button", {name: "Föregående"}).click();
    await expect(drawer.getByText("1 / 2")).toBeVisible();
    await expect(nameInput).toHaveValue(firstName);

    await nameInput.fill(discarded);
    await drawer.getByRole("button", {name: "Nästa", exact: true}).click();
    await expect(unsavedDialog).toBeVisible();
    await unsavedDialog.getByRole("button", {name: "Avbryt"}).click();
    await expect(drawer.getByText("1 / 2")).toBeVisible();
    await expect(nameInput).toHaveValue(discarded);

    await drawer.getByRole("button", {name: "Nästa", exact: true}).click();
    await expect(unsavedDialog).toBeVisible();
    await unsavedDialog.getByRole("button", {name: "Kasta ändringarna"}).click();
    await expect(drawer.getByText("2 / 2")).toBeVisible();

    await drawer.getByRole("button", {name: "Föregående"}).click();
    await expect(drawer.getByText("1 / 2")).toBeVisible();
    await expect(nameInput).toHaveValue(firstName);

    await nameInput.fill(savedFirst);
    await drawer.getByRole("button", {name: "Spara", exact: true}).click();
    await expect(page.getByText("Uppdateringen lyckades").first()).toBeVisible();
    await expect(drawer.getByText("1 / 2")).toBeVisible();
    await expect(nameInput).toHaveValue(savedFirst);
    await expect(page.locator("tbody").getByText(savedFirst)).toBeVisible();

    await drawer.getByRole("button", {name: "Nästa", exact: true}).click();
    await expect(unsavedDialog).toBeHidden();
    await expect(drawer.getByText("2 / 2")).toBeVisible();

    await expect(drawer.getByRole("button", {name: /Spara & nästa/})).toBeDisabled();

    await drawer.getByRole("button", {name: "Föregående"}).click();
    await expect(drawer.getByText("1 / 2")).toBeVisible();

    await nameInput.fill(savedAgain);
    await drawer.getByRole("button", {name: /Spara & nästa/}).click();
    await expect(drawer.getByText("2 / 2")).toBeVisible();
    await expect(page.locator("tbody").getByText(savedAgain)).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expect(queueButton).toBeVisible();

    await queueButton.click();
    await expect(drawer).toBeVisible();
    await drawer.getByRole("button", {name: "Töm kön"}).click();
    await expect(drawer).toBeHidden();
    await expect(queueButton).toBeHidden();
});

test("saving a queued item leaves the table's sort order alone", async ({page}) => {
    await page.goto("/spexare/manage");

    await expect(page.locator("tbody").getByText("Ada")).toBeVisible();

    const firstNames = () => page.locator("tbody tr td:nth-child(2)").allTextContents();
    const before = await firstNames();
    expect(before.length).toBeGreaterThan(1);

    await page.getByRole("row").nth(1).getByRole("checkbox").click();
    await page.getByRole("button", {name: /Lägg till redigeringskö/}).click();
    await page.getByRole("button", {name: "Öppna redigeringskö"}).click();

    const drawer = page.locator('[data-slot="sheet-content"]');
    await expect(drawer).toBeVisible();

    await drawer.getByRole("button", {name: "Spara", exact: true}).click();
    await expect(page.getByText("Uppdateringen lyckades").first()).toBeVisible();
    expect(await firstNames()).toEqual(before);

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    expect(await firstNames()).toEqual(before);
});
