import type {ReactNode} from "react";
import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {SpexareCard} from "@/components/spexare/spexare-card.client";
import {SpexareViewDialog} from "@/components/spexare/spexare-view-dialog.client";
import {SpexareEditSheet} from "@/components/spexare/spexare-edit-sheet.client";
import type {Spexare} from "@/gql/schema";

vi.mock("next/image", () => ({default: () => <span data-slot="mock-image"/>}));
vi.mock("next/link", () => ({
    default: ({children, href}: { children?: ReactNode; href: string }) => <a href={href}>{children}</a>
}));
vi.mock("@/components/spexare/spexare-view.client", () => ({
    SpexareView: ({spexare}: { spexare: { firstName: string } }) => <div
        data-testid="spexare-view">{spexare.firstName}</div>,
}));
vi.mock("@/components/spexare/spexare-form.client", () => ({
    SpexareForm: () => <div data-testid="spexare-form"/>,
}));

const spexare = {
    id: "s1", firstName: "Ada", lastName: "Lovelace", nickName: "Countess",
    deceased: false, published: true, imageUrl: null,
} as unknown as Spexare;

describe("SpexareCard", () => {
    it("renders the name and nickname", () => {
        render(<SpexareCard spexare={spexare} index={0} isMe={false} canEdit={false} onSelect={vi.fn()}
                            onEdit={vi.fn()}/>);
        expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
        expect(screen.getByText("Countess")).toBeInTheDocument();
    });

    it("fires onEdit from the edit button when editable and not the current user", async () => {
        const onEdit = vi.fn();
        render(<SpexareCard spexare={spexare} index={0} isMe={false} canEdit onSelect={vi.fn()} onEdit={onEdit}/>);
        await userEvent.click(screen.getByRole("button"));
        expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it("fires onSelect when the card body is clicked", async () => {
        const onSelect = vi.fn();
        render(<SpexareCard spexare={spexare} index={0} isMe={false} canEdit={false} onSelect={onSelect}
                            onEdit={vi.fn()}/>);
        await userEvent.click(screen.getByText("Ada Lovelace"));
        expect(onSelect).toHaveBeenCalled();
    });

    it("renders no edit control when not editable", () => {
        render(<SpexareCard spexare={spexare} index={0} isMe={false} canEdit={false} onSelect={vi.fn()}
                            onEdit={vi.fn()}/>);
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
});

describe("SpexareViewDialog", () => {
    it("renders the full view and closes via the footer button", async () => {
        const onClose = vi.fn();
        render(<SpexareViewDialog open onClose={onClose} full={spexare} isLoading={false} countries={[]}
                                  isMe={false}/>);
        expect(screen.getByTestId("spexare-view")).toHaveTextContent("Ada");
        await userEvent.click(screen.getByRole("button", {name: /Common.close/}));
        expect(onClose).toHaveBeenCalled();
    });

    it("shows a loading state instead of the view", () => {
        render(<SpexareViewDialog open onClose={vi.fn()} full={null} isLoading countries={[]} isMe={false}/>);
        expect(screen.queryByTestId("spexare-view")).not.toBeInTheDocument();
    });

    it("renders nothing when closed", () => {
        render(<SpexareViewDialog open={false} onClose={vi.fn()} full={spexare} isLoading={false} countries={[]}
                                  isMe={false}/>);
        expect(screen.queryByTestId("spexare-view")).not.toBeInTheDocument();
    });
});

describe("SpexareEditSheet", () => {
    const baseProps = {
        onClose: vi.fn(), onSuccess: vi.fn(), isLoading: false,
        types: [], countries: [], tags: [], tasks: [], taskCategories: [], spex: [], spexCategories: [],
    };

    it("renders the form when open with a full item", () => {
        render(<SpexareEditSheet {...baseProps} open full={spexare}/>);
        expect(screen.getByTestId("spexare-form")).toBeInTheDocument();
    });

    it("renders nothing when closed", () => {
        render(<SpexareEditSheet {...baseProps} open={false} full={null}/>);
        expect(screen.queryByTestId("spexare-form")).not.toBeInTheDocument();
    });
});
