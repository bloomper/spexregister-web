import "server-only";

import {createHash} from "node:crypto";

const LOOKUP_TIMEOUT_MS = 2000;

export function gravatarImageUrl(email?: string | null): string | undefined {
    const normalized = email?.trim().toLowerCase();

    if (!normalized) {
        return undefined;
    }

    const emailHash = createHash("sha256").update(normalized).digest("hex");
    return `https://www.gravatar.com/avatar/${emailHash}?d=404&s=128`;
}

export async function resolveGravatarImage(email?: string | null): Promise<string | undefined> {
    const url = gravatarImageUrl(email);

    if (!url) {
        return undefined;
    }

    try {
        const response = await fetch(url, {method: "HEAD", signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS)});
        return response.ok ? url : undefined;
    } catch {
        return undefined;
    }
}
