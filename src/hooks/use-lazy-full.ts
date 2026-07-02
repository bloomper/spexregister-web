'use client';

import {useEffect, useRef, useState} from 'react';

export function useLazyFull<T>(
    id: string | null | undefined,
    loadAction: (id: string) => Promise<T | null | undefined>,
): {full: T | null; isLoading: boolean} {
    const [full, setFull] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadRef = useRef(loadAction);
    loadRef.current = loadAction;

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!id) {
                setFull(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setFull(null);

            try {
                const data = await loadRef.current(id);
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
    }, [id]);

    return {full, isLoading};
}
