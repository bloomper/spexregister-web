"use client";

import {useEffect} from "react";

type Listener = () => void;

const listeners = new Set<Listener>();

export function emitDataRefresh() {
    for (const listener of [...listeners]) {
        listener();
    }
}

export function useDataRefresh(onRefresh: () => void) {
    useEffect(() => {
        listeners.add(onRefresh);
        return () => {
            listeners.delete(onRefresh);
        };
    }, [onRefresh]);
}
