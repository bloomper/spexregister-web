import type {Page} from "@playwright/test";
import {expect, test} from "./fixtures";

/** Small and common phones, and a tablet. */
const SCREENS = [
    {width: 360, height: 740},
    {width: 390, height: 844},
    {width: 768, height: 1024},
];

const PAGES = ["/", "/news", "/spex", "/spex/categories", "/spexare", "/spexare/search?q=ada", "/spexare/explore",
    "/spexare/map", "/tasks", "/tasks/categories", "/tags", "/analytics", "/my-profile", "/spexare/manage",
    "/spexare/create", "/news/manage", "/spex/manage", "/tags/manage", "/users/manage", "/admin/change-log",
    "/admin/permissions", "/admin/maintenance", "/impex/manage", "/about", "/support"];

/**
 * The page does not scroll sideways; tables and tab lists may scroll inside their frame.
 */
async function fits(page: Page, path: string) {
    await page.goto(path);
    await page.getByRole("heading", {level: 1}).first().waitFor({state: "attached"});

    // Charts are drawn at a default size before they measure their frame, so give them a moment
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
        {message: `${path} scrolls sideways`}).toBeLessThanOrEqual(0);
}

/**
 * The application's name is shown in full, and every control in the header lies inside the screen, clear of the
 * others.
 */
async function headerFits(page: Page) {
    const header = page.getByRole("banner");
    // The title opens the application switcher here, so it is the button's text that must not be cut short
    const title = header.locator("p button > span:visible").first();

    await expect(title).toHaveText("Chalmersspexets Adressregister");
    expect(await title.evaluate(element => element.scrollWidth - element.clientWidth), "the title is cut short")
        .toBeLessThanOrEqual(0);

    const boxes = await header.locator("button:visible, a:visible, input:visible").evaluateAll(elements => elements
        .filter(element => !elements.some(other => other !== element && other.contains(element)))
        .map(element => {
            const rect = element.getBoundingClientRect();

            return {name: element.getAttribute("aria-label") ?? element.textContent ?? "", ...rect.toJSON()};
        }));
    const width = await page.evaluate(() => document.documentElement.clientWidth);

    expect(boxes.length).toBeGreaterThan(3);
    boxes.forEach((box, index) => {
        expect(box.left, `${box.name} starts off screen`).toBeGreaterThanOrEqual(0);
        expect(box.right, `${box.name} ends off screen`).toBeLessThanOrEqual(width);
        boxes.slice(index + 1).forEach(other => {
            const overlaps = box.left < other.right - 1 && other.left < box.right - 1
                && box.top < other.bottom - 1 && other.top < box.bottom - 1;

            expect(overlaps, `${box.name} overlaps ${other.name}`).toBe(false);
        });
    });
}

for (const screen of SCREENS) {
    test.describe(`${screen.width} × ${screen.height}`, () => {
        test.beforeEach(async ({page}) => {
            await page.setViewportSize(screen);
        });

        test("no page scrolls sideways", async ({page}) => {
            test.setTimeout(120_000);
            for (const path of PAGES) {
                await fits(page, path);
            }
        });

        test("the header shows the whole title and every control, and the menu opens", async ({page}) => {
            await page.goto("/");
            await headerFits(page);

            await page.getByRole("button", {name: "Visa eller dölj menyn"}).click();
            await expect(page.getByRole("link", {name: "Hem"}).first()).toBeVisible();
        });
    });
}
