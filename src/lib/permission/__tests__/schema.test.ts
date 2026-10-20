import {describe, expect, it} from "vitest";
import {
    permissionGrantFormSchema,
    permissionGrantUpdateFormSchema,
    toCreateInput,
    toUpdateInput
} from "@/lib/permission/schema";

const valid = {granteeType: "USER", userId: "7", permission: "WRITE", scope: "SPEX_PARTICIPANTS", spexId: "3"} as const;

describe("permissionGrantFormSchema", () => {
    it("accepts a personal grant on everyone in a spex", () => {
        expect(permissionGrantFormSchema.safeParse(valid).success).toBe(true);
    });

    it("needs the grantee that matches the grantee type", () => {
        expect(permissionGrantFormSchema.safeParse({...valid, userId: undefined}).success).toBe(false);
        expect(permissionGrantFormSchema.safeParse({...valid, granteeType: "ROLE"}).success).toBe(false);
        expect(permissionGrantFormSchema.safeParse({...valid, granteeType: "ROLE", role: "USER"}).success).toBe(true);
    });

    it("needs the id that matches the scope", () => {
        expect(permissionGrantFormSchema.safeParse({...valid, scope: "SPEXARE"}).success).toBe(false);
        expect(permissionGrantFormSchema.safeParse({...valid, scope: "SPEXARE", spexareId: "9"}).success).toBe(true);
    });

    it("refuses roles that cannot be granted and end dates in the past", () => {
        expect(permissionGrantFormSchema.safeParse({
            ...valid,
            granteeType: "ROLE",
            role: "REVIVAL"
        }).success).toBe(false);
        expect(permissionGrantFormSchema.safeParse({...valid, validUntil: "2000-01-01"}).success).toBe(false);
    });
});

describe("toCreateInput", () => {
    it("sends only the fields that match the grantee type and scope", () => {
        expect(toCreateInput({...valid, role: "USER", spexareId: "9"})).toEqual({
            userId: "7",
            role: null,
            permission: "WRITE",
            scope: "SPEX_PARTICIPANTS",
            spexareId: null,
            spexId: "3",
            validUntil: null,
        });
    });
});

describe("permissionGrantUpdateFormSchema", () => {
    it("accepts a new permission with or without an end date", () => {
        expect(permissionGrantUpdateFormSchema.safeParse({permission: "READ"}).success).toBe(true);
        expect(permissionGrantUpdateFormSchema.safeParse({
            permission: "READ",
            validUntil: "2099-12-31"
        }).success).toBe(true);
    });

    it("refuses end dates in the past", () => {
        expect(permissionGrantUpdateFormSchema.safeParse({
            permission: "READ",
            validUntil: "2000-01-01"
        }).success).toBe(false);
    });

    it("sends a cleared end date as null", () => {
        expect(toUpdateInput("g1", {permission: "DELETE", validUntil: ""})).toEqual({
            id: "g1",
            permission: "DELETE",
            validUntil: null
        });
    });
});
