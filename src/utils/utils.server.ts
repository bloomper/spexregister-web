import "server-only";

import {PageInfo} from "@/gql/schema";
import {CursorPage} from "@/types/pagination";

export function mapConnection<T, E extends { cursor: string; node: T }>(
    connection: { edges: (E | null | undefined)[]; pageInfo: PageInfo; totalCount?: number | null } | null | undefined
): CursorPage<T> & { edges: E[] } {
    const edges = (connection?.edges ?? []).filter((e): e is E => Boolean(e?.cursor && e?.node));

    return {
        items: edges.map(e => e.node),
        edges: edges,
        pageInfo: {
            hasNextPage: Boolean(connection?.pageInfo?.hasNextPage),
            hasPreviousPage: Boolean(connection?.pageInfo?.hasPreviousPage),
            startCursor: connection?.pageInfo?.startCursor ?? null,
            endCursor: connection?.pageInfo?.endCursor ?? null,
        },
        totalCount: connection?.totalCount ?? 0,
    };
}

function parseSupportedLocales(raw: string | undefined): Set<string> {
    const items = (raw ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    return new Set(items.length > 0 ? items : ["sv", "en"]);
}

const SUPPORTED_LOCALES = parseSupportedLocales(process.env.SUPPORTED_LOCALES);
const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE && SUPPORTED_LOCALES.has(process.env.DEFAULT_LOCALE)
    ? process.env.DEFAULT_LOCALE
    : "sv";

export function normalizeLocale(input: string | undefined): string {
    return input && SUPPORTED_LOCALES.has(input) ? input : DEFAULT_LOCALE;
}

export function resolveBackendUrl(url: string, baseUrl: string | undefined): URL | null {
    if (!baseUrl) {
        return null;
    }

    try {
        const base = new URL(baseUrl);
        const basePath = base.pathname.replace(/\/$/, "");
        const target = url.startsWith("/") && !url.startsWith("//")
            ? new URL(`${basePath}${url}`, base.origin)
            : new URL(url);

        if (target.origin !== base.origin || !target.pathname.startsWith(`${basePath}/api/`)) {
            return null;
        }

        return target;
    } catch {
        return null;
    }
}

export async function deleteEach(ids: string[], del: (id: string) => Promise<unknown>): Promise<void> {
    const failed: string[] = [];

    for (const id of ids) {
        try {
            await del(id);
        } catch (error) {
            console.error(`Could not delete ${id}`, error);
            failed.push(id);
        }
    }

    if (failed.length > 0) {
        throw new Error(`Could not delete ${failed.length} of ${ids.length}: ${failed.join(", ")}`);
    }
}
