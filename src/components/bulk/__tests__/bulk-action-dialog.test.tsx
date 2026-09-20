import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {BulkActionDialog} from "@/components/bulk/bulk-action-dialog.client";
import type {BulkOptions} from "@/components/bulk/registry.client";
import {BulkResult, SpexareBulkInput, SpexareBulkOperation, Tag, Type} from "@/gql/schema";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({push: vi.fn(), replace: vi.fn(), refresh}),
    usePathname: () => "/spexare/manage",
}));

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("sonner", () => ({
    toast: {
        success: (...args: unknown[]) => toastSuccess(...args),
        error: (...args: unknown[]) => toastError(...args),
    },
}));

const tags = [
    {id: "7", name: "Sångare"},
    {id: "8", name: "Dansare"},
] as unknown as Tag[];

const types = [
    {id: "bilder", label: "Bilder", type: "CONSENT"},
    {id: "nyhetsbrev", label: "Nyhetsbrev", type: "CONSENT"},
    {id: "aktiv", label: "Aktiv", type: "TOGGLE"},
] as unknown as Type[];

const options: BulkOptions = {tags, spex: [], tasks: [], types};

const resultOf = (applied: number): BulkResult => ({
    operation: SpexareBulkOperation.TagAdd,
    requested: 3,
    applied,
    unchanged: 3 - applied,
    blocked: 0,
    entries: Array.from({length: applied}, (_, i) => ({
        id: String(i + 1),
        label: `Spexare ${i + 1}`,
        outcome: "APPLIED",
        detail: "Sångare",
    })),
}) as unknown as BulkResult;

const preview = vi.fn<(input: SpexareBulkInput) => Promise<BulkResult>>();
const apply = vi.fn<(input: SpexareBulkInput, reason: string) => Promise<BulkResult>>();

const renderDialog = (props: Partial<Parameters<typeof BulkActionDialog>[0]> = {}) =>
    render(
        <BulkActionDialog
            operation={SpexareBulkOperation.TagAdd}
            onClose={vi.fn()}
            options={options}
            actions={{preview, apply}}
            selectedIds={["1", "2", "3"]}
            filter={null}
            {...props}
        />,
    );

/** The picker is a popover; open it and tick a tag so the payload is complete. */
const pickTag = async (user: ReturnType<typeof userEvent.setup>, name: string) => {
    await user.click(screen.getByRole("button", {name: /Spexare\.bulk\.fields\.tags/}));
    await user.click(await screen.findByRole("button", {name}));
};

const previewButton = () => screen.getByRole("button", {name: "Spexare.bulk.preview"});
const applyButton = () => screen.getByRole("button", {name: /Spexare\.bulk\.apply/});

beforeEach(() => {
    preview.mockReset().mockResolvedValue(resultOf(2));
    apply.mockReset().mockResolvedValue(resultOf(2));
    refresh.mockClear();
    toastSuccess.mockClear();
    toastError.mockClear();
});

