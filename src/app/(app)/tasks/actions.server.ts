"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";

import {get, revisions} from "@/lib/task";

/**
 * Reads behind the task view dialog. The task itself is kept in Spexipedia; Spexregister holds a copy.
 */
export async function getAction(id: string) {
    return withPolicyAction(Policies.task.requireRead, async () => {
        return get(id);
    });
}

export async function getRevisionsAction(id: string) {
    return withPolicyAction(Policies.task.requireRead, async () => {
        return revisions(id);
    });
}
