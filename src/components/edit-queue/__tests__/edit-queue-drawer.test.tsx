import {describe, expect, it, vi, beforeEach} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {useState} from "react";
import {EditQueueProvider, useEditQueue} from "@/components/edit-queue/edit-queue-provider.client";
import {EditQueueDrawer} from "@/components/edit-queue/edit-queue-drawer.client";
import {useReportEditQueueFormState} from "@/components/edit-queue/edit-queue-form-state.client";

const emitDataRefresh = vi.fn();
const getById = vi.fn(async (id: string) => ({id}));
const onSubmitSpy = vi.fn();
let submitShouldFail = false;

vi.mock("@/hooks/use-data-refresh.client", () => ({
    emitDataRefresh: (...args: unknown[]) => emitDataRefresh(...args),
    useDataRefresh: () => undefined,
}));

vi.mock("@/app/(app)/edit-queue/actions.server", () => ({
    getEditQueueOptions: vi.fn(async () => ({})),
}));

function FakeForm({item, onSuccess, onError}: {
    item: { id: string };
    onSuccess: (updated?: { id: string }) => void;
    onError: () => void;
}) {
    const [value, setValue] = useState(item.id);
    useReportEditQueueFormState({isDirty: value !== item.id});

    return (
        <form
            id="edit-queue-form"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmitSpy(item.id);
                if (submitShouldFail) {
                    onError();
                } else {
                    onSuccess({id: item.id});
                }
            }}
        >
            <input aria-label="value" value={value} onChange={(e) => setValue(e.target.value)}/>
        </form>
    );
}

vi.mock("@/components/edit-queue/registry.client", () => ({
    EDIT_QUEUE_FORM_ID: "edit-queue-form",
    editQueueRegistry: {
        tag: {
            needsOptions: false,
            formId: "edit-queue-form",
            getById: (id: string) => getById(id),
            labelOf: (i: { id: string }) => `Tag ${i.id}`,
            Form: (props: Parameters<typeof FakeForm>[0]) => <FakeForm {...props}/>,
        },
    },
}));

function Harness() {
    const {enqueueMany, open} = useEditQueue();
    return (
        <button
            onClick={() => {
                enqueueMany("tag", [{id: "1"}, {id: "2"}]);
                open();
            }}
        >
            seed
        </button>
    );
}

async function setup() {
    const user = userEvent.setup();
    render(
        <EditQueueProvider>
            <Harness/>
            <EditQueueDrawer/>
        </EditQueueProvider>,
    );
    await user.click(screen.getByRole("button", {name: "seed"}));
    return user;
}

const position = (current: number, total = 2) =>
    `EditQueue.position:${JSON.stringify({current, total})}`;

const dirty = (user: Awaited<ReturnType<typeof setup>>) =>
    user.type(screen.getByLabelText("value"), "-edited");

beforeEach(() => {
    emitDataRefresh.mockClear();
    getById.mockClear();
    onSubmitSpy.mockClear();
    submitShouldFail = false;
});

describe("EditQueueDrawer", () => {
    it("navigates without warning when the form is clean", async () => {
        const user = await setup();
        expect(screen.getByText(position(1))).toBeInTheDocument();

        await user.click(screen.getByRole("button", {name: /EditQueue.next/}));

        expect(screen.getByText(position(2))).toBeInTheDocument();
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });

    it("warns before navigating away from unsaved changes and stays put on cancel", async () => {
        const user = await setup();
        await dirty(user);

        await user.click(screen.getByRole("button", {name: /EditQueue.next/}));
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();

        await user.click(screen.getByRole("button", {name: "Common.cancel"}));

        expect(screen.getByText(position(1))).toBeInTheDocument();
        expect(screen.getByLabelText("value")).toHaveValue("1-edited");
        expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it("discards the changes and navigates", async () => {
        const user = await setup();
        await dirty(user);

        await user.click(screen.getByRole("button", {name: /EditQueue.next/}));
        await user.click(screen.getByRole("button", {name: "EditQueue.discardChanges"}));

        expect(screen.getByText(position(2))).toBeInTheDocument();
        expect(onSubmitSpy).not.toHaveBeenCalled();
    });

    it("saves and then performs the deferred navigation", async () => {
        const user = await setup();
        await dirty(user);

        await user.click(screen.getByRole("button", {name: /EditQueue.next/}));
        await user.click(screen.getByRole("button", {name: "EditQueue.saveAndContinue"}));

        expect(onSubmitSpy).toHaveBeenCalledWith("1");
        expect(screen.getByText(position(2))).toBeInTheDocument();
        expect(emitDataRefresh).toHaveBeenCalled();
    });

    it("keeps you on the item when the deferred save fails", async () => {
        const user = await setup();
        submitShouldFail = true;
        await dirty(user);

        await user.click(screen.getByRole("button", {name: /EditQueue.next/}));
        await user.click(screen.getByRole("button", {name: "EditQueue.saveAndContinue"}));

        expect(onSubmitSpy).toHaveBeenCalledWith("1");
        expect(screen.getByText(position(1))).toBeInTheDocument();
    });

    it("Save stays on the item, refreshes tables and clears the dirty state", async () => {
        const user = await setup();
        await dirty(user);

        await user.click(screen.getByRole("button", {name: "Common.save"}));

        expect(onSubmitSpy).toHaveBeenCalledWith("1");
        expect(emitDataRefresh).toHaveBeenCalled();
        expect(screen.getByText(position(1))).toBeInTheDocument();

        await user.click(screen.getByRole("button", {name: /EditQueue.next/}));
        expect(screen.getByText(position(2))).toBeInTheDocument();
    });

    it("clears the whole queue, asking first when there are unsaved changes", async () => {
        const user = await setup();
        await dirty(user);

        await user.click(screen.getByRole("button", {name: "EditQueue.clearQueue"}));
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
        await user.click(screen.getByRole("button", {name: "EditQueue.discardChanges"}));

        expect(screen.queryByText(position(1))).not.toBeInTheDocument();
        expect(emitDataRefresh).toHaveBeenCalled();
    });

    it("Save & next saves the current item and advances, and is disabled on the last item", async () => {
        const user = await setup();
        await dirty(user);

        await user.click(screen.getByRole("button", {name: "EditQueue.saveAndNext"}));

        expect(onSubmitSpy).toHaveBeenCalledWith("1");
        expect(screen.getByText(position(2))).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "EditQueue.saveAndNext"})).toBeDisabled();
    });
});
