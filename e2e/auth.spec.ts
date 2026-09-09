import {expect, test} from "@playwright/test";

test.use({storageState: {cookies: [], origins: []}});

test("unauthenticated visitor gets the sign-in screen", async ({page}) => {
    await page.goto("/");

    await expect(page.getByText("Du behöver vara inloggad för att använda adressregistret.")).toBeVisible();
    await expect(page.locator('a[href="/api/auth/login"]')).toBeVisible();
});

test("unauthenticated visitor gets no app shell", async ({page}) => {
    await page.goto("/");

    // The `(app)` layout must substitute the landing page for the whole authenticated shell —
    // no sidebar, and none of the entity routes reachable from it.
    await expect(page.locator('[data-slot="sidebar"]')).toHaveCount(0);
    await expect(page.getByRole("link", {name: "Spexare", exact: true})).toHaveCount(0);
});
