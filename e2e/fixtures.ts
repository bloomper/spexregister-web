import {test as base} from "@playwright/test";
import {MOCK_PORT} from "./constants";

const MOCK_URL = `http://localhost:${MOCK_PORT}`;

export const test = base.extend<{ resetBackend: void; mock: Mock }>({
    resetBackend: [async ({request}, provide) => {
        await request.post(`${MOCK_URL}/__reset`);
        await provide();
    }, {auto: true}],
    mock: async ({request}, provide) => {
        await provide({
            roles: async (roles: string[]) => {
                await request.post(`${MOCK_URL}/__roles`, {data: {roles}});
            },
            failNext: async (operation: string, classification: string) => {
                await request.post(`${MOCK_URL}/__fail`, {data: {operation, classification}});
            },
        });
    },
});

type Mock = {
    /** The roles of the logged-in user. */
    roles: (roles: string[]) => Promise<void>;
    /** Makes the next call of a GraphQL operation, e.g. "SpexareUpdate", fail with the classification, e.g. "CONFLICT". */
    failNext: (operation: string, classification: string) => Promise<void>;
};

export {expect} from "@playwright/test";
