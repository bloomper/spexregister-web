<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read
the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next`
package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at
`node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted
change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Spexregister Web — project notes

Next.js 16 App Router + React 19 frontend for the Chalmersspexet address register, backed by a
separate GraphQL/REST API. Stack and setup: `README.md`. PR process: `CONTRIBUTING.md`.

## Commands

- `npm run dev` / `build` / `start`
- `npm run lint` (ESLint), `npm run typecheck` (tsc) — note typecheck only covers `src/**`, so
  `next.config.ts`, `codegen.ts` and `eslint.config.mts` are *not* type-checked by it.
- `npm run test` (Vitest), `npm run test:e2e` (Playwright)
- `npm run gql-codegen` — regenerate `src/gql/` from the live schema (`API_GRAPHQL_ENDPOINT` in `.env.local`)

CI (`.github/workflows/build.yml`): lint → typecheck → test:coverage → build, then E2E as a
separate job. Node version comes from `.nvmrc`.

**Don't run `npm run format`.** `.prettierrc` sets `tabWidth: 2`, the codebase is 4-space
indented, and `.prettierignore` doesn't exclude `src/` — it would reformat the whole tree.
ESLint enforces double quotes.

## File conventions

- **A module's directive and its filename must agree**, both ways:
    - `"use client"` ⇔ `*.client.ts(x)` — components *and* hooks (`use-lazy-full.client.ts`).
    - `import "server-only"` ⇔ `*.server.ts` (libs, utils).
    - `"use server"` ⇔ `*.server.ts` too — the `actions.server.ts` server-action modules. Don't add
      `server-only` to a `"use server"` file; the directive already pins it to the server.
- Three standing exceptions, all deliberate:
    - `src/auth.ts` — `server-only`, but keeps the conventional Better Auth entry-point name.
    - Next.js reserved filenames (`page.tsx`, `layout.tsx`, `error.tsx`, `global-error.tsx`) cannot
      be renamed, so a `"use client"` one keeps its required name.
    - shadcn-owned files keep their upstream names so `shadcn add` stays a clean overwrite. That is
      `src/components/ui/**` *and* `src/hooks/use-mobile.ts`, which ships with the sidebar component
      and is imported by it as `@/hooks/use-mobile`.
- `src/gql/**` (generated) and `src/components/ui/**` (shadcn) are ESLint-ignored — don't hand-edit.

## Rendering and caching — Cache Components is ON

`cacheComponents: true` in `next.config.ts`. Consult `node_modules/next/dist/docs/` before
changing routing or data fetching; this area differs sharply from older Next.

- `src/app/(app)/layout.tsx` awaits `auth()` and substitutes a logged-out landing page for
  `{children}`, so no `(app)` route renders without a session. It therefore carries
  `export const instant = false`, which also opts the whole `(app)` tree out of static-shell
  validation (the highest `instant` in a tree wins for that check).
- Because that gate makes per-page validation unreachable, `experimental.instantInsights.validationLevel`
  is `"manual-warning"`: only segments that explicitly export `instant` are validated. Add
  `export const instant = true` to a segment to check it on demand.
- **A new route that fetches data at the top of the page needs a `loading.tsx` beside it**, or it
  can't prerender a shell. Reuse `DataTableSkeleton` / `DataGridSkeleton`; see
  `src/app/(app)/tasks/manage/loading.tsx` and `src/app/(app)/news/loading.tsx`.
- The root layout's metadata must stay a **static** `export const metadata`. `/_not-found` inherits
  it, so a `generateMetadata()` that reads cookies (e.g. `getTranslations()`) blocks metadata on
  every route. The locale-correct title is applied client-side in `src/app/provider.client.tsx`.
- `"use cache"` cannot wrap anything reading cookies/headers. Current uses: `getCountries` /
  `getTypes` in `src/lib/settings/settings.server.ts`.

## i18n

- Locale is a **cookie**, not a URL segment — there is no `[locale]` route. `src/i18n/request.ts`
  reads it; `normalizeLocale()` in `src/utils/utils.server.ts` validates it against
  `SUPPORTED_LOCALES` / `DEFAULT_LOCALE` (default `sv`).
- Messages: `messages/{sv,en}.json`. Client-side switching lives in `src/app/provider.client.tsx`
  (`changeLocale` sets the cookie, swaps messages, then `router.refresh()`).

## Auth and authorization

