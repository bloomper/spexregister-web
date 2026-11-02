import type {ReactElement} from "react";
import {render} from "@testing-library/react";
import {EditQueueProvider} from "@/components/edit-queue";
import type {CursorPage} from "@/types/pagination";

export const router = {refresh: () => undefined, push: () => undefined, replace: () => undefined, back: () => undefined};

export function pageOf<T>(items: T[], hasNextPage = false): CursorPage<T> {
    return {
        items,
        pageInfo: {hasNextPage, hasPreviousPage: false, startCursor: "s", endCursor: "e"},
        totalCount: items.length,
    };
}

export const audited = {
    createdBy: "admin@example.com",
    createdAt: "2026-01-01T10:00:00Z",
    lastModifiedBy: "editor@example.com",
    lastModifiedAt: "2026-02-01T10:00:00Z",
};

export function renderWithQueue(ui: ReactElement) {
    return render(<EditQueueProvider>{ui}</EditQueueProvider>);
}
