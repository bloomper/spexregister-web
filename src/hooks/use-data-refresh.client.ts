"use client";

import {useEffect} from "react";

type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * Tells every component listening with `useDataRefresh` that data has changed.
 */
export function emitDataRefresh() {
    for (const listener of [...listeners]) {
        listener();
    }
}

/**
 * Calls `onRefresh` whenever `emitDataRefresh` is called, while the component is mounted.
 */
export function useDataRefresh(onRefresh: () => void) {
    useEffect(() => {
        listeners.add(onRefresh);
        return () => {
            listeners.delete(onRefresh);
        };
    }, [onRefresh]);
}
