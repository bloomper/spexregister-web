import {beforeEach, describe, expect, it, vi} from "vitest";
import {
    collectAllPages,
    createResourceClient,
    mutateForData,
    runMutation,
    runMutationField,
    runQuery,
} from "@/lib/graphql.server";
import {ImpexType, SortDirection} from "@/gql/schema";
import type {CursorPage} from "@/types/pagination";

const toPromise = vi.fn();
const query = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
const mutation = vi.fn<(...args: unknown[]) => { toPromise: typeof toPromise }>(() => ({toPromise}));
vi.mock("@/lib/urql.server", () => ({getClient: () => ({query, mutation})}));

const axiosPost = vi.fn();
vi.mock("@/lib/axios.server", () => ({default: {post: (...a: unknown[]) => axiosPost(...a)}}));

beforeEach(() => {
    toPromise.mockReset();
    query.mockClear();
    mutation.mockClear();
    axiosPost.mockReset();
});

describe("runQuery", () => {
    it("returns data and forwards variables and context", async () => {
        toPromise.mockResolvedValue({data: {value: 42}});

        const ctx = {fetchOptions: {next: {tags: ["x"]}}};
        const data = await runQuery<{ value: number }>("query", {a: 1}, ctx);

        expect(data).toEqual({value: 42});
        expect(query).toHaveBeenCalledWith("query", {a: 1}, ctx);
    });

    it("defaults variables to an empty object", async () => {
        toPromise.mockResolvedValue({data: {}});
        await runQuery("query");
        expect(query).toHaveBeenCalledWith("query", {}, undefined);
    });

    it("throws the GraphQL error", async () => {
        toPromise.mockResolvedValue({error: new Error("bad query")});
        await expect(runQuery("query")).rejects.toThrow("bad query");
    });
});

describe("runMutation", () => {
    it("returns data on success", async () => {
        toPromise.mockResolvedValue({data: {ok: true}});
        await expect(runMutation("m", {id: "1"})).resolves.toEqual({ok: true});
        expect(mutation).toHaveBeenCalledWith("m", {id: "1"});
    });

    it("throws the GraphQL error", async () => {
        toPromise.mockResolvedValue({error: new Error("bad mutation")});
        await expect(runMutation("m")).rejects.toThrow("bad mutation");
    });
});

describe("runMutationField", () => {
    it("returns the named root field", async () => {
        toPromise.mockResolvedValue({data: {thingDelete: true}});
        await expect(runMutationField("m", {id: "1"}, "thingDelete")).resolves.toBe(true);
    });

    it("returns undefined when the field is absent", async () => {
        toPromise.mockResolvedValue({data: {}});
        await expect(runMutationField("m", {}, "thingDelete")).resolves.toBeUndefined();
    });

    it("propagates errors", async () => {
        toPromise.mockResolvedValue({error: new Error("nope")});
        await expect(runMutationField("m", {}, "thingDelete")).rejects.toThrow("nope");
    });
});

describe("mutateForData", () => {
    it("returns the entity when present", async () => {
        toPromise.mockResolvedValue({data: {thingCreate: {id: "1"}}});
        await expect(mutateForData("m", {}, "thingCreate", "No data created")).resolves.toEqual({id: "1"});
    });

    it("throws the supplied message when the field is falsy", async () => {
        toPromise.mockResolvedValue({data: {}});
        await expect(mutateForData("m", {}, "thingCreate", "No data created")).rejects.toThrow("No data created");
    });

    it("propagates GraphQL errors ahead of the missing-data check", async () => {
        toPromise.mockResolvedValue({error: new Error("boom")});
        await expect(mutateForData("m", {}, "thingCreate", "No data created")).rejects.toThrow("boom");
    });
});

describe("collectAllPages", () => {
    it("walks every page until hasNextPage is false and forwards the cursor", async () => {
        const pages: Record<string, CursorPage<{ id: string }>> = {
            "null": {
                items: [{id: "1"}, {id: "2"}],
                pageInfo: {hasNextPage: true, hasPreviousPage: false, startCursor: null, endCursor: "c2"}
            },
            "c2": {
                items: [{id: "3"}],
                pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null}
            },
        };
        const fetchPage = vi.fn(async (after: string | null) => pages[String(after)]);

        const items = await collectAllPages(fetchPage);

        expect(items.map((i) => i.id)).toEqual(["1", "2", "3"]);
        expect(fetchPage).toHaveBeenNthCalledWith(1, null);
        expect(fetchPage).toHaveBeenNthCalledWith(2, "c2");
    });

    it("returns an empty array when the first page is empty", async () => {
        const fetchPage = vi.fn(async () => ({
            items: [],
            pageInfo: {hasNextPage: false, hasPreviousPage: false, startCursor: null, endCursor: null},
        }));
        await expect(collectAllPages(fetchPage)).resolves.toEqual([]);
        expect(fetchPage).toHaveBeenCalledTimes(1);
    });

    it("aborts a runaway loop when hasNextPage never becomes false", async () => {
        const fetchPage = vi.fn(async () => ({
            items: [{id: "x"}],
            pageInfo: {hasNextPage: true, hasPreviousPage: false, startCursor: null, endCursor: "stuck"},
        }));
        await expect(collectAllPages(fetchPage)).rejects.toThrow(/exceeded 1000 pages/);
    });
});

