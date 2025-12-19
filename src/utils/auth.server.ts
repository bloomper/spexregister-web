import 'server-only';

import {auth} from '@/auth';
import {jwtDecode} from 'jwt-decode';
import {type AuthzFail, type AuthzOk, type Role} from '@/types/auth';

type AccessTokenClaims = {
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

function normalizeRole(value: string): Role | null {
    const v = value.trim().toUpperCase();
    if (v === 'ADMIN' || v === 'EDITOR' || v === 'USER') {
        return v;
    }
    return null;
}

function extractRolesFromClaims(claims: AccessTokenClaims): Role[] {
    const rawRoles = claims.resource_access?.spexregister?.roles ?? [];
    const roles = rawRoles
        .map(normalizeRole)
        .filter((r): r is Role => r !== null);

    return Array.from(new Set(roles));
}

export async function requireUser() {
    const session = await auth();
    if (!session) {
        return {session: null, roles: [] as Role[]};
    }

    const accessToken = (session as any).access_token as string | undefined;
    if (!accessToken) {
        return {session, roles: [] as Role[]};
    }

    const claims = jwtDecode<AccessTokenClaims>(accessToken);
    const roles = extractRolesFromClaims(claims);

    return {session, roles};
}

function notAuthenticated(): AuthzFail {
    return {ok: false, status: 401, message: 'Not authenticated'};
}

function notAuthorized(): AuthzFail {
    return {ok: false, status: 403, message: 'Not authorized'};
}

export async function requireAnyRole(required: Role[]): Promise<AuthzOk | AuthzFail> {
    const {session, roles} = await requireUser();
    if (!session) {
        return notAuthenticated();
    }

    const allowed = required.some((r) => roles.includes(r));
    if (!allowed) {
        return notAuthorized();
    }

    return {ok: true, roles};
}

export async function requireAllRoles(required: Role[]): Promise<AuthzOk | AuthzFail> {
    const {session, roles} = await requireUser();
    if (!session) {
        return notAuthenticated();
    }

    const allowed = required.every((r) => roles.includes(r));
    if (!allowed) {
        return notAuthorized();
    }

    return {ok: true, roles};
}