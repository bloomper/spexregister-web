import "server-only";

import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import type {AuthzFail, AuthzOk, AuthzResult} from "@/types/auth";
import {forbidden, redirect} from "next/navigation";
import {requireUser} from "@/utils/auth.server";

const LOGIN_PATH = "/api/auth/login";
const NO_ACCESS_PATH = "/no-access";

type RouteContext = unknown;

type RouteHandler = (request: NextRequest, context: RouteContext) => Promise<Response> | Response;

type AuthedRouteHandler = (
    request: NextRequest,
    context: RouteContext,
    authz: AuthzOk
) => Promise<Response> | Response;

/**
 * The JSON response of a refused request, with its status.
 */
export function authzFailureResponse(authz: AuthzFail): Response {
    return NextResponse.json({error: authz.message}, {status: authz.status});
}

/**
 * Guards a route handler: a signed-out user is sent to the start page and a refused one gets the failure response.
 */
export function withPolicyRoute(policy: () => Promise<AuthzResult>, handler: AuthedRouteHandler): RouteHandler {
    return async (request, context) => {
        const authz = await policy();
        if (!authz.ok) {
            if (authz.status === 401) {
                redirect("/");
            }
            return authzFailureResponse(authz);
        }
        return handler(request, context, authz);
    };
}

/**
 * Guards a server action: a signed-out user is sent to sign in, and a refusal throws.
 */
export async function withPolicyAction<T>(
    policy: () => Promise<AuthzResult>,
    handler: (authz: AuthzOk) => Promise<T>
): Promise<T> {
    const authz = await policy();
    if (!authz.ok) {
        if (authz.status === 401) {
            redirect(LOGIN_PATH);
        }
        throw new Error(authz.message);
    }
    return handler(authz);
}

/**
 * Guards a page: a user without any Spexregister role is sent to `/no-access`, and one without the roles needed gets
 * 403.
 */
export async function withPolicyPage<T>(
    policy: () => Promise<AuthzResult>,
    handler: (authz: AuthzOk) => Promise<T>
): Promise<T> {
    const authz = await policy();
    if (!authz.ok && authz.status === 403 && (await requireUser()).roles.length === 0) {
        redirect(NO_ACCESS_PATH);
    }
    if (!authz.ok && authz.status === 403) {
        forbidden();
    }
    return withPolicyAction(async () => authz, handler);
}