import {describe, expect, it} from "vitest";
import {spexareFormSchema} from "@/lib/spexare/schema";

const base = {firstName: "Ann", lastName: "Björk"};

describe("spexareFormSchema", () => {
    it("accepts the minimal required fields (no SSN parts)", () => {
        expect(spexareFormSchema.safeParse(base).success).toBe(true);
    });

    it("requires firstName and lastName", () => {
        const result = spexareFormSchema.safeParse({firstName: "", lastName: ""});
        expect(result.success).toBe(false);
        const paths = result.success ? [] : result.error.issues.map((i) => i.path[0]);
        expect(paths).toContain("firstName");
        expect(paths).toContain("lastName");
    });

    it("accepts a valid personnummer (correct Luhn check digit)", () => {
        const result = spexareFormSchema.safeParse({...base, birthDate: "1981-12-18", birthNumber: "9876"});
        expect(result.success).toBe(true);
    });

    it("rejects a personnummer with a wrong check digit", () => {
        const result = spexareFormSchema.safeParse({...base, birthDate: "1981-12-18", birthNumber: "9875"});
        expect(result.success).toBe(false);
        const issue = result.success ? undefined : result.error.issues.find((i) => i.path[0] === "birthNumber");
        expect(issue?.message).toBe("Spexare.invalidBirthNumber");
    });

    it("rejects a birthNumber that is not four digits (field-level regex)", () => {
        const result = spexareFormSchema.safeParse({...base, birthDate: "1981-12-18", birthNumber: "987"});
        expect(result.success).toBe(false);
    });

    it("skips the SSN check when birthNumber is empty", () => {
        const result = spexareFormSchema.safeParse({...base, birthDate: "1981-12-18", birthNumber: ""});
        expect(result.success).toBe(true);
    });

    it("flags a combination that does not form a valid personnummer pattern", () => {
        // Malformed birthDate → the assembled SSN fails the structural regex.
        const result = spexareFormSchema.safeParse({...base, birthDate: "1981-12-8", birthNumber: "9876"});
        expect(result.success).toBe(false);
    });
});
