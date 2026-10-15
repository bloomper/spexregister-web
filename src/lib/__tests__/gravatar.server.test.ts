import {afterEach, describe, expect, it, vi} from "vitest";
import {createHash} from "node:crypto";
import {gravatarImageUrl, resolveGravatarImage} from "@/lib/gravatar.server";

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

describe("resolveGravatarImage", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("keeps the URL when a gravatar exists", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, {status: 200})));

        await expect(resolveGravatarImage("ada@example.com")).resolves.toBe(gravatarImageUrl("ada@example.com"));
    });

    it("drops the URL when there is no gravatar", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, {status: 404})));

        await expect(resolveGravatarImage("ada@example.com")).resolves.toBeUndefined();
    });

    it("drops the URL when gravatar cannot be reached", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

        await expect(resolveGravatarImage("ada@example.com")).resolves.toBeUndefined();
    });

    it("does not look anything up without an email", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        await expect(resolveGravatarImage(null)).resolves.toBeUndefined();
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
