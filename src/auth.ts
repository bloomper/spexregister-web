import 'server-only';

import nextAuth, {DefaultSession} from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import {createHash} from "node:crypto";
import {AccessTokenClaims, Role} from "@/types/auth";
import {jwtDecode} from "jwt-decode";
import {extractRolesFromClaims} from "@/utils/auth";

declare module 'next-auth' {
    interface Session extends DefaultSession {
        error?: "RefreshTokenError"
        access_token: string
        roles: Role[]
    }
}

export const {handlers, auth, signIn, signOut} = nextAuth({
    debug: process.env.NODE_ENV === 'development',
    providers: [Keycloak],
    callbacks: {
        async jwt({token, account, user}) {
            if (account && user) {
                const claims = jwtDecode<AccessTokenClaims>(account.access_token!);

                return {
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    refresh_token: account.refresh_token,
                    roles: extractRolesFromClaims(claims),
                    sub: user.id,
                    name: user.name,
                    email: user.email,
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
                const AUTH_KEYCLOAK_ISSUER = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER!;
                const response = await fetch(`${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
                    method: "POST",
                    body: new URLSearchParams({
                        client_id: process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ID!,
                        client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
                        grant_type: "refresh_token",
                        refresh_token: token.refresh_token as string,
                    }),
                })

                const tokensOrError = await response.json();

                if (!response.ok) {
                    throw tokensOrError;
                }

                const newTokens = tokensOrError as {
                    access_token: string
                    expires_in: number
                    refresh_token?: string
                };

                const claims = jwtDecode<AccessTokenClaims>(newTokens.access_token);

                return {
                    ...token,
                    access_token: newTokens.access_token,
                    expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
                    refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token,
                    roles: extractRolesFromClaims(claims),
                };
            } catch (error) {
                console.error("Error refreshing access_token", error);
                token.error = "RefreshTokenError";
                return token;
            }
        },
        async session({session, token}) {
            session.access_token = token.access_token as string;
            session.roles = (token.roles as Role[]) || [];
            session.error = token.error === "RefreshTokenError" ? "RefreshTokenError" : undefined;

            if (session.user) {
                session.user.id = token.sub as string;

                const email = token.email?.trim().toLowerCase();

                if (email) {
                    const emailHash = createHash("md5").update(email).digest("hex");
                    session.user.image = `https://www.gravatar.com/avatar/${emailHash}?d=404&s=128`;
                }
            }

            return session;
        },
    },
})
