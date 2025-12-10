import nextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user?: string;
    }
}

export const {handlers, auth, signIn, signOut} = nextAuth({
    debug: process.env.NODE_ENV === 'development',
    providers: [Keycloak],
    callbacks: {
        async jwt({token, account, user}) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account?.access_token,
                    user
                };
            }
            return token;
        },
        async session({session, token}) {
            session.accessToken = token.accessToken as string;
            session.user = token.user as any;
            return session;
        }
    }
});