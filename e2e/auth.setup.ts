import {expect, test as setup} from "@playwright/test";
import {STORAGE_STATE} from "./constants";

setup("authenticate", async ({page}) => {
    await page.goto("/api/auth/login");

    await expect(page.locator('a[href="/api/auth/login"]')).toHaveCount(0);
    await page.getByRole("button", {name: "Jag förstår"}).click();
    await expect(page.getByRole("link", {name: "Hem"})).toBeVisible();
    // c15t writes the dismissal asynchronously; saving state before it lands leaves the banner over every later test
    await expect(page.getByTestId("consent-banner-root")).toHaveCount(0);
    await expect.poll(async () => (await page.context().cookies()).some(c => c.name === "c15t-notice")).toBe(true);

    await page.context().storageState({path: STORAGE_STATE});
});
