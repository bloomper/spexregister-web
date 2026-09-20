import {describe, expect, it} from "vitest";
import {bulkInputSchema} from "@/lib/spexare/bulk/schema";
import {SpexareBulkOperation} from "@/gql/schema";

const withTarget = (rest: Record<string, unknown>) => ({target: {ids: ["1", "2"]}, ...rest});

const issuePaths = (data: unknown) => {
    const result = bulkInputSchema.safeParse(data);
    return result.success ? [] : result.error.issues.map((i) => i.path.join("."));
};

describe("bulkInputSchema target", () => {
    it("accepts ids alone", () => {
        const result = bulkInputSchema.safeParse({
            target: {ids: ["1"]},
            operation: SpexareBulkOperation.TagAdd,
            tags: ["7"],
        });
        expect(result.success).toBe(true);
    });

    it("accepts a filter alone", () => {
        const result = bulkInputSchema.safeParse({
            target: {filter: "published:TRUE"},
            operation: SpexareBulkOperation.TagAdd,
            tags: ["7"],
        });
        expect(result.success).toBe(true);
    });

    it("rejects both ids and a filter, so an action cannot silently widen", () => {
        const result = bulkInputSchema.safeParse({
            target: {ids: ["1"], filter: "published:TRUE"},
            operation: SpexareBulkOperation.TagAdd,
            tags: ["7"],
        });
        expect(result.success).toBe(false);
    });

    it("rejects an empty target", () => {
        const result = bulkInputSchema.safeParse({
            target: {},
            operation: SpexareBulkOperation.TagAdd,
            tags: ["7"],
        });
        expect(result.success).toBe(false);
    });
});

describe("bulkInputSchema payload requirements", () => {
    it("requires tags for TAG_ADD and TAG_REMOVE", () => {
        expect(issuePaths(withTarget({operation: SpexareBulkOperation.TagAdd}))).toContain("tags");
        expect(issuePaths(withTarget({operation: SpexareBulkOperation.TagRemove}))).toContain("tags");
    });

    it("requires spex for SPEX_ADD and SPEX_REMOVE", () => {
        expect(issuePaths(withTarget({operation: SpexareBulkOperation.SpexAdd}))).toContain("spex");
        expect(issuePaths(withTarget({operation: SpexareBulkOperation.SpexRemove}))).toContain("spex");
    });

    it("requires both a spexId and tasks for TASK_ADD, since a task hangs off a spex activity", () => {
        const paths = issuePaths(withTarget({operation: SpexareBulkOperation.TaskAdd}));
        expect(paths).toContain("tasks");
        expect(paths).toContain("spexId");
    });

    it("accepts TASK_ADD once both are given", () => {
        const result = bulkInputSchema.safeParse(
            withTarget({operation: SpexareBulkOperation.TaskAdd, tasks: ["3"], spexId: "9"}),
        );
        expect(result.success).toBe(true);
    });

    it("requires values for CONSENT_SET and TOGGLE_SET", () => {
        expect(issuePaths(withTarget({operation: SpexareBulkOperation.ConsentSet}))).toContain("values");
        expect(issuePaths(withTarget({operation: SpexareBulkOperation.ToggleSet}))).toContain("values");
    });

    it("requires at least one field for FIELDS_SET", () => {
        expect(issuePaths(withTarget({operation: SpexareBulkOperation.FieldsSet}))).toContain("fields");
        expect(issuePaths(withTarget({operation: SpexareBulkOperation.FieldsSet, fields: {}}))).toContain("fields");
    });

    it("accepts FIELDS_SET setting published to false", () => {
        const result = bulkInputSchema.safeParse(
            withTarget({operation: SpexareBulkOperation.FieldsSet, fields: {published: false}}),
        );
        expect(result.success).toBe(true);
    });

    it("rejects an unknown operation", () => {
        expect(bulkInputSchema.safeParse(withTarget({operation: "DROP_EVERYTHING"})).success).toBe(false);
    });
});
