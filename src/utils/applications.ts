import type {AccessTokenClaims} from "@/types/auth";

/**
 * The FGV applications that sign in through the same Keycloak realm and that the header can switch between.
 */
export type ApplicationId = "spexregister" | "revival" | "spexflix" | "spexify" | "spexgram" | "archive" | "spexipedia";

/**
 * An application in the switcher. The current one links to its own start page, the others to their address.
 */
export type Application = {
    id: ApplicationId;
    url: string;
    current: boolean;
};

const APPLICATIONS: ReadonlyArray<{ id: ApplicationId; clientId: string; urlVariable: string }> = [
    {id: "spexregister", clientId: "fgv-spexregister", urlVariable: "SPEXREGISTER_WEB_URL"},
    {id: "revival", clientId: "fgv-revival", urlVariable: "REVIVAL_WEB_URL"},
    {id: "spexflix", clientId: "fgv-spexflix", urlVariable: "SPEXFLIX_WEB_URL"},
    {id: "spexify", clientId: "fgv-spexify", urlVariable: "SPEXIFY_WEB_URL"},
    {id: "spexgram", clientId: "fgv-spexgram", urlVariable: "SPEXGRAM_WEB_URL"},
    {id: "archive", clientId: "fgv-archive", urlVariable: "ARCHIVE_WEB_URL"},
    {id: "spexipedia", clientId: "fgv-spexipedia", urlVariable: "SPEXIPEDIA_WEB_URL"},
];

/**
 * Spexipedia and Spexgram are open to visitors and never ask Keycloak on their own whether someone is logged in, so the
 * switcher opens them through a silent login that comes back to their start page either way.
 */
const SILENT_LOGIN: ReadonlySet<ApplicationId> = new Set(["spexipedia", "spexgram"]);

/**
 * The applications the user can switch to, always in the same order: the current one, and every other one that has
 * an address and whose `USER` role is in the access token. Keycloak maps each web client to the other web clients'
 * `USER` role, so the token carries it exactly for the users who can open that application.
 */
export function resolveApplications(
    current: ApplicationId,
    claims: AccessTokenClaims,
    env: Readonly<Record<string, string | undefined>>,
): Application[] {
    return APPLICATIONS.flatMap(({id, clientId, urlVariable}): Application[] => {
        if (id === current) {
            return [{id, url: "/", current: true}];
        }

        const url = env[urlVariable]?.trim().replace(/\/+$/, "");
        const roles = claims.resource_access?.[clientId]?.roles ?? [];

        if (!url || !roles.includes("USER")) {
            return [];
        }

        return [{id, url: SILENT_LOGIN.has(id) ? `${url}/api/auth/login?silent=1` : url, current: false}];
    });
}
