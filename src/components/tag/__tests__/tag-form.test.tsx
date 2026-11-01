import type {ReactNode} from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TagForm} from "@/components/tag/tag-form.client";
import type {Tag} from "@/gql/schema";

const actions = vi.hoisted(() => ({createAction: vi.fn(), updateAction: vi.fn()}));
const toast = vi.hoisted(() => ({success: vi.fn(), error: vi.fn()}));
const track = vi.hoisted(() => vi.fn());

vi.mock("@/app/(app)/tags/actions.server", () => actions);
vi.mock("sonner", () => ({toast}));
vi.mock("@/utils/umami", () => ({track}));
vi.mock("@/components/edit-queue/edit-form-shell.client", () => ({
    EditFormShell: ({children}: { children?: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/edit-queue/edit-queue-form-state.client", () => ({useReportEditQueueFormState: vi.fn()}));

const show = (item?: Tag) => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const view = render(<TagForm item={item} onSuccess={onSuccess} onError={onError} embedded formId="tag-form"/>);

    return {submit: () => fireEvent.submit(view.container.querySelector("form#tag-form")!), onSuccess, onError};
};

describe("TagForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        actions.createAction.mockResolvedValue({id: "1"});
        actions.updateAction.mockResolvedValue({id: "1"});
    });

    it("creates a tag and counts it", async () => {
        const {submit, onSuccess} = show();

        await userEvent.type(screen.getByRole("textbox"), "Kör");
        submit();

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(undefined));
        expect(actions.createAction).toHaveBeenCalledWith({name: "Kör"});
        expect(track).toHaveBeenCalledWith("tag-create");
        expect(toast.success).toHaveBeenCalledWith("Common.createSuccess");
    });

    it("updates a tag and hands back the changed values", async () => {
        const {submit, onSuccess} = show({id: "3", name: "Orkester"} as Tag);

        expect(screen.getByRole("textbox")).toHaveValue("Orkester");
        await userEvent.clear(screen.getByRole("textbox"));
        await userEvent.type(screen.getByRole("textbox"), "Band");
        submit();

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({id: "3", name: "Band"}));
        expect(actions.updateAction).toHaveBeenCalledWith("3", {name: "Band"});
        expect(track).toHaveBeenCalledWith("tag-update");
    });

    it("needs a name", async () => {
        const {submit} = show();

        submit();
        expect(await screen.findByText("Common.fieldRequired")).toBeInTheDocument();
        expect(actions.createAction).not.toHaveBeenCalled();
    });

    it("tells when saving fails", async () => {
        actions.createAction.mockRejectedValue(new Error("CONFLICT"));
        const {submit, onSuccess, onError} = show();

        await userEvent.type(screen.getByRole("textbox"), "Kör");
        submit();

        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred");
        expect(track).not.toHaveBeenCalled();
        expect(onSuccess).not.toHaveBeenCalled();
    });
});
