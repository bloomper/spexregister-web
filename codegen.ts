import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: process.env.API_GRAPHQL_ENDPOINT || '',
    documents: ['src/**/*.tsx'],
    ignoreNoDocuments: true,
    generates: {
        './src/gql/': {
            preset: 'client',
            plugins: [],
        },
    },
};

export default config;
