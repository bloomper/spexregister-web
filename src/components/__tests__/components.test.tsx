import {createRef} from "react";
import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DataEmpty} from "@/components/data-empty";
import {Translated} from "@/components/translated.client";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {DataFilter} from "@/components/data-filter";
import {SE, US} from "@/components/flags";

describe("Translated", () => {
    it("renders the translated message for the given id", () => {
        render(<Translated id="Common.loading"/>);
        expect(screen.getByText("Common.loading")).toBeInTheDocument();
    });
});

describe("DataEmpty", () => {
    it("falls back to the default heading and description keys", () => {
        render(<DataEmpty/>);
        expect(screen.getByText("Common.noDataHeading")).toBeInTheDocument();
        expect(screen.getByText("Common.noDataDescription")).toBeInTheDocument();
    });

    it("prefers explicit title and description props", () => {
        render(<DataEmpty title="Nothing here" description="Try again later"/>);
        expect(screen.getByText("Nothing here")).toBeInTheDocument();
        expect(screen.getByText("Try again later")).toBeInTheDocument();
    });
});

describe("InfiniteScrollFooter", () => {
    const baseProps = {
        sentinelRef: createRef<HTMLDivElement>(),
        loading: false,
        error: null,
        hasNextPage: true,
        itemsCount: 0,
        onRetry: vi.fn(),
    };

    it("shows a loading indicator while loading", () => {
        render(<InfiniteScrollFooter {...baseProps} loading/>);
        expect(screen.getByText("Common.loading")).toBeInTheDocument();
    });

    it("shows the end-of-list message when there is no next page", () => {
        render(<InfiniteScrollFooter {...baseProps} hasNextPage={false} itemsCount={3}/>);
        expect(screen.getByText("Common.noMoreDataFound")).toBeInTheDocument();
    });

    it("renders an error state and calls onRetry when the button is clicked", async () => {
        const onRetry = vi.fn();
        render(<InfiniteScrollFooter {...baseProps} error="failed" onRetry={onRetry}/>);

        expect(screen.getByText("Common.couldNotLoadData")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", {name: /Common.tryAgain/}));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });
});

describe("DataFilter", () => {
    const options = [
        {label: "Alpha", value: "a"},
        {label: "Beta", value: "b"},
    ];

    it("renders the title and a count of the selected values", () => {
        render(
            <DataFilter
                title="Status"
                options={options}
                selectedValues={new Set(["a"])}
                onSelect={vi.fn()}
            />,
        );

        expect(screen.getByText("Status")).toBeInTheDocument();
        // Interpolated count is serialised by the next-intl test mock.
        expect(screen.getByText('Common.selected:{"count":1}')).toBeInTheDocument();
    });

    it("omits the selected count when nothing is selected", () => {
        render(
            <DataFilter title="Status" options={options} selectedValues={new Set()} onSelect={vi.fn()}/>,
        );
        expect(screen.queryByText(/Common.selected/)).not.toBeInTheDocument();
    });
});

describe("flag icons", () => {
    it("renders decorative flags as aria-hidden svgs", () => {
        const {container} = render(
            <>
                <SE/>
                <US/>
            </>,
        );
        const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
        expect(svgs).toHaveLength(2);
    });

    it("exposes a title (and drops aria-hidden) when a title is provided", () => {
        render(<SE title="Sweden"/>);
        expect(screen.getByTitle("Sweden")).toBeInTheDocument();
    });
});
