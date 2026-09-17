import {expect, test} from "@playwright/test";

test.describe("graph explorer", () => {
    test("searches for a start node and seeds the graph with it", async ({page}) => {
        await page.goto("/spexare/explore");

        await expect(page.getByText("Inget att utforska ännu")).toBeVisible();

        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();

        await page.getByRole("button", {name: /Ada Lovelace/}).click();

        await expect(page.getByText("5 noder")).toBeVisible();
        await expect(page.getByRole("button", {name: "Visa detaljer för Ada Lovelace"})).toBeVisible();
    });

    test("expands a node and pulls its neighbours in", async ({page}) => {
        await page.goto("/spexare/explore");
        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();
        await page.getByRole("button", {name: /Ada Lovelace/}).click();

        await expect(page.getByText("5 noder")).toBeVisible();

        // Ada's 2015 participation leads on to the spex and the function she held there.
        await page.getByRole("button", {name: "Expandera Bacchus"}).click();

        await expect(page.getByText("6 noder")).toBeVisible();
        // Bacchus leads on to the revival of the same production.
        await expect(page.getByRole("button", {name: "Visa Bacchus i grafen"}).first()).toBeVisible();
    });

    test("opens the detail dialog for a node", async ({page}) => {
        await page.goto("/spexare/explore");
        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();
        await page.getByRole("button", {name: /Ada Lovelace/}).click();

        await page.getByRole("button", {name: "Visa detaljer för Ada Lovelace"}).click();

        const dialog = page.locator('[data-slot="dialog-content"]');

        await expect(dialog).toBeVisible();
        await expect(dialog.getByText("Spexkarriär")).toBeVisible();
    });

    test("an expanded node offers collapse instead of expand", async ({page}) => {
        await page.goto("/spexare/explore");
        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();
        await page.getByRole("button", {name: /Ada Lovelace/}).click();

        await expect(page.getByText("5 noder")).toBeVisible();
        await expect(page.getByRole("button", {name: "Expandera Ada Lovelace"})).toHaveCount(0);

        // Collapsing drops the neighbours that hang off Ada and nothing else.
        await page.getByRole("button", {name: "Fäll ihop Ada Lovelace"}).click();

        await expect(page.getByText("1 nod", {exact: true})).toBeVisible();
        await expect(page.getByRole("button", {name: "Expandera Ada Lovelace"})).toBeEnabled();
    });

    // Which node it lands on is the server's business - your own spexare if linked, a random
// person otherwise; from here all that matters is that an empty term seeds the graph.
    test("an empty search seeds a starting point", async ({page}) => {
        await page.goto("/spexare/explore");

        await expect(page.getByText("Inget att utforska ännu")).toBeVisible();
        await page.getByRole("button", {name: "Sök", exact: true}).click();

        await expect(page.getByText(/noder|nod$/)).toBeVisible();
    });

    test("shows a partner as a relation", async ({page}) => {
        await page.goto("/spexare/explore");
        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();
        await page.getByRole("button", {name: /Ada Lovelace/}).click();

        await expect(page.getByRole("button", {name: "Visa Grace Hopper i grafen"})).toBeVisible();
    });

    test("filters the node list", async ({page}) => {
        await page.goto("/spexare/explore");
        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();
        await page.getByRole("button", {name: /Ada Lovelace/}).click();
        await expect(page.getByText("5 noder")).toBeVisible();

        await page.getByLabel("Filtrera noder...").fill("bacch");

        await expect(page.getByRole("button", {name: "Visa Bacchus i grafen"})).toBeVisible();
        await expect(page.getByRole("button", {name: "Visa Ada Lovelace i grafen"})).toHaveCount(0);

        await page.getByLabel("Filtrera noder...").fill("zzz");
        await expect(page.getByText("Inga noder matchar")).toBeVisible();

        // The filter clears from its own button, without backspacing the term away.
        await page.getByRole("button", {name: "Rensa filter"}).click();

        await expect(page.getByLabel("Filtrera noder...")).toHaveValue("");
        await expect(page.getByRole("button", {name: "Visa Ada Lovelace i grafen"})).toBeVisible();
        await expect(page.getByRole("button", {name: "Rensa filter"})).toHaveCount(0);
    });

    test("shows a legend for the node colours", async ({page}) => {
        await page.goto("/spexare/explore");
        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();
        await page.getByRole("button", {name: /Ada Lovelace/}).click();
        await expect(page.getByText("5 noder")).toBeVisible();

        // Only the types actually on screen, plus the revival marker.
        const legend = page.locator("ul").filter({hasText: "Nyuppsättning"}).first();

        await expect(legend.getByText("Spexare")).toBeVisible();
        await expect(legend.getByText("Nyuppsättning")).toBeVisible();
        await expect(legend.getByText("Funktionskategori")).toHaveCount(0);
    });

    test("starts over when the page is left and re-entered", async ({page}) => {
        await page.goto("/spexare/explore");
        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();
        await page.getByRole("button", {name: /Ada Lovelace/}).first().click();
        await expect(page.getByText("5 noder")).toBeVisible();
        await page.waitForTimeout(3000);

        await page.getByRole("link", {name: "Hem", exact: true}).click();
        await page.waitForTimeout(1500);
        await page.getByRole("link", {name: "Utforska", exact: true}).click();

        // React keeps this page's state across the navigation, but the WebGL scene does not survive
        // with it - a rebuilt graph re-simulates and lands somewhere else entirely. So the page
        // starts fresh instead of pretending to resume.
        await expect(page.getByText("Inget att utforska ännu")).toBeVisible();
        await expect(page.getByText("5 noder")).toHaveCount(0);
        await expect(page.getByLabel("Sök efter spexare, spex, funktion eller tagg...")).toHaveValue("");

        // And it is genuinely usable again, with a canvas that draws.
        await page.getByLabel("Sök efter spexare, spex, funktion eller tagg...").fill("Ada");
        await page.getByRole("button", {name: "Sök", exact: true}).click();
        await page.getByRole("button", {name: /Ada Lovelace/}).first().click();
        await expect(page.getByText("5 noder")).toBeVisible();
        await page.waitForTimeout(6000);

        // A blank canvas is a flat colour and compresses to a fraction of a drawn one: measured,
        // ~1.8kB against ~18kB. WebGL pixels cannot be read back without preserveDrawingBuffer, so
        // the screenshot size stands in for "something was actually rendered".
        const drawn = (await page.locator("canvas").screenshot()).length;

        expect(drawn).toBeGreaterThan(6000);
    });
});
