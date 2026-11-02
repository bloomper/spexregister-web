import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SpexareMap} from "@/components/map/spexare-map.client";
import type {SpexareLocation} from "@/lib/map/map.server";
import {useLazyFull} from "@/hooks/use-lazy-full.client";

type StubProps = { locations: SpexareLocation[]; onOpen: (id: string) => void };

vi.mock("next/dynamic", () => ({
    default: () => function LeafletStub({locations, onOpen}: StubProps) {
        return (
            <ul>
                {locations.map(location => (
                    <li key={location.id}>
                        <button onClick={() => onOpen(location.id)}>{location.firstName}</button>
                    </li>
                ))}
            </ul>
        );
    },
}));
vi.mock("@/hooks/use-lazy-full.client", () => ({
    useLazyFull: vi.fn(() => ({full: null, isLoading: false})),
}));
vi.mock("@/app/(app)/spexare/actions.server", () => ({getAction: vi.fn()}));
vi.mock("@/components/spexare/spexare-view-dialog.client", () => ({
    SpexareViewDialog: ({open}: { open: boolean }) => (open ? <div role="dialog">details</div> : null),
}));

const locations: SpexareLocation[] = [
    {id: "1", firstName: "Ada", lastName: "Lovelace", nickName: "Countess", latitude: 57.7, longitude: 11.9},
    {id: "2", firstName: "Grace", lastName: "Hopper", nickName: null, latitude: 59.3, longitude: 18.0},
];

beforeEach(() => {
    vi.clearAllMocks();
});

describe("SpexareMap", () => {
    it("shows an empty state without locations", () => {
        render(<SpexareMap locations={[]} countries={[]}/>);

        expect(screen.getByText("emptyTitle")).toBeInTheDocument();
    });

    it("shows every location and counts them", () => {
        render(<SpexareMap locations={locations} countries={[]}/>);

        expect(screen.getByRole("button", {name: "Ada"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Grace"})).toBeInTheDocument();
        expect(screen.getByText(`count:${JSON.stringify({shown: 2, total: 2})}`)).toBeInTheDocument();
    });

    it("filters by name, nickname included", async () => {
        render(<SpexareMap locations={locations} countries={[]}/>);

        await userEvent.type(screen.getByRole("textbox", {name: "filterPlaceholder"}), "countess");

        expect(screen.getByRole("button", {name: "Ada"})).toBeInTheDocument();
        expect(screen.queryByRole("button", {name: "Grace"})).not.toBeInTheDocument();
        expect(screen.getByText(`count:${JSON.stringify({shown: 1, total: 2})}`)).toBeInTheDocument();
    });

    it("opens the details of a clicked spexare", async () => {
        render(<SpexareMap locations={locations} countries={[]}/>);

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", {name: "Grace"}));

        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(vi.mocked(useLazyFull).mock.lastCall?.[0]).toBe("2");
    });
});
