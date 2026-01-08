/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string; }
    String: { input: string; output: string; }
    Boolean: { input: boolean; output: boolean; }
    Int: { input: number; output: number; }
    Float: { input: number; output: number; }
    /** The CountryCode scalar type as defined by ISO 3166-1 alpha-2. */
    CountryCode: { input: any; output: any; }
    /** An RFC-3339 compliant Full Date Scalar */
    Date: { input: any; output: any; }
    /** A slightly refined version of RFC-3339 compliant DateTime Scalar */
    DateTime: { input: any; output: any; }
    Email: { input: any; output: any; }
    /** A custom scalar that handles Java 8 Instant types */
    Instant: { input: any; output: any; }
    /** A IETF BCP 47 language tag */
    Locale: { input: any; output: any; }
    /** A 64-bit signed integer */
    Long: { input: any; output: any; }
    SocialSecurityNumber: { input: any; output: any; }
    /** A custom scalar that represents the null value */
    Void: { input: any; output: any; }
    Year: { input: any; output: any; }
};

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


export type ActivityTaskActivitiesPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type ActivityConnection = {
    __typename?: 'ActivityConnection';
    edges: Array<Maybe<ActivityEdge>>;
    pageInfo: PageInfo;
};

export type ActivityEdge = {
    __typename?: 'ActivityEdge';
    cursor: Scalars['String']['output'];
    node: Activity;
};

export type Actor = {
    __typename?: 'Actor';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    role?: Maybe<Scalars['String']['output']>;
    vocal?: Maybe<Type>;
};

