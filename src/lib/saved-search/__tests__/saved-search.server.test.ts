import {beforeEach, describe, expect, it, vi} from "vitest";
import {create, del, get, getAll, update} from "@/lib/saved-search/saved-search.server";

const {runQuery, mutateForData, runMutationField} = vi.hoisted(() => ({
    runQuery: vi.fn(), mutateForData: vi.fn(), runMutationField: vi.fn(),
}));

vi.mock("@/lib/graphql.server", () => ({runQuery, mutateForData, runMutationField}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("saved-search.server", () => {
    it("lists the saved searches, dropping empty entries", async () => {
        runQuery.mockResolvedValueOnce({savedSearches: [{id: "1"}, null]});
        expect(await getAll()).toEqual([{id: "1"}]);
        expect(runQuery.mock.calls[0][2]).toEqual({fetchOptions: {next: {tags: ["saved-search"]}}});

        runQuery.mockResolvedValueOnce(undefined);
        expect(await getAll()).toEqual([]);
    });

    it("gets one", async () => {
        runQuery.mockResolvedValueOnce({savedSearch: {id: "2"}});
        expect(await get("2")).toEqual({id: "2"});
        expect(runQuery.mock.calls[0][1]).toEqual({id: "2"});
    });

    it("creates, updates and deletes", async () => {
        mutateForData.mockResolvedValue({id: "3"});
        runMutationField.mockResolvedValue(true);

        expect(await create({name: "A", query: "q=a"})).toEqual({id: "3"});
        expect(mutateForData.mock.calls[0].slice(1)).toEqual([{input: {name: "A", query: "q=a"}}, "savedSearchCreate", "No data created"]);

        await update("3", {name: "B", query: "q=b"});
        expect(mutateForData.mock.calls[1][1]).toEqual({input: {name: "B", query: "q=b", id: "3"}});

        expect(await del("3")).toBe(true);
        expect(runMutationField.mock.calls[0].slice(1)).toEqual([{id: "3"}, "savedSearchDelete"]);
    });
});
