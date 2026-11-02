import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {PartnerManager} from "@/components/spexare/partner/partner-manager.client";
import * as actions from "@/app/(app)/spexare/actions.server";
import type {Spexare} from "@/gql/schema";
import {toast} from "sonner";

const refresh = vi.hoisted(() => vi.fn());

vi.mock("@/app/(app)/spexare/actions.server", () => ({
    getPageAction: vi.fn(),
    addPartnerAction: vi.fn(),
    removePartnerAction: vi.fn(),
}));
vi.mock("@/hooks/use-refresh.client", () => ({useRefresh: () => refresh}));
vi.mock("next/navigation", () => ({useRouter: () => ({refresh})}));
vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn()}}));

const grace = {id: "x2", firstName: "Grace", lastName: "Hopper", published: false, imageUrl: null, partner: null} as unknown as Spexare;
const charles = {
    id: "x3", firstName: "Charles", lastName: "Babbage", published: true, imageUrl: null,
    partner: {id: "x4", firstName: "Georgiana", lastName: "Whitmore"},
} as unknown as Spexare;
const self = {id: "x1", firstName: "Ada", lastName: "Lovelace", published: true, imageUrl: null} as unknown as Spexare;

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(actions.getPageAction).mockResolvedValue({items: [self, grace, charles]} as never);
    vi.mocked(actions.addPartnerAction).mockResolvedValue(undefined as never);
    vi.mocked(actions.removePartnerAction).mockResolvedValue(undefined as never);
});

describe("PartnerManager", () => {
    it("searches for a partner, leaving out the spexare themselves, and links one", async () => {
        render(<PartnerManager spexareId="x1"/>);

        await userEvent.type(screen.getByPlaceholderText("Common.search"), "gr");

        expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
        expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
        expect(screen.getByText("Spexare.partner (Georgiana Whitmore)")).toBeInTheDocument();
        expect(JSON.stringify(vi.mocked(actions.getPageAction).mock.lastCall)).toContain("published:TRUE OR published:FALSE");

        await userEvent.click(screen.getAllByRole("button", {name: /Common.add/})[0]);

        await waitFor(() => expect(actions.addPartnerAction).toHaveBeenCalledWith("x1", "x2"));
        expect(toast.success).toHaveBeenCalledWith("Common.updateSuccess");
        expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
    });

    it("waits for two characters before searching", async () => {
        render(<PartnerManager spexareId="x1"/>);

        await userEvent.type(screen.getByPlaceholderText("Common.search"), "g");
        await new Promise((resolve) => setTimeout(resolve, 400));

        expect(actions.getPageAction).not.toHaveBeenCalled();
    });

    it("unlinks the partner", async () => {
        render(<PartnerManager spexareId="x1" initialPartner={grace}/>);

        expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
        expect(screen.getByText("Spexare.publishedBadges.false")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button"));

        await waitFor(() => expect(actions.removePartnerAction).toHaveBeenCalledWith("x1"));
        expect(await screen.findByPlaceholderText("Common.search")).toBeInTheDocument();
    });

    it("reports failures", async () => {
        vi.mocked(actions.getPageAction).mockRejectedValue(new Error("boom"));
        vi.mocked(actions.removePartnerAction).mockRejectedValue(new Error("boom"));
        const {unmount} = render(<PartnerManager spexareId="x1"/>);

        await userEvent.type(screen.getByPlaceholderText("Common.search"), "gr");
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred"));
        unmount();

        render(<PartnerManager spexareId="x1" initialPartner={grace}/>);
        await userEvent.click(screen.getByRole("button"));
        await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(2));
    });
});
