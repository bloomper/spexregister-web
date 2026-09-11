import {describe, expect, it} from "vitest";
import {auditFieldLabel, auditFieldValue} from "@/utils/audit";
import {AuditedType} from "@/gql/schema";
import sv from "../../../messages/sv.json";

const lookup = (key: string): unknown =>
    key.split(".").reduce<unknown>((node, part) =>
        node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined, sv);

const t = Object.assign(
    (key: string) => String(lookup(key)),
    {has: (key: string) => typeof lookup(key) === "string"},
);

describe("auditFieldLabel", () => {
    it("uses the entity's own field label", () => {
        expect(auditFieldLabel(t, AuditedType.SpexCategory, "name")).toBe("Namn");
        expect(auditFieldLabel(t, AuditedType.SpexCategory, "firstYear")).toBe("Första året");
        expect(auditFieldLabel(t, AuditedType.Spexare, "firstName")).toBe("Förnamn");
        expect(auditFieldLabel(t, AuditedType.Address, "streetAddress")).toBe("Gatuadress");
    });

    it("maps a binary column onto the label the form uses", () => {
        expect(auditFieldLabel(t, AuditedType.SpexCategory, "logo")).toBe("Logo");
    });

    it("falls back to the shared audit labels for technical fields", () => {
        // The wording is free to change; what matters is that a technical name never reaches the user.
        expect(auditFieldLabel(t, AuditedType.SpexCategory, "logoContentType")).not.toBe("logoContentType");
        expect(auditFieldLabel(t, AuditedType.Spex, "details")).not.toBe("details");
    });

    it("humanizes a field nobody has translated rather than leaking the identifier", () => {
        expect(auditFieldLabel(t, AuditedType.Tag, "somethingUnmapped")).toBe("Something unmapped");
        expect(auditFieldLabel(t, AuditedType.Tag, "url")).toBe("Url");
    });

    it("has a translation for the audited association fields", () => {
        // The wording is yours to tune; what matters is that each one resolves to something.
        const associations: [AuditedType, string][] = [
            [AuditedType.Activity, "spexActivity"],
            [AuditedType.Activity, "spexare"],
            [AuditedType.Actor, "taskActivity"],
            [AuditedType.Spexare, "partner"],
            [AuditedType.Spex, "details"],
            [AuditedType.Spex, "parent"],
        ];

        associations.forEach(([type, field]) => {
            const label = auditFieldLabel(t, type, field);

            expect(label, `${type}.${field}`).not.toBe(field);
            expect(label, `${type}.${field}`).toBeTruthy();
        });
    });

    it("resolves a label for every audited type", () => {
        Object.values(AuditedType).forEach((type) => {
            expect(auditFieldLabel(t, type, "name")).toBeTruthy();
        });
    });
});

describe("auditFieldValue", () => {
    it("localizes booleans", () => {
        expect(auditFieldValue(t, AuditedType.Spexare, "deceased", "true")).toBe("Ja");
        expect(auditFieldValue(t, AuditedType.Spexare, "deceased", "false")).toBe("Nej");
    });

    it("prefers the entity's own wording for the two states", () => {
        expect(auditFieldValue(t, AuditedType.News, "published", "true")).toBe("Publicerad");
        expect(auditFieldValue(t, AuditedType.News, "published", "false")).toBe("Utkast");
    });

    it("falls back to a plain yes/no when the entity has no wording", () => {
        expect(auditFieldValue(t, AuditedType.TaskCategory, "actorPresent", "true")).toBe("Ja");
        expect(auditFieldValue(t, AuditedType.Toggle, "value", "false")).toBe("Nej");
    });

    it("leaves every other value untouched", () => {
        expect(auditFieldValue(t, AuditedType.Spexare, "firstName", "Abraham")).toBe("Abraham");
        expect(auditFieldValue(t, AuditedType.Spex, "year", "2020")).toBe("2020");
        expect(auditFieldValue(t, AuditedType.Spexare, "comment", "")).toBe("");
    });
});
