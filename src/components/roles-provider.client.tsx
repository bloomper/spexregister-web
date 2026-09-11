"use client";

import {createContext, ReactNode, useContext, useMemo} from "react";
import {Role} from "@/types/auth";

const RolesContext = createContext<Role[]>([]);

export function RolesProvider({roles, children}: { roles: Role[]; children: ReactNode }) {
    const value = useMemo(() => roles, [roles]);

    return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
}

export function useRoles(): Role[] {
    return useContext(RolesContext);
}
