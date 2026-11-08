import type {AccessTokenClaims} from "@/types/auth";

/**
 * The FGV applications that sign in through the same Keycloak realm and that the header can switch between.
 */
export type ApplicationId = "spexregister" | "revival" | "spexflix" | "spexify" | "spexgram" | "archive";

/**
 * An application in the switcher. The current one links to its own start page, the others to their address.
 */
export type Application = {
    id: ApplicationId;
    url: string;
    current: boolean;
};

const APPLICATIONS: ReadonlyArray<{ id: ApplicationId; clientId: string; urlVariable: string }> = [
    {id: "spexregister", clientId: "spexregister", urlVariable: "SPEXREGISTER_WEB_URL"},
    {id: "revival", clientId: "fgv-revival", urlVariable: "FGV_REVIVAL_WEB_URL"},
    {id: "spexflix", clientId: "fgv-spexflix", urlVariable: "SPEXFLIX_WEB_URL"},
    {id: "spexify", clientId: "fgv-spexify", urlVariable: "SPEXIFY_WEB_URL"},
    {id: "spexgram", clientId: "fgv-spexgram", urlVariable: "SPEXGRAM_WEB_URL"},
    {id: "archive", clientId: "fgv-archive", urlVariable: "ARCHIVE_WEB_URL"},
];

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

        return url && roles.includes("USER") ? [{id, url, current: false}] : [];
    });
}
