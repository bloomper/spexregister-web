import "server-only";

import {cache} from "react";
import {headers} from "next/headers";
import {jwtDecode} from "jwt-decode";
import {auth} from "@/auth";
import {extractRolesFromClaims} from "@/utils/auth";
import {AccessTokenClaims, type AuthzFail, AuthzResult, type Role} from "@/types/auth";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export type SessionContext = {
    session: NonNullable<Session> | null;
    accessToken: string | null;
    roles: Role[];
};

const unauthenticated: SessionContext = {session: null, accessToken: null, roles: []};

export const getSessionContext = cache(async (): Promise<SessionContext> => {
    const headerList = await headers();

    const session = await auth.api.getSession({headers: headerList});

    if (!session) {
        return unauthenticated;
    }

    try {
        const {accessToken} = await auth.api.getAccessToken({
            body: {useAccountCookie: true},
            headers: headerList,
        });

        if (!accessToken) {
            return unauthenticated;
        }

        return {
            session,
            accessToken,
            roles: extractRolesFromClaims(jwtDecode<AccessTokenClaims>(accessToken)),
        };
    } catch (error) {
        console.warn("Could not resolve a valid access token for the current session", error);
        return unauthenticated;
    }
});

export async function requireUser() {
    const {session, roles} = await getSessionContext();

    return {session, roles};
}

export async function getAccessToken(): Promise<string | null> {
    return (await getSessionContext()).accessToken;
}

function notAuthenticated(): AuthzFail {
    return {ok: false, status: 401, message: "Not authenticated"};
}

function notAuthorized(): AuthzFail {
    return {ok: false, status: 403, message: "Not authorized"};
}

export async function requireAnyRole(required: Role[]): Promise<AuthzResult> {
    const {session, roles} = await requireUser();

    if (!session) {
        return notAuthenticated();
    }

    const hasRole = required.some(role => roles.includes(role));

    if (!hasRole) {
        return notAuthorized();
    }

    return {
        ok: true,
        roles
    };
}

export async function requireAllRoles(required: Role[]): Promise<AuthzResult> {
    const {session, roles} = await requireUser();

    if (!session) {
        return notAuthenticated();
    }

    const allowed = required.every((r) => roles.includes(r));
    if (!allowed) {
        return notAuthorized();
    }

    return {
        ok: true,
        roles
    };
}
