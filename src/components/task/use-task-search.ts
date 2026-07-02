'use client';

import {useCallback, useEffect, useState} from 'react';
import {useInfiniteList} from '@/hooks/use-infinite-list';
import {Task, TaskCategory} from '@/gql/schema';
import {CursorPageInfo} from '@/types/pagination';
import {getPageAction} from '@/app/(app)/tasks/actions.server';

type UseTaskSearchArgs = {
    categories: TaskCategory[];
    initialItems: Task[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
};

export function useTaskSearch({categories, initialItems, initialPageInfo, maxItems}: UseTaskSearchArgs) {
    const [searchValue, setSearchValue] = useState('');
    const [filterQuery, setFilterQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set([...categories.map((c) => c.id), 'none'])
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilterQuery(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const fetchPageWithFilters = useCallback((args: {after: string | null; pageSize: number}) => {
        const filterParts = [];

        if (filterQuery.trim()) {
            const escapedQuery = filterQuery.trim();
            filterParts.push(`(name:*${escapedQuery}*)`);
        }

        const totalOptionCount = categories.length + 1;

        if (selectedCategories.size < totalOptionCount) {
            if (selectedCategories.size === 0) {
                filterParts.push(`id:NULL`);
            } else {
                const categoryParts: string[] = [];
                selectedCategories.forEach(id => {
                    if (id === 'none') {
                        categoryParts.push(`category:NULL`);
                    } else {
                        categoryParts.push(`category.id:${id}`);
                    }
                });
                filterParts.push(`(${categoryParts.join(' OR ')})`);
            }
        }

        return getPageAction({
            after: args.after,
            first: args.pageSize,
            filter: filterParts.join(' AND ')
        });
    }, [categories.length, selectedCategories, filterQuery]);

    const infinite = useInfiniteList<Task>({
        fetchPageAction: fetchPageWithFilters,
        pageSize: 24,
        rootMargin: '600px',
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
        const allIds = new Set([...categories.map(c => c.id), 'none']);
        setSelectedCategories(allIds);
        reset();
    };

    const totalOptionCount = categories.length + 1;
    const noResults = !loading && items.length === 0;
    const isFiltered = filterQuery.trim() !== '' || (categories.length > 0 && selectedCategories.size < totalOptionCount);

    return {
        ...infinite,
        searchValue,
        setSearchValue,
        selectedCategories,
        handleCategorySelect,
        handleClearCategories,
        totalOptionCount,
        noResults,
        isFiltered,
    };
}
