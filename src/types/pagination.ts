export type CursorPageInfo = {
    hasNextPage: boolean;
    endCursor: string | null;
};

export type CursorPage<TItem> = {
    items: TItem[];
    pageInfo: CursorPageInfo;
};
