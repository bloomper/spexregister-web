import {createServer} from "node:http";
import {randomUUID} from "node:crypto";
import {exportJWK, generateKeyPair, SignJWT} from "jose";

const PORT = Number(process.env.MOCK_PORT || 4000);

const pageInfo = (hasNextPage = false, endCursor = null) => ({
    hasNextPage,
    hasPreviousPage: false,
    startCursor: null,
    endCursor,
});

const edges = (nodes) => nodes.map((node, i) => ({cursor: `c${i}`, node}));

const blankSpexare = {
    firstName: "", lastName: "", nickName: null, socialSecurityNumber: null,
    deceased: false, published: false, graduation: null, comment: null, imageUrl: null, partner: null,
};

const namedSpexare = [
    {...blankSpexare, id: "1", firstName: "Ada", lastName: "Lovelace", nickName: "Countess", published: true},
    {...blankSpexare, id: "2", firstName: "Alan", lastName: "Turing", deceased: true, published: true},
    {...blankSpexare, id: "3", firstName: "Grace", lastName: "Hopper", nickName: "Amazing Grace", published: true},
];

const extraSpexare = Array.from({length: 27}, (_, k) => {
    const i = k + 3;
    return {...blankSpexare, id: String(i + 1), firstName: "Testperson", lastName: String(i), published: true};
});

export const spexareList = [...namedSpexare, ...extraSpexare];

const audit = {createdAt: "2024-01-01T00:00:00Z", createdBy: "seed", lastModifiedAt: null, lastModifiedBy: null};

// Ada alone gets a career, with a deliberate 2017-2019 gap so the overview strip has
// both filled and empty years to render.
const careerActivities = [
    {year: "2015", title: "Bacchus", category: "Chalmersspexet", task: "Skådespelare", role: "Greve"},
    {year: "2016", title: "Caesar", category: "Chalmersspexet", task: "Skådespelare", role: "Baron"},
    {year: "2020", title: "Dante", category: "Vasaspexet", task: "Orkester", role: null},
].map(({year, title, category, task, role}) => ({
    id: `act-${year}`,
    spexActivity: {
        id: `spexact-${year}`,
        ...audit,
        spex: {
            id: `spex-${year}`, year, title, revival: false, posterUrl: null, parent: null,
            category: {id: "cat-1", name: category, firstYear: "1948", logoUrl: null, ...audit},
            ...audit,
        },
    },
    taskActivities: [{
        id: `taskact-${year}`,
        task: {id: `task-${year}`, name: task, category: null, ...audit},
        actors: role ? [{id: `actor-${year}`, role, vocal: null, ...audit}] : [],
        ...audit,
    }],
    ...audit,
}));

const careerMemberships = [
    {id: "mem-2015", year: "2015", type: {id: "mtype-1", label: "Fullvärdig", type: "MEMBERSHIP"}, ...audit},
    {id: "mem-2020", year: "2020", type: {id: "mtype-2", label: "Stödjande", type: "MEMBERSHIP"}, ...audit},
];

// Grace gets the awkward shape: a 25-year span with long gaps, and two spex in the same
// year, so the strip has to cope with both in the width of a dialog.
const longActivities = [
    {year: "1991", title: "Urspexet", category: "Bobspexet"},
    {year: "2006", title: "Bob", category: "Bobspexet"},
    {year: "2014", title: "Vera I", category: "Veraspexet"},
    {year: "2015", title: "Vera II", category: "Veraspexet"},
    {year: "2015", title: "Bob igen", category: "Bobspexet"},
].map(({year, title, category}, index) => ({
    id: `long-act-${index}`,
    spexActivity: {
        id: `long-spexact-${index}`,
        ...audit,
        spex: {
            id: `long-spex-${index}`, year, title, revival: false, posterUrl: null, parent: null,
            category: {id: `long-cat-${category}`, name: category, firstYear: "1948", logoUrl: null, ...audit},
            ...audit,
        },
    },
    taskActivities: [],
    ...audit,
}));

const longMemberships = [
    {id: "long-mem", year: "1991", type: {id: "mtype-3", label: "FGV", type: "MEMBERSHIP"}, ...audit},
];

const spexareFull = (s) => ({
    ...s,
    activities: s.id === "1" ? careerActivities : s.id === "3" ? longActivities : [],
    memberships: s.id === "1" ? careerMemberships : s.id === "3" ? longMemberships : [],
    addresses: [], consents: [], taggings: [], toggles: [],
    ...audit,
});

