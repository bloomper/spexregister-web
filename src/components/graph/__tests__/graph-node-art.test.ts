import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {drawCaption, drawFallback, drawImage} from "@/components/graph/graph-node-art.client";
import {GraphNodeType} from "@/gql/schema";

function fakeContext() {
    return {
        arc: vi.fn(), beginPath: vi.fn(), closePath: vi.fn(), clip: vi.fn(), drawImage: vi.fn(), fill: vi.fn(),
        fillText: vi.fn(), measureText: vi.fn((text: string) => ({width: text.length * 10})), restore: vi.fn(),
        save: vi.fn(), scale: vi.fn(), stroke: vi.fn(), strokeText: vi.fn(), translate: vi.fn(),
    };
}

let contexts: ReturnType<typeof fakeContext>[] = [];

beforeEach(() => {
    contexts = [];
    vi.stubGlobal("Path2D", class {
        constructor(public readonly path: string) {
        }
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
        const context = fakeContext();

        contexts.push(context);
        return context as never;
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("drawCaption", () => {
    it("sizes the canvas to the measured label", () => {
        const {canvas, aspect} = drawCaption("Ada", "#f00", "#000");

        expect(canvas.width).toBe(30 + 48);
        expect(aspect).toBe(canvas.width / 128);
        expect(contexts[1].strokeText).toHaveBeenCalledWith("Ada", canvas.width / 2, 64);
        expect(contexts[1].fillText).toHaveBeenCalledWith("Ada", canvas.width / 2, 64);
    });

    it("shortens a long label", () => {
        drawCaption("A very long name that goes on and on", "#f00", "#000");

        expect(contexts[1].fillText.mock.calls[0][0]).toBe("A very long name that g…");
    });

    it("estimates the width without a 2D context", () => {
        vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);

        const {canvas} = drawCaption("Ada", "#f00", "#000");

        expect(canvas.width).toBe(Math.ceil(3 * 84 * 0.6) + 48);
    });
});

describe("drawFallback", () => {
    it("draws the glyph on a disc with one ring", () => {
        const canvas = drawFallback(GraphNodeType.Spexare, "#0f0", false);

        expect(canvas.width).toBe(192);
        expect(contexts[0].fill).toHaveBeenCalled();
        expect(contexts[0].arc).toHaveBeenCalledTimes(2);
    });

    it("adds a second ring for a revival", () => {
        drawFallback(GraphNodeType.Spex, "#0f0", true);

        expect(contexts[0].arc).toHaveBeenCalledTimes(3);
    });

    it("returns a blank canvas without a 2D context", () => {
        vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);

        expect(drawFallback(GraphNodeType.Tag, "#0f0", false).width).toBe(192);
    });
});

describe("drawImage", () => {
    it("covers the disc with the image", () => {
        const image = {width: 100, height: 200} as HTMLImageElement;

        drawImage(image, "#00f", true);

        expect(contexts[0].clip).toHaveBeenCalled();
        expect(contexts[0].drawImage).toHaveBeenCalledWith(image, 0, 96 - 192, 192, 384);
    });

    it("returns a blank canvas without a 2D context", () => {
        vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);

        expect(drawImage({width: 1, height: 1} as HTMLImageElement, "#00f", false).height).toBe(192);
    });
});