- **Better Auth** (`better-auth@1.7`) + Keycloak, configured in `src/auth.ts` via the
  `genericOAuth` plugin's `keycloak()` helper. There is **no database**: omitting `database`
  puts Better Auth in stateless mode — the session lives in a JWE `better-auth.session_data`
  cookie and the Keycloak access/refresh/id tokens in an encrypted, chunked
  `better-auth.account_data` cookie.
- Discovery runs once at boot and supplies the JWKS used to verify Keycloak's `id_token`.
  `src/auth.ts` also pins the fixed `…/protocol/openid-connect/*` paths explicitly — they are the
  fallback that keeps login working if discovery is unreachable at startup (without them Better
  Auth drops the provider until the server restarts).
- **`getSessionContext()` in `src/utils/auth.server.ts` is the single entry point for server-side
  auth.** It resolves the session, then the Keycloak access token from the account cookie (refreshing when near expiry),
  then decodes the roles out of that token's
  `resource_access.spexregister.roles`. It is wrapped in React `cache()` — the layout, urql, axios
  and every policy check call it within one render. `requireUser()` and `getAccessToken()` are thin
  wrappers over it; a token that cannot be refreshed reads as logged out.
- `src/proxy.ts` (Next 16's middleware file) refreshes the account cookie and forwards the
  resulting `Set-Cookie`. It exists because **RSC renders cannot write cookies** — without it a
  token rotated during a plain navigation would be recomputed every render and never persist. It
  never blocks or redirects.
- Gate server code with `Policies` (`src/utils/policy.server.ts`) plus `withPolicyPage` /
  `withPolicyAction` / `withPolicyRoute` (`src/utils/route.server.ts`). Pages wrap their body in
  `withPolicyPage(Policies.<entity>.require<Op>, async (authz) => …)` — take roles from `authz`
  rather than calling the session again. Don't hand-roll role checks —
  `requireUser` / `requireAnyRole` are in `src/utils/auth.server.ts`. Roles: `USER | EDITOR | ADMIN`.
- Client side: `src/lib/auth-client.ts` (`useSession`, `signOut`); no session provider is needed.
  Logout uses `signOut({disableRedirect: true})` and appends `ui_locales`/`theme` to the returned
  Keycloak `end_session` URL via `appendLogoutParams` (`src/utils/auth.ts`).
- Env: Better Auth reads only `AUTH_SECRET` (legacy alias), `BETTER_AUTH_SECRET`,
  `BETTER_AUTH_SECRETS`, `BETTER_AUTH_TRUSTED_ORIGINS` and `BETTER_AUTH_URL` — Auth.js's
  `AUTH_URL` / `AUTH_TRUST_HOST` do nothing. `NEXT_PUBLIC_AUTH_URL` is inlined at build time (the browser needs it), so
  **`BETTER_AUTH_URL` is the runtime override** that lets a built image
  be retargeted without a rebuild; `src/auth.ts` prefers it. `NEXT_PUBLIC_AUTH_KEYCLOAK_ID` is
  gone — only the server needs the client id now, because Better Auth builds the logout URL.

## Data layer

- Server-side GraphQL goes through `runQuery` / `runMutation` / `runMutationField` / `mutateForData`
  in `src/lib/graphql.server.ts`; the urql client (`src/lib/urql.server.ts`) injects the access token.
- Each entity's client comes from **`createResourceClient`** (same file). It derives field names by
  convention (`${singular}Paged`, `${singular}Create`, …) and returns
  `getPaged/get/getAll/create/update/del/exp/imp/events`. Canonical wiring:
  `src/lib/task/task.server.ts`.
- Mutations invalidate by cache tag (`config.cacheTag` + `revalidateTag`). Server actions live in
  `src/app/(app)/<entity>/actions.server.ts` and validate input with the entity's Zod schema
  (`src/lib/<entity>/schema.ts`) before calling the lib.
- Codegen has two targets (`codegen.ts`): `src/gql/schema.ts` for domain types/enums, and the
  client preset in `src/gql/` for typed `graphql()` documents. Fragment masking is off, and enums
  are re-used from `./schema` so identities match.

## Audit and the change log

- Every revision records **why** it happened, not just what changed: `source` (`WEB | IMPORT |
  RESTORE | SYSTEM`), `operation` and a free-text `comment` on `revinfo`. The server decides
  `source`; the only thing a client contributes is the comment, via an **`X-Audit-Reason`** header —
  use `auditReason()` from `src/lib/graphql.server.ts` and pass it as the mutation context, as the
  restore dialog does so the reason is recorded in the user's language.
- Backend note worth knowing before touching `AuditContext`: Envers creates the revision entity at
  **before-transaction-completion, not at flush**. A try/finally around the writing code releases the
  origin too early and the revision then records the surrounding request instead, so
  `AuditContext.stamp` hands it back via a transaction synchronization.
- `revisionDetail(revision)` is what an expanded change-log row shows: every entity the revision
  touched, each with its field changes and the aggregate root to open. The grouping by that root is
  the "why did this record change" context — a spexare edit and the address it also touched read as
  one change.
- Diffs render through **`AuditDiff`** (`src/components/audit/audit-diff.client.tsx`), shared by the
  change log and the per-entity `AuditTrail`. One trap: a **binary value must be addressed at the
  timeline's entity**, not at the field's owner — that is where the backend authorizes the read and
  where it resolves a field living on a referenced entity (`SPEX` → `SpexDetails.poster`).
- **Deep links**: `auditEntityHref` (`src/utils/audit.ts`) maps an audit target to
  `/<route>?open=<id>` plus `&tab=` for the spexare view. Pages read it with `useDeepLink` /
  `useDeepLinkItem` (`src/hooks/use-deep-link-item.client.ts`). Two things this depends on: every
  linkable route needs a `loading.tsx` (the Suspense boundary `useSearchParams` requires), and the
  params stay in the URL, so a page must treat the link as the *initial* selection and let a later
  choice of its own win — see the derived `selection` state in `spexare-grid.client.tsx`.

## Tables and forms

`@tanstack/react-table` v9 with React Compiler (`reactCompiler: true`). Three traps, all
previously hit in this codebase:

- `useTable()` returns a **new object on every state change**. Never put `table` in a `useEffect`
  dependency array — derive from state instead (see the comment at `src/components/data-table.client.tsx:187`).
- A column's `id` is **not** the backend sort path. Put the entity path in `meta.sortKey`
  (`"category.name"`, `"details.title"`); `getSortKey` reads it. A wrong key silently returns an
  empty page.
- Under React Compiler, a memoized cell reading live `row`/`table` methods off an otherwise stable
  object never updates. Pass primitives as props.

Forms use `react-hook-form` + `zodResolver`.

## Edit queue

Global bulk-edit drawer (`src/components/edit-queue/`) that reuses each entity's own form. Adding
an entity means registering it in `registry.tsx` (form, label, `getById`, optional `fetchFull`).

## Bulk actions

One change applied to many spexare at once (`src/components/bulk/`), separate from the edit queue,
which walks records one at a time.

- The work happens **in the backend** (`nu.fgv.register.server.spexare.bulk`), not as a loop of
  single-record mutations from here. One `@Transactional` service method means Envers writes **one
  revision**, so a bulk action is a single change-log row with a reason — `revisionDetail` then lists
  every record it touched. Looping mutations client-side would produce one revision per record.
- Both APIs sit on the same `SpexareBulkService`, one input and one result type:
  GraphQL `spexareBulkPreview` (query) / `spexareBulkApply` (mutation), REST
  `POST /api/spexare/bulk/preview` / `POST /api/spexare/bulk`. The operation is an enum (`TAG_ADD`, `SPEX_ADD`,
  `CONSENT_SET`, `FIELDS_SET`, …) and decides which payload fields are read.
  `X-Audit-Reason` works on both, since `AuditContextFilter` reads it per HTTP request.
- **Preview and apply run the same code path**, the preview simply not writing, so the counts a
  reader confirms are the counts they get. Per record the outcome is `APPLIED`, `UNCHANGED`
  (already as asked — a skip, not a failure) or `NOT_PERMITTED` (no ACL write permission).
- `BulkTarget` takes **`ids` or `filter`, never both**, mirroring `spexareExport`, so an action can
  run on a whole filtered set without ticking every row. The size cap is checked *before* the rows
  are loaded — a `Spexare` carries an eager image blob.
- The payload's tag/spex/task/type ids are resolved **before the first write**, so a bad id fails the
  batch having changed nothing. The batch is otherwise all-or-nothing: one transaction.
- Adding an operation: the enum case plus a handler in `SpexareBulkService`, then an entry in
  `src/components/bulk/registry.client.tsx` (icon, `isComplete`, a `Fields` component) and its
  `Spexare.bulk.operations.<OP>` message. The toolbar menu and the preview/apply dialog are generic.
  Both APIs pick the new operation up for free; only `spexare-bulk.adoc`'s operation list needs a word.
- Note `BadRequestException` needs `problemDetail.type.*` / `problemDetail.title.*` entries in
  `messages_{sv,en}.properties`; without them `GlobalExceptionResolver` falls through to
  `INTERNAL_ERROR` instead of `BAD_REQUEST`.

## Dashboard and analytics

**One query, `analytics`, covers the whole dashboard** — the former `statistics` query, package,
REST endpoint and `Statistics` message namespace are gone, folded in as the `totals` section.
Rendered on `/analytics`, with a headline slice on `/` (`src/components/analytics/`,
`src/lib/analytics/`).

- `totals` is the old statistics payload verbatim (counts + 3-year `createdAt` trends, the four
  sparkline cards on `/`), computed with criteria queries rather than from the search index.
- **Only the selected sections are computed.** `AnalyticsGraphqlApi` turns the GraphQL selection set
  into `AnalyticsSection`s and the service builds just those; REST has no field selection so
  `/api/analytics` always pays for all six. This is why the home page uses `getSummary()` — a
  narrower document — rather than `get()`: asking for the full fragment would drag the revision
  queries behind `operations` onto every landing. Add a section to the schema *and* to
  `AnalyticsSection`, or it will silently never be built.

- **A chart bucket carries its own drill-down.** `Bucket` has `facet` + `key`, which
  `bucketHref` (`src/utils/analytics.ts`) turns into `/spexare/search?f.<facet>=<key>` — the same
  vocabulary `parseFacetParams` already reads. There is no second mapping to fall out of step.
  A `null` facet means a summary with no list behind it; render it without a link.
- **The counts come from the search index, not from SQL.** `AnalyticsService` reads
  `SpexareService.facets()` — one `matchAll` search returning every aggregation the search page
  filters on — so a bar's number and the rows it opens are the same query, and both obey the
  non-admin `published` restriction. Adding a breakdown usually means adding an aggregation in
  `SpexareSearchEnabledJpaRepository`, not writing a query.
- Two filter values exist only for drilling down, both in that repository:
  `quality` is a **filter-only** facet (no aggregation) whose values are `DataQualityIssue` keys and
  which resolves to a `mustNot(exists(...))` predicate — `countByDataQualityIssue` uses the *same*
  predicate, so tile and list agree. The year facets (`spexYears`, `debutYears`,
  `lastActiveYears`) also accept `2010..2015`, either bound omitted, which is what makes the
  dormancy bands clickable. Note multiple values of one facet still **AND** together.
- **Changing an indexed field needs a reindex.** `debutYear`, `lastActiveYear`, `spexCount` and
  `hasImage` are derived `@GenericField`s on `Spexare`, `Address.country` is now `Aggregable.YES`,
  and `Address` carries an `AddressTypeBinder`. Until the index is rebuilt (the `full-index` cron,
  or `AdminApi`) those aggregations come back empty and the charts are silently blank.
- Sections are **role-nullable**: `dataQuality` is null below EDITOR and `operations` below ADMIN.
  The backend decides; the dashboard just omits the tab. Null means "not for you" — distinct from
  an empty list.
- `dataQuality.complete` is a **bound, not a count** — the total minus the single largest gap. The
  gaps overlap, and counting records free of all of them would be a separate query per combination.
- `dataQuality.total` (the readable population, the denominator for the gap shares) is deliberately **not**
  `totals.spexareCount`, which counts published records only.

## Testing

- Unit: Vitest, tests in `__tests__/` beside the code.
- E2E: Playwright against a real `next build && next start` on port 3100, with
  `e2e/mock-backend.mjs` standing in for the backend on 4100 (wired through `API_*` env in
  `playwright.config.ts`). The same mock also acts as a **mini-Keycloak** (discovery, authorize,
  token, JWKS, userinfo, logout), and `e2e/auth.setup.ts` signs in through a real OIDC
  authorization-code round-trip before saving `storageState`. Better Auth's cookies are encrypted
  blobs with no public minting API, so this is the supported way — don't try to forge them.

## Dependency notes

- `graphql` is on 17.x. `@0no-co/graphql.web` must stay **≥ 1.3.4**: earlier versions cap their
  optional peer range at `^16`, which makes npm install a second nested `graphql@16` under
  `@urql/core` and breaks `npm run typecheck` with `Kind.DOCUMENT` vs `"Document"` mismatches.
