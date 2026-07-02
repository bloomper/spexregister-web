import "server-only";

import {Consent, ConsentCreate, ConsentUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField} from "@/lib/graphql.server";

export const ConsentSummary = graphql(`
    fragment ConsentSummary on Consent {
        id
        value
        type {
            id
            label
        }
    }
`);

export const ConsentFull = graphql(`
    fragment ConsentFull on Consent {
        ...ConsentSummary
        createdAt
        createdBy
        lastModifiedAt
        lastModifiedBy
    }
`);

const ConsentCreateMutation = graphql(`
    mutation ConsentCreate($spexareId: ID!, $typeId: ID!, $input: ConsentCreate!) {
        consentCreate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ...ConsentFull
        }
    }
`);

const ConsentUpdateMutation = graphql(`
    mutation ConsentUpdate($spexareId: ID!, $typeId: ID!, $input: ConsentUpdate!) {
        consentUpdate(spexareId: $spexareId, typeId: $typeId, input: $input) {
            ...ConsentFull
        }
    }
`);

const ConsentDeleteMutation = graphql(`
    mutation ConsentDelete($spexareId: ID!, $typeId: ID!, $id: ID!) {
        consentDelete(spexareId: $spexareId, typeId: $typeId, id: $id)
    }
`);

export async function create(spexareId: string, typeId: string, input: ConsentCreate): Promise<Consent> {
    return mutateForData(ConsentCreateMutation, {
        spexareId,
        typeId,
        input
    }, "consentCreate", "No data created") as Promise<Consent>;
}

export async function update(spexareId: string, typeId: string, id: string, input: Omit<ConsentUpdate, "id">): Promise<Consent> {
    return mutateForData(ConsentUpdateMutation, {
        spexareId,
        typeId,
        input: {...input, id}
    }, "consentUpdate", "No data updated") as Promise<Consent>;
}

export async function del(spexareId: string, typeId: string, id: string) {
    return runMutationField(ConsentDeleteMutation, {spexareId, typeId, id}, "consentDelete");
}
