import {describe, expect, it} from "vitest";
import {textFilter} from "@/utils/filter";

describe("textFilter", () => {
    it("returns an empty filter for blank input", () => {
        expect(textFilter(["name"], "")).toBe("");
        expect(textFilter(["name"], "   ")).toBe("");
    });

    it("matches a single word on a single field", () => {
        expect(textFilter(["name"], "Curie")).toBe("name:*Curie*");
    });

    it("requires every word to match", () => {
        expect(textFilter(["subject"], "  Nu   finns ")).toBe("subject:*Nu* AND subject:*finns*");
    });

    it("lets each word match any of several fields", () => {
        expect(textFilter(["year", "details.title"], "2019 Gauss")).toBe(
            "(year:*2019* OR details.title:*2019*) AND (year:*Gauss* OR details.title:*Gauss*)",
        );
    });

    it("strips characters the backend parser treats as syntax", () => {
        expect(textFilter(["name"], "(Ka*rl)")).toBe("name:*Karl*");
        expect(textFilter(["name"], "*** ()")).toBe("");
    });

    it("drops words the backend parser would read as operators", () => {
        expect(textFilter(["name"], "Romeo and Julia OR")).toBe("name:*Romeo* AND name:*Julia*");
    });
});
