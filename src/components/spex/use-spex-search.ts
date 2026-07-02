"use client";

import {useCallback, useEffect, useState} from "react";
import {useInfiniteList} from "@/hooks/use-infinite-list";
import {Spex, SpexCategory} from "@/gql/schema";
import {CursorPageInfo} from "@/types/pagination";
import {getPageAction} from "@/app/(app)/spex/actions.server";

type UseSpexSearchArgs = {
    categories: SpexCategory[];
    initialItems: Spex[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
};

export function useSpexSearch({categories, initialItems, initialPageInfo, maxItems}: UseSpexSearchArgs) {
    const [searchValue, setSearchValue] = useState("");
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set(categories.map((c) => c.id))
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilterQuery(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const fetchPageWithFilters = useCallback((args: { after: string | null; pageSize: number }) => {
        const filterParts = ["parent:NULL"];

        if (filterQuery.trim()) {
            const escapedQuery = filterQuery.trim();
            filterParts.push(`(details.title:*${escapedQuery}* OR year:*${escapedQuery}*)`);
        }

        if (categories.length > 0 && selectedCategories.size < categories.length) {
            const categoryFilters = Array.from(selectedCategories)
                .map(id => `details.category.id:${id}`)
                .join(" OR ");
            filterParts.push(`(${categoryFilters})`);
        }

        return getPageAction({
            after: args.after,
            first: args.pageSize,
            filter: filterParts.join(" AND ")
        });
    }, [categories.length, selectedCategories, filterQuery]);

    const infinite = useInfiniteList<Spex>({
        fetchPageAction: fetchPageWithFilters,
        pageSize: 24,
        rootMargin: "600px",
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
        maxItems,
    });

    const {items, loading, reset} = infinite;

    useEffect(() => {
        reset();
    }, [filterQuery, selectedCategories, reset]);

    const handleCategorySelect = (newValues: Set<string>) => {
        setSelectedCategories(newValues);
        reset();
    };

    const handleClearCategories = () => {
        const allIds = new Set(categories.map(c => c.id));
        setSelectedCategories(allIds);
        reset();
    };

    const noResults = !loading && items.length === 0;
    const isFiltered = filterQuery.trim() !== "" || (categories.length > 0 && selectedCategories.size < categories.length);

    return {
        ...infinite,
        searchValue,
        setSearchValue,
        selectedCategories,
        handleCategorySelect,
        handleClearCategories,
        noResults,
        isFiltered,
    };
}
