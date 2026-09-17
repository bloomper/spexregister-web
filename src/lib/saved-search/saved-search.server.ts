import "server-only";

import {SavedSearch, SavedSearchCreate, SavedSearchUpdate} from "@/gql/schema";
import {graphql} from "@/gql";
import {mutateForData, runMutationField, runQuery} from "@/lib/graphql.server";

export const SavedSearchFields = graphql(`
    fragment SavedSearchFields on SavedSearch {
        id
        name
        query
        createdBy
        createdAt
        lastModifiedBy
        lastModifiedAt
    }
`);

const ListQuery = graphql(`
    query SavedSearches {
        savedSearches { ...SavedSearchFields }
    }
`);

const GetQuery = graphql(`
    query SavedSearchGet($id: ID!) {
        savedSearch(id: $id) { ...SavedSearchFields }
    }
`);

const CreateMutation = graphql(`
    mutation SavedSearchCreate($input: SavedSearchCreate!) {
        savedSearchCreate(input: $input) { ...SavedSearchFields }
    }
`);

const UpdateMutation = graphql(`
    mutation SavedSearchUpdate($input: SavedSearchUpdate!) {
        savedSearchUpdate(input: $input) { ...SavedSearchFields }
    }
`);

const DeleteMutation = graphql(`
    mutation SavedSearchDelete($id: ID!) {
        savedSearchDelete(id: $id)
    }
`);

const cacheTag = "saved-search";

export async function getAll(): Promise<SavedSearch[]> {
    const data = await runQuery(ListQuery, {}, {
        fetchOptions: {
            next: {tags: [cacheTag]}
        }
    });

    return (data?.savedSearches ?? []).filter(Boolean) as SavedSearch[];
}

export async function get(id: string): Promise<SavedSearch | undefined> {
    const data = await runQuery(GetQuery, {id}, {
        fetchOptions: {
            next: {tags: [cacheTag]}
        }
    });

    return data?.savedSearch as SavedSearch | undefined;
}

export async function create(input: SavedSearchCreate): Promise<SavedSearch> {
    const value = await mutateForData(CreateMutation, {input}, "savedSearchCreate", "No data created");
    return value as SavedSearch;
}

export async function update(id: string, input: Omit<SavedSearchUpdate, "id">): Promise<SavedSearch> {
    const value = await mutateForData(
        UpdateMutation,
        {input: {...input, id} as SavedSearchUpdate},
        "savedSearchUpdate",
        "No data updated",
    );
    return value as SavedSearch;
}

export async function del(id: string): Promise<boolean | undefined> {
    return runMutationField(DeleteMutation, {id}, "savedSearchDelete") as Promise<boolean | undefined>;
}
