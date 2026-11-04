import {expect, test} from "./fixtures";

test("the header's title switches to the other applications the user can open", async ({page}) => {
    await page.goto("/");

    const banner = page.getByRole("banner");
    await banner.getByRole("button", {name: "Chalmersspexets Adressregister"}).click();

    const menu = page.getByRole("menu");
    await expect(menu.getByText("Byt applikation")).toBeVisible();

    await expect(menu.getByRole("menuitem", {name: /Spexregister/})).toHaveAttribute("aria-current", "true");
    await expect(menu.getByRole("menuitem", {name: /Spexify/})).toHaveAttribute("href", "https://spexify.e2e.test");

    // Nyuppsättning has an address but no USER role in the token; Spexflix has the role but no address.
    await expect(menu.getByRole("menuitem", {name: /Nyuppsättning/})).toHaveCount(0);
    await expect(menu.getByRole("menuitem", {name: /Spexflix/})).toHaveCount(0);
});
