"use server";

import type {MaintenanceJob} from "@/gql/schema";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {getMaintenanceJobs, getSyncSources, runMaintenanceJob, runSync} from "@/lib/admin";

/**
 * Starts a maintenance job. Resolves to false when it is already running.
 */
export async function runMaintenanceJobAction(job: MaintenanceJob) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => runMaintenanceJob(job));
}

/**
 * The maintenance jobs as they are now, to refresh their status.
 */
export async function getMaintenanceJobsAction() {
    return withPolicyAction(Policies.admin.requireAdmin, async () => getMaintenanceJobs());
}

/**
 * Pulls from the sources of copied data now.
 */
export async function runSyncAction(full: boolean) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => runSync(full));
}

/**
 * The sources of copied data as they are now.
 */
export async function getSyncSourcesAction() {
    return withPolicyAction(Policies.admin.requireAdmin, async () => getSyncSources());
}
