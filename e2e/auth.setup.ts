import {test as setup} from "@playwright/test";
import {encode} from "@auth/core/jwt";
import fs from "node:fs";
import path from "node:path";
import {AUTH_SECRET, SESSION_COOKIE, STORAGE_STATE} from "./constants";

setup("authenticate", async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const maxAge = 60 * 60;

    const token = {
        access_token: "e2e-access-token",
        expires_at: nowSec + maxAge, // future → not expired → jwt callback skips refresh
        refresh_token: "e2e-refresh-token",
        roles: ["ADMIN"],
        sub: "user-1",
        name: "E2E Admin",
        email: "e2e@example.com",
    };

    const value = await encode({token, secret: AUTH_SECRET, salt: SESSION_COOKIE, maxAge});

    const state = {
        cookies: [
            {
                name: SESSION_COOKIE,
                value,
                domain: "localhost",
                path: "/",
                httpOnly: true,
                secure: false,
                sameSite: "Lax" as const,
                expires: nowSec + maxAge,
            },
        ],
        origins: [],
    };

    fs.mkdirSync(path.dirname(STORAGE_STATE), {recursive: true});
    fs.writeFileSync(STORAGE_STATE, JSON.stringify(state, null, 2));
});
