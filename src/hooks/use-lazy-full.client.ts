"use client";

import {useCallback, useEffect, useEffectEvent, useRef, useState} from "react";

/**
 * Loads the full record of an id when it changes, for a dialog shown from a summary. A reload keeps the current record
 * on screen until the new one arrives.
 */
export function useLazyFull<T>(
    id: string | null | undefined,
    loadAction: (id: string) => Promise<T | null | undefined>,
): { full: T | null; isLoading: boolean; reload: () => void } {
    const [full, setFull] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [version, setVersion] = useState(0);
    const reloadingRef = useRef(false);

    const loadFull = useEffectEvent(loadAction);

    useEffect(() => {
        let cancelled = false;
        const reloading = reloadingRef.current;

        reloadingRef.current = false;

        async function load() {
            if (!id) {
                setFull(null);
                setIsLoading(false);
                return;
            }

            if (!reloading) {
                setIsLoading(true);
                setFull(null);
            }

            try {
                const data = await loadFull(id);
                if (!cancelled) {
                    setFull(data ?? null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void load();
        return () => {
            cancelled = true;
        };
    }, [id, version]);

    const reload = useCallback(() => {
        reloadingRef.current = true;
        setVersion((current) => current + 1);
    }, []);

    return {full, isLoading, reload};
}
