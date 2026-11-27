"use server";

import { Policies } from "@/utils/policy.server";
import { withPolicyAction } from "@/utils/route.server";

import { get } from "@/lib/task/category";

/**
 * The read behind the task category view dialog. The task category itself is kept in Spexipedia; Spexregister holds a copy.
 */
export async function getAction(id: string) {
  return withPolicyAction(Policies.taskCategory.requireRead, async () => {
    return get(id);
  });
}
