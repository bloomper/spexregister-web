import {describe, expect, it} from "vitest";
import {act, renderHook} from "@testing-library/react";
import {EditQueueProvider, useEditQueue} from "@/components/edit-queue/edit-queue-provider.client";

function setup() {
    return renderHook(() => useEditQueue(), {wrapper: EditQueueProvider});
}

describe("EditQueueProvider", () => {
    it("enqueues items and dedupes by entityType + id", () => {
        const {result} = setup();

        act(() => result.current.enqueue("tag", {id: "1"}));
        act(() => result.current.enqueue("tag", {id: "1"})); // duplicate
        act(() => result.current.enqueue("news", {id: "1"})); // same id, different type

        expect(result.current.count).toBe(2);
        expect(result.current.isQueued("tag", "1")).toBe(true);
        expect(result.current.isQueued("news", "1")).toBe(true);
        expect(result.current.isQueued("tag", "2")).toBe(false);
    });

    it("enqueueMany adds only the new items", () => {
        const {result} = setup();

        act(() => result.current.enqueue("tag", {id: "1"}));
        act(() => result.current.enqueueMany("tag", [{id: "1"}, {id: "2"}, {id: "3"}]));

        expect(result.current.count).toBe(3);
    });

    it("navigates with next/prev/goTo clamped to bounds", () => {
        const {result} = setup();

        act(() => result.current.enqueueMany("tag", [{id: "1"}, {id: "2"}, {id: "3"}]));

        expect(result.current.index).toBe(0);
        act(() => result.current.prev()); // clamped at 0
        expect(result.current.index).toBe(0);

        act(() => result.current.next());
        expect(result.current.current?.item.id).toBe("2");

        act(() => result.current.goTo(99)); // clamped at last
        expect(result.current.index).toBe(2);
        expect(result.current.current?.item.id).toBe("3");

        act(() => result.current.next()); // clamped at last
        expect(result.current.index).toBe(2);
    });

    it("removing the current item keeps the index in range", () => {
        const {result} = setup();

        act(() => result.current.enqueueMany("tag", [{id: "1"}, {id: "2"}, {id: "3"}]));
        act(() => result.current.goTo(2));
        act(() => result.current.remove("tag", "3"));

        expect(result.current.count).toBe(2);
        expect(result.current.index).toBe(1);
        expect(result.current.current?.item.id).toBe("2");
    });

    it("clear empties the queue and closes the drawer", () => {
        const {result} = setup();

        act(() => result.current.enqueue("tag", {id: "1"}));
        act(() => result.current.open());
        act(() => result.current.clear());

        expect(result.current.count).toBe(0);
        expect(result.current.isOpen).toBe(false);
        expect(result.current.current).toBeNull();
    });
});
