"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {getRevisionFeedPaged} from "@/lib/audit/audit.server";
import {AuditedType} from "@/gql/schema";

export async function getRevisionFeedPageAction(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    type?: AuditedType | null;
    sinceInDays?: number | null;
}) {
    return withPolicyAction(Policies.audit.requireRestore, async () => {
        return getRevisionFeedPaged(args);
    });
}
