import 'server-only';

import {Job, JobStatus} from "@/gql/graphql";
import {runMutationField, runQuery} from "@/lib/graphql.server";

const BaseFields = `
    id
    name
    status
    exitStatus
`;

const Fields = `
    ${BaseFields}
    createdAt
    startedAt
    finishedAt
    hasDownload
    importResult {
      success
      errors
      messages
      data
    }
`;

const JobStatusQuery = /* GraphQL */ `
    query ($id: ID!) {
        jobStatus(id: $id) {
            ${BaseFields}
        }
    }
`;

const JobQuery = /* GraphQL */ `
    query ($id: ID!) {
        job(id: $id) {
            ${Fields}
        }
    }
`;

const JobsQuery = /* GraphQL */ `
    query {
        jobs {
            ${Fields}
        }
    }
`;

const DeleteMutation = /* GraphQL */ `
    mutation ($id: ID!) {
        jobDelete(id: $id)
    }
`;

const jobContext = {fetchOptions: {next: {tags: ['job']}}};

export async function jobStatus(id: string): Promise<JobStatus | null> {
    const data = await runQuery<{ jobStatus: JobStatus }>(JobStatusQuery, {id}, jobContext);
    return data?.jobStatus ?? null;
}

export async function job(id: string): Promise<Job | null> {
    const data = await runQuery<{ job: Job }>(JobQuery, {id}, jobContext);
    return data?.job ?? null;
}

export async function jobs(): Promise<Job[]> {
    const data = await runQuery<{ jobs: Job[] }>(JobsQuery, {}, jobContext);
    return data?.jobs ?? [];
}

export async function del(id: string) {
    return runMutationField(DeleteMutation, {id}, 'jobDelete');
}
