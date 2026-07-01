import 'server-only';

import {SortDirection, SpexCategory, SpexCategoryCreate, SpexCategoryEdge, SpexCategoryUpdate} from "@/gql/graphql";
import {createResourceClient} from "@/lib/graphql.server";
import axios from "@/lib/axios.server";

const SummaryFields = `
    id
    name
    logoUrl
    firstYear
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const client = createResourceClient<SpexCategory, SpexCategoryEdge, SpexCategoryCreate, SpexCategoryUpdate>({
    singular: 'spexCategory',
    createInputType: 'SpexCategoryCreate',
    updateInputType: 'SpexCategoryUpdate',
    summaryFields: SummaryFields,
    fullFields: FullFields,
    cacheTag: 'spex-category',
    restPath: 'spex/categories',
    defaultSort: ['name'],
    defaultDirection: SortDirection.Asc,
    defaultFilter: '',
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;

export async function uploadLogo(id: string, file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const response = await axios.put(`${process.env.API_REST_BASE_URL}/api/spex/categories/${id}/logo`, arrayBuffer, {
        headers: {
            'Content-Type': file.type,
        }
    });
    return response.data;
}

export async function deleteLogo(id: string) {
    await axios.delete(`${process.env.API_REST_BASE_URL}/api/spex/categories/${id}/logo`);
    return {success: true};
}
