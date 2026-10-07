"use client";

import {useEffect, useEffectEvent, useState} from "react";
import {useSearchParams} from "next/navigation";
import {AUDIT_OPEN_PARAM, AUDIT_TAB_PARAM} from "@/utils/audit";

export type DeepLink = { id: string; tab: string | null };

export function useDeepLink(): DeepLink | null {
    const params = useSearchParams();
    const id = params.get(AUDIT_OPEN_PARAM);

    return id ? {id, tab: params.get(AUDIT_TAB_PARAM)} : null;
}

export function useDeepLinkItem<TItem extends { id: string }>(
    fetchById: (id: string) => Promise<TItem | null | undefined>,
    onFound: (item: TItem, tab: string | null) => void,
) {
    const link = useDeepLink();
    const [isLoading, setIsLoading] = useState(false);
    const fetchItem = useEffectEvent(fetchById);
    const onItemFound = useEffectEvent(onFound);

    const id = link?.id ?? null;
    const tab = link?.tab ?? null;

    useEffect(() => {
        if (!id) {
            return;
        }

        let cancelled = false;

        async function open(linkedId: string) {
            setIsLoading(true);

            try {
                const item = await fetchItem(linkedId);

                if (!cancelled && item) {
                    onItemFound(item, tab);
                }
            } catch (e) {
                console.error("Failed to open the linked record", e);
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        void open(id);

        return () => {
            cancelled = true;
        };
    }, [id, tab]);

    return {isLoading};
}
