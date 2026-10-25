"use client";

import {createContext, ReactNode, useContext, useMemo} from "react";
import {Role} from "@/types/auth";

const RolesContext = createContext<Role[]>([]);

/**
 * Provides the signed-in user's roles to client components, to show only what they may do.
 */
export function RolesProvider({roles, children}: { roles: Role[]; children: ReactNode }) {
    const value = useMemo(() => roles, [roles]);

    return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
}

/**
 * The signed-in user's roles; the server still decides.
 */
export function useRoles(): Role[] {
    return useContext(RolesContext);
}
