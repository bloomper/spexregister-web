"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

import {get, revisions} from "@/lib/spex/category";

/**
 * Reads behind the spex category view dialog. The spex category itself is kept in Spexipedia; Spexregister holds a copy.
 */
export async function getAction(id: string) {
    return withPolicyAction(Policies.spexCategory.requireRead, async () => {
        return get(id);
    });
}

export async function getRevisionsAction(id: string) {
    return withPolicyAction(Policies.spexCategory.requireRead, async () => {
        return revisions(id);
    });
}
