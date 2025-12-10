import nextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import type { User } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        error?: "RefreshTokenError"
        access_token: string
        expires_at: number
        refresh_token?: string
    }
}

export const {handlers, auth, signIn, signOut} = nextAuth({
    debug: process.env.NODE_ENV === 'development',
    providers: [Keycloak],
    callbacks: {
        async jwt({token, account, user}) {
            if (account?.expires_at) {
                token.expires_at = account.expires_at;
            }

            if (account && user) {
                return {
                    ...token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    refresh_token: account.refresh_token,
                    user
                };
            }

            const expiresAt = token.expires_at as number;

            if (Date.now() < (expiresAt * 1000)) {
                return token;
            }

            if (!token.refresh_token) {
                throw new TypeError("Missing refresh_token");
            }

            try {
                const tokenEndpoint = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_TOKEN_ENDPOINT!;
                const response = await fetch(tokenEndpoint, {
                    method: "POST",
                    body: new URLSearchParams({
                        client_id: process.env.AUTH_KEYCLOAK_ID!,
                        client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
                        grant_type: "refresh_token",
                        refresh_token: token.refresh_token as string,
                    }),
                })

                const tokensOrError = await response.json()

                if (!response.ok) {
                    throw tokensOrError;
                }

                const newTokens = tokensOrError as {
                    access_token: string
                    expires_in: number
                    refresh_token?: string
                }

                return {
                    ...token,
                    access_token: newTokens.access_token,
                    expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                    refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token,
                }
            } catch (error) {
                console.error("Error refreshing access_token", error)
                token.error = "RefreshTokenError"
                return token
            }
        },
        async session({session, token}) {
            session.access_token = token.access_token as string;
            session.expires_at = token.expires_at as number;
            session.refresh_token = token.refresh_token as string;
            if (token.sub && token.email) {
                session.user = {
                    id: token.sub as string,
                    email: token.email as string,
                    emailVerified: null,
                    name: token.name as string,
                };
            }

            if (token.error) {
                session.error = token.error as "RefreshTokenError";
            }

            return session
        },
    },
})
