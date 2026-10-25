import {expect, test} from "./fixtures";
import {MOCK_PORT} from "./constants";

test.use({storageState: {cookies: [], origins: []}});

test("a user without any role sees the no-access page instead of the app", async ({page, request}) => {
    await request.post(`http://localhost:${MOCK_PORT}/__roles`, {data: {roles: []}});

    await page.goto("/api/auth/login");

    await expect(page).toHaveURL(/\/no-access$/);
    await expect(page.getByRole("heading", {name: "Du har inte åtkomst"})).toBeVisible();
    await expect(page.getByText("e2e@example.com", {exact: false})).toBeVisible();
    await expect(page.locator('[data-slot="sidebar"]')).toHaveCount(0);

    await page.goto("/spexare");
    await expect(page).toHaveURL(/\/no-access$/);

    await page.getByRole("button", {name: "Jag förstår"}).click();
    await page.getByRole("button", {name: "Logga ut"}).click();
    await expect(page.getByText("Du behöver vara inloggad för att använda adressregistret.")).toBeVisible();
});

test("a visitor who is not logged in is sent from the no-access page to the sign-in screen", async ({page}) => {
    await page.goto("/no-access");

    await expect(page.getByText("Du behöver vara inloggad för att använda adressregistret.")).toBeVisible();
});

test("a user who lacks the page's role sees the forbidden page inside the app", async ({page, request}) => {
    await request.post(`http://localhost:${MOCK_PORT}/__roles`, {data: {roles: ["USER"]}});

    await page.goto("/api/auth/login");
    await page.goto("/admin/maintenance");

    await expect(page).toHaveURL(/\/admin\/maintenance$/);
    await expect(page.getByRole("heading", {name: "Du har inte behörighet"})).toBeVisible();
});
