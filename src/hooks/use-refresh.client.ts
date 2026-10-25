"use client";

import {createContext, useCallback, useContext} from "react";
import {useRouter} from "next/navigation";

/**
 * A reload of client-side data to run with a router refresh, provided by components that hold such data.
 */
export const RefreshContext = createContext<(() => void) | null>(null);

/**
 * Refreshes the page's server components and reloads the client-side data of the nearest `RefreshContext`.
 */
export function useRefresh() {
    const router = useRouter();
    const reload = useContext(RefreshContext);

    return useCallback(() => {
        router.refresh();
        reload?.();
    }, [router, reload]);
}
