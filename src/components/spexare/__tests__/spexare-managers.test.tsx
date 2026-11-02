import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ToggleManager} from "@/components/spexare/toggle/toggle-manager.client";
import {ConsentManager} from "@/components/spexare/consent/consent-manager.client";
import {AddressManager} from "@/components/spexare/address/address-manager.client";
import {MembershipManager} from "@/components/spexare/membership/membership-manager.client";
import {TaggingManager} from "@/components/spexare/tagging/tagging-manager.client";
import * as actions from "@/app/(app)/spexare/actions.server";
import {type Address, type Consent, type Membership, type Tag, type Toggle, type Type, TypeType} from "@/gql/schema";
import {toast} from "sonner";

const refresh = vi.hoisted(() => vi.fn());

vi.mock("@/app/(app)/spexare/actions.server", () => ({
    createToggleAction: vi.fn(), updateToggleAction: vi.fn(), deleteToggleAction: vi.fn(),
    createConsentAction: vi.fn(), updateConsentAction: vi.fn(), deleteConsentAction: vi.fn(),
    createAddressAction: vi.fn(), updateAddressAction: vi.fn(), deleteAddressAction: vi.fn(),
    createMembershipAction: vi.fn(), deleteMembershipAction: vi.fn(),
    createTaggingAction: vi.fn(), deleteTaggingAction: vi.fn(),
}));
vi.mock("@/hooks/use-refresh.client", () => ({useRefresh: () => refresh}));
vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn()}}));
vi.mock("@/components/audit/aggregate-audit-trail.client", () => ({AggregateAuditTrail: () => null}));

const type = (id: string, kind: TypeType, label = id) => ({id, type: kind, label}) as Type;
const rowOf = (text: string) => screen.getByText(text).closest(".group") as HTMLElement;

beforeEach(() => {
    vi.clearAllMocks();
});

describe("ToggleManager", () => {
    const types = [type("NEWSLETTER", TypeType.Toggle, "Nyhetsbrev"), type("PHOTO", TypeType.Toggle, "Foto")];
    const toggles = [{id: "g1", type: types[0], value: true}] as Toggle[];

    it("adds a toggle of an unused type", async () => {
        render(<ToggleManager spexareId="s1" initialToggles={toggles} types={types}/>);

        await userEvent.click(screen.getByRole("button", {name: "Common.add"}));
        await userEvent.click(screen.getByRole("switch"));
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));

        await waitFor(() => expect(actions.createToggleAction).toHaveBeenCalledWith("s1", "PHOTO", {typeId: "PHOTO", value: true}));
        expect(refresh).toHaveBeenCalled();
    });

    it("edits and deletes a toggle", async () => {
        render(<ToggleManager spexareId="s1" initialToggles={toggles} types={types}/>);

        expect(screen.getByText("Common.yes")).toBeInTheDocument();
        const [edit, remove] = within(rowOf("Nyhetsbrev")).getAllByRole("button");

        await userEvent.click(remove);
        await waitFor(() => expect(actions.deleteToggleAction).toHaveBeenCalledWith("s1", "NEWSLETTER", "g1"));

        await userEvent.click(edit);
        await userEvent.click(screen.getByRole("switch"));
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));
        await waitFor(() => expect(actions.updateToggleAction).toHaveBeenCalledWith("s1", "NEWSLETTER", "g1", {typeId: "NEWSLETTER", value: false}));
    });

    it("reports failures and shows an empty state", async () => {
        vi.mocked(actions.createToggleAction).mockRejectedValue(new Error("boom"));
        render(<ToggleManager spexareId="s1" initialToggles={[]} types={types}/>);

        await userEvent.click(screen.getByRole("button", {name: "Common.add"}));
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred"));
        await userEvent.click(screen.getByRole("button", {name: "Common.cancel"}));
        expect(screen.queryByRole("button", {name: "Common.save"})).not.toBeInTheDocument();
    });
});

describe("ConsentManager", () => {
    const types = [type("REGISTER", TypeType.Consent, "Registret"), type("PUBLISH", TypeType.Consent, "Publicering")];
    const consents = [{id: "c1", type: types[0], value: false}] as Consent[];

    it("adds, edits and deletes consents", async () => {
        render(<ConsentManager spexareId="s1" initialConsents={consents} types={types}/>);

        await userEvent.click(screen.getByRole("button", {name: "Common.add"}));
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));
        await waitFor(() => expect(actions.createConsentAction).toHaveBeenCalledWith("s1", "PUBLISH", {typeId: "PUBLISH", value: false}));

        const [edit, remove] = within(rowOf("Registret")).getAllByRole("button");

        await userEvent.click(remove);
        await waitFor(() => expect(actions.deleteConsentAction).toHaveBeenCalledWith("s1", "REGISTER", "c1"));

        await userEvent.click(edit);
        await userEvent.click(screen.getByRole("switch"));
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));
        await waitFor(() => expect(actions.updateConsentAction).toHaveBeenCalledWith("s1", "REGISTER", "c1", {typeId: "REGISTER", value: true}));
    });

    it("reports a failed delete", async () => {
        vi.mocked(actions.deleteConsentAction).mockRejectedValue(new Error("boom"));
        render(<ConsentManager spexareId="s1" initialConsents={consents} types={types}/>);

        await userEvent.click(within(rowOf("Registret")).getAllByRole("button")[1]);

        await waitFor(() => expect(toast.error).toHaveBeenCalled());
    });
});

