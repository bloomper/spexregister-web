import 'server-only';

import {auth} from '@/auth';
import {type AuthzFail, AuthzResult, type Role} from '@/types/auth';


export async function requireUser() {
    const session = await auth();

    if (!session || session.error === "RefreshTokenError") {
        return {session: null, roles: [] as Role[]};
    }

    return {session, roles: session.roles || []};
}

function notAuthenticated(): AuthzFail {
    return {ok: false, status: 401, message: 'Not authenticated'};
}

function notAuthorized(): AuthzFail {
    return {ok: false, status: 403, message: 'Not authorized'};
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