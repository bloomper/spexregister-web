export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
    CountryCode: { input: any; output: any; }
    Date: { input: any; output: any; }
    DateTime: { input: any; output: any; }
    Email: { input: any; output: any; }
    /** Returned as an ISO-8601 instant in UTC. Given as a date, read as its start in UTC. */
    Instant: { input: any; output: any; }
    /** Any JSON value. */
    JSON: { input: any; output: any; }
    Locale: { input: any; output: any; }
    Long: { input: any; output: any; }
    /** A Swedish social security number as YYYYMMDD-NNNN, or only the birth date YYYYMMDD. */
    SocialSecurityNumber: { input: any; output: any; }
    /** No value: the mutation returns null when it succeeds. */
    Void: { input: any; output: any; }
    /** A four-digit year, 1900 to 2199. */
    Year: { input: any; output: any; }
};

/** A spexare's participation in one spex: the spex activity names the spex and the task activities the tasks. */
export type Activity = {
    __typename?: 'Activity';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    spexActivity?: Maybe<SpexActivity>;
    taskActivities?: Maybe<Array<Maybe<TaskActivity>>>;
    taskActivitiesPaged?: Maybe<TaskActivityConnection>;
};


/** A spexare's participation in one spex: the spex activity names the spex and the task activities the tasks. */
export type ActivityTaskActivitiesPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};

