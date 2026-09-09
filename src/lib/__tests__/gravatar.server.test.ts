import {describe, expect, it} from "vitest";
import {createHash} from "node:crypto";
import {gravatarImageUrl} from "@/lib/gravatar.server";

describe("gravatarImageUrl", () => {
    it("returns undefined for empty / whitespace-only email", () => {
        expect(gravatarImageUrl(undefined)).toBeUndefined();
        expect(gravatarImageUrl(null)).toBeUndefined();
        expect(gravatarImageUrl("   ")).toBeUndefined();
    });

    it("hashes the normalized email into a gravatar URL", () => {
        const expected = createHash("sha256").update("ada@example.com").digest("hex");
        expect(gravatarImageUrl("  Ada@Example.com ")).toBe(
            `https://www.gravatar.com/avatar/${expected}?d=404&s=128`,
        );
    });
});
