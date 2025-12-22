import {News, NewsEdge} from "@/gql/graphql";

export type CursorPageInfo = {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
};

export type CursorPage<TItem> = {
    items: TItem[];
    pageInfo: CursorPageInfo;
};

export type NewsPage = CursorPage<News> & {
    edges: Array<Omit<NewsEdge, 'node'> & { node: News }>;
};
