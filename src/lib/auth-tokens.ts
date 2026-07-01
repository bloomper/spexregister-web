import 'server-only';

import {createHash} from 'node:crypto';
import {jwtDecode} from 'jwt-decode';
import {AccessTokenClaims, Role} from '@/types/auth';
import {extractRolesFromClaims} from '@/utils/auth';

export type AppToken = {
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    roles?: Role[];
    error?: 'RefreshTokenError';
    sub?: string;
    name?: string | null;
    email?: string | null;
    [key: string]: unknown;
};

type InitialAccount = {
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
};

type InitialUser = {
    id?: string;
    name?: string | null;
    email?: string | null;
};

export function mapInitialToken(account: InitialAccount, user: InitialUser): AppToken {
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

export function isTokenExpired(token: AppToken, now: number = Date.now()): boolean {
    const expiresAt = token.expires_at as number;
    return !(now < expiresAt * 1000);
}

export async function refreshAccessToken(refreshToken: string, token: AppToken): Promise<AppToken> {
    try {
        const issuer = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER!;
        const response = await fetch(`${issuer}/protocol/openid-connect/token`, {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ID!,
                client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        const tokensOrError = await response.json();

        if (!response.ok) {
            throw tokensOrError;
        }

        const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
        };

        const claims = jwtDecode<AccessTokenClaims>(newTokens.access_token);

        return {
            ...token,
            access_token: newTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
            refresh_token: newTokens.refresh_token ? newTokens.refresh_token : refreshToken,
            roles: extractRolesFromClaims(claims),
        };
    } catch (error) {
        console.error('Error refreshing access_token', error);
        return {...token, error: 'RefreshTokenError'};
    }
}

export function gravatarImageUrl(email?: string | null): string | undefined {
    const normalized = email?.trim().toLowerCase();

    if (!normalized) {
        return undefined;
    }

    const emailHash = createHash('md5').update(normalized).digest('hex');
    return `https://www.gravatar.com/avatar/${emailHash}?d=404&s=128`;
}
