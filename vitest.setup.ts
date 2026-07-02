import "@testing-library/jest-dom/vitest";
import {afterEach, vi} from "vitest";
import {cleanup} from "@testing-library/react";

afterEach(() => {
    cleanup();
});

vi.mock("next-intl", () => ({
    useTranslations: () => (key: string, values?: Record<string, unknown>) =>
        values ? `${key}:${JSON.stringify(values)}` : key,
    useLocale: () => "sv",
}));

class MockIntersectionObserver implements IntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];

    callback: IntersectionObserverCallback;
    elements = new Set<Element>();

    constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        MockIntersectionObserver.instances.push(this);
    }

    observe = (el: Element) => {
        this.elements.add(el);
    };
    unobserve = (el: Element) => {
        this.elements.delete(el);
    };
    disconnect = () => {
        this.elements.clear();
    };
    takeRecords = (): IntersectionObserverEntry[] => [];

    trigger(isIntersecting: boolean) {
        const entries = Array.from(this.elements).map(
            (target) => ({isIntersecting, target}) as IntersectionObserverEntry,
        );
        this.callback(entries, this);
    }
}

vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
);

export {MockIntersectionObserver};
