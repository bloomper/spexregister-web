import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ModeToggle} from "@/components/mode-toggle.client";
import {LanguageToggle} from "@/components/language-toggle.client";

const setTheme = vi.hoisted(() => vi.fn());
const changeLocale = vi.hoisted(() => vi.fn());
const track = vi.hoisted(() => vi.fn());

vi.mock("next-themes", () => ({useTheme: () => ({setTheme})}));
vi.mock("@/app/provider.client", () => ({useLocaleContext: () => ({changeLocale})}));
vi.mock("@/utils/umami", () => ({track}));

describe("the header toggles", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("changes the theme, remembers it in a cookie and counts the change", async () => {
        render(<ModeToggle/>);

        await userEvent.click(screen.getByRole("button", {name: "Header.toggleTheme"}));
        await userEvent.click(await screen.findByRole("menuitem", {name: "Common.themeDark"}));

        expect(setTheme).toHaveBeenCalledWith("dark");
        expect(document.cookie).toContain("theme=dark");
        expect(track).toHaveBeenCalledWith("theme-change", {theme: "dark"});
    });

    it("changes the language and counts the change", async () => {
        render(<LanguageToggle/>);

        await userEvent.click(screen.getByRole("button", {name: "Header.toggleLanguage"}));
        await userEvent.click(await screen.findByRole("menuitem", {name: "English"}));

        expect(changeLocale).toHaveBeenCalledWith("en");
        expect(track).toHaveBeenCalledWith("language-change", {locale: "en"});
    });
});
