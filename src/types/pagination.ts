import {News, NewsEdge} from "@/gql/graphql";

export type CursorPageInfo = {
    hasNextPage: boolean;
    endCursor: string | null;
};

export type CursorPage<TItem> = {
    items: TItem[];
    pageInfo: CursorPageInfo;
};

export type NewsPage = CursorPage<News> & {
    edges: Array<Omit<NewsEdge, 'node'> & { node: News }>;
};
