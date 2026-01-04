import 'server-only';

import {cacheExchange, createClient, fetchExchange} from '@urql/core';
import {registerUrql} from '@urql/next/rsc';
import {auth} from '@/auth';
import {authExchange} from "@urql/exchange-auth";

const makeClient = () => {
    return createClient({
        url: process.env.API_GRAPHQL_ENDPOINT || '',
        exchanges: [
            cacheExchange,
            authExchange(async (utils) => {
                let token: string | null = null;

                return {
                    addAuthToOperation(operation) {
                        if (!token) {
                            return operation;
                        }

                        return utils.appendHeaders(operation, {
                            Authorization: `Bearer ${token}`,
                        });
                    },

                    didAuthError(error) {
                        return error.graphQLErrors.some(
                            (e) =>
                                e.extensions?.code === 'UNAUTHENTICATED' ||
                                e.extensions?.code === 'UNAUTHORIZED'
                        );
                    },

                    async refreshAuth() {
                        const session = await auth();

                        if (session?.error === "RefreshTokenError") {
                            token = null;
                            return;
                        }

                        token = session?.access_token || null;
                    },

                    willAuthError(_operation) {
                        return !token;
                    },
                };
            }),
            fetchExchange
        ],
        preferGetMethod: false,
    });
};

export const {getClient} = registerUrql(makeClient);
