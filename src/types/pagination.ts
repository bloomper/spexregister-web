import {
    Address,
    AddressEdge,
    Consent,
    ConsentEdge,
    Membership,
    MembershipEdge,
    News,
    NewsEdge,
    Spex,
    Spexare,
    SpexareEdge,
    SpexCategory,
    SpexCategoryEdge,
    SpexEdge,
    Tag,
    TagEdge,
    Task,
    TaskCategory,
    TaskCategoryEdge,
    TaskEdge,
    Toggle,
    ToggleEdge
} from "@/gql/graphql";

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

export type AddressPage = CursorPage<Address> & {
    edges: Array<Omit<AddressEdge, 'node'> & { node: Address }>;
};

export type ConsentPage = CursorPage<Consent> & {
    edges: Array<Omit<ConsentEdge, 'node'> & { node: Consent }>;
};

export type MembershipPage = CursorPage<Membership> & {
    edges: Array<Omit<MembershipEdge, 'node'> & { node: Membership }>;
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

export type SpexarePage = CursorPage<Spexare> & {
    edges: Array<Omit<SpexareEdge, 'node'> & { node: Spexare }>;
};

export type TagPage = CursorPage<Tag> & {
    edges: Array<Omit<TagEdge, 'node'> & { node: Tag }>;
};

export type TaskPage = CursorPage<Task> & {
    edges: Array<Omit<TaskEdge, 'node'> & { node: Task }>;
};

export type TaskCategoryPage = CursorPage<TaskCategory> & {
    edges: Array<Omit<TaskCategoryEdge, 'node'> & { node: TaskCategory }>;
};

export type TogglePage = CursorPage<Toggle> & {
    edges: Array<Omit<ToggleEdge, 'node'> & { node: Toggle }>;
};
