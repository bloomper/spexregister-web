import {describe, expect, it} from "vitest";
import {spexareLabel} from "@/components/map/spexare-label";

describe("spexareLabel", () => {
    it("puts the nickname in quotes between the names", () => {
        expect(spexareLabel({firstName: "Ada", nickName: "Countess", lastName: "Lovelace"})).toBe("Ada \"Countess\" Lovelace");
    });

    it("skips missing parts", () => {
        expect(spexareLabel({firstName: "Ada", nickName: null, lastName: "Lovelace"})).toBe("Ada Lovelace");
        expect(spexareLabel({firstName: null, nickName: "Countess", lastName: undefined})).toBe("\"Countess\"");
    });
});
