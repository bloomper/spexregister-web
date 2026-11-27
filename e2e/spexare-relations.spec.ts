import { type Locator, type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const sheetOf = (page: Page) => page.locator('[data-slot="sheet-content"]');

const activityBlock = (sheet: Locator, heading: string) =>
  sheet
    .locator("div.relative.pl-10")
    .filter({ has: sheet.page().getByRole("heading", { name: heading, exact: true }) });

async function openEditFromTable(page: Page, firstName: string) {
  await page.goto("/spexare/manage");
  const row = page.getByRole("row").filter({ hasText: firstName });
  await row.getByRole("button").last().click();
  await page.getByRole("menuitem", { name: "Ändra" }).click();
  const sheet = sheetOf(page);
  await expect(sheet.getByText("Ändra spexare")).toBeVisible();
  return sheet;
}

async function openEditFromGrid(page: Page, name: string) {
  await page.goto("/spexare");
  const card = page.locator('[data-slot="card"]').filter({ hasText: name });
  await card.hover();
  await card.getByRole("button", { name: "Ändra" }).click();
  const sheet = sheetOf(page);
  await expect(sheet.getByText("Ändra spexare")).toBeVisible();
  return sheet;
}

async function openEditFromQueue(page: Page, firstName: string) {
  await page.goto("/spexare/manage");
  await page.getByRole("row").filter({ hasText: firstName }).getByRole("checkbox").click();
  await page.getByRole("button", { name: /Lägg till redigeringskö/ }).click();
  await page.getByRole("button", { name: "Öppna redigeringskö" }).click();
  const drawer = sheetOf(page);
  await expect(drawer.getByText("1 / 1")).toBeVisible();
  return drawer;
}

async function pickOption(page: Page, trigger: Locator, option: string) {
  await trigger.click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

async function addActivityWithSpex(page: Page, sheet: Locator, category: string, year: string, title: string) {
  await sheet.getByRole("tab", { name: "Aktiviteter" }).click();
  await expect(activityBlock(sheet, "Bacchus")).toBeVisible();

  await sheet.getByRole("button", { name: "Lägg till", exact: true }).first().click();

  const added = activityBlock(sheet, "Ny aktivitet");
  await expect(added).toBeVisible();
  await expect(sheet.getByRole("tab", { name: "Aktiviteter" })).toHaveAttribute("aria-selected", "true");

  await pickOption(page, added.getByRole("combobox").filter({ hasText: "Välj spexkategori" }), category);
  await pickOption(page, added.getByRole("combobox").filter({ hasText: "Välj år" }), `${year} - ${title}`);
  await added.getByRole("button", { name: "Lägg till", exact: true }).click();

  const activity = activityBlock(sheet, title);
  await expect(activity).toBeVisible();
  await expect(activityBlock(sheet, "Ny aktivitet")).toHaveCount(0);
  await expect(activity.getByText("Välj funktionskategori")).toBeVisible();
  return activity;
}

async function addActivityWithSpexAndFunction(page: Page, sheet: Locator) {
  const nobel = await addActivityWithSpex(page, sheet, "Chalmersspexet", "1996", "Nobel");

  await pickOption(page, nobel.getByRole("combobox").filter({ hasText: "Välj funktionskategori" }), "Kommitté");
  await pickOption(page, nobel.getByRole("combobox").filter({ hasText: "Välj funktion" }), "Scenmästare");
  await nobel.getByRole("button", { name: "Lägg till", exact: true }).click();

  await expect(nobel.getByText("Scenmästare", { exact: true })).toBeVisible();
  return nobel;
}

test.describe("spexare activities", () => {
  test("adding an activity, its spex and a function shows each step at once in the table's edit sheet", async ({
    page,
  }) => {
    const sheet = await openEditFromTable(page, "Ada");
    await addActivityWithSpexAndFunction(page, sheet);

    // The footer's button; the corner's X, after it, is named the same
    await sheet.getByRole("button", { name: "Stäng" }).first().click();
    await expect(sheet).toBeHidden();

    const reopened = await openEditFromTable(page, "Ada");
    await reopened.getByRole("tab", { name: "Aktiviteter" }).click();
    await expect(activityBlock(reopened, "Nobel").getByText("Scenmästare", { exact: true })).toBeVisible();
  });

  test("adding an activity shows it at once in the grid's edit sheet", async ({ page }) => {
    const sheet = await openEditFromGrid(page, "Ada Lovelace");
    await addActivityWithSpexAndFunction(page, sheet);
  });

  test("adding an activity shows it at once in the edit queue", async ({ page }) => {
    const drawer = await openEditFromQueue(page, "Ada");
    await addActivityWithSpexAndFunction(page, drawer);
  });

  test("a function with roles takes its role from the spex's characters in the same step", async ({ page }) => {
    const sheet = await openEditFromTable(page, "Ada");
    const nobel = await addActivityWithSpex(page, sheet, "Chalmersspexet", "1996", "Nobel");

    await pickOption(page, nobel.getByRole("combobox").filter({ hasText: "Välj funktionskategori" }), "Ensemble");
    await pickOption(page, nobel.getByRole("combobox").filter({ hasText: "Välj funktion" }), "Ensemblist");

    // The spex has characters, so the role is picked among them and can't be typed in.
    const role = nobel.getByRole("combobox").filter({ hasText: "Ingen roll" });
    await role.click();
    await expect(page.getByRole("option", { name: "Struken roll" })).toHaveCount(0);
    await page.getByRole("option", { name: "Alfred Nobel", exact: true }).click();
    await expect(nobel.getByRole("textbox")).toHaveCount(0);

    // A role needs a vocal.
    await nobel.getByRole("button", { name: "Lägg till", exact: true }).click();
    await expect(nobel.getByText("Fältet är obligatoriskt")).toBeVisible();

    await pickOption(page, nobel.getByRole("combobox").filter({ hasText: "Välj" }).last(), "Sopran");
    await nobel.getByRole("button", { name: "Lägg till", exact: true }).click();

    const actor = nobel.locator("div.italic").filter({ hasText: "Alfred Nobel" });
    await expect(actor).toBeVisible();
    await expect(actor).toContainText("Sopran");
    await expect(nobel.getByText("Ensemblist", { exact: true })).toBeVisible();
  });

  test("a function with roles takes a typed role when the spex has no characters", async ({ page }) => {
    const sheet = await openEditFromTable(page, "Ada");
    const ada = await addActivityWithSpex(page, sheet, "Veraspexet", "2018", "Ada Lovelace");

    await pickOption(page, ada.getByRole("combobox").filter({ hasText: "Välj funktionskategori" }), "Ensemble");
    await pickOption(page, ada.getByRole("combobox").filter({ hasText: "Välj funktion" }), "Ensemblist");

    await expect(ada.getByRole("combobox").filter({ hasText: "Ingen roll" })).toHaveCount(0);
    await ada.getByRole("textbox").fill("Grevinnan");
    await pickOption(page, ada.getByRole("combobox").filter({ hasText: "Välj" }).last(), "Sopran");
    await ada.getByRole("button", { name: "Lägg till", exact: true }).click();

    const actor = ada.locator("div.italic").filter({ hasText: "Grevinnan" });
    await expect(actor).toBeVisible();
    await expect(actor).toContainText("Sopran");
  });

  test("deleting an activity removes it at once", async ({ page }) => {
    const sheet = await openEditFromTable(page, "Ada");
    const nobel = await addActivityWithSpexAndFunction(page, sheet);

    await nobel.getByRole("button").nth(1).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Radera" }).click();

    await expect(page.getByText("Raderingen lyckades").first()).toBeVisible();
    await expect(activityBlock(sheet, "Nobel")).toHaveCount(0);
    await expect(activityBlock(sheet, "Bacchus")).toBeVisible();
  });

  test("removing a function from an activity removes it at once", async ({ page }) => {
    const sheet = await openEditFromTable(page, "Ada");
    const nobel = await addActivityWithSpexAndFunction(page, sheet);

    const functionRow = nobel.locator("div.space-y-3").filter({ hasText: "Scenmästare" });
    await functionRow.getByRole("button").last().click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Radera" }).click();

    await expect(nobel.getByText("Scenmästare", { exact: true })).toHaveCount(0);
  });
});

test.describe("spexare memberships", () => {
  test("adding and deleting a membership updates the sheet at once", async ({ page }) => {
    const sheet = await openEditFromTable(page, "Ada");
    await sheet.getByRole("tab", { name: "Medlemskap" }).click();
    await expect(sheet.getByText("Fullvärdig")).toBeVisible();

    await sheet.getByRole("button", { name: "Lägg till", exact: true }).click();
    const field = (label: string) => sheet.getByRole("group").filter({ hasText: label }).getByRole("combobox");
    await pickOption(page, field("Medlemskapstyp"), "Stödjande");
    await pickOption(page, field("År"), "2021");
    await sheet
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Avbryt" }) })
      .getByRole("button", { name: "Spara", exact: true })
      .click();

    const added = sheet.locator(".group").filter({ hasText: "Stödjande" }).filter({ hasText: "2021" });
    await expect(added).toBeVisible();

    await added.hover();
    await added.getByRole("button").click();

    await expect(added).toHaveCount(0);
    await expect(sheet.getByText("Fullvärdig")).toBeVisible();
  });
});

test.describe("spexare tags", () => {
  test("adding and removing a tag updates the sheet at once", async ({ page }) => {
    const sheet = await openEditFromTable(page, "Ada");
    await sheet.getByRole("tab", { name: "Taggar" }).click();

    await sheet.getByRole("button", { name: "Lägg till", exact: true }).click();
    await page.getByRole("option", { name: "Grundare" }).click();

    const badge = sheet.locator('[data-slot="badge"]').filter({ hasText: "Grundare" });
    await expect(badge).toBeVisible();

    await badge.getByRole("button").click();
    await expect(badge).toHaveCount(0);
  });
});