const newsList = [
    {id: "1", subject: "Premiär 2026", text: "Biljetterna släpps snart.", visibleFrom: "2026-01-01"},
    {id: "2", subject: "Nya lokaler", text: "Vi har flyttat.", visibleFrom: "2026-02-01"},
];

const statistics = {
    spexareCount: 3, spexareCountHistory: [{label: "2024", count: 2}, {label: "2025", count: 3}],
    userCount: 1, userCountHistory: [{label: "2025", count: 1}],
    spexCount: 4, spexCountHistory: [{label: "2025", count: 4}],
    spexRevivalCount: 1, spexRevivalCountHistory: [{label: "2025", count: 1}],
    taskCount: 5, taskCountHistory: [{label: "2025", count: 5}],
};

// entityId has to resolve in the matching entity list below: the explorer's detail dialogs fetch
// the real entity by that id, and a dangling one leaves the dialog silently empty.
const graphNode = (type, entityId, label, sublabel = null, imageUrl = null, revival = false) =>
    ({id: `${type}:${entityId}`, type, label, sublabel, imageUrl, revival, entityId: String(entityId)});

const graphNodes = [
    graphNode("SPEXARE", "1", "Ada Lovelace", "Countess", "/api/spexare/1/image"),
    graphNode("SPEXARE", "3", "Grace Hopper", "Amazing Grace"),
    graphNode("SPEX", "1", "Bacchus", "2015"),
    graphNode("SPEX", "2", "Bacchus", "1998", null, true),
    graphNode("TASK", "1", "Skådespelare"),
    graphNode("TAG", "1", "Hedersmedlem"),
];

const graphNodeById = Object.fromEntries(graphNodes.map((n) => [n.id, n]));

const graphGroups = {
    "SPEXARE:1": [
        {type: "PARTICIPATION", nodes: [graphNodeById["SPEX:1"]]},
        {type: "FUNCTION", nodes: [graphNodeById["TASK:1"]]},
        {type: "TAG", nodes: [graphNodeById["TAG:1"]]},
        {type: "PARTNER", nodes: [graphNodeById["SPEXARE:3"]]},
    ],
    "SPEX:1": [
        {type: "PARTICIPATION", nodes: [graphNodeById["SPEXARE:1"]]},
        {type: "REVIVAL_OF", nodes: [graphNodeById["SPEX:2"]]},
    ],
    "TAG:1": [
        {type: "TAG", nodes: [graphNodeById["SPEXARE:1"], graphNodeById["SPEXARE:3"]]},
    ],
};

const nameHaystack = (s) => [s.firstName, s.lastName, s.nickName].filter(Boolean).join(" ").toLowerCase();

function spexarePaged(variables) {
    const filter = String(variables?.filter ?? "");
    const m = filter.match(/firstName:\*([^*]+)\*/);
    const term = m ? m[1].toLowerCase() : "";
    // Every whitespace-separated token has to land somewhere in the name fields, rather than
    // the whole term having to sit inside a single one. A full name like "Grace Hopper" spans
    // two fields, and the real backend fuzzy-matches it across all of them.
    const tokens = term.split(/\s+/).filter(Boolean);
    const matched = tokens.length
        ? spexareList.filter((s) => tokens.every((token) => nameHaystack(s).includes(token)))
        : spexareList;

    const sortField = variables?.sort?.[0] ?? "firstName";
    const descending = String(variables?.direction ?? "ASC").toUpperCase() === "DESC";
    const sorted = [...matched].sort((a, b) =>
        String(a[sortField] ?? "").localeCompare(String(b[sortField] ?? ""), "sv"));
    if (descending) {
        sorted.reverse();
    }

    const start = variables?.after ? Number(variables.after) : 0;
    const first = Number(variables?.first ?? matched.length);
    const slice = sorted.slice(start, start + first);
    const end = start + slice.length;
    const pageEdges = slice.map((node, i) => ({cursor: `c${start + i}`, node}));
    return {
        spexarePaged: {
            edges: pageEdges,
            pageInfo: pageInfo(end < matched.length, String(end)),
            totalCount: matched.length,
        },
    };
}

const paged = (field, items) => ({
    [field]: {edges: edges(items), pageInfo: pageInfo(false, null), totalCount: items.length},
});

const single = (field, items, id) => {
    const found = items.find((item) => item.id === String(id));

    return {[field]: found ? withAudit(found) : null};
};

