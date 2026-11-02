import {beforeEach, describe, expect, it, vi} from "vitest";
import {getSpexareLocations} from "@/lib/map/map.server";

const runQuery = vi.fn();
vi.mock("@/lib/graphql.server", () => ({runQuery: (...args: unknown[]) => runQuery(...args)}));

beforeEach(() => {
    runQuery.mockReset();
});

describe("map.server", () => {
    it("getSpexareLocations returns the located spexare", async () => {
        const location = {id: "1", firstName: "Ada", lastName: "Lovelace", nickName: null, latitude: 57.7, longitude: 11.9};
        runQuery.mockResolvedValue({spexareLocations: [location]});

        expect(await getSpexareLocations()).toEqual([location]);
    });

    it("getSpexareLocations is empty when nothing comes back", async () => {
        runQuery.mockResolvedValue(undefined);

        expect(await getSpexareLocations()).toEqual([]);
    });
});