describe("createResourceClient", () => {
    type Thing = { id: string; name?: string };
    type ThingEdge = { cursor: string; node: Thing };

    // Opaque marker documents — the urql client is mocked, so the factory only forwards
    // these to getClient().query/mutation. We assert on document identity (summary vs full,
    // export, etc.) rather than on query-string contents.
    const pagedSummaryDoc = {doc: "pagedSummary"};
    const pagedFullDoc = {doc: "pagedFull"};
    const createDoc = {doc: "create"};
    const updateDoc = {doc: "update"};
    const deleteDoc = {doc: "delete"};
    const exportDoc = {doc: "export"};
    const eventsDoc = {doc: "events"};

    const client = createResourceClient<Thing, ThingEdge, { name: string }, { id?: string; name?: string }>({
        singular: "thing",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pagedSummaryQuery: pagedSummaryDoc as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pagedFullQuery: pagedFullDoc as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createMutation: createDoc as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateMutation: updateDoc as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        deleteMutation: deleteDoc as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        exportQuery: exportDoc as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        eventsQuery: eventsDoc as any,
        cacheTag: "thing",
        restPath: "things",
        defaultSort: ["name"],
        defaultDirection: SortDirection.Asc,
        defaultFilter: "active:TRUE",
    });

    const connection = (nodes: Thing[], hasNextPage: boolean, endCursor: string | null) => ({
        edges: nodes.map((node, i) => ({cursor: `c${i}`, node})),
        pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: "c0", endCursor},
    });

    it("getPaged maps the connection, applies defaults, tags the read and uses the summary document", async () => {
        toPromise.mockResolvedValue({data: {thingPaged: connection([{id: "1"}, {id: "2"}], true, "c1")}});

        const page = await client.getPaged({});

        expect(page.items).toEqual([{id: "1"}, {id: "2"}]);
        const [doc, vars, context] = query.mock.calls[0] as [unknown, Record<string, unknown>, unknown];
        expect(doc).toBe(pagedSummaryDoc);
        expect(vars).toMatchObject({
            sort: ["name"],
            direction: SortDirection.Asc,
            filter: "active:TRUE",
            after: null,
            before: null
        });
        expect(context).toEqual({fetchOptions: {next: {tags: ["thing"]}}});
    });

    it("getPaged selects the full document and forwards explicit arguments", async () => {
        toPromise.mockResolvedValue({data: {thingPaged: connection([], false, null)}});

        await client.getPaged({
            full: true,
            first: 5,
            after: "x",
            sort: ["id"],
            direction: SortDirection.Desc,
            filter: "f"
        });

        const [doc, vars] = query.mock.calls[0] as [unknown, Record<string, unknown>];
        expect(doc).toBe(pagedFullDoc);
        expect(vars).toMatchObject({first: 5, after: "x", sort: ["id"], direction: SortDirection.Desc, filter: "f"});
    });

    it("getAll walks pages with an empty filter", async () => {
        toPromise
            .mockResolvedValueOnce({data: {thingPaged: connection([{id: "1"}], true, "c-end")}})
            .mockResolvedValueOnce({data: {thingPaged: connection([{id: "2"}], false, null)}});

        const items = await client.getAll();

        expect(items.map((i) => i.id)).toEqual(["1", "2"]);
        expect((query.mock.calls[0][1] as Record<string, unknown>).filter).toBe("");
        expect((query.mock.calls[1][1] as Record<string, unknown>).after).toBe("c-end");
    });

    it("create returns the entity or throws when missing", async () => {
        toPromise.mockResolvedValueOnce({data: {thingCreate: {id: "9"}}});
        await expect(client.create({name: "a"})).resolves.toEqual({id: "9"});
        expect(mutation.mock.calls[0][0]).toBe(createDoc);

        toPromise.mockResolvedValueOnce({data: {}});
        await expect(client.create({name: "a"})).rejects.toThrow("No data created");
    });

    it("update injects the id into the input and throws when missing", async () => {
        toPromise.mockResolvedValueOnce({data: {thingUpdate: {id: "9", name: "b"}}});
        await client.update("9", {name: "b"});
        expect(mutation.mock.calls[0][0]).toBe(updateDoc);
        expect(mutation.mock.calls[0][1]).toEqual({input: {name: "b", id: "9"}});

        toPromise.mockResolvedValueOnce({data: {}});
        await expect(client.update("9", {name: "b"})).rejects.toThrow("No data updated");
    });

    it("del returns the delete payload", async () => {
        toPromise.mockResolvedValue({data: {thingDelete: true}});
        await expect(client.del("9")).resolves.toBe(true);
        expect(mutation.mock.calls[0][0]).toBe(deleteDoc);
    });

    it("exp returns the export job reference using the export document", async () => {
        toPromise.mockResolvedValue({data: {thingExport: {id: "job-1"}}});
        const job = await client.exp(["1"], "f", ImpexType.Excel);
        expect(job).toEqual({id: "job-1"});
        expect(query.mock.calls[0][0]).toBe(exportDoc);
    });

    it("events returns the list, defaulting to empty", async () => {
        toPromise.mockResolvedValueOnce({data: {thingEvents: [{id: "e1"}]}});
        await expect(client.events("1")).resolves.toEqual([{id: "e1"}]);
        expect(query.mock.calls[0][0]).toBe(eventsDoc);

        toPromise.mockResolvedValueOnce({data: {}});
        await expect(client.events("1")).resolves.toEqual([]);
    });

    it("imp posts the file bytes to the REST endpoint with the impex type", async () => {
        vi.stubEnv("API_REST_BASE_URL", "https://api.test");
        axiosPost.mockResolvedValue({data: {id: "job-imp"}});
        const file = new File(["a,b,c"], "data.csv", {type: "text/csv"});

        const job = await client.imp(ImpexType.Excel, file);

        expect(job).toEqual({id: "job-imp"});
        expect(axiosPost).toHaveBeenCalledWith(
            `https://api.test/api/things?type=${ImpexType.Excel}`,
            expect.anything(),
            {headers: {"Content-Type": "text/csv"}},
        );
        vi.unstubAllEnvs();
    });
});
