import 'server-only';

import {News, NewsCreate, NewsEdge, NewsUpdate, SortDirection} from "@/gql/graphql";
import {createResourceClient} from "@/lib/graphql.server";

const SummaryFields = `
    id
    subject
    text
    visibleFrom
`;

const FullFields = `
    ${SummaryFields}
    published
    visibleTo
    createdAt
    createdBy
    lastModifiedAt
    lastModifiedBy
`;

const client = createResourceClient<News, NewsEdge, NewsCreate, NewsUpdate>({
    singular: 'news',
    createInputType: 'NewsCreate',
    updateInputType: 'NewsUpdate',
    summaryFields: SummaryFields,
    fullFields: FullFields,
    cacheTag: 'news',
    restPath: 'news',
    defaultSort: ['visibleFrom'],
    defaultDirection: SortDirection.Desc,
    defaultFilter: 'published:TRUE',
});

export const {getPaged, create, update, del, exp, imp, events} = client;
