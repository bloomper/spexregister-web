"use client";

import {createContext, type ReactNode, useContext} from "react";

export type Medlemskap = { url: string; canManage: boolean } | null;

const MedlemskapContext = createContext<Medlemskap>(null);

/**
 * Provides where Medlemskap is and whether the signed-in user may manage members there, for the links from FGV
 * memberships, which are kept in Medlemskap.
 */
export function MedlemskapProvider({medlemskap, children}: { medlemskap: Medlemskap; children: ReactNode }) {
    return <MedlemskapContext.Provider value={medlemskap}>{children}</MedlemskapContext.Provider>;
}

export function useMedlemskap(): Medlemskap {
    return useContext(MedlemskapContext);
}
