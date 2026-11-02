import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SavedSearchBar} from "@/components/spexare/saved-search-bar.client";
import * as actions from "@/app/(app)/spexare/search/actions.server";
import type {SavedSearch} from "@/gql/schema";
import {toast} from "sonner";
import {track} from "@/utils/umami";

const router = vi.hoisted(() => ({refresh: vi.fn(), push: vi.fn()}));

vi.mock("next/navigation", () => ({useRouter: () => router}));
vi.mock("@/app/(app)/spexare/search/actions.server", () => ({
    createSavedSearchAction: vi.fn(),
    deleteSavedSearchAction: vi.fn(),
    updateSavedSearchAction: vi.fn(),
}));
vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn(), message: vi.fn()}}));
vi.mock("@/utils/umami", () => ({track: vi.fn()}));

const searches = [
    {id: "s1", name: "Kalas 2020", query: "q=kalas"},
    {id: "s2", name: "Styrelsen", query: "f.tags=board"},
] as SavedSearch[];

function at(query: string) {
    window.history.replaceState(null, "", query ? `/spexare/search?${query}` : "/spexare/search");
}

async function openList() {
    await userEvent.click(screen.getByRole("button", {name: /SavedSearch.heading/}));
}

beforeEach(() => {
    vi.clearAllMocks();
    at("q=ada");
    vi.mocked(actions.createSavedSearchAction).mockResolvedValue(undefined as never);
    vi.mocked(actions.updateSavedSearchAction).mockResolvedValue(undefined as never);
    vi.mocked(actions.deleteSavedSearchAction).mockResolvedValue(undefined as never);
});

afterEach(() => {
    at("");
});

describe("SavedSearchBar", () => {
    it("says when there is nothing saved", async () => {
        render(<SavedSearchBar/>);

        await openList();

        expect(await screen.findByText("SavedSearch.empty")).toBeInTheDocument();
    });

    it("runs a saved search", async () => {
        render(<SavedSearchBar savedSearches={searches}/>);

        await openList();
        await userEvent.click(await screen.findByRole("button", {name: "Kalas 2020"}));

        expect(router.push).toHaveBeenCalledWith("/spexare/search?q=kalas");
        expect(track).toHaveBeenCalledWith("saved-search-apply");
    });

    it("saves the current search under a new name", async () => {
        render(<SavedSearchBar savedSearches={searches}/>);

        await userEvent.click(screen.getByRole("button", {name: "SavedSearch.save"}));
        await userEvent.type(screen.getByRole("combobox"), "Ada");
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));

        await waitFor(() => expect(actions.createSavedSearchAction).toHaveBeenCalledWith({name: "Ada", query: "q=ada"}));
        expect(toast.success).toHaveBeenCalledWith("SavedSearch.saveSuccess");
        expect(router.refresh).toHaveBeenCalled();
    });

    it("overwrites a search with the same name, picked from the suggestions with the keyboard", async () => {
        render(<SavedSearchBar savedSearches={searches}/>);

        await userEvent.click(screen.getByRole("button", {name: "SavedSearch.save"}));
        await userEvent.type(screen.getByRole("combobox"), "sty");
        expect(screen.getByRole("button", {name: "Styrelsen"})).toBeInTheDocument();
        await userEvent.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}{ArrowDown}{Enter}");

        expect(screen.getByRole("combobox")).toHaveValue("Styrelsen");
        expect(screen.getByText("SavedSearch.overwriteHint")).toBeInTheDocument();
        await userEvent.keyboard("{Enter}");

        await waitFor(() => expect(actions.updateSavedSearchAction).toHaveBeenCalledWith("s2", {name: "Styrelsen", query: "q=ada"}));
        expect(track).toHaveBeenCalledWith("saved-search-save", {update: true});
    });

    it("picks a suggestion with the mouse and closes the suggestions with Escape", async () => {
        render(<SavedSearchBar savedSearches={searches}/>);

        await userEvent.click(screen.getByRole("button", {name: "SavedSearch.save"}));
        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(screen.getByRole("button", {name: "Kalas 2020"}));
        expect(screen.getByRole("combobox")).toHaveValue("Kalas 2020");

        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.keyboard("{Escape}");
        expect(screen.queryByRole("button", {name: "Styrelsen"})).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", {name: "Common.cancel"}));
        await waitFor(() => expect(screen.queryByRole("combobox")).not.toBeInTheDocument());
    });

    it("has nothing to save without a search", async () => {
        at("");
        render(<SavedSearchBar savedSearches={searches}/>);

        await userEvent.click(screen.getByRole("button", {name: "SavedSearch.save"}));

        expect(toast.message).toHaveBeenCalledWith("SavedSearch.nothingToSave");
        expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

        await openList();
        await userEvent.click((await screen.findAllByRole("button", {name: /^SavedSearch.updateLabel/}))[0]);
        expect(toast.message).toHaveBeenCalledTimes(2);
    });

    it("updates a search to the current one, and deletes one", async () => {
        render(<SavedSearchBar savedSearches={searches}/>);

        await openList();
        await userEvent.click((await screen.findAllByRole("button", {name: /^SavedSearch.updateLabel/}))[0]);
        await waitFor(() => expect(actions.updateSavedSearchAction).toHaveBeenCalledWith("s1", {name: "Kalas 2020", query: "q=ada"}));

        await userEvent.click(screen.getAllByRole("button", {name: /^SavedSearch.deleteLabel/})[1]);
        await waitFor(() => expect(actions.deleteSavedSearchAction).toHaveBeenCalledWith("s2"));
        expect(toast.success).toHaveBeenCalledWith("SavedSearch.deleteSuccess");
    });

    it("renames a search, refusing a taken name", async () => {
        render(<SavedSearchBar savedSearches={searches}/>);

        await openList();
        await userEvent.click((await screen.findAllByRole("button", {name: /^SavedSearch.renameLabel/}))[0]);
        const input = screen.getByRole("textbox");

        await userEvent.clear(input);
        await userEvent.type(input, "styrelsen{Enter}");
        expect(toast.error).toHaveBeenCalledWith("SavedSearch.nameTaken");

        await userEvent.clear(input);
        await userEvent.type(input, "Kalas 2021");
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));

        await waitFor(() => expect(actions.updateSavedSearchAction).toHaveBeenCalledWith("s1", {name: "Kalas 2021", query: "q=kalas"}));
        expect(toast.success).toHaveBeenCalledWith("SavedSearch.renameSuccess");
    });

    it("cancels a rename that changes nothing, and reports failures", async () => {
        vi.mocked(actions.deleteSavedSearchAction).mockRejectedValue(new Error("boom"));
        render(<SavedSearchBar savedSearches={searches}/>);

        await openList();
        await userEvent.click((await screen.findAllByRole("button", {name: /^SavedSearch.renameLabel/}))[0]);
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));
        expect(actions.updateSavedSearchAction).not.toHaveBeenCalled();
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

        await userEvent.click((await screen.findAllByRole("button", {name: /^SavedSearch.renameLabel/}))[1]);
        await userEvent.click(screen.getByRole("button", {name: "Common.cancel"}));
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

        await userEvent.click(screen.getAllByRole("button", {name: /^SavedSearch.deleteLabel/})[0]);
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred"));
    });
});
