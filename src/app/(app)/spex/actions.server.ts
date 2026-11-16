"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

import {get, revisions} from "@/lib/spex";

/**
 * Reads behind the spex view dialog. The spex itself is kept in Spexipedia; Spexregister holds a copy.
 */
export async function getAction(id: string) {
    return withPolicyAction(Policies.spex.requireRead, async () => {
        return get(id);
    });
}

export async function getRevisionsAction(id: string) {
    return withPolicyAction(Policies.spex.requireRead, async () => {
        return revisions(id);
    });
}
