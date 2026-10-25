/**
 * The Spexregister roles a user of the web application can have.
 */
export type Role = "ADMIN" | "EDITOR" | "USER";

export type AuthzFail = { ok: false; status: 401 | 403; message: string };
export type AuthzOk = { ok: true; roles: Role[] };
/**
 * The outcome of a policy: allowed with the user's roles, or refused as signed out (401) or without the role (403).
 */
export type AuthzResult = AuthzOk | AuthzFail;

/**
 * The claims of a Keycloak access token that carry the client roles.
 */
export type AccessTokenClaims = {
    resource_access?: {
        spexregister?: {
            roles?: string[];
        };
        [resource: string]:
            | {
            roles?: string[];
        }
            | undefined;
    };
};
