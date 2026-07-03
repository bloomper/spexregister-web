import {createServer} from "node:http";

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

const spexareFull = (s) => ({
    ...s,
    activities: [], addresses: [], consents: [], memberships: [], taggings: [], toggles: [],
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

function spexarePaged(variables) {
    const filter = String(variables?.filter ?? "");
    const m = filter.match(/firstName:\*([^*]+)\*/);
    const term = m ? m[1].toLowerCase() : "";
    const matched = term
        ? spexareList.filter((s) =>
            [s.firstName, s.lastName, s.nickName].some((v) => v && v.toLowerCase().includes(term)))
        : spexareList;

    const start = variables?.after ? Number(variables.after) : 0;
    const first = Number(variables?.first ?? matched.length);
    const slice = matched.slice(start, start + first);
    const end = start + slice.length;
    const pageEdges = slice.map((node, i) => ({cursor: `c${start + i}`, node}));
    return {spexarePaged: {edges: pageEdges, pageInfo: pageInfo(end < matched.length, String(end))}};
}

const paged = (field, items) => ({[field]: {edges: edges(items), pageInfo: pageInfo(false, null)}});

const spexCategoryList = [
    {id: "1", name: "Chalmersspexet", logoUrl: null, firstYear: 1948},
    {id: "2", name: "Veraspexet", logoUrl: null, firstYear: 2002},
];
const spexList = [
    {id: "1", year: 1996, title: "Nobel", posterUrl: null, revival: false, revivals: [], category: {id: "1", name: "Chalmersspexet"}},
    {id: "2", year: 2018, title: "Ada Lovelace", posterUrl: null, revival: false, revivals: [], category: {id: "2", name: "Veraspexet"}},
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
const userList = [
    {id: "1", externalId: "ext-1", email: "admin@example.com", authorities: [{id: "1", label: "ADMIN"}], state: {id: "1", label: "ACTIVE"}, spexare: null},
    {id: "2", externalId: "ext-2", email: "redaktor@example.com", authorities: [{id: "2", label: "EDITOR"}], state: {id: "1", label: "ACTIVE"}, spexare: null},
];

const withAudit = (s) => ({...s, ...audit});

const resolvers = {
    UserMe: () => ({me: {spexare: null}}),
    Authorities: () => ({authorities: []}),
    States: () => ({states: []}),
    Statistics: () => ({statistics}),
    Countries: () => ({countries: [{isoCode: "SE", label: "Sverige"}, {isoCode: "NO", label: "Norge"}]}),
    Types: () => ({types: []}),

    NewsPagedSummary: () => ({newsPaged: {edges: edges(newsList), pageInfo: pageInfo(false, null)}}),
    NewsPagedFull: () => ({newsPaged: {edges: edges(newsList), pageInfo: pageInfo(false, null)}}),

    SpexarePagedSummary: (v) => spexarePaged(v),
    SpexarePagedFull: (v) => spexarePaged(v),
    SpexareGet: (v) => ({spexare: spexareFull(spexareList.find((s) => s.id === String(v?.id)) ?? spexareList[0])}),
    SpexareSearch: (v) => {
        const {spexarePaged: p} = spexarePaged({filter: `firstName:*${v?.q ?? ""}*`});
        return {spexareSearchPaged: {edges: p.edges, pageInfo: pageInfo(false, null), facets: []}};
    },
    SpexareCreate: (v) => ({spexareCreate: spexareFull({...blankSpexare, id: "new-1", ...(v?.input ?? {})})}),
    SpexareUpdate: (v) => ({spexareUpdate: spexareFull({...blankSpexare, id: v?.input?.id ?? "new-1", ...(v?.input ?? {})})}),
    SpexareExport: () => ({spexareExport: {id: "export-job-1"}}),

    TagPagedSummary: () => paged("tagPaged", tagList),
    TagPagedFull: () => paged("tagPaged", tagList.map(withAudit)),
    TagCreate: (v) => ({tagCreate: withAudit({id: "new-tag", name: v?.input?.name ?? ""})}),
    TagUpdate: (v) => ({tagUpdate: withAudit({id: v?.input?.id ?? "new-tag", name: v?.input?.name ?? ""})}),

    TaskPagedSummary: () => paged("taskPaged", taskList),
    TaskPagedFull: () => paged("taskPaged", taskList.map(withAudit)),

    TaskCategoryPagedSummary: () => paged("taskCategoryPaged", taskCategoryList),
    TaskCategoryPagedFull: () => paged("taskCategoryPaged", taskCategoryList.map(withAudit)),

    SpexPagedSummary: () => paged("spexPaged", spexList),
    SpexPagedFull: () => paged("spexPaged", spexList.map(withAudit)),

    SpexCategoryPagedSummary: () => paged("spexCategoryPaged", spexCategoryList),
    SpexCategoryPagedFull: () => paged("spexCategoryPaged", spexCategoryList.map(withAudit)),

    UserPagedSummary: () => paged("userPaged", userList),
    UserPagedFull: () => paged("userPaged", userList.map(withAudit)),

    SpexareEvents: () => ({spexareEvents: []}),

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

function handleRest(req, res) {
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

const server = createServer((req, res) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
        const url = req.url || "";
        if (url.includes("/.well-known/openid-configuration")) {
            res.writeHead(200, {"content-type": "application/json"});
            res.end(JSON.stringify(oidcConfig));
            return;
        }
        if (url.endsWith("/protocol/openid-connect/certs")) {
            res.writeHead(200, {"content-type": "application/json"});
            res.end(JSON.stringify({keys: []}));
            return;
        }
        if (req.method === "POST" && url.includes("/api/graphql")) {
            handleGraphql(Buffer.concat(chunks).toString("utf8"), res);
            return;
        }
        handleRest(req, res);
    });
});

server.listen(PORT, () => {
    console.log(`[mock-backend] listening on http://localhost:${PORT}`);
});
