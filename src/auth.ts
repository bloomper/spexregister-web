import "server-only";

import {betterAuth} from "better-auth";
import {genericOAuth, type GenericOAuthUserInfo, keycloak} from "better-auth/plugins/generic-oauth";
import {nextCookies} from "better-auth/next-js";
import {gravatarImageUrl} from "@/lib/gravatar.server";

// The browser needs NEXT_PUBLIC_AUTH_URL, and Next inlines `NEXT_PUBLIC_*` at build time — into
// the server bundle too. BETTER_AUTH_URL is the runtime override, so a built image can still be
// retargeted at another hostname without a rebuild, the way Auth.js's AUTH_URL allowed.
const appUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_AUTH_URL;

const issuer = (process.env.AUTH_KEYCLOAK_ISSUER ?? "").replace(/\/$/, "");
const endpoint = (name: string) => `${issuer}/protocol/openid-connect/${name}`;

export const auth = betterAuth({
    baseURL: appUrl,
    secret: process.env.AUTH_SECRET,
    plugins: [
        genericOAuth({
            config: [
                {
                    ...keycloak({
                        issuer,
                        clientId: process.env.AUTH_KEYCLOAK_ID ?? "",
                        clientSecret: process.env.AUTH_KEYCLOAK_SECRET ?? "",
                        postLogoutRedirectURI: appUrl,
                    }),
                    authorizationUrl: endpoint("auth"),
                    tokenUrl: endpoint("token"),
                    userInfoUrl: endpoint("userinfo"),
                    endSessionEndpoint: endpoint("logout"),
                    mapProfileToUser: (profile: GenericOAuthUserInfo) => ({
                        image: profile.image ?? gravatarImageUrl(profile.email),
                    }),
                },
            ],
        }),
        nextCookies(),
    ],
});
