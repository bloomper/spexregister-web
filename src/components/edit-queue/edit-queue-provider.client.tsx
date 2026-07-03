"use client";

import * as React from "react";
import {createContext, useCallback, useContext, useMemo, useState} from "react";

export type EntityType =
    | "spexare"
    | "news"
    | "spex"
    | "spexCategory"
    | "task"
    | "taskCategory"
    | "tag"
    | "user";

export type QueueItem = { id: string } & Record<string, unknown>;

export type QueueEntry = {
    entityType: EntityType;
    item: QueueItem;
};

const keyOf = (entityType: EntityType, id: string) => `${entityType}:${id}`;

type EditQueueContextValue = {
    entries: QueueEntry[];
    count: number;
    isOpen: boolean;
    index: number;
    current: QueueEntry | null;

    enqueue: (entityType: EntityType, item: { id: string }) => void;
    enqueueMany: (entityType: EntityType, items: { id: string }[]) => void;
    updateItem: (entityType: EntityType, id: string, item: { id: string }) => void;
    remove: (entityType: EntityType, id: string) => void;
    clear: () => void;

    open: () => void;
    close: () => void;
    setOpen: (open: boolean) => void;

    goTo: (index: number) => void;
    next: () => void;
    prev: () => void;

    isQueued: (entityType: EntityType, id: string) => boolean;
};

const EditQueueContext = createContext<EditQueueContextValue | null>(null);

export function EditQueueProvider({children}: { children: React.ReactNode }) {
    const [entries, setEntries] = useState<QueueEntry[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const clampIndex = useCallback((i: number, length: number) => {
        if (length === 0) {
            return 0;
        }
        return Math.max(0, Math.min(i, length - 1));
    }, []);

    const enqueue = useCallback((entityType: EntityType, item: { id: string }) => {
        setEntries((prev) => {
            if (prev.some((e) => keyOf(e.entityType, e.item.id) === keyOf(entityType, item.id))) {
                return prev;
            }
            return [...prev, {entityType, item: item as QueueItem}];
        });
    }, []);

    const enqueueMany = useCallback((entityType: EntityType, items: { id: string }[]) => {
        setEntries((prev) => {
            const seen = new Set(prev.map((e) => keyOf(e.entityType, e.item.id)));
            const additions: QueueEntry[] = [];
            for (const item of items) {
                const k = keyOf(entityType, item.id);
                if (!seen.has(k)) {
                    seen.add(k);
                    additions.push({entityType, item: item as QueueItem});
                }
            }
            return additions.length ? [...prev, ...additions] : prev;
        });
    }, []);

    const updateItem = useCallback((entityType: EntityType, id: string, item: { id: string }) => {
        setEntries((prev) =>
            prev.map((e) =>
                keyOf(e.entityType, e.item.id) === keyOf(entityType, id)
                    ? {entityType: e.entityType, item: {...e.item, ...item} as QueueItem}
                    : e,
            ),
        );
    }, []);

    const remove = useCallback((entityType: EntityType, id: string) => {
        setEntries((prev) => {
            const next = prev.filter((e) => keyOf(e.entityType, e.item.id) !== keyOf(entityType, id));
            setIndex((i) => clampIndex(i, next.length));
            return next;
        });
    }, [clampIndex]);

    const clear = useCallback(() => {
        setEntries([]);
        setIndex(0);
        setIsOpen(false);
    }, []);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const goTo = useCallback((i: number) => setIndex(clampIndex(i, entries.length)), [clampIndex, entries.length]);
    const next = useCallback(() => setIndex((i) => clampIndex(i + 1, entries.length)), [clampIndex, entries.length]);
    const prev = useCallback(() => setIndex((i) => clampIndex(i - 1, entries.length)), [clampIndex, entries.length]);

    const isQueued = useCallback(
        (entityType: EntityType, id: string) =>
            entries.some((e) => keyOf(e.entityType, e.item.id) === keyOf(entityType, id)),
        [entries],
    );

    const value = useMemo<EditQueueContextValue>(() => {
        const safeIndex = clampIndex(index, entries.length);
        return {
            entries,
            count: entries.length,
            isOpen,
            index: safeIndex,
            current: entries[safeIndex] ?? null,
            enqueue,
            enqueueMany,
            updateItem,
            remove,
            clear,
            open,
            close,
            setOpen: setIsOpen,
            goTo,
            next,
            prev,
            isQueued,
        };
    }, [clampIndex, index, entries, isOpen, enqueue, enqueueMany, updateItem, remove, clear, open, close, goTo, next, prev, isQueued]);

    return <EditQueueContext.Provider value={value}>{children}</EditQueueContext.Provider>;
}

export function useEditQueue() {
    const ctx = useContext(EditQueueContext);
    if (!ctx) {
        throw new Error("useEditQueue must be used within <EditQueueProvider />");
    }
    return ctx;
}
