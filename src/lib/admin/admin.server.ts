import "server-only";

import {graphql} from "@/gql";
import type {MaintenanceJob} from "@/gql/schema";
import {runMutationField, runQuery} from "@/lib/graphql.server";

const MaintenanceJobsQuery = graphql(`
    query MaintenanceJobs {
        maintenanceJobs {
            job
            schedule
            running
            lastStartedAt
            lastFinishedAt
            lastSucceeded
        }
    }
`);

const MaintenanceJobRunMutation = graphql(`
    mutation MaintenanceJobRun($job: MaintenanceJob!) {
        maintenanceJobRun(job: $job)
    }
`);

/**
 * A scheduled maintenance job with its schedule and how its latest run went.
 */
export type MaintenanceJobStatus = {
    job: MaintenanceJob;
    schedule?: string | null;
    running: boolean;
    lastStartedAt?: string | null;
    lastFinishedAt?: string | null;
    lastSucceeded?: boolean | null;
};

/**
 * Every maintenance job the server runs on a schedule.
 */
export async function getMaintenanceJobs(): Promise<MaintenanceJobStatus[]> {
    const data = await runQuery(MaintenanceJobsQuery, {});

    return data?.maintenanceJobs ?? [];
}

/**
 * Asks the server to start the job in the background. Resolves to false when it is already running.
 */
export async function runMaintenanceJob(job: MaintenanceJob): Promise<boolean> {
    return Boolean(await runMutationField(MaintenanceJobRunMutation, {job}, "maintenanceJobRun"));
}

const SyncSourcesQuery = graphql(`
    query SyncSources {
        syncSources {
            name
            cursor
            lastPulledAt
            lastSuccess
            lastError
            applied
            stale
        }
    }
`);

const SyncRunMutation = graphql(`
    mutation SyncRun($full: Boolean) {
        syncRun(full: $full) {
            applied
            missing
            error
        }
    }
`);

/**
 * A source Spexregister copies data from, today Spexipedia, and how far the copy has got.
 */
export type SyncSourceStatus = {
    name: string;
    cursor?: string | null;
    lastPulledAt?: string | null;
    lastSuccess?: string | null;
    lastError?: string | null;
    applied: number;
    stale: boolean;
};

export type SyncRunResult = {
    applied: number;
    missing: string[];
    error?: string | null;
};

/**
 * Every source of copied data.
 */
export async function getSyncSources(): Promise<SyncSourceStatus[]> {
    const data = await runQuery(SyncSourcesQuery, {});

    return data?.syncSources ?? [];
}

/**
 * Pulls from the sources now. A full pull reads the whole feed again and reports what is here but no longer there.
 */
export async function runSync(full: boolean): Promise<SyncRunResult | null> {
    return (await runMutationField(SyncRunMutation, {full}, "syncRun")) ?? null;
}