const spexCategoryList = [
    {id: "1", name: "Chalmersspexet", logoUrl: null, firstYear: 1948},
    {id: "2", name: "Veraspexet", logoUrl: null, firstYear: 2002},
];
const spexList = [
    {
        id: "1",
        year: 1996,
        title: "Nobel",
        posterUrl: null,
        revival: false,
        revivals: [],
        category: {id: "1", name: "Chalmersspexet"}
    },
    {
        id: "2",
        year: 2018,
        title: "Ada Lovelace",
        posterUrl: null,
        revival: false,
        revivals: [],
        category: {id: "2", name: "Veraspexet"}
    },
];
const taskCategoryList = [
    {id: "1", name: "Ensemble", actorPresent: true},
    {id: "2", name: "Kommitté", actorPresent: false},
];
const taskList = [
    {id: "1", name: "Ensemblist", category: {id: "1", name: "Ensemble", actorPresent: true}},
    {id: "2", name: "Scenmästare", category: {id: "2", name: "Kommitté", actorPresent: false}},
];
const tagList = [
    {id: "1", name: "Hedersmedlem"},
    {id: "2", name: "Grundare"},
];

function applyTagUpdate(input) {
    const id = String(input?.id ?? "");
    const existing = tagList.find((tag) => tag.id === id);
    if (existing) {
        existing.name = input?.name ?? existing.name;
        return existing;
    }
    const created = {id: id || "new-tag", name: input?.name ?? ""};
    return created;
}

const userList = [
    {
        id: "1",
        externalId: "ext-1",
        email: "admin@example.com",
        authorities: [{id: "1", label: "ADMIN"}],
        state: {id: "1", label: "ACTIVE"},
        spexare: null
    },
    {
        id: "2",
        externalId: "ext-2",
        email: "redaktor@example.com",
        authorities: [{id: "2", label: "EDITOR"}],
        state: {id: "1", label: "ACTIVE"},
        spexare: null
    },
];

const withAudit = (s) => ({...s, ...audit});

// Mutable so a test can save a search and then see it listed.
const savedSearchList = [];

