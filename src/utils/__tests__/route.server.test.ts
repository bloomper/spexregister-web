import {beforeEach, describe, expect, it, vi} from 'vitest';
import type {AuthzResult} from '@/types/auth';

const redirectMock = vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
});
vi.mock('next/navigation', () => ({redirect: (url: string) => redirectMock(url)}));

vi.mock('next/server', () => ({
    NextResponse: {
        json: (body: unknown, init?: {status?: number}) => ({
            body,
            status: init?.status ?? 200,
        }),
    },
}));

import {authzFailureResponse, withPolicyAction, withPolicyPage, withPolicyRoute} from '@/utils/route.server';

const ok: AuthzResult = {ok: true, roles: ['ADMIN']};
const unauth: AuthzResult = {ok: false, status: 401, message: 'Not authenticated'};
const forbidden: AuthzResult = {ok: false, status: 403, message: 'Not authorized'};

beforeEach(() => {
    redirectMock.mockClear();
});

describe('authzFailureResponse', () => {
    it('serialises the failure message and status', () => {
        const res = authzFailureResponse(forbidden) as unknown as {body: unknown; status: number};
        expect(res.status).toBe(403);
        expect(res.body).toEqual({error: 'Not authorized'});
    });
});

describe('withPolicyAction', () => {
    it('invokes the handler with the authz result on success', async () => {
        const handler = vi.fn(async (authz) => `roles:${authz.roles.join(',')}`);
        const result = await withPolicyAction(async () => ok, handler);

        expect(result).toBe('roles:ADMIN');
        expect(handler).toHaveBeenCalledWith(ok);
    });

    it('redirects to / on 401 and never calls the handler', async () => {
        const handler = vi.fn();
        await expect(withPolicyAction(async () => unauth, handler)).rejects.toThrow('NEXT_REDIRECT:/');
        expect(redirectMock).toHaveBeenCalledWith('/');
        expect(handler).not.toHaveBeenCalled();
    });

    it('throws the message on 403', async () => {
        const handler = vi.fn();
        await expect(withPolicyAction(async () => forbidden, handler)).rejects.toThrow('Not authorized');
        expect(handler).not.toHaveBeenCalled();
        expect(redirectMock).not.toHaveBeenCalled();
    });
});

describe('withPolicyPage', () => {
    it('invokes the handler on success', async () => {
        const result = await withPolicyPage(async () => ok, async (authz) => authz.roles);
        expect(result).toEqual(['ADMIN']);
    });

    it('redirects on 401', async () => {
        await expect(withPolicyPage(async () => unauth, vi.fn())).rejects.toThrow('NEXT_REDIRECT:/');
    });

    it('throws on 403', async () => {
        await expect(withPolicyPage(async () => forbidden, vi.fn())).rejects.toThrow('Not authorized');
    });
});

describe('withPolicyRoute', () => {
    const request = {} as never;
    const context = {} as never;

    it('calls the handler with request, context and authz on success', async () => {
        const handler = vi.fn(async () => new Response(null, {status: 200}));
        const route = withPolicyRoute(async () => ok, handler);
        await route(request, context);

        expect(handler).toHaveBeenCalledWith(request, context, ok);
    });

    it('redirects on 401', async () => {
        const route = withPolicyRoute(async () => unauth, vi.fn());
        await expect(route(request, context)).rejects.toThrow('NEXT_REDIRECT:/');
    });

    it('returns a 403 json response without calling the handler', async () => {
        const handler = vi.fn();
        const route = withPolicyRoute(async () => forbidden, handler);
        const res = (await route(request, context)) as unknown as {body: unknown; status: number};

        expect(res.status).toBe(403);
        expect(res.body).toEqual({error: 'Not authorized'});
        expect(handler).not.toHaveBeenCalled();
    });
});
