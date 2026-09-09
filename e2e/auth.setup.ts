import {expect, test as setup} from "@playwright/test";
import {STORAGE_STATE} from "./constants";

setup("authenticate", async ({page}) => {
    await page.goto("/api/auth/login");

    await expect(page.locator('a[href="/api/auth/login"]')).toHaveCount(0);
    await expect(page.getByRole("link", {name: "Hem"})).toBeVisible();

    await page.context().storageState({path: STORAGE_STATE});
});
