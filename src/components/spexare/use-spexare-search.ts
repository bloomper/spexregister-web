"use client";

import {startTransition, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useInfiniteList} from "@/hooks/use-infinite-list";
import {Facet, Spexare} from "@/gql/schema";
import {CursorPageInfo, SpexarePage} from "@/types/pagination";
import {getPageAction, searchAction} from "@/app/(app)/spexare/actions.server";

type UseSpexareSearchArgs = {
    mode: "filter" | "search";
    initialSearchQuery: string;
    facets: Facet[];
    initialItems: Spexare[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
};

export function useSpexareSearch({
                                     mode,
                                     initialSearchQuery,
                                     facets,
                                     initialItems,
                                     initialPageInfo,
                                     maxItems,
                                 }: UseSpexareSearchArgs) {
    const router = useRouter();
    const pathname = usePathname();
    const [searchValue, setSearchValue] = useState(initialSearchQuery);
    const [filterQuery, setFilterQuery] = useState(initialSearchQuery);
    const [selectedDeceasedValues, setSelectedDeceasedValues] = useState<Set<string>>(new Set(["true", "false"]));
    const [selectedFacets, setSelectedFacets] = useState<Record<string, Set<string>>>({});
    const [currentFacets, setCurrentFacets] = useState<Facet[]>(facets);
    const previousResetKeyRef = useRef<string | null>(null);
    const skipNextResetRef = useRef(false);
    const previousInitialSearchQueryRef = useRef(initialSearchQuery);

    useEffect(() => {
        if (previousInitialSearchQueryRef.current !== initialSearchQuery) {
            previousInitialSearchQueryRef.current = initialSearchQuery;
            skipNextResetRef.current = true;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchValue(initialSearchQuery);
            setFilterQuery(initialSearchQuery);
        }
    }, [initialSearchQuery]);

    useEffect(() => {
        if (mode !== "search" || !filterQuery) {
            if (mode === "search" && !filterQuery && window.location.search) {
                window.history.replaceState(null, "", pathname);
            }
            return;
        }

        const params = new URLSearchParams();
        params.set("q", filterQuery);

        const url = `${pathname}?${params.toString()}`;
        window.history.replaceState(null, "", url);
    }, [filterQuery, pathname, mode]);

    const fetchPage = useCallback(async (args: { after: string | null; pageSize: number }): Promise<SpexarePage> => {
        const isFirstPage = args.after === null;

        if (mode === "search") {
            const aggregationFilters: { name: string; value: string }[] = [];

            Object.entries(selectedFacets).forEach(([name, values]) => {
                values.forEach(value => {
                    aggregationFilters.push({name, value});
                });
            });

            const currentOffset = isFirstPage ? 0 : parseInt(args.after || "0");

            const result = await searchAction({
                q: filterQuery.trim() || "",
                limit: args.pageSize,
                offset: currentOffset,
                aggregationFilters,
            });

            if (isFirstPage && result.facets) {
                setCurrentFacets(result.facets);
            }

            const hasNextPage = result.pageInfo?.hasNextPage;
            const resolvedHasNextPage =
                result.items.length === args.pageSize && hasNextPage;

            return {
                ...result,
                pageInfo: {
                    ...result.pageInfo,
                    endCursor: (currentOffset + result.items.length).toString(),
                    hasNextPage: resolvedHasNextPage,
                }
            };
        }

        const parts: string[] = [];

        if (filterQuery.trim()) {
            const query = filterQuery.trim();
            parts.push(`(firstName:*${query}* OR lastName:*${query}* OR nickName:*${query}*)`);
        }

        if (selectedDeceasedValues.size < 2) {
            if (selectedDeceasedValues.size === 0) {
                parts.push(`id:NULL`);
            } else {
                const val = selectedDeceasedValues.has("true") ? "TRUE" : "FALSE";
                parts.push(`deceased:${val}`);
            }
        }

        return getPageAction({
            after: args.after,
            first: args.pageSize,
            filter: parts.join(" AND ")
        });
    }, [filterQuery, mode, selectedDeceasedValues, selectedFacets]);

    const infinite = useInfiniteList<Spexare>({
        fetchPageAction: fetchPage,
        pageSize: 24,
        rootMargin: "600px",
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
        maxItems,
    });

    const {items, loading, reset} = infinite;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== filterQuery) {
                setFilterQuery(searchValue);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue, filterQuery]);

    const resetKey = useMemo(() => {
        const deceasedKey = Array.from(selectedDeceasedValues).sort().join(",");
        const facetsKey = Object.entries(selectedFacets)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([name, values]) => `${name}:${Array.from(values).sort().join(",")}`)
            .join("|");
        return `${filterQuery}__${deceasedKey}__${facetsKey}`;
    }, [filterQuery, selectedDeceasedValues, selectedFacets]);

    useEffect(() => {
        if (previousResetKeyRef.current === null) {
            previousResetKeyRef.current = resetKey;
            return;
        }
        if (skipNextResetRef.current) {
            skipNextResetRef.current = false;
            previousResetKeyRef.current = resetKey;
            return;
        }
        if (previousResetKeyRef.current !== resetKey) {
            previousResetKeyRef.current = resetKey;
            reset();
        }
    }, [resetKey, reset]);

    const handleReset = useCallback(() => {
        startTransition(() => {
            setSearchValue("");
            setFilterQuery("");
            setSelectedDeceasedValues(new Set(["true", "false"]));
            setSelectedFacets({});

            if (mode === "search") {
                router.replace(pathname, {scroll: false});
            }
        });
    }, [mode, pathname, router]);

    const noResults = !loading && items.length === 0;
    const hasActiveFacets = Object.values(selectedFacets).some(s => s.size > 0);
    const isFiltered = mode === "search"
        ? filterQuery.trim() !== "" || hasActiveFacets
        : filterQuery.trim() !== "" || selectedDeceasedValues.size < 2;

    return {
        ...infinite,
        searchValue,
        setSearchValue,
        selectedDeceasedValues,
        setSelectedDeceasedValues,
        selectedFacets,
        setSelectedFacets,
        currentFacets,
        handleReset,
        noResults,
        isFiltered,
    };
}