describe("BulkActionDialog", () => {
    it("renders nothing without an operation", () => {
        const {container} = renderDialog({operation: null});
        expect(container).toBeEmptyDOMElement();
    });

    it("cannot preview until the operation is complete", async () => {
        const user = userEvent.setup();
        renderDialog();

        expect(previewButton()).toBeDisabled();

        await pickTag(user, "Sångare");

        expect(previewButton()).toBeEnabled();
    });

    it("previews before it will apply, and never applies without one", async () => {
        const user = userEvent.setup();
        renderDialog();

        await pickTag(user, "Sångare");
        expect(screen.queryByRole("button", {name: /Spexare\.bulk\.apply/})).not.toBeInTheDocument();

        await user.click(previewButton());

        await waitFor(() => expect(applyButton()).toBeInTheDocument());
        expect(apply).not.toHaveBeenCalled();
        expect(preview).toHaveBeenCalledWith(
            expect.objectContaining({
                operation: SpexareBulkOperation.TagAdd,
                target: {ids: ["1", "2", "3"]},
                tags: ["7"],
            }),
        );
    });

    it("applies with a localized reason, then refreshes", async () => {
        const user = userEvent.setup();
        renderDialog();

        await pickTag(user, "Sångare");
        await user.click(previewButton());
        await waitFor(() => expect(applyButton()).toBeInTheDocument());
        await user.click(applyButton());

        await waitFor(() => expect(apply).toHaveBeenCalled());
        const [, reason] = apply.mock.calls[0];
        expect(reason).toContain("Spexare.bulk.reason");
        expect(toastSuccess).toHaveBeenCalled();
        expect(refresh).toHaveBeenCalled();
    });

    it("invalidates the preview when the payload changes, so the confirmed counts always match", async () => {
        const user = userEvent.setup();
        renderDialog();

        await pickTag(user, "Sångare");
        await user.click(previewButton());
        await waitFor(() => expect(applyButton()).toBeInTheDocument());

        await pickTag(user, "Dansare");

        expect(screen.queryByRole("button", {name: /Spexare\.bulk\.apply/})).not.toBeInTheDocument();
        expect(previewButton()).toBeEnabled();
    });

    it("will not apply when the preview says nothing would change", async () => {
        preview.mockResolvedValue(resultOf(0));
        const user = userEvent.setup();
        renderDialog();

        await pickTag(user, "Sångare");
        await user.click(previewButton());

        await waitFor(() => expect(applyButton()).toBeDisabled());
    });

    it("targets the filter when there is no selection", async () => {
        const user = userEvent.setup();
        renderDialog({selectedIds: [], filter: "published:TRUE"});

        await pickTag(user, "Sångare");
        await user.click(previewButton());

        await waitFor(() =>
            expect(preview).toHaveBeenCalledWith(
                expect.objectContaining({target: {filter: "published:TRUE"}}),
            ),
        );
    });

    it("offers only the consent types, and applies the switch value to each picked type", async () => {
        const user = userEvent.setup();
        renderDialog({operation: SpexareBulkOperation.ConsentSet});

        await user.click(screen.getByRole("button", {name: /Spexare\.bulk\.fields\.types/}));
        expect(screen.queryByRole("button", {name: "Aktiv"})).not.toBeInTheDocument();
        await user.click(await screen.findByRole("button", {name: "Bilder"}));
        await user.click(await screen.findByRole("button", {name: "Nyhetsbrev"}));

        await user.click(previewButton());

        await waitFor(() =>
            expect(preview).toHaveBeenCalledWith(
                expect.objectContaining({
                    operation: SpexareBulkOperation.ConsentSet,
                    values: [
                        {typeId: "bilder", value: true},
                        {typeId: "nyhetsbrev", value: true},
                    ],
                }),
            ),
        );
    });

    it("keeps the switch flipped when it is toggled before any type is picked", async () => {
        const user = userEvent.setup();
        renderDialog({operation: SpexareBulkOperation.ConsentSet});

        const valueSwitch = screen.getByRole("switch");
        await user.click(valueSwitch);
        expect(valueSwitch).not.toBeChecked();

        await user.click(screen.getByRole("button", {name: /Spexare\.bulk\.fields\.types/}));
        await user.click(await screen.findByRole("button", {name: "Bilder"}));
        await user.click(previewButton());

        await waitFor(() =>
            expect(preview).toHaveBeenCalledWith(
                expect.objectContaining({values: [{typeId: "bilder", value: false}]}),
            ),
        );
    });

    it("reports a failed preview instead of silently offering to apply", async () => {
        preview.mockRejectedValue(new Error("boom"));
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        const user = userEvent.setup();
        renderDialog();

        await pickTag(user, "Sångare");
        await user.click(previewButton());

        await waitFor(() => expect(toastError).toHaveBeenCalled());
        expect(screen.queryByRole("button", {name: /Spexare\.bulk\.apply/})).not.toBeInTheDocument();
    });
});
