import {
    Activity,
    ActivityEdge,
    Actor,
    ActorEdge,
    Address,
    AddressEdge,
    Consent,
    ConsentEdge,
    Facet,
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
    TaskActivity,
    TaskActivityEdge,
    TaskCategory,
    TaskCategoryEdge,
    TaskEdge,
    Toggle,
    ToggleEdge,
    User,
    UserEdge
} from "@/gql/schema";

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

export type ActivityPage = CursorPage<Activity> & {
    edges: Array<Omit<ActivityEdge, "node"> & { node: Activity }>;
};

export type ActorPage = CursorPage<Actor> & {
    edges: Array<Omit<ActorEdge, "node"> & { node: Actor }>;
};

export type AddressPage = CursorPage<Address> & {
    edges: Array<Omit<AddressEdge, "node"> & { node: Address }>;
};

export type ConsentPage = CursorPage<Consent> & {
    edges: Array<Omit<ConsentEdge, "node"> & { node: Consent }>;
};

export type MembershipPage = CursorPage<Membership> & {
    edges: Array<Omit<MembershipEdge, "node"> & { node: Membership }>;
};

export type NewsPage = CursorPage<News> & {
    edges: Array<Omit<NewsEdge, "node"> & { node: News }>;
};

export type SpexPage = CursorPage<Spex> & {
    edges: Array<Omit<SpexEdge, "node"> & { node: Spex }>;
};

export type SpexCategoryPage = CursorPage<SpexCategory> & {
    edges: Array<Omit<SpexCategoryEdge, "node"> & { node: SpexCategory }>;
};

export type SpexarePage = CursorPage<Spexare> & {
    edges: Array<Omit<SpexareEdge, "node"> & { node: Spexare }>;
};

export type SpexareWithFacetsPage = SpexarePage & {
    facets: Facet[];
};

export type TagPage = CursorPage<Tag> & {
    edges: Array<Omit<TagEdge, "node"> & { node: Tag }>;
};

export type TaskActivityPage = CursorPage<TaskActivity> & {
    edges: Array<Omit<TaskActivityEdge, "node"> & { node: TaskActivity }>;
};

export type TaskPage = CursorPage<Task> & {
    edges: Array<Omit<TaskEdge, "node"> & { node: Task }>;
};

export type TaskCategoryPage = CursorPage<TaskCategory> & {
    edges: Array<Omit<TaskCategoryEdge, "node"> & { node: TaskCategory }>;
};

export type TogglePage = CursorPage<Toggle> & {
    edges: Array<Omit<ToggleEdge, "node"> & { node: Toggle }>;
};

export type UserPage = CursorPage<User> & {
    edges: Array<Omit<UserEdge, "node"> & { node: User }>;
};
