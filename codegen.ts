import { CodegenConfig } from "@graphql-codegen/cli";

const enumValues = {
  AuditedType: "./schema#AuditedType",
  AuditSource: "./schema#AuditSource",
  BulkOutcome: "./schema#BulkOutcome",
  GraphEdgeType: "./schema#GraphEdgeType",
  GraphNodeType: "./schema#GraphNodeType",
  ImpexType: "./schema#ImpexType",
  MaintenanceJob: "./schema#MaintenanceJob",
  ReportType: "./schema#ReportType",
  RestoreAction: "./schema#RestoreAction",
  RevisionType: "./schema#RevisionType",
  SortDirection: "./schema#SortDirection",
  SpexareBulkOperation: "./schema#SpexareBulkOperation",
  TypeType: "./schema#TypeType",
};

// Introspection is off on the server, so the schema is read from a sibling spexregister-server checkout. The output in
// src/gql/ is committed, so CI needs no sibling. Run `npm run gql-codegen` after every schema change.
const schema = process.env.GRAPHQL_SCHEMA ?? "../spexregister-server/src/main/resources/graphql/*.graphqls";

const config: CodegenConfig = {
  schema,
  documents: ["src/**/*.{ts,tsx}", "!src/gql/**"],
  ignoreNoDocuments: true,
  generates: {
    // Full schema object types + real enums. The app imports domain types
    // (`Spexare`, `Revision`, `SortDirection`, …) from `@/gql/schema`.
    "./src/gql/schema.ts": {
      plugins: ["typescript"],
      config: {
        defaultScalarType: "any",
      },
    },
    // Typed `graphql()` documents (client-preset). Operation/variable/input types
    // live here; enums are re-used from `./schema` so they share identity with the
    // domain code. Fragment masking is off for now.
    "./src/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        enumValues,
        defaultScalarType: "any",
      },
      plugins: [],
    },
  },
};

export default config;
