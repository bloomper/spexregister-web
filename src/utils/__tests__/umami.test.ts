import {afterEach, describe, expect, it, vi} from "vitest";
import {track} from "@/utils/umami";

afterEach(() => {
    delete window.umami;
});

describe("track", () => {
    it("does nothing when the tracker isn't loaded", () => {
        expect(() => track("export")).not.toThrow();
    });

    it("forwards the event to Umami", () => {
        const umamiTrack = vi.fn();
        window.umami = {track: umamiTrack};

        track("bulk-apply", {operation: "TAG_ADD", count: 3});

        expect(umamiTrack).toHaveBeenCalledWith("bulk-apply", {operation: "TAG_ADD", count: 3});
    });

    it("swallows tracker errors", () => {
        window.umami = {track: () => {
            throw new Error("blocked");
        }};

        expect(() => track("restore")).not.toThrow();
    });
});
