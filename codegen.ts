import {CodegenConfig} from "@graphql-codegen/cli";

const enumValues = {
    AuditedType: "./schema#AuditedType",
    ImpexType: "./schema#ImpexType",
    ReportType: "./schema#ReportType",
    RestoreAction: "./schema#RestoreAction",
    RevisionType: "./schema#RevisionType",
    SortDirection: "./schema#SortDirection",
    TypeType: "./schema#TypeType",
};

const config: CodegenConfig = {
    schema: process.env.API_GRAPHQL_ENDPOINT || "",
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
