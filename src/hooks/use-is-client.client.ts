"use client";

import {useSyncExternalStore} from "react";

const subscribe = () => {
    return () => {
    };
};

const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Whether the component renders in the browser rather than on the server.
 */
export function useIsClient() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
