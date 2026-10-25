"use client";

import {useSyncExternalStore} from "react";

/**
 * Whether the media query matches, following its changes; `serverValue` when rendered on the server.
 */
export function useMediaQuery(query: string, serverValue = false) {
    return useSyncExternalStore(
        (onChange) => {
            const media = window.matchMedia(query);
            media.addEventListener("change", onChange);
            return () => media.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
        () => serverValue,
    );
}
