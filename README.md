# Spexregister Web 2.0

## Overview

Spexregister Web is the second generation of the frontend responsible for serving data related to Spexregister.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Styling:
  ** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/) & [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Fetching:** [urql](https://formidable.com/open-source/urql/) (GraphQL) & [Axios](https://axios-http.com/)
  (REST)
- **State Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Authentication:** [Better Auth](https://better-auth.com/) (Keycloak integration, stateless sessions)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/) (Supports English & Swedish)

## Getting Started

### Prerequisites

- Node.js 26+
- npm (package manager)
- Docker & Docker Compose (optional, for containerized setup)

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create a `.env.local` file based on your environment requirements (API endpoints, Auth secrets).

3. **Generate GraphQL types:**
   If you change GraphQL queries or the schema, regenerate types:
   ```bash
   npm run gql-codegen
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker

The project includes a `Dockerfile` and `docker-compose.yaml` for containerized deployment, including a Caddy reverse
proxy setup for local development with HTTPS.

### Running with Docker Compose

To start the application along with the Caddy reverse proxy:

```bash
docker-compose up --build
```

The application will be accessible via the configured hostnames (e.g., `https://register.fgv.local.nu` if your hosts
file is configured).

### Published images

CI publishes `bloomper/spexregister-web` for `linux/amd64`:

| Trigger              | Tags                              |
|----------------------|-----------------------------------|
| push to `develop`    | `develop`, `sha-<commit>`         |
| push of tag `vX.Y.Z` | `X.Y.Z`, `latest`, `sha-<commit>` |

To release, set `version` in `package.json` to `X.Y.Z`, merge to `main`, then
`git tag vX.Y.Z && git push origin vX.Y.Z`. The publish fails if the tag doesn't match the version or if `X.Y.Z` is
already on Docker Hub.

The image contains no environment-specific values. All configuration is read at runtime: `BETTER_AUTH_URL`,
`AUTH_SECRET`, `AUTH_KEYCLOAK_ID`, `AUTH_KEYCLOAK_SECRET`, `AUTH_KEYCLOAK_ISSUER`, `API_GRAPHQL_ENDPOINT`,
`API_REST_BASE_URL`, `SUPPORT_EMAIL`, `FEEDBACK_EMAIL`, `SUPPORTED_LOCALES` and `DEFAULT_LOCALE`.

## Building and Deployment

### Production Build

To create an optimized production build manually:

```bash
npm run build
npm run start
```

## Contributing

Contributors to this project agree to uphold its [code of conduct][3].

You can contribute to Spexregister Web by:

- Opening a [pull request][4]. Please see the [contributor guidelines][5] for details

## License

Spexregister Web is open source software released under the [Apache 2.0 license][6].

[1]: https://register.fgv.nu/docs/

[2]: https://gradle.org

[3]: CODE_OF_CONDUCT.md

[4]: https://help.github.com/articles/using-pull-requests/

[5]: CONTRIBUTING.md

[6]: https://www.apache.org/licenses/LICENSE-2.0.html

[7]: http://localhost:8080/docs/
