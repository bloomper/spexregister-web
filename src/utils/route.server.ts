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

export function authzFailureResponse(authz: AuthzFail): Response {
    return NextResponse.json({error: authz.message}, {status: authz.status});
}

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