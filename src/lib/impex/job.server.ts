import 'server-only';

import {getClient} from '@/lib/urql.server';
import {Job, JobStatus} from "@/gql/graphql";

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

export async function jobStatus(id: string): Promise<JobStatus | null> {
    const result = await getClient()
        .query<{ jobStatus: JobStatus }>(JobStatusQuery, {id}, {
            fetchOptions: {
                next: {tags: ['job']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.jobStatus ?? null;
}

export async function job(id: string): Promise<Job | null> {

    const result = await getClient()
        .query<{ job: Job }>(JobQuery, {id}, {
            fetchOptions: {
                next: {tags: ['job']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.job ?? null;
}

export async function jobs(): Promise<Job[]> {
    const result = await getClient()
        .query<{ jobs: Job[] }>(JobsQuery, {}, {
            fetchOptions: {
                next: {tags: ['job']}
            }
        })
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.jobs ?? [];
}

export async function del(id: string) {
    const result = await getClient()
        .mutation(DeleteMutation, {id})
        .toPromise();

    if (result.error) {
        throw result.error;
    }

    return result.data?.jobDelete;
}
