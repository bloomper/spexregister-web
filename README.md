# Spexregister Web 2.0

## Overview

Spexregister Web is the second generation of the frontend responsible for serving data related to Spexregister.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Styling:
  ** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/) & [Tailwind CSS 4](https://tailwindcss.com/)
- **Data Fetching:** [urql](https://formidable.com/open-source/urql/) (GraphQL) & [Axios](https://axios-http.com/) (
  REST)
- **State Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Keycloak integration)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/) (Supports English & Swedish)

## Getting Started

### Prerequisites

- Node.js 24+
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
