import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {format, parseISO} from "date-fns";

/**
 * Joins class names, letting later Tailwind classes override earlier ones.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * An ISO date as yyyy-MM-dd, or an empty string when it cannot be read.
 */
export function formatDate(date: string) {
    if (!date) {
        return "";
    }
    try {
        return format(parseISO(date), "yyyy-MM-dd");
    } catch {
        return "";
    }
}

/**
 * An ISO instant as yyyy-MM-dd HH:mm in the browser's time zone.
 */
export function formatDateTime(date: string) {
    if (!date) {
        return "";
    }
    try {
        return format(parseISO(date), "yyyy-MM-dd HH:mm");
    } catch {
        return formatDate(date);
    }
}

/**
 * The address of an API image through the image proxy, which adds the user's token. The last modified time busts the
 * browser's cache when the image changes.
 */
export function getProxiedImageUrl(url?: string | null, lastModifiedAt?: string | null) {
    if (!url) {
        return "";
    }
    const params = new URLSearchParams();
    params.set("url", url);

    if (lastModifiedAt) {
        params.set("t", new Date(lastModifiedAt).getTime().toString());
    }

    return `/api/image-download-proxy?${params.toString()}`;
}

/**
 * A form error with its message key translated.
 */
export function translateError<T extends { message?: string }>(t: (key: string) => string, error?: T) {
    if (!error?.message) {
        return error;
    }
    return {
        ...error,
        message: t(error.message)
    };
}

const FACET_PARAM_PREFIX = "f.";

type FacetParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function facetParamEntries(source: FacetParamSource): [string, string][] {
    if (source instanceof URLSearchParams) {
        return [...source.entries()];
    }
    return Object.entries(source).flatMap(([key, value]) => {
        if (value === undefined) {
            return [];
        }
        return (Array.isArray(value) ? value : [value]).map((v): [string, string] => [key, v]);
    });
}

/**
 * The selected facet values in search parameters named `f.<facet>`.
 */
export function parseFacetParams(source: FacetParamSource): Record<string, Set<string>> {
    const selected: Record<string, Set<string>> = {};

    for (const [key, value] of facetParamEntries(source)) {
        if (!key.startsWith(FACET_PARAM_PREFIX) || !value) {
            continue;
        }
        const id = key.slice(FACET_PARAM_PREFIX.length);
        if (!id) {
            continue;
        }
        (selected[id] ??= new Set<string>()).add(value);
    }

    return selected;
}

/**
 * Adds the selected facet values as `f.<facet>` parameters, sorted so that the same selection gives the same address.
 */
export function appendFacetParams(params: URLSearchParams, selectedFacets: Record<string, Set<string>>) {
    for (const id of Object.keys(selectedFacets).sort()) {
        for (const value of [...selectedFacets[id]].sort()) {
            params.append(`${FACET_PARAM_PREFIX}${id}`, value);
        }
    }
    return params;
}

/**
 * The selected facet values as the search's aggregation filters.
 */
export function toAggregationFilters(selectedFacets: Record<string, Set<string>>): { name: string; value: string }[] {
    return Object.keys(selectedFacets)
        .sort()
        .flatMap((name) => [...selectedFacets[name]].sort().map((value) => ({name, value})));
}
