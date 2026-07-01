import 'server-only';

import nextAuth, {DefaultSession} from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import {Role} from "@/types/auth";
import {gravatarImageUrl, isTokenExpired, mapInitialToken, refreshAccessToken} from "@/lib/auth-tokens";

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
                return mapInitialToken(account, user);
            }

            if (!isTokenExpired(token)) {
                return token;
            }

            if (!token.refresh_token) {
                throw new TypeError("Missing refresh_token");
            }

            return refreshAccessToken(token.refresh_token as string, token);
        },
        async session({session, token}) {
            session.access_token = token.access_token as string;
            session.roles = (token.roles as Role[]) || [];
            session.error = token.error === "RefreshTokenError" ? "RefreshTokenError" : undefined;

            if (session.user) {
                session.user.id = token.sub as string;

                const image = gravatarImageUrl(token.email);

                if (image) {
                    session.user.image = image;
                }
            }

            return session;
        },
    },
})
