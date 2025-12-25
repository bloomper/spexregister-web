import {News, NewsEdge, Spex, SpexCategory, SpexCategoryEdge, SpexEdge} from "@/gql/graphql";

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

export type SpexPage = CursorPage<Spex> & {
    edges: Array<Omit<SpexEdge, 'node'> & { node: Spex }>;
};

export type SpexCategoryPage = CursorPage<SpexCategory> & {
    edges: Array<Omit<SpexCategoryEdge, 'node'> & { node: SpexCategory }>;
};