const resolvers = {
    UserMe: () => ({me: {spexare: null}}),
    Authorities: () => ({authorities: []}),
    States: () => ({states: []}),
    Statistics: () => ({statistics}),
    Countries: () => ({countries: [{isoCode: "SE", label: "Sverige"}, {isoCode: "NO", label: "Norge"}]}),
    Types: () => ({types: []}),

    NewsPagedSummary: () => paged("newsPaged", newsList),
    NewsPagedFull: () => paged("newsPaged", newsList),
    NewsUpdate: (v) => ({
        newsUpdate: {
            id: v?.input?.id ?? "1",
            subject: v?.input?.subject ?? "",
            text: v?.input?.text ?? "",
            visibleFrom: v?.input?.visibleFrom ?? null,
            visibleTo: v?.input?.visibleTo ?? null,
            published: v?.input?.published ?? false,
            ...audit,
        },
    }),

    SpexarePagedSummary: (v) => spexarePaged(v),
    SpexarePagedFull: (v) => spexarePaged(v),
    SpexareGet: (v) => ({spexare: spexareFull(spexareList.find((s) => s.id === String(v?.id)) ?? spexareList[0])}),
    // Deliberately asymmetric, to keep both cases reachable from E2E: the summary query
    // (the header badge and the command palette) sees no linked spexare, so the palette
    // spec can assert the profile shortcut is omitted; the full query (/my-profile only)
    // resolves to Ada, so the profile page can be exercised at all.
    SpexareMeSummary: () => ({spexareMe: null}),
    SpexareMeFull: () => ({spexareMe: spexareFull(spexareList[0])}),
    SpexareSearch: (v) => {
        const q = String(v?.q ?? "");
        const {spexarePaged: p} = spexarePaged(q ? {filter: `firstName:*${q}*`} : {});
        const matched = p.edges.map((e) => e.node);

        const filters = Array.isArray(v?.aggregationFilters) ? v.aggregationFilters : [];
        const nodes = filters.reduce(
            (acc, f) => (f?.name === "deceased"
                ? acc.filter((s) => String(Boolean(s.deceased)) === String(f.value))
                : acc),
            matched,
        );

        // Counts are reported over the query-matched set, before the facet narrows it, the
        // way a real faceted search reports them.
        const deceasedFacet = {
            id: "deceased",
            label: "Avliden",
            groups: [{
                id: "deceased",
                label: "Avliden",
                values: [
                    {id: "true", label: "Ja", count: matched.filter((s) => s.deceased).length},
                    {id: "false", label: "Nej", count: matched.filter((s) => !s.deceased).length},
                ],
            }],
        };

        return {
            spexareSearchPaged: {
                edges: nodes.map((node, i) => ({cursor: `c${i}`, node})),
                pageInfo: pageInfo(false, null),
                totalCount: nodes.length,
                facets: [deceasedFacet],
            },
        };
    },
    SpexareCreate: (v) => ({spexareCreate: spexareFull({...blankSpexare, id: "new-1", ...(v?.input ?? {})})}),
    SpexareUpdate: (v) => ({
        spexareUpdate: spexareFull({
            ...blankSpexare,
            id: v?.input?.id ?? "new-1", ...(v?.input ?? {})
        })
    }),
    SpexareExport: () => ({spexareExport: {id: "export-job-1"}}),

    SavedSearches: () => ({savedSearches: savedSearchList}),
    SavedSearchGet: (v) => ({savedSearch: savedSearchList.find((s) => s.id === String(v?.id)) ?? null}),
    SavedSearchCreate: (v) => {
        const created = withAudit({
            id: String(savedSearchList.length + 1),
            name: v?.input?.name ?? "",
            query: v?.input?.query ?? "",
        });
        savedSearchList.push(created);
        return {savedSearchCreate: created};
    },
    SavedSearchUpdate: (v) => {
        const existing = savedSearchList.find((s) => s.id === String(v?.input?.id));
        if (existing) {
            existing.name = v?.input?.name ?? existing.name;
            existing.query = v?.input?.query ?? existing.query;
        }
        return {savedSearchUpdate: existing ?? null};
    },
    SavedSearchDelete: (v) => {
        const index = savedSearchList.findIndex((s) => s.id === String(v?.id));
        if (index >= 0) {
            savedSearchList.splice(index, 1);
        }
        return {savedSearchDelete: null};
    },

    TagPagedSummary: () => paged("tagPaged", tagList),
    TagPagedFull: () => paged("tagPaged", tagList.map(withAudit)),
    TagCreate: (v) => ({tagCreate: withAudit({id: "new-tag", name: v?.input?.name ?? ""})}),
    TagUpdate: (v) => ({tagUpdate: withAudit(applyTagUpdate(v?.input))}),
    TagGet: (v) => {
        const tag = tagList.find((t) => t.id === String(v?.id));
        return {tag: tag ? withAudit(tag) : null};
    },

    TaskPagedSummary: () => paged("taskPaged", taskList),
    TaskPagedFull: () => paged("taskPaged", taskList.map(withAudit)),
    TaskGet: (v) => single("task", taskList, v?.id),

    TaskCategoryPagedSummary: () => paged("taskCategoryPaged", taskCategoryList),
    TaskCategoryPagedFull: () => paged("taskCategoryPaged", taskCategoryList.map(withAudit)),
    TaskCategoryGet: (v) => single("taskCategory", taskCategoryList, v?.id),

    SpexPagedSummary: () => paged("spexPaged", spexList),
    SpexPagedFull: () => paged("spexPaged", spexList.map(withAudit)),
    SpexGet: (v) => single("spex", spexList, v?.id),

    SpexCategoryPagedSummary: () => paged("spexCategoryPaged", spexCategoryList),
    SpexCategoryPagedFull: () => paged("spexCategoryPaged", spexCategoryList.map(withAudit)),
    SpexCategoryGet: (v) => single("spexCategory", spexCategoryList, v?.id),

    UserPagedSummary: () => paged("userPaged", userList),
    UserPagedFull: () => paged("userPaged", userList.map(withAudit)),

    revisions: () => ({
        revisions: [
            {
                revision: 2, type: "TAG", entityId: 1, revisionType: "MOD",
                modifiedAt: audit.createdAt, modifiedBy: "admin@example.com",
                changes: [{field: "name", oldValue: "Hedersledamot", newValue: "Hedersmedlem", binary: false}],
            },
            {
                revision: 1, type: "TAG", entityId: 1, revisionType: "ADD",
                modifiedAt: audit.createdAt, modifiedBy: "admin@example.com", changes: [],
            },
        ],
    }),
    revisionFeedPaged: () => paged("revisionFeedPaged", []),
    restorePreview: () => ({restorePreview: {entries: [], warnings: []}}),
    restore: () => ({restore: {revision: 1, updated: 1, created: 0, deleted: 0, warnings: []}}),

    Jobs: () => ({
        jobs: [{
            id: "job-1", name: "spexareExport", status: "COMPLETED", exitStatus: "COMPLETED",
            createdAt: audit.createdAt, startedAt: audit.createdAt, finishedAt: audit.createdAt,
            hasDownload: true, importResult: null,
        }],
    }),
    JobStatus: (v) => ({
        jobStatus: {
            id: String(v?.id ?? "export-job-1"), name: "spexareExport",
            status: "COMPLETED", exitStatus: "COMPLETED",
        },
    }),

    GraphSearch: (v) => {
        const q = String(v?.q ?? "").trim().toLowerCase();

        // A blank term is answered with a single random node, matching the backend's "surprise me".
        if (!q) {
            return {graphSearch: [graphNodes[0]]};
        }

        return {graphSearch: graphNodes.filter((n) => n.label.toLowerCase().includes(q))};
    },
    GraphNeighbourhood: (v) => {
        const origin = graphNodes.find((n) => n.type === v?.type && String(n.entityId) === String(v?.id));

        if (!origin) {
            return {graphNeighbourhood: null};
        }

        const first = Number(v?.first ?? 25);

        return {
            graphNeighbourhood: {
                origin,
                groups: (graphGroups[origin.id] ?? []).map((group) => ({
                    type: group.type,
                    totalCount: group.nodes.length,
                    nodes: group.nodes.slice(0, first),
                    edges: group.nodes.slice(0, first).map((n) => ({
                        id: `${origin.id}->${n.id}:${group.type}`,
                        source: origin.id, target: n.id, type: group.type, label: null,
                    })),
                })),
            },
        };
    },
    GraphNeighboursPaged: (v) => {
        const origin = graphNodes.find((n) => n.type === v?.type && String(n.entityId) === String(v?.id));
        const group = (graphGroups[origin?.id] ?? []).find((g) => g.type === v?.edge);
        const nodes = group?.nodes ?? [];
        const first = Number(v?.first ?? 25);

        return {
            graphNeighboursPaged: {
                edges: nodes.slice(0, first).map((n, i) => ({cursor: `c${i}`, node: n})),
                pageInfo: {hasNextPage: nodes.length > first, endCursor: `c${Math.min(first, nodes.length) - 1}`},
                totalCount: nodes.length,
            },
        };
    },
};

