import 'server-only';

import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import type {Role} from '@/types/auth';

export type AuthzOk = { ok: true; roles: Role[] };
export type AuthzFail = { ok: false; status: 401 | 403; message: string };
export type AuthzResult = AuthzOk | AuthzFail;

type RouteContext = unknown;

type RouteHandler = (request: NextRequest, context: RouteContext) => Promise<Response> | Response;

type AuthedRouteHandler = (
    request: NextRequest,
    context: RouteContext,
    authz: AuthzOk
) => Promise<Response> | Response;

export function authzFailureResponse(authz: AuthzFail): Response {
    return NextResponse.json({error: authz.message}, {status: authz.status});
}

export function withPolicy(policy: () => Promise<AuthzResult>, handler: AuthedRouteHandler): RouteHandler {
    return async (request, context) => {
        const authz = await policy();
        if (!authz.ok) {
            return authzFailureResponse(authz);
        }
        return handler(request, context, authz);
    };
}

export async function withPolicyAction<T>(
    policy: () => Promise<AuthzResult>,
    handler: (authz: AuthzOk) => Promise<T>
): Promise<T> {
    const authz = await policy();
    if (!authz.ok) {
        throw new Error(authz.message);
    }
    return handler(authz);
}