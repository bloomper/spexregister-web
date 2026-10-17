import {test as base} from "@playwright/test";
import {MOCK_PORT} from "./constants";

export const test = base.extend<{ resetBackend: void }>({
    resetBackend: [async ({request}, use) => {
        await request.post(`http://localhost:${MOCK_PORT}/__reset`);
        await use();
    }, {auto: true}],
});

export {expect} from "@playwright/test";