function operationNameOf(query) {
    const re = /\b(query|mutation|subscription)\s+([A-Za-z0-9_]+)/g;
    let match;
    while ((match = re.exec(query)) !== null) {
        return match[2];
    }
    return null;
}

function handleGraphql(body, res) {
    let payload;
    try {
        payload = JSON.parse(body);
    } catch {
        res.writeHead(400).end('{"errors":[{"message":"bad json"}]}');
        return;
    }
    const op = operationNameOf(payload.query || "");
    const resolver = op && resolvers[op];
    if (!resolver) {
        res.writeHead(200, {"content-type": "application/json"});
        res.end(JSON.stringify({data: {}}));
        return;
    }
    const data = resolver(payload.variables || {});
    res.writeHead(200, {"content-type": "application/json"});
    res.end(JSON.stringify({data}));
}

// A real 16x16 PNG, so the graph's image-sprite path is exercised end to end rather than always
// falling back to the generated icon.
const PIXEL = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR4nGMQ2bGMJMQwqmFUw/DVAAAiOnIQQXml9AAAAABJRU5ErkJggg==", "base64");

function handleRest(req, res) {
    if (/\/(image|poster|logo)$/.test(req.url.split("?")[0])) {
        res.writeHead(200, {"content-type": "image/png", "content-length": PIXEL.length});
        res.end(PIXEL);
        return;
    }

    res.writeHead(200, {"content-type": "application/json"});
    res.end(JSON.stringify({id: "job-1"}));
}

const ISSUER = `http://localhost:${PORT}/realms/e2e`;
const oidcConfig = {
    issuer: ISSUER,
    authorization_endpoint: `${ISSUER}/protocol/openid-connect/auth`,
    token_endpoint: `${ISSUER}/protocol/openid-connect/token`,
    userinfo_endpoint: `${ISSUER}/protocol/openid-connect/userinfo`,
    jwks_uri: `${ISSUER}/protocol/openid-connect/certs`,
    end_session_endpoint: `${ISSUER}/protocol/openid-connect/logout`,
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
};

