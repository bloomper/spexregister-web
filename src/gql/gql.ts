/* eslint-disable */
import * as types from './graphql';
import {TypedDocumentNode as DocumentNode} from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    fragment TaggingSummary on Tag {\n        id\n        name\n    }\n": typeof types.TaggingSummaryFragmentDoc,
    "\n    fragment TaggingFull on Tag {\n        ...TaggingSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n    \n": typeof types.TaggingFullFragmentDoc,
    "\n    fragment StatisticsFields on Statistics {\n        spexareCount\n        spexareCountHistory {\n            label\n            count\n        }\n        userCount\n        userCountHistory {\n            label\n            count\n        }\n        spexCount\n        spexCountHistory {\n            label\n            count\n        }\n        spexRevivalCount\n        spexRevivalCountHistory {\n            label\n            count\n        }\n        taskCount\n        taskCountHistory {\n            label\n            count\n        }\n    }\n": typeof types.StatisticsFieldsFragmentDoc,
    "\n    query Statistics {\n        statistics {\n            ...StatisticsFields\n        }\n    }\n    \n": typeof types.StatisticsDocument,
};
const documents: Documents = {
    "\n    fragment TaggingSummary on Tag {\n        id\n        name\n    }\n": types.TaggingSummaryFragmentDoc,
    "\n    fragment TaggingFull on Tag {\n        ...TaggingSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n    \n": types.TaggingFullFragmentDoc,
    "\n    fragment StatisticsFields on Statistics {\n        spexareCount\n        spexareCountHistory {\n            label\n            count\n        }\n        userCount\n        userCountHistory {\n            label\n            count\n        }\n        spexCount\n        spexCountHistory {\n            label\n            count\n        }\n        spexRevivalCount\n        spexRevivalCountHistory {\n            label\n            count\n        }\n        taskCount\n        taskCountHistory {\n            label\n            count\n        }\n    }\n": types.StatisticsFieldsFragmentDoc,
    "\n    query Statistics {\n        statistics {\n            ...StatisticsFields\n        }\n    }\n    \n": types.StatisticsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaggingSummary on Tag {\n        id\n        name\n    }\n"): (typeof documents)["\n    fragment TaggingSummary on Tag {\n        id\n        name\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment TaggingFull on Tag {\n        ...TaggingSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n    \n"): (typeof documents)["\n    fragment TaggingFull on Tag {\n        ...TaggingSummary\n        createdAt\n        createdBy\n        lastModifiedAt\n        lastModifiedBy\n    }\n    \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    fragment StatisticsFields on Statistics {\n        spexareCount\n        spexareCountHistory {\n            label\n            count\n        }\n        userCount\n        userCountHistory {\n            label\n            count\n        }\n        spexCount\n        spexCountHistory {\n            label\n            count\n        }\n        spexRevivalCount\n        spexRevivalCountHistory {\n            label\n            count\n        }\n        taskCount\n        taskCountHistory {\n            label\n            count\n        }\n    }\n"): (typeof documents)["\n    fragment StatisticsFields on Statistics {\n        spexareCount\n        spexareCountHistory {\n            label\n            count\n        }\n        userCount\n        userCountHistory {\n            label\n            count\n        }\n        spexCount\n        spexCountHistory {\n            label\n            count\n        }\n        spexRevivalCount\n        spexRevivalCountHistory {\n            label\n            count\n        }\n        taskCount\n        taskCountHistory {\n            label\n            count\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Statistics {\n        statistics {\n            ...StatisticsFields\n        }\n    }\n    \n"): (typeof documents)["\n    query Statistics {\n        statistics {\n            ...StatisticsFields\n        }\n    }\n    \n"];

export function graphql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;