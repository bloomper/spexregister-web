import {describe, expect, it} from "vitest";
import {taskActivityFormSchema} from "@/lib/spexare/activity/task-activity/schema";

describe("taskActivityFormSchema", () => {
    it("accepts a task without an actor", () => {
        expect(taskActivityFormSchema.safeParse({taskId: "1"}).success).toBe(true);
        expect(taskActivityFormSchema.safeParse({taskId: "1", vocalId: "", role: "", characterId: null}).success).toBe(true);
    });

    it("accepts a task with its actor", () => {
        expect(taskActivityFormSchema.safeParse({taskId: "1", vocalId: "2", characterId: "3"}).success).toBe(true);
        expect(taskActivityFormSchema.safeParse({taskId: "1", vocalId: "2", role: "Greve"}).success).toBe(true);
    });

    it("requires a vocal for a role", () => {
        for (const actor of [{role: "Greve"}, {characterId: "3"}]) {
            const result = taskActivityFormSchema.safeParse({taskId: "1", vocalId: "", ...actor});
            expect(result.success).toBe(false);
            expect(result.success ? [] : result.error.issues.map((i) => i.path[0])).toEqual(["vocalId"]);
        }
    });
});
