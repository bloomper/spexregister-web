"use client";

import {createContext, useCallback, useContext} from "react";
import {useRouter} from "next/navigation";

export const RefreshContext = createContext<(() => void) | null>(null);

export function useRefresh() {
    const router = useRouter();
    const reload = useContext(RefreshContext);

    return useCallback(() => {
        router.refresh();
        reload?.();
    }, [router, reload]);
}
