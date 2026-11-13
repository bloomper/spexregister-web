import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SpexCard} from "@/components/spex/spex-card.client";
import {SpexViewDialog} from "@/components/spex/spex-view-dialog.client";

import type {Spex} from "@/gql/schema";

vi.mock("next/image", () => ({default: () => <span data-slot="mock-image"/>}));
vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));
vi.mock("@/app/(app)/spex/actions.server", () => ({
    getRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn()
}));
vi.mock("@/components/spex/spex-form.client", () => ({SpexForm: () => <div data-testid="spex-form"/>}));

const spex = {
    id: "sp1", title: "Hamlet", year: "2020", posterUrl: null,
    category: {id: "c1", name: "Chalmersspexet"}, revivals: [],
} as unknown as Spex;

describe("SpexCard", () => {
    it("renders title, year and category", () => {
        render(<SpexCard spex={spex} index={0} onSelect={vi.fn()}/>);
        expect(screen.getByText("Hamlet")).toBeInTheDocument();
        expect(screen.getByText("2020")).toBeInTheDocument();
        expect(screen.getByText("Chalmersspexet")).toBeInTheDocument();
    });

    it("fires onSelect when the title is clicked", async () => {
        const onSelect = vi.fn();
        render(<SpexCard spex={spex} index={0} onSelect={onSelect}/>);
        await userEvent.click(screen.getByText("Hamlet"));
        expect(onSelect).toHaveBeenCalled();
    });
});

describe("SpexViewDialog", () => {
    it("renders the spex detail and closes", async () => {
        const onClose = vi.fn();
        render(<SpexViewDialog selected={spex} onClose={onClose}/>);
        expect(screen.getByText("Hamlet")).toBeInTheDocument();
        expect(screen.getByText("Chalmersspexet")).toBeInTheDocument();
        expect(screen.getByTestId("audit-trail")).toBeInTheDocument();
        // The footer's button; the corner's X, after it, has the same name
        await userEvent.click(screen.getAllByRole("button", {name: /Common.close/})[0]);
        expect(onClose).toHaveBeenCalled();
    });

    it("renders nothing when there is no selection", () => {
        render(<SpexViewDialog selected={null} onClose={vi.fn()}/>);
        expect(screen.queryByTestId("audit-trail")).not.toBeInTheDocument();
    });
});

