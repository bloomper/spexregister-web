"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {getRevisionDetail, getRevisionFeedPaged, type RevisionFeedArgs} from "@/lib/audit/audit.server";

export async function getRevisionFeedPageAction(args: RevisionFeedArgs) {
    return withPolicyAction(Policies.audit.requireRestore, async () => {
        return getRevisionFeedPaged(args);
    });
}

export async function getRevisionDetailAction(revision: number) {
    return withPolicyAction(Policies.audit.requireRestore, async () => {
        return getRevisionDetail(revision);
    });
}
