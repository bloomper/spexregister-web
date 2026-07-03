import {expect, test} from "@playwright/test";

test("authenticated dashboard renders news from the backend", async ({page}) => {
    await page.goto("/");

    await expect(page.getByText("Premiär 2026")).toBeVisible();
    await expect(page.getByText("Nya lokaler")).toBeVisible();
});

test("authenticated dashboard renders the statistics charts", async ({page}) => {
    await page.goto("/");

    // "Nyuppsättningar" (spex revivals) and the per-card footer are unique to the stats block.
    await expect(page.getByText("Nyuppsättningar")).toBeVisible();
    await expect(page.getByText("Visar data för de senaste tre åren").first()).toBeVisible();

    // The spexare stat card shows its count (3, from the mock's statistics fixture).
    const spexareCard = page.locator('[data-slot="card"]').filter({hasText: "Nyuppsättningar"});
    await expect(spexareCard.getByText("4")).toBeVisible();
});