const KID = "e2e-key";
const CLIENT_ID = "e2e";
const TOKEN_TTL = 3600;

const E2E_USER = {
    sub: "user-1",
    name: "E2E Admin",
    email: "e2e@example.com",
    email_verified: true,
    preferred_username: "e2e",
};

const {privateKey, publicKey} = await generateKeyPair("RS256", {extractable: true});
const publicJwk = {...(await exportJWK(publicKey)), kid: KID, alg: "RS256", use: "sig"};

const pendingCodes = new Map();

const signJwt = (claims, {audience, expiresIn = TOKEN_TTL}) =>
    new SignJWT(claims)
        .setProtectedHeader({alg: "RS256", kid: KID, typ: "JWT"})
        .setIssuer(ISSUER)
        .setSubject(E2E_USER.sub)
        .setAudience(audience)
        .setIssuedAt()
        .setExpirationTime(`${expiresIn}s`)
        .sign(privateKey);

const accessToken = () =>
    signJwt(
        {
            ...E2E_USER,
            typ: "Bearer",
            azp: CLIENT_ID,
            resource_access: {spexregister: {roles: ["ADMIN"]}},
        },
        {audience: "account"},
    );

const idToken = (nonce) =>
    signJwt({...E2E_USER, ...(nonce ? {nonce} : {})}, {audience: CLIENT_ID});

function handleAuthorize(url, res) {
    const redirectUri = url.searchParams.get("redirect_uri");

    if (!redirectUri) {
        res.writeHead(400).end("missing redirect_uri");
        return;
    }

    const code = randomUUID();
    pendingCodes.set(code, url.searchParams.get("nonce"));

    const target = new URL(redirectUri);
    target.searchParams.set("code", code);

    const state = url.searchParams.get("state");
    if (state) {
        target.searchParams.set("state", state);
    }

    res.writeHead(302, {location: target.toString()}).end();
}

async function handleToken(body, res) {
    const params = new URLSearchParams(body);
    const grantType = params.get("grant_type");

    let nonce = null;
    if (grantType === "authorization_code") {
        const code = params.get("code");
        if (!pendingCodes.has(code)) {
            res.writeHead(400, {"content-type": "application/json"});
            res.end(JSON.stringify({error: "invalid_grant"}));
            return;
        }
        nonce = pendingCodes.get(code);
        pendingCodes.delete(code);
    }

    res.writeHead(200, {"content-type": "application/json"});
    res.end(JSON.stringify({
        access_token: await accessToken(),
        id_token: await idToken(nonce),
        refresh_token: `refresh-${randomUUID()}`,
        token_type: "Bearer",
        expires_in: TOKEN_TTL,
        scope: "openid profile email",
    }));
}

function handleLogout(url, res) {
    const redirectUri = url.searchParams.get("post_logout_redirect_uri");
    res.writeHead(302, {location: redirectUri || `http://localhost:${PORT}/`}).end();
}

const server = createServer((req, res) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", async () => {
        const raw = req.url || "";
        const url = new URL(raw, `http://localhost:${PORT}`);
        const path = url.pathname;

        if (path.endsWith("/.well-known/openid-configuration")) {
            res.writeHead(200, {"content-type": "application/json"});
            res.end(JSON.stringify(oidcConfig));
            return;
        }
        if (path.endsWith("/protocol/openid-connect/certs")) {
            res.writeHead(200, {"content-type": "application/json"});
            res.end(JSON.stringify({keys: [publicJwk]}));
            return;
        }
        if (path.endsWith("/protocol/openid-connect/auth")) {
            handleAuthorize(url, res);
            return;
        }
        if (path.endsWith("/protocol/openid-connect/token")) {
            await handleToken(Buffer.concat(chunks).toString("utf8"), res);
            return;
        }
        if (path.endsWith("/protocol/openid-connect/userinfo")) {
            res.writeHead(200, {"content-type": "application/json"});
            res.end(JSON.stringify(E2E_USER));
            return;
        }
        if (path.endsWith("/protocol/openid-connect/logout")) {
            handleLogout(url, res);
            return;
        }
        if (req.method === "POST" && path.includes("/api/graphql")) {
            handleGraphql(Buffer.concat(chunks).toString("utf8"), res);
            return;
        }
        handleRest(req, res);
    });
});

server.listen(PORT, () => {
    console.log(`[mock-backend] listening on http://localhost:${PORT}`);
});
