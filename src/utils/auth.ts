import {AccessTokenClaims, type Role} from "@/types/auth";

export const isAdmin = (roles: Role[]) => roles.includes("ADMIN");
export const isEditor = (roles: Role[]) => roles.includes("EDITOR");
export const isUser = (roles: Role[]) => roles.includes("USER");
export const isAdminOrEditor = (roles: Role[]) => roles.some(r => ["ADMIN", "EDITOR"].includes(r));

function normalizeRole(value: string): Role | null {
    const v = value.trim().toUpperCase();
    if (v === "ADMIN" || v === "EDITOR" || v === "USER") {
        return v;
    }
    return null;
}

export function extractRolesFromClaims(claims: AccessTokenClaims): Role[] {
    const rawRoles = claims.resource_access?.spexregister?.roles ?? [];
    const roles = rawRoles
        .map(normalizeRole)
        .filter((r): r is Role => r !== null);

    return Array.from(new Set(roles));
}

export function normalizeTheme(value?: string): "light" | "dark" | "system" | undefined {
    if (value === "light" || value === "dark" || value === "system") return value;
    return undefined;
}

export const appendLogoutParams = (
    logoutUrl: string,
    locale?: string,
    theme?: "light" | "dark" | "system"
): string => {
    if (!locale && !theme) {
        return logoutUrl;
    }

    const separator = logoutUrl.includes("?") ? "&" : "?";
    const urlParams = new URLSearchParams();

    if (locale) {
        urlParams.append("ui_locales", locale);
    }
    if (theme) {
        urlParams.append("theme", theme);
    }

    return `${logoutUrl}${separator}${urlParams.toString()}`;
};
