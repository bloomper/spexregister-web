import "server-only";

import {createHash} from "node:crypto";

export function gravatarImageUrl(email?: string | null): string | undefined {
    const normalized = email?.trim().toLowerCase();

    if (!normalized) {
        return undefined;
    }

    const emailHash = createHash("sha256").update(normalized).digest("hex");
    return `https://www.gravatar.com/avatar/${emailHash}?d=404&s=128`;
}
