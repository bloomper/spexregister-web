import {afterEach, describe, expect, it, vi} from 'vitest';
import {mapConnection} from '@/utils/utils.server';
import type {PageInfo} from '@/gql/schema';

type Edge = {cursor: string; node: {id: string}};

const pageInfo = (over: Partial<PageInfo> = {}): PageInfo =>
    ({
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        ...over,
    }) as PageInfo;

describe('mapConnection', () => {
    it('returns empty page for a null connection', () => {
        const page = mapConnection<{id: string}, Edge>(null);

        expect(page.items).toEqual([]);
        expect(page.edges).toEqual([]);
        expect(page.pageInfo).toEqual({
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
        });
    });

    it('maps edges to items and preserves edges', () => {
        const page = mapConnection<{id: string}, Edge>({
            edges: [
                {cursor: 'c1', node: {id: '1'}},
                {cursor: 'c2', node: {id: '2'}},
            ],
            pageInfo: pageInfo({hasNextPage: true, endCursor: 'c2'}),
        });

        expect(page.items).toEqual([{id: '1'}, {id: '2'}]);
        expect(page.edges).toHaveLength(2);
        expect(page.pageInfo.hasNextPage).toBe(true);
        expect(page.pageInfo.endCursor).toBe('c2');
    });

    it('filters out null edges and edges missing cursor or node', () => {
        const page = mapConnection<{id: string}, Edge>({
            edges: [
                null,
                undefined,
                {cursor: '', node: {id: 'no-cursor'}} as Edge,
                {cursor: 'c', node: null as unknown as {id: string}},
                {cursor: 'c3', node: {id: '3'}},
            ],
            pageInfo: pageInfo(),
        });

        expect(page.items).toEqual([{id: '3'}]);
        expect(page.edges).toHaveLength(1);
    });

    it('coerces missing pageInfo fields to safe defaults', () => {
        const page = mapConnection<{id: string}, Edge>({
            edges: [],
            pageInfo: {} as PageInfo,
        });

        expect(page.pageInfo).toEqual({
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
        });
    });
});

describe('normalizeLocale (env-driven)', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    async function loadWith(env: Record<string, string | undefined>) {
        vi.resetModules();
        for (const [k, v] of Object.entries(env)) {
            if (v === undefined) {
                vi.stubEnv(k, '');
            } else {
                vi.stubEnv(k, v);
            }
        }
        return import('@/utils/utils.server');
    }

    it('defaults to sv when nothing is configured', async () => {
        const {normalizeLocale} = await loadWith({SUPPORTED_LOCALES: '', DEFAULT_LOCALE: ''});
        expect(normalizeLocale(undefined)).toBe('sv');
        expect(normalizeLocale('en')).toBe('en');
        expect(normalizeLocale('de')).toBe('sv');
    });

    it('honours a configured DEFAULT_LOCALE within the supported set', async () => {
        const {normalizeLocale} = await loadWith({SUPPORTED_LOCALES: 'en,sv', DEFAULT_LOCALE: 'en'});
        expect(normalizeLocale(undefined)).toBe('en');
        expect(normalizeLocale('sv')).toBe('sv');
        expect(normalizeLocale('fr')).toBe('en');
    });

    it('ignores a DEFAULT_LOCALE outside the supported set', async () => {
        const {normalizeLocale} = await loadWith({SUPPORTED_LOCALES: 'en', DEFAULT_LOCALE: 'de'});
        expect(normalizeLocale(undefined)).toBe('sv');
        expect(normalizeLocale('en')).toBe('en');
    });

    it('restricts to a custom supported locale list', async () => {
        const {normalizeLocale} = await loadWith({SUPPORTED_LOCALES: 'en, sv, no', DEFAULT_LOCALE: 'no'});
        expect(normalizeLocale('no')).toBe('no');
        expect(normalizeLocale('en')).toBe('en');
        expect(normalizeLocale('fr')).toBe('no');
    });
});
