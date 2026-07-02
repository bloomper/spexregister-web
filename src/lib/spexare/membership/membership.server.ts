import "server-only";

import {Membership, MembershipCreate} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const MembershipSummary = graphql(`
    fragment MembershipSummary on Membership {
        id
        year
        type {
            id
            label
        }
    }
`);

export const MembershipFull = graphql(`
    fragment MembershipFull on Membership {
        ...MembershipSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const MembershipCreateMutation = graphql(`
    mutation MembershipCreate($spexareId: ID!, $typeId: ID!, $input: MembershipCreate!) {
        membershipCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ...MembershipFull
        }
    }
`);

const MembershipDeleteMutation = graphql(`
    mutation MembershipDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {
        membershipDelete(spexareId: $spexareId, typeId: $typeId, id: $id)
    }
`);

export async function create(spexareId: string, typeId: string, input: MembershipCreate): Promise<Membership> {
    return mutateForData(MembershipCreateMutation, {
        spexareId,
        typeId,
        input
    }, "membershipCreate", "No data created") as Promise<Membership>;
}

export async function del(spexareId: string, typeId: string, id: string) {
    return runMutationField(MembershipDeleteMutation, {spexareId, typeId, id}, "membershipDelete");
}
