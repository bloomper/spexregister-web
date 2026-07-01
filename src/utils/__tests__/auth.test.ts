import {afterEach, describe, expect, it, vi} from 'vitest';
import {
    extractRolesFromClaims,
    generateKeycloakLogoutUrl,
    isAdmin,
    isAdminOrEditor,
    isEditor,
    isUser,
    normalizeTheme,
} from '@/utils/auth';
import type {AccessTokenClaims} from '@/types/auth';

describe('role predicates', () => {
    it('isAdmin / isEditor / isUser check membership', () => {
        expect(isAdmin(['ADMIN'])).toBe(true);
        expect(isAdmin(['EDITOR', 'USER'])).toBe(false);
        expect(isEditor(['EDITOR'])).toBe(true);
        expect(isEditor(['ADMIN'])).toBe(false);
        expect(isUser(['USER'])).toBe(true);
        expect(isUser([])).toBe(false);
    });

    it('isAdminOrEditor is true for either role only', () => {
        expect(isAdminOrEditor(['ADMIN'])).toBe(true);
        expect(isAdminOrEditor(['EDITOR'])).toBe(true);
        expect(isAdminOrEditor(['USER'])).toBe(false);
        expect(isAdminOrEditor([])).toBe(false);
    });
});

describe('extractRolesFromClaims', () => {
    const claimsWith = (roles?: string[]): AccessTokenClaims => ({
        resource_access: {spexregister: {roles}},
    });

    it('returns [] when resource_access is missing', () => {
        expect(extractRolesFromClaims({})).toEqual([]);
    });

    it('returns [] when the spexregister client is missing', () => {
        expect(extractRolesFromClaims({resource_access: {}})).toEqual([]);
    });

    it('normalizes case and trims whitespace', () => {
        expect(extractRolesFromClaims(claimsWith(['admin', ' Editor ', 'user'])).sort()).toEqual(
            ['ADMIN', 'EDITOR', 'USER'],
        );
    });

    it('drops unknown roles', () => {
        expect(extractRolesFromClaims(claimsWith(['ADMIN', 'SUPERUSER', 'guest']))).toEqual(['ADMIN']);
    });

    it('de-duplicates roles', () => {
        expect(extractRolesFromClaims(claimsWith(['ADMIN', 'admin', 'ADMIN']))).toEqual(['ADMIN']);
    });
});

describe('normalizeTheme', () => {
    it('accepts the three valid themes', () => {
        expect(normalizeTheme('light')).toBe('light');
        expect(normalizeTheme('dark')).toBe('dark');
        expect(normalizeTheme('system')).toBe('system');
    });

    it('returns undefined for anything else', () => {
        expect(normalizeTheme('blue')).toBeUndefined();
        expect(normalizeTheme(undefined)).toBeUndefined();
        expect(normalizeTheme('')).toBeUndefined();
    });
});

describe('generateKeycloakLogoutUrl', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('builds the logout URL with client id and post-logout redirect', () => {
        vi.stubEnv('NEXT_PUBLIC_AUTH_KEYCLOAK_ID', 'spexregister');
        vi.stubEnv('NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER', 'https://kc.example/realms/r');

        const url = new URL(generateKeycloakLogoutUrl('https://app.example'));

        expect(url.origin + url.pathname).toBe('https://kc.example/realms/r/protocol/openid-connect/logout');
        expect(url.searchParams.get('client_id')).toBe('spexregister');
        expect(url.searchParams.get('post_logout_redirect_uri')).toBe('https://app.example/api/auth/logout');
        expect(url.searchParams.get('ui_locales')).toBeNull();
        expect(url.searchParams.get('theme')).toBeNull();
        expect(url.searchParams.get('id_token_hint')).toBeNull();
    });

    it('includes optional locale, theme and id_token_hint when provided', () => {
        vi.stubEnv('NEXT_PUBLIC_AUTH_KEYCLOAK_ID', 'spexregister');
        vi.stubEnv('NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER', 'https://kc.example/realms/r');

        const url = new URL(
            generateKeycloakLogoutUrl('https://app.example', 'id-token-123', 'sv', 'dark'),
        );

        expect(url.searchParams.get('ui_locales')).toBe('sv');
        expect(url.searchParams.get('theme')).toBe('dark');
        expect(url.searchParams.get('id_token_hint')).toBe('id-token-123');
    });

    it('falls back to empty client id / issuer when env is unset', () => {
        vi.stubEnv('NEXT_PUBLIC_AUTH_KEYCLOAK_ID', '');
        vi.stubEnv('NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER', '');

        const url = generateKeycloakLogoutUrl('https://app.example');

        expect(url).toContain('/protocol/openid-connect/logout?');
        expect(url).toContain('client_id=');
    });
});
