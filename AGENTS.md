<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

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

- `*.client.tsx` = Client Component; `*.server.ts` = server-only module (starts with `import "server-only"`).
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

- Auth.js v5 (`next-auth@5` beta) + Keycloak, configured in `src/auth.ts`. Token refresh happens in
  the `jwt` callback via `src/lib/auth-tokens.ts`; a failed refresh sets
  `session.error = "RefreshTokenError"`.
- `src/proxy.ts` (Next 16's middleware file) runs `auth` on nearly every request.
- Gate server code with `Policies` (`src/utils/policy.server.ts`) plus `withPolicyPage` /
  `withPolicyAction` / `withPolicyRoute` (`src/utils/route.server.ts`). Pages wrap their body in
  `withPolicyPage(Policies.<entity>.require<Op>, async () => …)`. Don't hand-roll role checks —
  `requireUser` / `requireAnyRole` are in `src/utils/auth.server.ts`. Roles: `USER | EDITOR | ADMIN`.

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

## Tables and forms

`@tanstack/react-table` v9 with React Compiler (`reactCompiler: true`). Three traps, all
previously hit in this codebase:

- `useTable()` returns a **new object on every state change**. Never put `table` in a `useEffect`
  dependency array — derive from state instead (see the comment at `src/components/data-table.client.tsx:171`).
- A column's `id` is **not** the backend sort path. Put the entity path in `meta.sortKey`
  (`"category.name"`, `"details.title"`); `getSortKey` reads it. A wrong key silently returns an
  empty page.
- Under React Compiler, a memoized cell reading live `row`/`table` methods off an otherwise stable
  object never updates. Pass primitives as props.

Forms use `react-hook-form` + `zodResolver`.

## Edit queue

Global bulk-edit drawer (`src/components/edit-queue/`) that reuses each entity's own form. Adding
an entity means registering it in `registry.tsx` (form, label, `getById`, optional `fetchFull`).

## Testing

- Unit: Vitest, tests in `__tests__/` beside the code.
- E2E: Playwright against a real `next build && next start` on port 3100, with
  `e2e/mock-backend.mjs` standing in for the backend on 4100 (wired through `API_*` env in
  `playwright.config.ts`). Auth is a session cookie minted directly in `e2e/auth.setup.ts` — no
  Keycloak round-trip.

## Dependency notes

- `graphql` is on 17.x. `@0no-co/graphql.web` must stay **≥ 1.3.4**: earlier versions cap their
  optional peer range at `^16`, which makes npm install a second nested `graphql@16` under
  `@urql/core` and breaks `npm run typecheck` with `Kind.DOCUMENT` vs `"Document"` mismatches.
