import {expect, test} from "@playwright/test";

test.use({storageState: {cookies: [], origins: []}});

test("unauthenticated visitor gets the sign-in screen", async ({page}) => {
    await page.goto("/");

    const loginLink = page.locator('a[href="/api/auth/login"]');
    await expect(loginLink).toBeVisible();

    await expect(page.getByRole("navigation")).toHaveCount(0);
});