describe("AddressManager", () => {
    const types = [type("HOME", TypeType.Address, "Hem"), type("WORK", TypeType.Address, "Arbete")];
    const addresses = [{
        id: "a1", type: types[0], streetAddress: "Kemigården 1", postalCode: "412 96", city: "Göteborg", country: "SE",
        phone: null, phoneMobile: null, emailAddress: null,
    }] as unknown as Address[];

    it("adds an address", async () => {
        render(<AddressManager spexareId="s1" initialAddresses={addresses} types={types} countries={[]}/>);

        await userEvent.click(screen.getByRole("button", {name: "Common.add"}));
        await userEvent.type(screen.getAllByRole("textbox")[0], "Hörsalsvägen 2");
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));

        await waitFor(() => expect(actions.createAddressAction).toHaveBeenCalledWith("s1", "WORK",
            expect.objectContaining({typeId: "WORK", streetAddress: "Hörsalsvägen 2"})));
    });

    it("edits and deletes an address", async () => {
        render(<AddressManager spexareId="s1" initialAddresses={addresses} types={types} countries={[]}/>);

        const row = rowOf("Kemigården 1");
        const buttons = within(row).getAllByRole("button");

        await userEvent.click(buttons[buttons.length - 1]);
        await waitFor(() => expect(actions.deleteAddressAction).toHaveBeenCalledWith("s1", "HOME", "a1"));

        await userEvent.click(within(rowOf("Kemigården 1")).getAllByRole("button")[0]);
        const street = screen.getByDisplayValue("Kemigården 1");

        await userEvent.clear(street);
        await userEvent.type(street, "Kemigården 2");
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));
        await waitFor(() => expect(actions.updateAddressAction).toHaveBeenCalledWith("s1", "HOME", "a1",
            expect.objectContaining({streetAddress: "Kemigården 2"})));
    });
});

describe("MembershipManager", () => {
    const types = [type("FGV", TypeType.Membership, "FGV")];
    const memberships = [{id: "m1", type: types[0], year: "2020"}] as unknown as Membership[];

    it("adds a membership for a year", async () => {
        render(<MembershipManager spexareId="s1" initialMemberships={memberships} types={types}/>);

        await userEvent.click(screen.getByRole("button", {name: "Common.add"}));
        await userEvent.click(screen.getAllByRole("combobox")[1]);
        await userEvent.click(await screen.findByRole("option", {name: "2021"}));
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));

        await waitFor(() => expect(actions.createMembershipAction).toHaveBeenCalledWith("s1", "FGV", {typeId: "FGV", year: "2021"}));
    });

    it("deletes a membership", async () => {
        render(<MembershipManager spexareId="s1" initialMemberships={memberships} types={types}/>);

        const row = screen.getByText("2020").closest(".group") as HTMLElement;

        await userEvent.click(within(row).getAllByRole("button").at(-1)!);

        await waitFor(() => expect(actions.deleteMembershipAction).toHaveBeenCalledWith("s1", "FGV", "m1"));
    });
});

describe("TaggingManager", () => {
    const tags = [{id: "t1", name: "Hedersmedlem"}, {id: "t2", name: "Styrelse"}] as Tag[];

    it("adds and removes tags", async () => {
        render(<TaggingManager spexareId="s1" initialTaggings={[tags[0]]} allTags={tags}/>);

        await userEvent.click(screen.getByRole("button", {name: "Common.add"}));
        await userEvent.click(await screen.findByRole("option", {name: "Styrelse"}));
        await waitFor(() => expect(actions.createTaggingAction).toHaveBeenCalledWith("s1", "t2"));

        await userEvent.click(within(screen.getByText("Hedersmedlem")).getByRole("button"));
        await waitFor(() => expect(actions.deleteTaggingAction).toHaveBeenCalledWith("s1", "t1"));
    });

    it("shows an empty state and reports failures", async () => {
        vi.mocked(actions.createTaggingAction).mockRejectedValue(new Error("boom"));
        render(<TaggingManager spexareId="s1" initialTaggings={[]} allTags={tags}/>);

        await userEvent.click(screen.getByRole("button", {name: "Common.add"}));
        await userEvent.click(await screen.findByRole("option", {name: "Hedersmedlem"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalled());
    });
});
