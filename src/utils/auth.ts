import {type Role} from '@/types/auth';

export const isAdmin = (roles: Role[]) => roles.includes('ADMIN');
export const isEditor = (roles: Role[]) => roles.includes('EDITOR');
export const isUser = (roles: Role[]) => roles.includes('USER');
export const isAdminOrEditor = (roles: Role[]) => roles.some(r => ['ADMIN', 'EDITOR'].includes(r));

export const generateKeycloakLogoutUrl = (redirectUrl: string, idToken?: string): string => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ID ?? '';
    const AUTH_KEYCLOAK_ISSUER = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER ?? '';
    const urlParams = new URLSearchParams();
    urlParams.append('client_id', CLIENT_ID);
    urlParams.append('post_logout_redirect_uri', `${redirectUrl}/api/auth/logout`);
    if (idToken) {
        urlParams.append('id_token_hint', idToken);
    }
    return `${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${urlParams.toString()}`;
};