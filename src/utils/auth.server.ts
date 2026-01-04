import 'server-only';

import {auth} from '@/auth';
import {type AuthzFail, type AuthzOk, type Role} from '@/types/auth';


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