import {expect, test} from "./fixtures";

const browsePages = [
    {name: "news", url: "/news", item: "Premiär 2026"},
    {name: "spex", url: "/spex", item: "Nobel"},
    {name: "spex categories", url: "/spex/categories", item: "Veraspexet"},
    {name: "tasks", url: "/tasks", item: "Scenmästare"},
    {name: "task categories", url: "/tasks/categories", item: "Kommitté"},
    {name: "tags", url: "/tags", item: "Hedersmedlem"},
];

for (const {name, url, item} of browsePages) {
    test(`${name} browse page renders the grid from the backend`, async ({page}) => {
        await page.goto(url);

        await expect(page.getByText(item).first()).toBeVisible();
    });
}

const staticPages = [
    {url: "/about", heading: "Om registret"},
    {url: "/support", heading: "Hur kan vi hjälpa till?"},
    {url: "/admin/maintenance", heading: "Underhåll"},
];

for (const {url, heading} of staticPages) {
    test(`${url} renders`, async ({page}) => {
        await page.goto(url);

        await expect(page.getByRole("heading", {name: heading})).toBeVisible();
    });
}
