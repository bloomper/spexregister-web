import 'server-only';

import {SortDirection, Tag, TagCreate, TagEdge, TagUpdate} from "@/gql/graphql";
import {createResourceClient} from "@/lib/graphql.server";

const SummaryFields = `
    id
    name
`;

const FullFields = `
    ${SummaryFields}
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const client = createResourceClient<Tag, TagEdge, TagCreate, TagUpdate>({
    singular: 'tag',
    createInputType: 'TagCreate',
    updateInputType: 'TagUpdate',
    summaryFields: SummaryFields,
    fullFields: FullFields,
    cacheTag: 'tag',
    restPath: 'tags',
    defaultSort: ['name'],
    defaultDirection: SortDirection.Desc,
    defaultFilter: '',
});

export const {getPaged, getAll, create, update, del, exp, imp, events} = client;