export type ActivityConnection = {
    __typename?: 'ActivityConnection';
    edges: Array<Maybe<ActivityEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type ActivityEdge = {
    __typename?: 'ActivityEdge';
    cursor: Scalars['String']['output'];
    node: Activity;
};

/** A role played on stage in a task activity. */
export type Actor = {
    __typename?: 'Actor';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    /** The name of the part played. */
    role?: Maybe<Scalars['String']['output']>;
    /** The vocal part sung, a VOCAL type. */
    vocal?: Maybe<Type>;
};

export type ActorConnection = {
    __typename?: 'ActorConnection';
    edges: Array<Maybe<ActorEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type ActorCreate = {
    role?: InputMaybe<Scalars['String']['input']>;
};

export type ActorEdge = {
    __typename?: 'ActorEdge';
    cursor: Scalars['String']['output'];
    node: Actor;
};

export type ActorUpdate = {
    id: Scalars['ID']['input'];
    role?: InputMaybe<Scalars['String']['input']>;
};

/** A spexare's address, phone numbers and email of one address type. */
export type Address = {
    __typename?: 'Address';
    city?: Maybe<Scalars['String']['output']>;
    /** An ISO 3166-1 alpha-2 code, such as SE. */
    country?: Maybe<Scalars['CountryCode']['output']>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    emailAddress?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    phone?: Maybe<Scalars['String']['output']>;
    phoneMobile?: Maybe<Scalars['String']['output']>;
    postalCode?: Maybe<Scalars['String']['output']>;
    streetAddress?: Maybe<Scalars['String']['output']>;
    type: Type;
};

export type AddressConnection = {
    __typename?: 'AddressConnection';
    edges: Array<Maybe<AddressEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type AddressCreate = {
    city?: InputMaybe<Scalars['String']['input']>;
    country?: InputMaybe<Scalars['CountryCode']['input']>;
    emailAddress?: InputMaybe<Scalars['Email']['input']>;
    phone?: InputMaybe<Scalars['String']['input']>;
    phoneMobile?: InputMaybe<Scalars['String']['input']>;
    postalCode?: InputMaybe<Scalars['String']['input']>;
    streetAddress?: InputMaybe<Scalars['String']['input']>;
};

export type AddressEdge = {
    __typename?: 'AddressEdge';
    cursor: Scalars['String']['output'];
    node: Address;
};

export type AddressUpdate = {
    city?: InputMaybe<Scalars['String']['input']>;
    country?: InputMaybe<Scalars['CountryCode']['input']>;
    emailAddress?: InputMaybe<Scalars['Email']['input']>;
    id: Scalars['ID']['input'];
    phone?: InputMaybe<Scalars['String']['input']>;
    phoneMobile?: InputMaybe<Scalars['String']['input']>;
    postalCode?: InputMaybe<Scalars['String']['input']>;
    streetAddress?: InputMaybe<Scalars['String']['input']>;
};

/** Narrows a search to hits with a facet value, as named by Facet.id and FacetValue.id. */
export type AggregationFilterInput = {
    name: Scalars['String']['input'];
    value: Scalars['String']['input'];
};

/** Statistics of the register. */
export type Analytics = {
    __typename?: 'Analytics';
    /** ADMIN or EDITOR; null for others. */
    dataQuality?: Maybe<DataQuality>;
    demographics: Demographics;
    lifecycle: Lifecycle;
    /** ADMIN; null for others. */
    operations?: Maybe<Operations>;
    participation: Participation;
    totals: Totals;
};

/** What kind of client a change came from. */
export enum AuditSource {
    Import = 'IMPORT',
    Mcp = 'MCP',
    Restore = 'RESTORE',
    System = 'SYSTEM',
    Web = 'WEB'
}

/** The entity types that have an audit history. */
export enum AuditedType {
    Activity = 'ACTIVITY',
    Actor = 'ACTOR',
    Address = 'ADDRESS',
    Consent = 'CONSENT',
    Membership = 'MEMBERSHIP',
    News = 'NEWS',
    PermissionGrant = 'PERMISSION_GRANT',
    Spex = 'SPEX',
    Spexare = 'SPEXARE',
    SpexActivity = 'SPEX_ACTIVITY',
    SpexCategory = 'SPEX_CATEGORY',
    SpexDetails = 'SPEX_DETAILS',
    State = 'STATE',
    Tag = 'TAG',
    Task = 'TASK',
    TaskActivity = 'TASK_ACTIVITY',
    TaskCategory = 'TASK_CATEGORY',
    Toggle = 'TOGGLE',
    Type = 'TYPE',
    User = 'USER'
}

/** A Spexregister role, a Keycloak client role. */
export type Authority = {
    __typename?: 'Authority';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** In the caller's language. */
    label: Scalars['String']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
};

/** A count for a value, such as a country or a task. */
export type Bucket = {
    __typename?: 'Bucket';
    count: Scalars['Long']['output'];
    /** The spexare search facet the bucket narrows by, when there is one. */
    facet?: Maybe<Scalars['String']['output']>;
    /** The value, to narrow a spexare search by in the facet named by facet. */
    key: Scalars['String']['output'];
    label: Scalars['String']['output'];
};

/** One target and what happened to it. */
export type BulkEntry = {
    __typename?: 'BulkEntry';
    /** What was or would be changed, such as the names of the tags added. */
    detail?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    label: Scalars['String']['output'];
    outcome: BulkOutcome;
};

export enum BulkOutcome {
    Applied = 'APPLIED',
    NotPermitted = 'NOT_PERMITTED',
    Unchanged = 'UNCHANGED'
}

/** What happened to each target, and the count of each outcome. */
export type BulkResult = {
    __typename?: 'BulkResult';
    applied: Scalars['Int']['output'];
    /** The spexare the caller may not change. */
    blocked: Scalars['Int']['output'];
    entries: Array<BulkEntry>;
    operation: SpexareBulkOperation;
    requested: Scalars['Int']['output'];
    unchanged: Scalars['Int']['output'];
};

/** The spexare to change: either ids or a filter, not both. */
export type BulkTarget = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** A spexare's answer to one consent type. */
export type Consent = {
    __typename?: 'Consent';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    type: Type;
    /** Whether the spexare agreed. */
    value: Scalars['Boolean']['output'];
};

/** How many spexare have agreed to, declined or not answered a consent type. */
export type ConsentCompletion = {
    __typename?: 'ConsentCompletion';
    denied: Scalars['Long']['output'];
    granted: Scalars['Long']['output'];
    key: Scalars['String']['output'];
    label: Scalars['String']['output'];
    missing: Scalars['Long']['output'];
};

export type ConsentConnection = {
    __typename?: 'ConsentConnection';
    edges: Array<Maybe<ConsentEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type ConsentCreate = {
    value: Scalars['Boolean']['input'];
};

export type ConsentEdge = {
    __typename?: 'ConsentEdge';
    cursor: Scalars['String']['output'];
    node: Consent;
};

export type ConsentUpdate = {
    id: Scalars['ID']['input'];
    value: Scalars['Boolean']['input'];
};

/** A country, labelled in the caller's language. */
export type Country = {
    __typename?: 'Country';
    isoCode: Scalars['CountryCode']['output'];
    label?: Maybe<Scalars['String']['output']>;
};

/** What spexare records lack. */
export type DataQuality = {
    __typename?: 'DataQuality';
    /** The spexare that lack nothing. */
    complete: Scalars['Long']['output'];
    issues: Array<Bucket>;
    total: Scalars['Long']['output'];
};

/** Who the spexare are. The lists by country, address type, membership, tag and toggle hold at most 15 buckets. */
export type Demographics = {
    __typename?: 'Demographics';
    byAddressType: Array<Bucket>;
    byCountry: Array<Bucket>;
    byMembership: Array<Bucket>;
    byStatus: Array<Bucket>;
    byTag: Array<Bucket>;
    byToggle: Array<Bucket>;
    consentCompletion: Array<ConsentCompletion>;
};

/** A facet of a search result: a field and the counts of its values among the hits. */
export type Facet = {
    __typename?: 'Facet';
    groups: Array<Maybe<FacetGroup>>;
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
};

/** The values of a facet under one parent value, for hierarchical facets. */
export type FacetGroup = {
    __typename?: 'FacetGroup';
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
    values: Array<Maybe<FacetValue>>;
};

/** A value and how many hits have it. */
export type FacetValue = {
    __typename?: 'FacetValue';
    count: Scalars['Int']['output'];
    id: Scalars['String']['output'];
    label: Scalars['String']['output'];
};

/** One field's value before and after a revision. Associations show the label of what they point at. */
export type FieldChange = {
    __typename?: 'FieldChange';
    /** Whether the field holds a binary value such as an image; the values are then content types. */
    binary: Scalars['Boolean']['output'];
    entityId?: Maybe<Scalars['Long']['output']>;
    field: Scalars['String']['output'];
    newValue?: Maybe<Scalars['String']['output']>;
    oldValue?: Maybe<Scalars['String']['output']>;
    /** The type of the entity the field belongs to, when it is not the revision's own, as in merged revisions. */
    type?: Maybe<AuditedType>;
};

/** A relation between two nodes, by their graph ids. */
export type GraphEdge = {
    __typename?: 'GraphEdge';
    id: Scalars['ID']['output'];
    /** Such as the year of a participation or the roles played in a task. */
    label?: Maybe<Scalars['String']['output']>;
    source: Scalars['ID']['output'];
    target: Scalars['ID']['output'];
    type: GraphEdgeType;
};

/**
 * How two nodes are related: a spexare took part in a spex (PARTICIPATION) or held a task in it (FUNCTION), something is
 * in a category (CATEGORY), a spexare has a tag (TAG) or a partner (PARTNER), or a spex is a revival of another
 * (REVIVAL_OF).
 */
export enum GraphEdgeType {
    Category = 'CATEGORY',
    Function = 'FUNCTION',
    Participation = 'PARTICIPATION',
    Partner = 'PARTNER',
    RevivalOf = 'REVIVAL_OF',
    Tag = 'TAG'
}

/** The neighbours of a node along one edge type. */
export type GraphGroup = {
    __typename?: 'GraphGroup';
    edges: Array<GraphEdge>;
    nodes: Array<GraphNode>;
    totalCount: Scalars['Int']['output'];
    type: GraphEdgeType;
};

/** A node and its neighbours. */
export type GraphNeighbourhood = {
    __typename?: 'GraphNeighbourhood';
    groups: Array<GraphGroup>;
    origin: GraphNode;
};

/** A spexare, spex, task, tag or category in the graph. */
export type GraphNode = {
    __typename?: 'GraphNode';
    /** The id of the entity. */
    entityId: Scalars['ID']['output'];
    /** The node's id in the graph, such as SPEXARE:42. */
    id: Scalars['ID']['output'];
    imageUrl?: Maybe<Scalars['String']['output']>;
    label: Scalars['String']['output'];
    revival: Scalars['Boolean']['output'];
    sublabel?: Maybe<Scalars['String']['output']>;
    type: GraphNodeType;
};

export type GraphNodeConnection = {
    __typename?: 'GraphNodeConnection';
    edges: Array<Maybe<GraphNodeEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type GraphNodeEdge = {
    __typename?: 'GraphNodeEdge';
    cursor: Scalars['String']['output'];
    node: GraphNode;
};

/** What a node is. */
export enum GraphNodeType {
    Spex = 'SPEX',
    Spexare = 'SPEXARE',
    SpexCategory = 'SPEX_CATEGORY',
    Tag = 'TAG',
    Task = 'TASK',
    TaskCategory = 'TASK_CATEGORY'
}

/** A count for a year. */
export type History = {
    __typename?: 'History';
    count: Scalars['Long']['output'];
    label: Scalars['String']['output'];
};

/** File formats of import and export. */
export enum ImpexType {
    Excel = 'EXCEL',
    ExcelXls = 'EXCEL_XLS',
    Pdf = 'PDF'
}

/** What an import did. */
export type ImportResult = {
    __typename?: 'ImportResult';
    data?: Maybe<Scalars['JSON']['output']>;
    /** A message for each row that failed, in the language of the import. */
    errors?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
    /** How many records of each kind were created, updated and removed. */
    messages?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
    success: Scalars['Boolean']['output'];
};

/** An import or export job. */
export type Job = {
    __typename?: 'Job';
    createdAt?: Maybe<Scalars['Instant']['output']>;
    exitStatus?: Maybe<Scalars['String']['output']>;
    finishedAt?: Maybe<Scalars['Instant']['output']>;
    /** Whether the export's file can be downloaded from the REST API. */
    hasDownload?: Maybe<Scalars['Boolean']['output']>;
    id: Scalars['ID']['output'];
    importResult?: Maybe<ImportResult>;
    name: Scalars['String']['output'];
    startedAt?: Maybe<Scalars['Instant']['output']>;
    /** The Spring Batch status, such as STARTED, COMPLETED or FAILED. */
    status: Scalars['String']['output'];
};

/** A started import or export job, to follow with jobProgress or job. */
export type JobReference = {
    __typename?: 'JobReference';
    id: Scalars['ID']['output'];
};

/** The status of an import or export job. */
export type JobStatus = {
    __typename?: 'JobStatus';
    exitStatus?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
    status: Scalars['String']['output'];
};

/** A language Spexregister is available in, labelled in the caller's language. */
export type Language = {
    __typename?: 'Language';
    isoCode: Scalars['Locale']['output'];
    label?: Maybe<Scalars['String']['output']>;
};

/** How spexare come and go. */
export type Lifecycle = {
    __typename?: 'Lifecycle';
    /**
     * Spexare by how long since their last spex: active within 3 years, lapsing within 10, dormant before that, and never
     * active.
     */
    byDormancy: Array<Bucket>;
    /** Spexare by the number of spex they took part in. */
    byEngagement: Array<Bucket>;
    lastActiveByYear: Array<Bucket>;
    /** Spexare in no spex. */
    neverActive: Scalars['Long']['output'];
    newcomersByYear: Array<Bucket>;
    /** Spexare in one spex. */
    oneTimers: Scalars['Long']['output'];
    /** Spexare in two to four spex. */
    returning: Scalars['Long']['output'];
    /** Spexare in five spex or more. */
    veterans: Scalars['Long']['output'];
};

/** Membership of an association in one year. */
export type Membership = {
    __typename?: 'Membership';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    type: Type;
    year: Scalars['Year']['output'];
};

export type MembershipConnection = {
    __typename?: 'MembershipConnection';
    edges: Array<Maybe<MembershipEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type MembershipCreate = {
    year: Scalars['Year']['input'];
};

export type MembershipEdge = {
    __typename?: 'MembershipEdge';
    cursor: Scalars['String']['output'];
    node: Membership;
};

export type Mutation = {
    __typename?: 'Mutation';
    /** Every role, with WRITE on the spexare. Adds an empty activity, to be given a spex and tasks. */
    activityCreate?: Maybe<Activity>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. Removes the activity with its spex and task activities. */
    activityDelete?: Maybe<Scalars['Void']['output']>;
    /** Every role, with WRITE on the spexare. vocalId is a VOCAL type such as B1. */
    actorCreate?: Maybe<Actor>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    actorDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    actorUpdate?: Maybe<Actor>;
    /**
     * Every role, with WRITE on the spexare. typeId is an ADDRESS type such as HOME; a spexare has at most one address of
     * each.
     */
    addressCreate?: Maybe<Address>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    addressDelete?: Maybe<Scalars['Void']['output']>;
    /** Every role, with WRITE on the spexare. Omitted values are left unchanged. */
    addressUpdate?: Maybe<Address>;
    /**
     * Every role, with WRITE on the spexare. typeId is a CONSENT type such as CIRCULARS; a spexare has at most one consent
     * of each.
     */
    consentCreate?: Maybe<Consent>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    consentDelete?: Maybe<Scalars['Void']['output']>;
    /** Every role, with WRITE on the spexare. */
    consentUpdate?: Maybe<Consent>;
    /** ADMIN. Rebuilds the spexare search index in the background. */
    indexSpexare?: Maybe<Scalars['Void']['output']>;
    /** ADMIN or EDITOR. Removes one of the caller's finished jobs with its files. */
    jobDelete?: Maybe<Scalars['Void']['output']>;
    /**
     * Every role, with WRITE on the spexare. typeId is a MEMBERSHIP type such as FGV; fails when the spexare already is a
     * member that year.
     */
    membershipCreate?: Maybe<Membership>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    membershipDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN or EDITOR. Published at once when today is within the visibility period. */
    newsCreate?: Maybe<News>;
    /** ADMIN or EDITOR. */
    newsDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN or EDITOR. Omitted values are left unchanged; published follows the visibility period. */
    newsUpdate?: Maybe<News>;
    /**
     * ADMIN. Names exactly one of userId and role (USER, EDITOR or ADMIN). A SPEXARE grant names spexareId; the other
     * scopes name spexId. validUntil may not be in the past.
     */
    permissionGrantCreate?: Maybe<PermissionGrant>;
    /** ADMIN. */
    permissionGrantDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Changes the permission and validUntil; who and what the grant applies to are fixed. */
    permissionGrantUpdate?: Maybe<PermissionGrant>;
    /**
     * ADMIN, with WRITE on the entity. Puts its audited fields, and those of what it points at, back as they were in the
     * revision. With cascade, the records that belong to it are restored too: changed ones are put back, ones added since
     * are removed and ones removed since are re-created under new ids. The entity must still exist. The reason given in
     * the X-Audit-Reason header is kept with the new revision.
     */
    restore?: Maybe<RestoreResult>;
    /** ADMIN, EDITOR or USER. Saves a search as the caller's. */
    savedSearchCreate?: Maybe<SavedSearch>;
    /** ADMIN, EDITOR or USER. Removes one of the caller's saved searches. */
    savedSearchDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER. Changes one of the caller's saved searches. */
    savedSearchUpdate?: Maybe<SavedSearch>;
    /** Every role, with WRITE on the spexare. Fails when the activity already has the spex. */
    spexActivityCreate?: Maybe<SpexActivity>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    spexActivityDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. Changes the spex. */
    spexActivityUpdate?: Maybe<SpexActivity>;
    /** ADMIN. Sets the category of the spex and of all that share its title. */
    spexCategoryAdd?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. */
    spexCategoryCreate?: Maybe<SpexCategory>;
    /** ADMIN. */
    spexCategoryDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. */
    spexCategoryLogoDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Clears the category of the spex and of all that share its title. */
    spexCategoryRemove?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. */
    spexCategoryUpdate?: Maybe<SpexCategory>;
    /** ADMIN. */
    spexCreate?: Maybe<Spex>;
    /** ADMIN. Removes the spex with its revivals. */
    spexDelete?: Maybe<Scalars['Void']['output']>;
    /** Removes the poster, shared with the original and all its revivals. Requires WRITE on the spex. */
    spexPosterDelete?: Maybe<Scalars['Void']['output']>;
    /**
     * Every role. Adds a revival of the spex in the year. Requires WRITE on the spex; fails when there already is one that
     * year.
     */
    spexRevivalCreate?: Maybe<SpexRevival>;
    /** Requires WRITE on the original spex. */
    spexRevivalDelete?: Maybe<Scalars['Void']['output']>;
    /** Changes the year and the title, which is shared with the original and all its revivals. Requires WRITE on the spex. */
    spexUpdate?: Maybe<Spex>;
    /**
     * ADMIN, EDITOR or USER. Applies one operation to at most 500 spexare. Ids that do not exist, and a missing payload,
     * fail the whole request before anything changes; spexare the caller may not change are reported as NOT_PERMITTED and
     * left alone.
     */
    spexareBulkApply?: Maybe<BulkResult>;
    /** ADMIN, EDITOR or REVIVAL. The social security number is kept only for ADMIN and EDITOR. */
    spexareCreate?: Maybe<Spexare>;
    /**
     * Requires DELETE on the spexare, held by ADMIN and by grants. Removes everything that belongs to it. purge also
     * removes its audit history, which only ADMIN may do.
     */
    spexareDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    spexareImageDelete?: Maybe<Scalars['Void']['output']>;
    /**
     * ADMIN, EDITOR or USER. Mails a request to remove the caller from the register to the administrators. reason is at
     * most 2000 characters.
     */
    spexareMeRemovalRequest?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER with WRITE on both. Makes them each other's partner, parting either from a previous one. */
    spexarePartnerAdd?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER with WRITE on both. Parts the spexare and its partner. */
    spexarePartnerRemove?: Maybe<Scalars['Void']['output']>;
    /**
     * ADMIN, EDITOR or USER with WRITE on the spexare: their own, their partner's or one granted. Omitted values are left
     * unchanged, and so is the social security number for a caller who may not see it.
     */
    spexareUpdate?: Maybe<Spexare>;
    /** ADMIN or EDITOR. */
    tagCreate?: Maybe<Tag>;
    /** ADMIN or EDITOR. */
    tagDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN or EDITOR. */
    tagUpdate?: Maybe<Tag>;
    /** Every role, with WRITE on the spexare. Fails when the spexare already has the tag. */
    taggingCreate?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    taggingDelete?: Maybe<Scalars['Void']['output']>;
    /** Every role, with WRITE on the spexare. Fails when the activity already has the task. */
    taskActivityCreate?: Maybe<TaskActivity>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. Removes it with its actors. */
    taskActivityDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. Changes the task. */
    taskActivityUpdate?: Maybe<TaskActivity>;
    /** ADMIN. Puts the task in the category. */
    taskCategoryAdd?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. */
    taskCategoryCreate?: Maybe<TaskCategory>;
    /** ADMIN. */
    taskCategoryDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Takes the task out of its category. */
    taskCategoryRemove?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. */
    taskCategoryUpdate?: Maybe<TaskCategory>;
    /** ADMIN. */
    taskCreate?: Maybe<Task>;
    /** ADMIN. */
    taskDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN or EDITOR. */
    taskUpdate?: Maybe<Task>;
    /**
     * ADMIN, EDITOR or USER with WRITE on the spexare. typeId is a TOGGLE type such as CHALMERS_STUDENT; a spexare has at
     * most one toggle of each.
     */
    toggleCreate?: Maybe<Toggle>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    toggleDelete?: Maybe<Scalars['Void']['output']>;
    /** ADMIN, EDITOR or USER with WRITE on the spexare. */
    toggleUpdate?: Maybe<Toggle>;
    /** ADMIN. Gives the user's Keycloak account the roles it lacks. */
    userAuthoritiesAdd?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Takes the roles from the user's Keycloak account. */
    userAuthoritiesRemove?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Gives the user's Keycloak account the role. */
    userAuthorityAdd?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Takes the role from the user's Keycloak account. */
    userAuthorityRemove?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Creates the Keycloak account with a temporary password, returned once, and the user in the initial state. */
    userCreate?: Maybe<User>;
    /** ADMIN. Removes the Keycloak account and the user. The user's spexare stays. */
    userDelete?: Maybe<Scalars['Void']['output']>;
    /**
     * ADMIN. Links the user to their spexare, which then reads and changes it. Fails when the spexare belongs to another
     * user.
     */
    userSpexareAdd?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Unlinks the user from their spexare. */
    userSpexareRemove?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Moves the user to the state, enabling or disabling the Keycloak account to match. */
    userStateSet?: Maybe<Scalars['Void']['output']>;
    /** ADMIN. Changes the email, in Keycloak too. */
    userUpdate?: Maybe<User>;
};


export type MutationActivityCreateArgs = {
    spexareId: Scalars['ID']['input'];
};


export type MutationActivityDeleteArgs = {
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
};


export type MutationActorCreateArgs = {
    activityId: Scalars['ID']['input'];
    input: ActorCreate;
    spexareId: Scalars['ID']['input'];
    taskActivityId: Scalars['ID']['input'];
    vocalId: Scalars['ID']['input'];
};


export type MutationActorDeleteArgs = {
    activityId: Scalars['ID']['input'];
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
    taskActivityId: Scalars['ID']['input'];
    vocalId: Scalars['ID']['input'];
};


export type MutationActorUpdateArgs = {
    activityId: Scalars['ID']['input'];
    input: ActorUpdate;
    spexareId: Scalars['ID']['input'];
    taskActivityId: Scalars['ID']['input'];
    vocalId: Scalars['ID']['input'];
};


export type MutationAddressCreateArgs = {
    input: AddressCreate;
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationAddressDeleteArgs = {
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationAddressUpdateArgs = {
    input: AddressUpdate;
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationConsentCreateArgs = {
    input: ConsentCreate;
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationConsentDeleteArgs = {
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationConsentUpdateArgs = {
    input: ConsentUpdate;
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationJobDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationMembershipCreateArgs = {
    input: MembershipCreate;
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationMembershipDeleteArgs = {
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationNewsCreateArgs = {
    input: NewsCreate;
};


export type MutationNewsDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationNewsUpdateArgs = {
    input: NewsUpdate;
};


export type MutationPermissionGrantCreateArgs = {
    input: PermissionGrantCreate;
};


export type MutationPermissionGrantDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationPermissionGrantUpdateArgs = {
    input: PermissionGrantUpdate;
};


export type MutationRestoreArgs = {
    cascade?: InputMaybe<Scalars['Boolean']['input']>;
    id: Scalars['ID']['input'];
    revision: Scalars['Long']['input'];
    type: AuditedType;
};


export type MutationSavedSearchCreateArgs = {
    input: SavedSearchCreate;
};


export type MutationSavedSearchDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationSavedSearchUpdateArgs = {
    input: SavedSearchUpdate;
};


export type MutationSpexActivityCreateArgs = {
    activityId: Scalars['ID']['input'];
    spexId: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
};


export type MutationSpexActivityDeleteArgs = {
    activityId: Scalars['ID']['input'];
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
};


export type MutationSpexActivityUpdateArgs = {
    activityId: Scalars['ID']['input'];
    id: Scalars['ID']['input'];
    spexId: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
};


export type MutationSpexCategoryAddArgs = {
    id: Scalars['ID']['input'];
    spexId: Scalars['ID']['input'];
};


export type MutationSpexCategoryCreateArgs = {
    input: SpexCategoryCreate;
};


export type MutationSpexCategoryDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationSpexCategoryLogoDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationSpexCategoryRemoveArgs = {
    spexId: Scalars['ID']['input'];
};


export type MutationSpexCategoryUpdateArgs = {
    input: SpexCategoryUpdate;
};


export type MutationSpexCreateArgs = {
    input: SpexCreate;
};


export type MutationSpexDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationSpexPosterDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationSpexRevivalCreateArgs = {
    spexId: Scalars['ID']['input'];
    year: Scalars['Year']['input'];
};


export type MutationSpexRevivalDeleteArgs = {
    id: Scalars['ID']['input'];
    spexId: Scalars['ID']['input'];
};


export type MutationSpexUpdateArgs = {
    input: SpexUpdate;
};


export type MutationSpexareBulkApplyArgs = {
    input: SpexareBulkInput;
};


export type MutationSpexareCreateArgs = {
    input: SpexareCreate;
};


export type MutationSpexareDeleteArgs = {
    id: Scalars['ID']['input'];
    purge?: Scalars['Boolean']['input'];
};


export type MutationSpexareImageDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationSpexareMeRemovalRequestArgs = {
    reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSpexarePartnerAddArgs = {
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
};


export type MutationSpexarePartnerRemoveArgs = {
    spexareId: Scalars['ID']['input'];
};


export type MutationSpexareUpdateArgs = {
    input: SpexareUpdate;
};


export type MutationTagCreateArgs = {
    input: TagCreate;
};


export type MutationTagDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationTagUpdateArgs = {
    input: TagUpdate;
};


export type MutationTaggingCreateArgs = {
    spexareId: Scalars['ID']['input'];
    tagId: Scalars['ID']['input'];
};


export type MutationTaggingDeleteArgs = {
    spexareId: Scalars['ID']['input'];
    tagId: Scalars['ID']['input'];
};


export type MutationTaskActivityCreateArgs = {
    activityId: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
    taskId: Scalars['ID']['input'];
};


export type MutationTaskActivityDeleteArgs = {
    activityId: Scalars['ID']['input'];
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
};


export type MutationTaskActivityUpdateArgs = {
    activityId: Scalars['ID']['input'];
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
    taskId: Scalars['ID']['input'];
};


export type MutationTaskCategoryAddArgs = {
    id: Scalars['ID']['input'];
    taskId: Scalars['ID']['input'];
};


export type MutationTaskCategoryCreateArgs = {
    input: TaskCategoryCreate;
};


export type MutationTaskCategoryDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationTaskCategoryRemoveArgs = {
    taskId: Scalars['ID']['input'];
};


export type MutationTaskCategoryUpdateArgs = {
    input: TaskCategoryUpdate;
};


export type MutationTaskCreateArgs = {
    input: TaskCreate;
};


export type MutationTaskDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationTaskUpdateArgs = {
    input: TaskUpdate;
};


export type MutationToggleCreateArgs = {
    input: ToggleCreate;
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationToggleDeleteArgs = {
    id: Scalars['ID']['input'];
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationToggleUpdateArgs = {
    input: ToggleUpdate;
    spexareId: Scalars['ID']['input'];
    typeId: Scalars['ID']['input'];
};


export type MutationUserAuthoritiesAddArgs = {
    ids: Array<InputMaybe<Scalars['ID']['input']>>;
    userId: Scalars['ID']['input'];
};


export type MutationUserAuthoritiesRemoveArgs = {
    ids: Array<InputMaybe<Scalars['ID']['input']>>;
    userId: Scalars['ID']['input'];
};


export type MutationUserAuthorityAddArgs = {
    id: Scalars['ID']['input'];
    userId: Scalars['ID']['input'];
};


export type MutationUserAuthorityRemoveArgs = {
    id: Scalars['ID']['input'];
    userId: Scalars['ID']['input'];
};


export type MutationUserCreateArgs = {
    input: UserCreate;
};


export type MutationUserDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationUserSpexareAddArgs = {
    id: Scalars['ID']['input'];
    userId: Scalars['ID']['input'];
};


export type MutationUserSpexareRemoveArgs = {
    userId: Scalars['ID']['input'];
};


export type MutationUserStateSetArgs = {
    id: Scalars['ID']['input'];
    userId: Scalars['ID']['input'];
};


export type MutationUserUpdateArgs = {
    input: UserUpdate;
};

/** A news item for the start page. */
export type News = {
    __typename?: 'News';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    /** What the caller may do with the news item. */
    permissions: Permissions;
    /** Whether today is within the visibility period, kept up to date by a daily job. */
    published?: Maybe<Scalars['Boolean']['output']>;
    subject: Scalars['String']['output'];
    text: Scalars['String']['output'];
    /** The first day it is published. Without it, it is never published. */
    visibleFrom?: Maybe<Scalars['Date']['output']>;
    /** The last day it is published. Without it, it stays published. */
    visibleTo?: Maybe<Scalars['Date']['output']>;
};

export type NewsConnection = {
    __typename?: 'NewsConnection';
    edges: Array<Maybe<NewsEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type NewsCreate = {
    subject: Scalars['String']['input'];
    text: Scalars['String']['input'];
    visibleFrom?: InputMaybe<Scalars['Date']['input']>;
    visibleTo?: InputMaybe<Scalars['Date']['input']>;
};

export type NewsEdge = {
    __typename?: 'NewsEdge';
    cursor: Scalars['String']['output'];
    node: News;
};

export type NewsUpdate = {
    id: Scalars['ID']['input'];
    subject: Scalars['String']['input'];
    text: Scalars['String']['input'];
    visibleFrom?: InputMaybe<Scalars['Date']['input']>;
    visibleTo?: InputMaybe<Scalars['Date']['input']>;
};

/** How the register itself is used. */
export type Operations = {
    __typename?: 'Operations';
    /** Revisions per month over the last 24 months. */
    revisionsByMonth: Array<Bucket>;
    revisionsBySource: Array<Bucket>;
    spexareWithoutUser: Scalars['Long']['output'];
    /** The 10 who made the most revisions. */
    topEditors: Array<Bucket>;
    usersByState: Array<Bucket>;
    usersWithoutSpexare: Scalars['Long']['output'];
};

export type PageInfo = {
    __typename?: 'PageInfo';
    endCursor?: Maybe<Scalars['String']['output']>;
    hasNextPage: Scalars['Boolean']['output'];
    hasPreviousPage: Scalars['Boolean']['output'];
    startCursor?: Maybe<Scalars['String']['output']>;
};

/** Who took part in what. All lists but bySpexYear hold at most 15 buckets. */
export type Participation = {
    __typename?: 'Participation';
    bySpexCategory: Array<Bucket>;
    bySpexYear: Array<Bucket>;
    byTaskCategory: Array<Bucket>;
    byVocal: Array<Bucket>;
    topSpex: Array<Bucket>;
    topTask: Array<Bucket>;
};

/** What a caller may do. ADMINISTRATION includes the others, and any permission includes READ. */
export enum Permission {
    Administration = 'ADMINISTRATION',
    Delete = 'DELETE',
    Read = 'READ',
    Write = 'WRITE'
}

/** A permission given to a user, or to everyone with a role, on top of what their role allows. */
export type PermissionGrant = {
    __typename?: 'PermissionGrant';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    /** Whether validUntil has passed. */
    expired: Scalars['Boolean']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    permission: Permission;
    /** The role granted to, when not a user. */
    role?: Maybe<Scalars['String']['output']>;
    scope: PermissionGrantScope;
    spex?: Maybe<Spex>;
    spexare?: Maybe<Spexare>;
    user?: Maybe<User>;
    /** The last day the grant applies. Without it, it never ends. */
    validUntil?: Maybe<Scalars['Date']['output']>;
};

export type PermissionGrantConnection = {
    __typename?: 'PermissionGrantConnection';
    edges: Array<Maybe<PermissionGrantEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type PermissionGrantCreate = {
    permission: Permission;
    role?: InputMaybe<Scalars['String']['input']>;
    scope: PermissionGrantScope;
    spexId?: InputMaybe<Scalars['ID']['input']>;
    spexareId?: InputMaybe<Scalars['ID']['input']>;
    userId?: InputMaybe<Scalars['ID']['input']>;
    validUntil?: InputMaybe<Scalars['Date']['input']>;
};

export type PermissionGrantEdge = {
    __typename?: 'PermissionGrantEdge';
    cursor: Scalars['String']['output'];
    node: PermissionGrant;
};

/** What a grant applies to: one spexare, everyone with a spex activity in a spex, or a spex. */
export enum PermissionGrantScope {
    Spex = 'SPEX',
    Spexare = 'SPEXARE',
    SpexParticipants = 'SPEX_PARTICIPANTS'
}

export type PermissionGrantUpdate = {
    id: Scalars['ID']['input'];
    permission: Permission;
    validUntil?: InputMaybe<Scalars['Date']['input']>;
};

/** What the caller may do with the object, so a client shows only the actions the server allows. */
export type Permissions = {
    __typename?: 'Permissions';
    administer: Scalars['Boolean']['output'];
    delete: Scalars['Boolean']['output'];
    read: Scalars['Boolean']['output'];
    write: Scalars['Boolean']['output'];
};

/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type Query = {
    __typename?: 'Query';
    /**
     * ADMIN, EDITOR or USER. Only the sections selected are computed. Figures from the spexare count only those the caller
     * may see.
     */
    analytics?: Maybe<Analytics>;
    /** ADMIN, EDITOR or USER. */
    authorities?: Maybe<Array<Maybe<Authority>>>;
    /** ADMIN, EDITOR or USER. */
    authority?: Maybe<Authority>;
    /** Open to everyone. The countries of ISO 3166-1, by label. */
    countries?: Maybe<Array<Maybe<Country>>>;
    /** Open to everyone. */
    country?: Maybe<Country>;
    /** ADMIN, EDITOR or USER. The node with at most first neighbours of each edge type. */
    graphNeighbourhood?: Maybe<GraphNeighbourhood>;
    /** ADMIN, EDITOR or USER. All neighbours of the node along one edge type. */
    graphNeighboursPaged?: Maybe<GraphNodeConnection>;
    /**
     * ADMIN, EDITOR or USER. Spexare, spex, tasks and tags matching q, by label. A blank q gives the caller's own spexare,
     * or a random one.
     */
    graphSearch: Array<GraphNode>;
    /** ADMIN or EDITOR. One of the caller's own jobs, with an import's result. */
    job?: Maybe<Job>;
    /** ADMIN or EDITOR. One of the caller's own jobs. */
    jobStatus?: Maybe<JobStatus>;
    /** ADMIN or EDITOR. The caller's own jobs, newest first. */
    jobs?: Maybe<Array<Maybe<Job>>>;
    /** Open to everyone. */
    language?: Maybe<Language>;
    /** Open to everyone. The languages Spexregister is available in. */
    languages?: Maybe<Array<Maybe<Language>>>;
    me?: Maybe<User>;
    /** ADMIN, EDITOR or USER. USER sees published news only. */
    news?: Maybe<News>;
    /** ADMIN or EDITOR. */
    newsExport?: Maybe<JobReference>;
    /** ADMIN, EDITOR or USER. USER sees published news only. */
    newsPaged?: Maybe<NewsConnection>;
    /** ADMIN. */
    permissionGrant?: Maybe<PermissionGrant>;
    /** ADMIN. */
    permissionGrantPaged?: Maybe<PermissionGrantConnection>;
    /**
     * ADMIN, EDITOR or USER who may read the entity. The revisions of the records of relatedType that belong to it, and of
     * those that belong to them in turn, newest first; for example the activities of a spexare.
     */
    relatedRevisions?: Maybe<Array<Maybe<Revision>>>;
    /** ADMIN. What restore would change, without changing anything. */
    restorePreview?: Maybe<RestorePreview>;
    /** ADMIN, EDITOR or USER who may read the entity. One of its revisions, as revisions gives it. */
    revision?: Maybe<Revision>;
    /** ADMIN. Everyone who has made a revision, by name. */
    revisionAuthors: Array<Scalars['String']['output']>;
    /** ADMIN. Everything changed in a revision, at most limitPerType entities of each type. */
    revisionDetail?: Maybe<RevisionDetail>;
    /**
     * ADMIN. All revisions, newest first, narrowed by the entity type that changed, the authors, the sources and a period
     * from and to, both inclusive. Without from, the period starts sinceInDays days before to, or today.
     */
    revisionFeedPaged?: Maybe<RevisionFeedConnection>;
    /**
     * ADMIN, EDITOR or USER who may read the entity. Its revisions with those of what it points at, such as a spex's
     * details, newest first.
     */
    revisions?: Maybe<Array<Maybe<Revision>>>;
    /** ADMIN, EDITOR or USER. One of the caller's saved searches. */
    savedSearch?: Maybe<SavedSearch>;
    /** ADMIN, EDITOR or USER. The caller's saved searches, by name. */
    savedSearches?: Maybe<Array<Maybe<SavedSearch>>>;
    /** Every role. */
    spex?: Maybe<Spex>;
    /** ADMIN, EDITOR or USER. */
    spexCategory?: Maybe<SpexCategory>;
    /** ADMIN or EDITOR. */
    spexCategoryExport?: Maybe<JobReference>;
    /** ADMIN, EDITOR or USER. */
    spexCategoryPaged?: Maybe<SpexCategoryConnection>;
    /**
     * ADMIN or EDITOR. Starts an export of the given spex, or of the original spex matching the filter, with their
     * revivals.
     */
    spexExport?: Maybe<JobReference>;
    /** Every role. Only original spex by default; filter on parent!NULL for the revivals. */
    spexPaged?: Maybe<SpexConnection>;
    /** Every role. A revival of another spex is not found. */
    spexRevival?: Maybe<Spex>;
    /** Every role. */
    spexare?: Maybe<Spexare>;
    /** ADMIN, EDITOR or USER. What spexareBulkApply would do, without changing anything. */
    spexareBulkPreview?: Maybe<BulkResult>;
    /** Every role. At most 500 ids; those the caller may not read are left out, and the order is not kept. */
    spexareByIds: Array<Spexare>;
    /** Every role. Those with a spex activity in the spex or one of its revivals, by last name and first name. */
    spexareBySpex: Array<Spexare>;
    /**
     * ADMIN or EDITOR. Starts an export of the given spexare, or of those matching the filter, as a spreadsheet or the PDF
     * report.
     */
    spexareExport?: Maybe<JobReference>;
    /** ADMIN, EDITOR or USER. The caller's own spexare, or null when their user has none. */
    spexareMe?: Maybe<Spexare>;
    /** ADMIN, EDITOR or USER. Starts an export of the caller's own spexare. Fails when their user has none. */
    spexareMeExport?: Maybe<JobReference>;
    /**
     * Every role. Published spexare by default; the social security number can be filtered on only by ADMIN and EDITOR,
     * and memberships and user not by REVIVAL alone.
     */
    spexarePaged?: Maybe<SpexareConnection>;
    /**
     * Every role. Free-text search, by relevance unless sorted, with facets to narrow by through aggregationFilters. Year
     * facets also take a range such as 1990..1999, and the quality facet finds records that lack something, such as
     * noAddress. Eight digits match a birth date, and a full social security number matches for ADMIN and EDITOR.
     */
    spexareSearchPaged?: Maybe<SpexareWithFacetsConnection>;
    /** ADMIN, EDITOR or USER. */
    state?: Maybe<State>;
    /** ADMIN, EDITOR or USER. */
    states?: Maybe<Array<Maybe<State>>>;
    /** Every role. */
    tag?: Maybe<Tag>;
    /** ADMIN or EDITOR. */
    tagExport?: Maybe<JobReference>;
    /** Every role. */
    tagPaged?: Maybe<TagConnection>;
    /** Every role. */
    task?: Maybe<Task>;
    /** Every role. */
    taskCategory?: Maybe<TaskCategory>;
    /** ADMIN or EDITOR. */
    taskCategoryExport?: Maybe<JobReference>;
    /** Every role. */
    taskCategoryPaged?: Maybe<TaskCategoryConnection>;
    /** ADMIN or EDITOR. */
    taskExport?: Maybe<JobReference>;
    /** Every role. */
    taskPaged?: Maybe<TaskConnection>;
    /** Open to everyone. */
    type?: Maybe<Type>;
    /** Open to everyone. */
    types?: Maybe<Array<Maybe<Type>>>;
    /** Open to everyone. The types of one kind, such as the address types. */
    typesOfType?: Maybe<Array<Maybe<Type>>>;
    /** ADMIN. */
    user?: Maybe<User>;
    /** ADMIN. */
    userExport?: Maybe<JobReference>;
    /** ADMIN. */
    userPaged?: Maybe<UserConnection>;
    /**
     * ADMIN. Users to pick from, found by the email, username or name of their Keycloak account or by the name of their
     * spexare, those found in Keycloak first. A blank query gives the first users. At most 100.
     */
    userSearch: Array<User>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryAuthoritiesArgs = {
    direction?: InputMaybe<SortDirection>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryAuthorityArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryCountryArgs = {
    isoCode: Scalars['CountryCode']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryGraphNeighbourhoodArgs = {
    first?: Scalars['Int']['input'];
    id: Scalars['ID']['input'];
    type: GraphNodeType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryGraphNeighboursPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    edge: GraphEdgeType;
    first?: InputMaybe<Scalars['Int']['input']>;
    id: Scalars['ID']['input'];
    last?: InputMaybe<Scalars['Int']['input']>;
    type: GraphNodeType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryGraphSearchArgs = {
    first?: Scalars['Int']['input'];
    q: Scalars['String']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryJobArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryJobStatusArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryLanguageArgs = {
    isoCode: Scalars['Locale']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryNewsArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryNewsExportArgs = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryNewsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryPermissionGrantArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryPermissionGrantPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryRelatedRevisionsArgs = {
    id: Scalars['ID']['input'];
    relatedType: AuditedType;
    type: AuditedType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryRestorePreviewArgs = {
    cascade?: InputMaybe<Scalars['Boolean']['input']>;
    id: Scalars['ID']['input'];
    revision: Scalars['Long']['input'];
    type: AuditedType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryRevisionArgs = {
    id: Scalars['ID']['input'];
    revision: Scalars['Long']['input'];
    type: AuditedType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryRevisionDetailArgs = {
    limitPerType?: Scalars['Int']['input'];
    revision: Scalars['Long']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryRevisionFeedPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    from?: InputMaybe<Scalars['Date']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    modifiedBy?: InputMaybe<Array<Scalars['String']['input']>>;
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
    sources?: InputMaybe<Array<AuditSource>>;
    to?: InputMaybe<Scalars['Date']['input']>;
    type?: InputMaybe<AuditedType>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryRevisionsArgs = {
    id: Scalars['ID']['input'];
    type: AuditedType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySavedSearchArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexCategoryArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexCategoryExportArgs = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexCategoryPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexExportArgs = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexRevivalArgs = {
    id: Scalars['ID']['input'];
    spexId: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexareArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexareBulkPreviewArgs = {
    input: SpexareBulkInput;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexareByIdsArgs = {
    ids: Array<Scalars['ID']['input']>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexareBySpexArgs = {
    spexId: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexareExportArgs = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    reportType?: InputMaybe<ReportType>;
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexareMeExportArgs = {
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexarePagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QuerySpexareSearchPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    aggregationFilters?: InputMaybe<Array<InputMaybe<AggregationFilterInput>>>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    q: Scalars['String']['input'];
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryStateArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryStatesArgs = {
    direction?: InputMaybe<SortDirection>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTagArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTagExportArgs = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTagPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTaskArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTaskCategoryArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTaskCategoryExportArgs = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTaskCategoryPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTaskExportArgs = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTaskPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTypeArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryTypesOfTypeArgs = {
    type: TypeType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryUserArgs = {
    id: Scalars['ID']['input'];
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryUserExportArgs = {
    filter?: InputMaybe<Scalars['String']['input']>;
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
    type: ImpexType;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryUserPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * Queries named *Paged return a Relay connection: page with first and after, or last and before. Their filter is an
 * expression of criteria such as year:2024, title:*Ali* or parent!NULL combined with AND, OR and parentheses. The
 * operators are : (equals), ! (not equals), >, < and ~ (SQL LIKE); an asterisk at the start or end of a value of : makes
 * it ends with, starts with or contains, and NULL, TRUE and FALSE compare as such. Nested attributes such as details.title
 * can be filtered on only where the type allows it. sort names attributes, ordered by direction.
 *
 * Lists only ever contain what the caller may read.
 */
export type QueryUserSearchArgs = {
    first?: Scalars['Int']['input'];
    query?: Scalars['String']['input'];
};

/** Reports produced as PDF from a spexare export. */
export enum ReportType {
    PdfAddressLabels = 'PDF_ADDRESS_LABELS',
    PdfPlatoonList = 'PDF_PLATOON_LIST',
    PdfScratchList = 'PDF_SCRATCH_LIST'
}

/** What a restore does to one entity. */
export enum RestoreAction {
    Create = 'CREATE',
    Delete = 'DELETE',
    Update = 'UPDATE'
}

/** What a restore would change, and what it could not do. */
export type RestorePreview = {
    __typename?: 'RestorePreview';
    entries: Array<RestorePreviewEntry>;
    warnings: Array<RestoreWarning>;
};

/** What a restore would do to one entity. */
export type RestorePreviewEntry = {
    __typename?: 'RestorePreviewEntry';
    action: RestoreAction;
    changes: Array<FieldChange>;
    id?: Maybe<Scalars['Long']['output']>;
    type: AuditedType;
};

/** How many entities a restore updated, created and deleted. */
export type RestoreResult = {
    __typename?: 'RestoreResult';
    created: Scalars['Int']['output'];
    deleted: Scalars['Int']['output'];
    revision: Scalars['Long']['output'];
    updated: Scalars['Int']['output'];
    warnings: Array<RestoreWarning>;
};

/** Something a restore could not do as asked. */
export type RestoreWarning = {
    __typename?: 'RestoreWarning';
    /**
     * ID_REASSIGNED when a removed record was re-created under a new id, REFERENCE_MISSING when it pointed at something
     * that no longer exists.
     */
    code: Scalars['String']['output'];
    message: Scalars['String']['output'];
    newId?: Maybe<Scalars['Long']['output']>;
    previousId?: Maybe<Scalars['Long']['output']>;
};

/** A change to one entity in one revision. */
export type Revision = {
    __typename?: 'Revision';
    /** The audited fields that changed. A social security number is shown as the birth date to those who may not see it. */
    changes: Array<FieldChange>;
    entityId?: Maybe<Scalars['Long']['output']>;
    entityLabel?: Maybe<Scalars['String']['output']>;
    modifiedAt: Scalars['Instant']['output'];
    /** Who made it, by email; for the revival service, its account on behalf of the person it acted for. */
    modifiedBy: Scalars['String']['output'];
    revision: Scalars['Long']['output'];
    revisionType: RevisionType;
    type: AuditedType;
};

/** Everything changed in a revision. */
export type RevisionDetail = {
    __typename?: 'RevisionDetail';
    comment?: Maybe<Scalars['String']['output']>;
    entities: Array<RevisionEntityChange>;
    modifiedAt: Scalars['Instant']['output'];
    modifiedBy: Scalars['String']['output'];
    operation?: Maybe<Scalars['String']['output']>;
    revision: Scalars['Long']['output'];
    source?: Maybe<AuditSource>;
    summary: Array<RevisionTypeSummary>;
};

/** One entity changed in a revision. */
export type RevisionEntityChange = {
    __typename?: 'RevisionEntityChange';
    changes: Array<FieldChange>;
    entityId?: Maybe<Scalars['Long']['output']>;
    entityLabel?: Maybe<Scalars['String']['output']>;
    revisionType: RevisionType;
    /** What to open to see the change, such as the spexare an address belongs to. */
    target?: Maybe<RevisionTarget>;
    type: AuditedType;
};

export type RevisionFeedConnection = {
    __typename?: 'RevisionFeedConnection';
    edges: Array<Maybe<RevisionFeedEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type RevisionFeedEdge = {
    __typename?: 'RevisionFeedEdge';
    cursor: Scalars['String']['output'];
    node: RevisionFeedEntry;
};

/** A revision in the feed. */
export type RevisionFeedEntry = {
    __typename?: 'RevisionFeedEntry';
    /** Why, as given in the X-Audit-Reason header or by a restore. */
    comment?: Maybe<Scalars['String']['output']>;
    modifiedAt: Scalars['Instant']['output'];
    modifiedBy: Scalars['String']['output'];
    /** The GraphQL operation, or the HTTP method and path, that made it. */
    operation?: Maybe<Scalars['String']['output']>;
    revision: Scalars['Long']['output'];
    source?: Maybe<AuditSource>;
    /** The entity types that changed. */
    types: Array<AuditedType>;
};

/** The entity whose history a change belongs to. */
export type RevisionTarget = {
    __typename?: 'RevisionTarget';
    id: Scalars['Long']['output'];
    label?: Maybe<Scalars['String']['output']>;
    type: AuditedType;
};

/** Whether the entity was added, modified or deleted. */
export enum RevisionType {
    Add = 'ADD',
    Del = 'DEL',
    Mod = 'MOD'
}

/** How many entities of a type changed in a revision, and how many of them are returned. */
export type RevisionTypeSummary = {
    __typename?: 'RevisionTypeSummary';
    count: Scalars['Long']['output'];
    returned: Scalars['Int']['output'];
    type: AuditedType;
};

/** A spexare search saved by name, visible only to the user who saved it. */
export type SavedSearch = {
    __typename?: 'SavedSearch';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
    /** The search as the client keeps it, at most 2000 characters. The server does not read it. */
    query: Scalars['String']['output'];
};

export type SavedSearchCreate = {
    name: Scalars['String']['input'];
    query: Scalars['String']['input'];
};

export type SavedSearchUpdate = {
    id: Scalars['ID']['input'];
    name: Scalars['String']['input'];
    query: Scalars['String']['input'];
};

export enum SortDirection {
    Asc = 'ASC',
    Desc = 'DESC'
}

/**
 * A spex in a year: an original production, or a revival of one when parent is set. Title, poster and category are shared
 * by an original and its revivals.
 */
export type Spex = {
    __typename?: 'Spex';
    /** Not for the REVIVAL role. */
    category?: Maybe<SpexCategory>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    /** The original, for a revival. Not for the REVIVAL role. */
    parent?: Maybe<SpexParent>;
    /** What the caller may do with the spex. */
    permissions: Permissions;
    /** Where to fetch the poster from the REST API, when there is one. */
    posterUrl?: Maybe<Scalars['String']['output']>;
    /** Whether this is a revival. */
    revival?: Maybe<Scalars['Boolean']['output']>;
    /** By year. */
    revivals?: Maybe<Array<Maybe<SpexRevival>>>;
    revivalsPaged?: Maybe<SpexRevivalConnection>;
    title: Scalars['String']['output'];
    year: Scalars['Year']['output'];
};


/**
 * A spex in a year: an original production, or a revival of one when parent is set. Title, poster and category are shared
 * by an original and its revivals.
 */
export type SpexRevivalsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};

/** The spex of an activity. */
export type SpexActivity = {
    __typename?: 'SpexActivity';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    spex: Spex;
};

/** An ensemble that stages spex, such as Gamla Chalmersspexet or Bobspexet. */
export type SpexCategory = {
    __typename?: 'SpexCategory';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    /** The year of its first spex. */
    firstYear: Scalars['Year']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    /** Where to fetch the logo from the REST API, when there is one. */
    logoUrl?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
};

export type SpexCategoryConnection = {
    __typename?: 'SpexCategoryConnection';
    edges: Array<Maybe<SpexCategoryEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type SpexCategoryCreate = {
    firstYear: Scalars['Year']['input'];
    name: Scalars['String']['input'];
};

export type SpexCategoryEdge = {
    __typename?: 'SpexCategoryEdge';
    cursor: Scalars['String']['output'];
    node: SpexCategory;
};

export type SpexCategoryUpdate = {
    firstYear: Scalars['Year']['input'];
    id: Scalars['ID']['input'];
    name: Scalars['String']['input'];
};

export type SpexConnection = {
    __typename?: 'SpexConnection';
    edges: Array<Maybe<SpexEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type SpexCreate = {
    title: Scalars['String']['input'];
    year: Scalars['Year']['input'];
};

export type SpexEdge = {
    __typename?: 'SpexEdge';
    cursor: Scalars['String']['output'];
    node: Spex;
};

/** The original of a revival. */
export type SpexParent = {
    __typename?: 'SpexParent';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    year: Scalars['Year']['output'];
};

/** A revival of a spex. */
export type SpexRevival = {
    __typename?: 'SpexRevival';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    year: Scalars['Year']['output'];
};

export type SpexRevivalConnection = {
    __typename?: 'SpexRevivalConnection';
    edges: Array<Maybe<SpexRevivalEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type SpexRevivalEdge = {
    __typename?: 'SpexRevivalEdge';
    cursor: Scalars['String']['output'];
    node: SpexRevival;
};

export type SpexUpdate = {
    id: Scalars['ID']['input'];
    title: Scalars['String']['input'];
    year: Scalars['Year']['input'];
};

/**
 * A person who has taken part in spex. ADMIN, EDITOR and REVIVAL see every spexare; USER sees the published ones, their
 * own, their partner's and those a grant covers.
 */
export type Spexare = {
    __typename?: 'Spexare';
    activities?: Maybe<Array<Maybe<Activity>>>;
    activitiesPaged?: Maybe<ActivityConnection>;
    addresses?: Maybe<Array<Maybe<Address>>>;
    addressesPaged?: Maybe<AddressConnection>;
    comment?: Maybe<Scalars['String']['output']>;
    consents?: Maybe<Array<Maybe<Consent>>>;
    consentsPaged?: Maybe<ConsentConnection>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    deceased: Scalars['Boolean']['output'];
    firstName: Scalars['String']['output'];
    graduation?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    /** Where to fetch the image from the REST API, when there is one. */
    imageUrl?: Maybe<Scalars['String']['output']>;
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    lastName: Scalars['String']['output'];
    /** Not for the REVIVAL role. */
    memberships?: Maybe<Array<Maybe<Membership>>>;
    /** Not for the REVIVAL role. */
    membershipsPaged?: Maybe<MembershipConnection>;
    nickName?: Maybe<Scalars['String']['output']>;
    /** The partner, when the caller may read them. Not for the REVIVAL role. */
    partner?: Maybe<SpexarePartner>;
    /** What the caller may do with the spexare. */
    permissions: Permissions;
    /** Whether users without a grant see the spexare. */
    published: Scalars['Boolean']['output'];
    /** In full for ADMIN, EDITOR and the spexare themself; for anyone else only the birth date. */
    socialSecurityNumber?: Maybe<Scalars['SocialSecurityNumber']['output']>;
    /** Not for the REVIVAL role. */
    taggings?: Maybe<Array<Maybe<Tag>>>;
    /** Not for the REVIVAL role. */
    taggingsPaged?: Maybe<TagConnection>;
    /** Not for the REVIVAL role. */
    toggles?: Maybe<Array<Maybe<Toggle>>>;
    /** Not for the REVIVAL role. */
    togglesPaged?: Maybe<ToggleConnection>;
};


/**
 * A person who has taken part in spex. ADMIN, EDITOR and REVIVAL see every spexare; USER sees the published ones, their
 * own, their partner's and those a grant covers.
 */
export type SpexareActivitiesPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * A person who has taken part in spex. ADMIN, EDITOR and REVIVAL see every spexare; USER sees the published ones, their
 * own, their partner's and those a grant covers.
 */
export type SpexareAddressesPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * A person who has taken part in spex. ADMIN, EDITOR and REVIVAL see every spexare; USER sees the published ones, their
 * own, their partner's and those a grant covers.
 */
export type SpexareConsentsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * A person who has taken part in spex. ADMIN, EDITOR and REVIVAL see every spexare; USER sees the published ones, their
 * own, their partner's and those a grant covers.
 */
export type SpexareMembershipsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * A person who has taken part in spex. ADMIN, EDITOR and REVIVAL see every spexare; USER sees the published ones, their
 * own, their partner's and those a grant covers.
 */
export type SpexareTaggingsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};


/**
 * A person who has taken part in spex. ADMIN, EDITOR and REVIVAL see every spexare; USER sees the published ones, their
 * own, their partner's and those a grant covers.
 */
export type SpexareTogglesPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};

/** The fields of FIELDS_SET; omitted ones are left unchanged. */
export type SpexareBulkFields = {
    deceased?: InputMaybe<Scalars['Boolean']['input']>;
    published?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * The operation and what it needs: tags for TAG_ADD and TAG_REMOVE, spex for SPEX_ADD and SPEX_REMOVE, spexId and tasks
 * for TASK_ADD and TASK_REMOVE, values for CONSENT_SET and TOGGLE_SET, and fields for FIELDS_SET.
 */
export type SpexareBulkInput = {
    fields?: InputMaybe<SpexareBulkFields>;
    operation: SpexareBulkOperation;
    spex?: InputMaybe<Array<Scalars['ID']['input']>>;
    spexId?: InputMaybe<Scalars['ID']['input']>;
    tags?: InputMaybe<Array<Scalars['ID']['input']>>;
    target: BulkTarget;
    tasks?: InputMaybe<Array<Scalars['ID']['input']>>;
    values?: InputMaybe<Array<TypeValue>>;
};

/**
 * SPEX_ADD adds an activity in each spex the spexare lacks, and SPEX_REMOVE removes the activity with its tasks. TASK_ADD
 * adds the tasks to the activity in spexId, adding the activity when needed.
 */
export enum SpexareBulkOperation {
    ConsentSet = 'CONSENT_SET',
    FieldsSet = 'FIELDS_SET',
    SpexAdd = 'SPEX_ADD',
    SpexRemove = 'SPEX_REMOVE',
    TagAdd = 'TAG_ADD',
    TagRemove = 'TAG_REMOVE',
    TaskAdd = 'TASK_ADD',
    TaskRemove = 'TASK_REMOVE',
    ToggleSet = 'TOGGLE_SET'
}

export type SpexareConnection = {
    __typename?: 'SpexareConnection';
    edges: Array<Maybe<SpexareEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

/** A new spexare. */
export type SpexareCreate = {
    comment?: InputMaybe<Scalars['String']['input']>;
    deceased: Scalars['Boolean']['input'];
    firstName: Scalars['String']['input'];
    graduation?: InputMaybe<Scalars['String']['input']>;
    lastName: Scalars['String']['input'];
    nickName?: InputMaybe<Scalars['String']['input']>;
    published: Scalars['Boolean']['input'];
    socialSecurityNumber?: InputMaybe<Scalars['SocialSecurityNumber']['input']>;
};

export type SpexareEdge = {
    __typename?: 'SpexareEdge';
    cursor: Scalars['String']['output'];
    node: Spexare;
};

/** A spexare's partner, another spexare who has the first as partner in turn. */
export type SpexarePartner = {
    __typename?: 'SpexarePartner';
    comment?: Maybe<Scalars['String']['output']>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    deceased: Scalars['Boolean']['output'];
    firstName: Scalars['String']['output'];
    graduation?: Maybe<Scalars['String']['output']>;
    id: Scalars['ID']['output'];
    imageUrl?: Maybe<Scalars['String']['output']>;
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    lastName: Scalars['String']['output'];
    nickName?: Maybe<Scalars['String']['output']>;
    published: Scalars['Boolean']['output'];
    socialSecurityNumber?: Maybe<Scalars['SocialSecurityNumber']['output']>;
};

/** Omitted values are left unchanged. */
export type SpexareUpdate = {
    comment?: InputMaybe<Scalars['String']['input']>;
    deceased: Scalars['Boolean']['input'];
    firstName: Scalars['String']['input'];
    graduation?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['ID']['input'];
    imageUrl?: InputMaybe<Scalars['String']['input']>;
    lastName: Scalars['String']['input'];
    nickName?: InputMaybe<Scalars['String']['input']>;
    published: Scalars['Boolean']['input'];
    socialSecurityNumber?: InputMaybe<Scalars['SocialSecurityNumber']['input']>;
};

/** Search hits with the facets of all hits, not only the window. */
export type SpexareWithFacetsConnection = {
    __typename?: 'SpexareWithFacetsConnection';
    edges?: Maybe<Array<Maybe<SpexareEdge>>>;
    facets?: Maybe<Array<Maybe<Facet>>>;
    pageInfo?: Maybe<PageInfo>;
    totalCount: Scalars['Int']['output'];
};

/** A state a user can be in. The Keycloak account is enabled only in some states. */
export type State = {
    __typename?: 'State';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    /** In the caller's language. */
    label: Scalars['String']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
};

/** Subscriptions run over the GraphQL WebSocket, authenticated with the same token as the queries. */
export type Subscription = {
    __typename?: 'Subscription';
    /** ADMIN or EDITOR. The status of one of the caller's own jobs as it starts and ends, the latest one first. */
    jobProgress?: Maybe<JobStatus>;
};


/** Subscriptions run over the GraphQL WebSocket, authenticated with the same token as the queries. */
export type SubscriptionJobProgressArgs = {
    id: Scalars['ID']['input'];
};

/** A label put on spexare. */
export type Tag = {
    __typename?: 'Tag';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
};

export type TagConnection = {
    __typename?: 'TagConnection';
    edges: Array<Maybe<TagEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type TagCreate = {
    name: Scalars['String']['input'];
};

export type TagEdge = {
    __typename?: 'TagEdge';
    cursor: Scalars['String']['output'];
    node: Tag;
};

export type TagUpdate = {
    id: Scalars['ID']['input'];
    name: Scalars['String']['input'];
};

/** A role a spexare can have in a spex, such as director or musician. */
export type Task = {
    __typename?: 'Task';
    category?: Maybe<TaskCategory>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
};

/** A task a spexare had in the spex of an activity. */
export type TaskActivity = {
    __typename?: 'TaskActivity';
    /** The roles played, for tasks on stage. */
    actors?: Maybe<Array<Maybe<Actor>>>;
    actorsPaged?: Maybe<ActorConnection>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    task: Task;
};


/** A task a spexare had in the spex of an activity. */
export type TaskActivityActorsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: Scalars['String']['input'];
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: Array<InputMaybe<Scalars['String']['input']>>;
};

export type TaskActivityConnection = {
    __typename?: 'TaskActivityConnection';
    edges: Array<Maybe<TaskActivityEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type TaskActivityEdge = {
    __typename?: 'TaskActivityEdge';
    cursor: Scalars['String']['output'];
    node: TaskActivity;
};

/** A group of tasks. */
export type TaskCategory = {
    __typename?: 'TaskCategory';
    /** Whether the tasks are performed on stage as an actor. */
    actorPresent: Scalars['Boolean']['output'];
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
};

export type TaskCategoryConnection = {
    __typename?: 'TaskCategoryConnection';
    edges: Array<Maybe<TaskCategoryEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type TaskCategoryCreate = {
    actorPresent: Scalars['Boolean']['input'];
    name: Scalars['String']['input'];
};

export type TaskCategoryEdge = {
    __typename?: 'TaskCategoryEdge';
    cursor: Scalars['String']['output'];
    node: TaskCategory;
};

export type TaskCategoryUpdate = {
    actorPresent: Scalars['Boolean']['input'];
    id: Scalars['ID']['input'];
    name: Scalars['String']['input'];
};

export type TaskConnection = {
    __typename?: 'TaskConnection';
    edges: Array<Maybe<TaskEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type TaskCreate = {
    name: Scalars['String']['input'];
};

export type TaskEdge = {
    __typename?: 'TaskEdge';
    cursor: Scalars['String']['output'];
    node: Task;
};

export type TaskUpdate = {
    id: Scalars['ID']['input'];
    name: Scalars['String']['input'];
};

/** A yes-or-no fact of one toggle type about a spexare. */
export type Toggle = {
    __typename?: 'Toggle';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    type: Type;
    value: Scalars['Boolean']['output'];
};

export type ToggleConnection = {
    __typename?: 'ToggleConnection';
    edges: Array<Maybe<ToggleEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type ToggleCreate = {
    value: Scalars['Boolean']['input'];
};

export type ToggleEdge = {
    __typename?: 'ToggleEdge';
    cursor: Scalars['String']['output'];
    node: Toggle;
};

export type ToggleUpdate = {
    id: Scalars['ID']['input'];
    value: Scalars['Boolean']['input'];
};

/** How much the register holds, with how it grew per year. */
export type Totals = {
    __typename?: 'Totals';
    /** Original spex, without revivals. */
    spexCount: Scalars['Long']['output'];
    spexCountHistory: Array<History>;
    spexRevivalCount: Scalars['Long']['output'];
    spexRevivalCountHistory: Array<History>;
    /** The published spexare. */
    spexareCount: Scalars['Long']['output'];
    /** Spexare by the year of their first spex. */
    spexareCountHistory: Array<History>;
    taskCount: Scalars['Long']['output'];
    taskCountByCategory: Array<Bucket>;
    userCount: Scalars['Long']['output'];
    userCountHistory: Array<History>;
};

/** A kind of address, consent, membership, vocal part or toggle, such as HOME, labelled in the caller's language. */
export type Type = {
    __typename?: 'Type';
    id: Scalars['ID']['output'];
    label: Scalars['String']['output'];
    type: TypeType;
};

/** What a Type is a kind of. */
export enum TypeType {
    Address = 'ADDRESS',
    Consent = 'CONSENT',
    Membership = 'MEMBERSHIP',
    Toggle = 'TOGGLE',
    Vocal = 'VOCAL'
}

/** A consent or toggle type and the value to set. */
export type TypeValue = {
    typeId: Scalars['ID']['input'];
    value: Scalars['Boolean']['input'];
};

/** A Keycloak account known to Spexregister. */
export type User = {
    __typename?: 'User';
    /** The Spexregister roles of the Keycloak account. */
    authorities?: Maybe<Array<Maybe<Authority>>>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    email: Scalars['Email']['output'];
    /** The Keycloak subject. */
    externalId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    spexare?: Maybe<Spexare>;
    state?: Maybe<State>;
    /** Only in the result of userCreate. */
    temporaryPassword?: Maybe<Scalars['String']['output']>;
};

export type UserConnection = {
    __typename?: 'UserConnection';
    edges: Array<Maybe<UserEdge>>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export type UserCreate = {
    email: Scalars['Email']['input'];
};

export type UserEdge = {
    __typename?: 'UserEdge';
    cursor: Scalars['String']['output'];
    node: User;
};

export type UserUpdate = {
    email: Scalars['Email']['input'];
    id: Scalars['ID']['input'];
};
