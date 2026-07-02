import {describe, expect, it} from "vitest";
import {newsFormSchema} from "@/lib/news/schema";

const base = {subject: "S", text: "T", visibleFrom: "2024-01-01"};

describe("newsFormSchema", () => {
    it("requires subject, text and visibleFrom", () => {
        const result = newsFormSchema.safeParse({subject: "", text: "", visibleFrom: "", visibleTo: null});
        expect(result.success).toBe(false);
        const paths = result.success ? [] : result.error.issues.map((i) => i.path[0]);
        expect(paths).toEqual(expect.arrayContaining(["subject", "text", "visibleFrom"]));
    });

    it("normalises an empty visibleTo to null", () => {
        const result = newsFormSchema.safeParse({...base, visibleTo: ""});
        expect(result.success && result.data.visibleTo).toBeNull();
    });

    it("normalises a null visibleTo to null", () => {
        const result = newsFormSchema.safeParse({...base, visibleTo: null});
        expect(result.success && result.data.visibleTo).toBeNull();
    });

    it("keeps a concrete visibleTo value", () => {
        const result = newsFormSchema.safeParse({...base, visibleTo: "2024-12-31"});
        expect(result.success && result.data.visibleTo).toBe("2024-12-31");
    });
});