export type ActorConnection = {
    __typename?: 'ActorConnection';
    edges: Array<Maybe<ActorEdge>>;
    pageInfo: PageInfo;
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

export type Address = {
    __typename?: 'Address';
    city?: Maybe<Scalars['String']['output']>;
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

export type Authority = {
    __typename?: 'Authority';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    label: Scalars['String']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
};

export type Consent = {
    __typename?: 'Consent';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    type: Type;
    value: Scalars['Boolean']['output'];
};

export type ConsentConnection = {
    __typename?: 'ConsentConnection';
    edges: Array<Maybe<ConsentEdge>>;
    pageInfo: PageInfo;
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

export type Country = {
    __typename?: 'Country';
    isoCode: Scalars['CountryCode']['output'];
    label?: Maybe<Scalars['String']['output']>;
};

export type Event = {
    __typename?: 'Event';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    event: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    source: Scalars['String']['output'];
};

export type Facet = {
    __typename?: 'Facet';
    name: Scalars['String']['output'];
    values: Array<Maybe<FacetValue>>;
};

export type FacetValue = {
    __typename?: 'FacetValue';
    count: Scalars['Int']['output'];
    value: Scalars['String']['output'];
};

export type History = {
    __typename?: 'History';
    count: Scalars['Long']['output'];
    label: Scalars['String']['output'];
};

export type Language = {
    __typename?: 'Language';
    isoCode: Scalars['Locale']['output'];
    label?: Maybe<Scalars['String']['output']>;
};

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
    activityCreate?: Maybe<Activity>;
    activityDelete?: Maybe<Scalars['Void']['output']>;
    actorCreate?: Maybe<Actor>;
    actorDelete?: Maybe<Scalars['Void']['output']>;
    actorUpdate?: Maybe<Actor>;
    addressCreate?: Maybe<Address>;
    addressDelete?: Maybe<Scalars['Void']['output']>;
    addressUpdate?: Maybe<Address>;
    consentCreate?: Maybe<Consent>;
    consentDelete?: Maybe<Scalars['Void']['output']>;
    consentUpdate?: Maybe<Consent>;
    membershipCreate?: Maybe<Membership>;
    membershipDelete?: Maybe<Scalars['Void']['output']>;
    newsCreate?: Maybe<News>;
    newsDelete?: Maybe<Scalars['Void']['output']>;
    newsUpdate?: Maybe<News>;
    noOp?: Maybe<Scalars['Void']['output']>;
    spexActivityCreate?: Maybe<SpexActivity>;
    spexActivityDelete?: Maybe<Scalars['Void']['output']>;
    spexActivityUpdate?: Maybe<SpexActivity>;
    spexCategoryAdd?: Maybe<Scalars['Void']['output']>;
    spexCategoryCreate?: Maybe<SpexCategory>;
    spexCategoryDelete?: Maybe<Scalars['Void']['output']>;
    spexCategoryLogoDelete?: Maybe<Scalars['Void']['output']>;
    spexCategoryRemove?: Maybe<Scalars['Void']['output']>;
    spexCategoryUpdate?: Maybe<SpexCategory>;
    spexCreate?: Maybe<Spex>;
    spexDelete?: Maybe<Scalars['Void']['output']>;
    spexPosterDelete?: Maybe<Scalars['Void']['output']>;
    spexRevivalCreate?: Maybe<SpexRevival>;
    spexRevivalDelete?: Maybe<Scalars['Void']['output']>;
    spexUpdate?: Maybe<Spex>;
    spexareCreate?: Maybe<Spexare>;
    spexareDelete?: Maybe<Scalars['Void']['output']>;
    spexareImageDelete?: Maybe<Scalars['Void']['output']>;
    spexarePartnerAdd?: Maybe<Scalars['Void']['output']>;
    spexarePartnerRemove?: Maybe<Scalars['Void']['output']>;
    spexareUpdate?: Maybe<Spexare>;
    tagCreate?: Maybe<Tag>;
    tagDelete?: Maybe<Scalars['Void']['output']>;
    tagUpdate?: Maybe<Tag>;
    taggingCreate?: Maybe<Scalars['Void']['output']>;
    taggingDelete?: Maybe<Scalars['Void']['output']>;
    taskActivityCreate?: Maybe<TaskActivity>;
    taskActivityDelete?: Maybe<Scalars['Void']['output']>;
    taskActivityUpdate?: Maybe<TaskActivity>;
    taskCategoryAdd?: Maybe<Scalars['Void']['output']>;
    taskCategoryCreate?: Maybe<TaskCategory>;
    taskCategoryDelete?: Maybe<Scalars['Void']['output']>;
    taskCategoryRemove?: Maybe<Scalars['Void']['output']>;
    taskCategoryUpdate?: Maybe<TaskCategory>;
    taskCreate?: Maybe<Task>;
    taskDelete?: Maybe<Scalars['Void']['output']>;
    taskUpdate?: Maybe<Task>;
    toggleCreate?: Maybe<Toggle>;
    toggleDelete?: Maybe<Scalars['Void']['output']>;
    toggleUpdate?: Maybe<Toggle>;
    userAuthoritiesAdd?: Maybe<Scalars['Void']['output']>;
    userAuthoritiesRemove?: Maybe<Scalars['Void']['output']>;
    userAuthorityAdd?: Maybe<Scalars['Void']['output']>;
    userAuthorityRemove?: Maybe<Scalars['Void']['output']>;
    userCreate?: Maybe<User>;
    userDelete?: Maybe<Scalars['Void']['output']>;
    userSpexareAdd?: Maybe<Scalars['Void']['output']>;
    userSpexareRemove?: Maybe<Scalars['Void']['output']>;
    userStateSet?: Maybe<Scalars['Void']['output']>;
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


export type MutationSpexareCreateArgs = {
    input: SpexareCreate;
};


export type MutationSpexareDeleteArgs = {
    id: Scalars['ID']['input'];
};


export type MutationSpexareImageDeleteArgs = {
    id: Scalars['ID']['input'];
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

export type News = {
    __typename?: 'News';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    published?: Maybe<Scalars['Boolean']['output']>;
    subject: Scalars['String']['output'];
    text: Scalars['String']['output'];
    visibleFrom?: Maybe<Scalars['Date']['output']>;
    visibleTo?: Maybe<Scalars['Date']['output']>;
};

export type NewsConnection = {
    __typename?: 'NewsConnection';
    edges: Array<Maybe<NewsEdge>>;
    pageInfo: PageInfo;
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

export type PageInfo = {
    __typename?: 'PageInfo';
    endCursor?: Maybe<Scalars['String']['output']>;
    hasNextPage: Scalars['Boolean']['output'];
    hasPreviousPage: Scalars['Boolean']['output'];
    startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
    __typename?: 'Query';
    authorities?: Maybe<Array<Maybe<Authority>>>;
    authority?: Maybe<Authority>;
    countries?: Maybe<Array<Maybe<Country>>>;
    country?: Maybe<Country>;
    event?: Maybe<Event>;
    events?: Maybe<Array<Maybe<Event>>>;
    language?: Maybe<Language>;
    languages?: Maybe<Array<Maybe<Language>>>;
    me?: Maybe<User>;
    news?: Maybe<News>;
    newsEvents?: Maybe<Array<Maybe<Event>>>;
    newsPaged?: Maybe<NewsConnection>;
    noOp?: Maybe<Scalars['Void']['output']>;
    sessionEvents?: Maybe<Array<Maybe<Event>>>;
    spex?: Maybe<Spex>;
    spexCategory?: Maybe<SpexCategory>;
    spexCategoryEvents?: Maybe<Array<Maybe<Event>>>;
    spexCategoryPaged?: Maybe<SpexCategoryConnection>;
    spexEvents?: Maybe<Array<Maybe<Event>>>;
    spexPaged?: Maybe<SpexConnection>;
    spexRevival?: Maybe<Spex>;
    spexare?: Maybe<Spexare>;
    spexareEvents?: Maybe<Array<Maybe<Event>>>;
    spexarePaged?: Maybe<SpexareConnection>;
    spexareSearchPaged?: Maybe<SpexareWithFacetsConnection>;
    state?: Maybe<State>;
    states?: Maybe<Array<Maybe<State>>>;
    statistics?: Maybe<Statistics>;
    tag?: Maybe<Tag>;
    tagEvents?: Maybe<Array<Maybe<Event>>>;
    tagPaged?: Maybe<TagConnection>;
    task?: Maybe<Task>;
    taskCategory?: Maybe<TaskCategory>;
    taskCategoryEvents?: Maybe<Array<Maybe<Event>>>;
    taskCategoryPaged?: Maybe<TaskCategoryConnection>;
    taskEvents?: Maybe<Array<Maybe<Event>>>;
    taskPaged?: Maybe<TaskConnection>;
    type?: Maybe<Type>;
    types?: Maybe<Array<Maybe<Type>>>;
    typesOfType?: Maybe<Array<Maybe<Type>>>;
    user?: Maybe<User>;
    userEvents?: Maybe<Array<Maybe<Event>>>;
    userPaged?: Maybe<UserConnection>;
};


export type QueryAuthoritiesArgs = {
    direction?: InputMaybe<SortDirection>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryAuthorityArgs = {
    id: Scalars['ID']['input'];
};


export type QueryCountryArgs = {
    isoCode: Scalars['CountryCode']['input'];
};


export type QueryEventArgs = {
    id: Scalars['ID']['input'];
};


export type QueryEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryLanguageArgs = {
    isoCode: Scalars['Locale']['input'];
};


export type QueryNewsArgs = {
    id: Scalars['ID']['input'];
};


export type QueryNewsEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryNewsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QuerySessionEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySpexArgs = {
    id: Scalars['ID']['input'];
};


export type QuerySpexCategoryArgs = {
    id: Scalars['ID']['input'];
};


export type QuerySpexCategoryEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySpexCategoryPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QuerySpexEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySpexPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QuerySpexRevivalArgs = {
    id: Scalars['ID']['input'];
    spexId: Scalars['ID']['input'];
};


export type QuerySpexareArgs = {
    id: Scalars['ID']['input'];
};


export type QuerySpexareEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySpexarePagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QuerySpexareSearchPagedArgs = {
    direction?: InputMaybe<SortDirection>;
    limit?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    q: Scalars['String']['input'];
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryStateArgs = {
    id: Scalars['ID']['input'];
};


export type QueryStatesArgs = {
    direction?: InputMaybe<SortDirection>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTagArgs = {
    id: Scalars['ID']['input'];
};


export type QueryTagEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTagPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTaskArgs = {
    id: Scalars['ID']['input'];
};


export type QueryTaskCategoryArgs = {
    id: Scalars['ID']['input'];
};


export type QueryTaskCategoryEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTaskCategoryPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTaskEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTaskPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type QueryTypeArgs = {
    id: Scalars['ID']['input'];
};


export type QueryTypesOfTypeArgs = {
    type: TypeType;
};


export type QueryUserArgs = {
    id: Scalars['ID']['input'];
};


export type QueryUserEventsArgs = {
    sinceInDays?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum SortDirection {
    Asc = 'ASC',
    Desc = 'DESC'
}

export type Spex = {
    __typename?: 'Spex';
    category?: Maybe<SpexCategory>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    parent?: Maybe<SpexParent>;
    posterUrl?: Maybe<Scalars['String']['output']>;
    revival?: Maybe<Scalars['Boolean']['output']>;
    revivals?: Maybe<Array<Maybe<SpexRevival>>>;
    revivalsPaged?: Maybe<SpexRevivalConnection>;
    title: Scalars['String']['output'];
    year: Scalars['Year']['output'];
};


export type SpexRevivalsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SpexActivity = {
    __typename?: 'SpexActivity';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    spex: Spex;
};

export type SpexCategory = {
    __typename?: 'SpexCategory';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    firstYear: Scalars['Year']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    logoUrl?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
};

export type SpexCategoryConnection = {
    __typename?: 'SpexCategoryConnection';
    edges: Array<Maybe<SpexCategoryEdge>>;
    pageInfo: PageInfo;
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

export type SpexParent = {
    __typename?: 'SpexParent';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    year: Scalars['Year']['output'];
};

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
    imageUrl?: Maybe<Scalars['String']['output']>;
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    lastName: Scalars['String']['output'];
    memberships?: Maybe<Array<Maybe<Membership>>>;
    membershipsPaged?: Maybe<MembershipConnection>;
    nickName?: Maybe<Scalars['String']['output']>;
    partner?: Maybe<SpexarePartner>;
    published: Scalars['Boolean']['output'];
    socialSecurityNumber?: Maybe<Scalars['SocialSecurityNumber']['output']>;
    taggings?: Maybe<Array<Maybe<Tag>>>;
    taggingsPaged?: Maybe<TagConnection>;
    toggles?: Maybe<Array<Maybe<Toggle>>>;
    togglesPaged?: Maybe<ToggleConnection>;
};


export type SpexareActivitiesPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SpexareAddressesPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SpexareConsentsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SpexareMembershipsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SpexareTaggingsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type SpexareTogglesPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type SpexareConnection = {
    __typename?: 'SpexareConnection';
    edges: Array<Maybe<SpexareEdge>>;
    pageInfo: PageInfo;
};

export type SpexareCreate = {
    deceased: Scalars['Boolean']['input'];
    firstName: Scalars['String']['input'];
    lastName: Scalars['String']['input'];
    nickName?: InputMaybe<Scalars['String']['input']>;
    published: Scalars['Boolean']['input'];
};

export type SpexareEdge = {
    __typename?: 'SpexareEdge';
    cursor: Scalars['String']['output'];
    node: Spexare;
};

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

export type SpexareWithFacetsConnection = {
    __typename?: 'SpexareWithFacetsConnection';
    edges?: Maybe<Array<Maybe<SpexareEdge>>>;
    facets?: Maybe<Array<Maybe<Facet>>>;
    pageInfo?: Maybe<PageInfo>;
};

export type State = {
    __typename?: 'State';
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    label: Scalars['String']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
};

export type Statistics = {
    __typename?: 'Statistics';
    spexCount?: Maybe<Scalars['Long']['output']>;
    spexCountHistory?: Maybe<Array<Maybe<History>>>;
    spexRevivalCount?: Maybe<Scalars['Long']['output']>;
    spexRevivalCountHistory?: Maybe<Array<Maybe<History>>>;
    spexareCount?: Maybe<Scalars['Long']['output']>;
    spexareCountHistory?: Maybe<Array<Maybe<History>>>;
    taskCount?: Maybe<Scalars['Long']['output']>;
    taskCountHistory?: Maybe<Array<Maybe<History>>>;
    userCount?: Maybe<Scalars['Long']['output']>;
    userCountHistory?: Maybe<Array<Maybe<History>>>;
};

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

export type TaskActivity = {
    __typename?: 'TaskActivity';
    actors?: Maybe<Array<Maybe<Actor>>>;
    actorsPaged?: Maybe<ActorConnection>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    task: Task;
};


export type TaskActivityActorsPagedArgs = {
    after?: InputMaybe<Scalars['String']['input']>;
    before?: InputMaybe<Scalars['String']['input']>;
    direction?: InputMaybe<SortDirection>;
    filter?: InputMaybe<Scalars['String']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type TaskActivityConnection = {
    __typename?: 'TaskActivityConnection';
    edges: Array<Maybe<TaskActivityEdge>>;
    pageInfo: PageInfo;
};

export type TaskActivityEdge = {
    __typename?: 'TaskActivityEdge';
    cursor: Scalars['String']['output'];
    node: TaskActivity;
};

export type TaskCategory = {
    __typename?: 'TaskCategory';
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

export type Type = {
    __typename?: 'Type';
    id: Scalars['ID']['output'];
    label: Scalars['String']['output'];
    type: TypeType;
};

export enum TypeType {
    Address = 'ADDRESS',
    Consent = 'CONSENT',
    Membership = 'MEMBERSHIP',
    Toggle = 'TOGGLE',
    Vocal = 'VOCAL'
}

export type User = {
    __typename?: 'User';
    authorities?: Maybe<Array<Maybe<Authority>>>;
    createdAt: Scalars['Instant']['output'];
    createdBy: Scalars['String']['output'];
    email: Scalars['Email']['output'];
    externalId: Scalars['ID']['output'];
    id: Scalars['ID']['output'];
    lastModifiedAt?: Maybe<Scalars['Instant']['output']>;
    lastModifiedBy?: Maybe<Scalars['String']['output']>;
    spexare?: Maybe<Spexare>;
    state?: Maybe<State>;
    temporaryPassword?: Maybe<Scalars['String']['output']>;
};

export type UserConnection = {
    __typename?: 'UserConnection';
    edges: Array<Maybe<UserEdge>>;
    pageInfo: PageInfo;
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
