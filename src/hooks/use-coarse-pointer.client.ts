"use client";

import {useSyncExternalStore} from "react";

const QUERY = "(pointer: coarse)";

const subscribe = (onChange: () => void) => {
    const media = window.matchMedia(QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function useCoarsePointer() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
