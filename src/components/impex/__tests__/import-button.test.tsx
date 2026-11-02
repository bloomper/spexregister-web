import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ImportButton} from "@/components/impex/import-button.client";
import {ImpexType} from "@/gql/schema";
import {toast} from "sonner";
import {track} from "@/utils/umami";
import {useJobTracker} from "@/hooks/use-job-tracker.client";

vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn(), info: vi.fn()}}));
vi.mock("@/utils/umami", () => ({track: vi.fn()}));
vi.mock("@/hooks/use-job-tracker.client", () => ({useJobTracker: vi.fn()}));

const xlsx = () => new File(["x"], "spexare.xlsx", {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});

async function openWithFile(file: File) {
    await userEvent.click(screen.getByRole("button", {name: "Impex.import"}));
    const dialog = await screen.findByRole("dialog");

    await userEvent.upload(dialog.querySelector("input[type=file]") as HTMLInputElement, file, {applyAccept: false});
    return dialog;
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe("ImportButton", () => {
    it("imports a picked file in the chosen format", async () => {
        const importAction = vi.fn().mockResolvedValue({id: "job-7"});
        render(<ImportButton importAction={importAction}/>);

        const dialog = await openWithFile(xlsx());

        expect(await within(dialog).findByText("spexare.xlsx")).toBeInTheDocument();
        await userEvent.click(within(dialog).getByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", {name: `Impex.types.${ImpexType.Excel}`}));
        await userEvent.click(within(dialog).getByRole("button", {name: "Impex.import"}));

        await waitFor(() => expect(importAction).toHaveBeenCalledWith(ImpexType.Excel, expect.any(File)));
        expect(track).toHaveBeenCalledWith("import", {format: ImpexType.Excel});
        expect(toast.info).toHaveBeenCalledWith("Impex.importStarted");
        expect(vi.mocked(useJobTracker).mock.lastCall?.[0]).toBe("job-7");
    });

    it("reports the status of a failed import", async () => {
        const importAction = vi.fn().mockRejectedValue({response: {status: 413}});
        render(<ImportButton importAction={importAction}/>);

        const dialog = await openWithFile(xlsx());

        await userEvent.click(within(dialog).getByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", {name: `Impex.types.${ImpexType.ExcelXls}`}));
        await userEvent.click(within(dialog).getByRole("button", {name: "Impex.import"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(`Impex.importFailed:${JSON.stringify({statusCode: 413})}`));
    });

    it("refuses a file that is not a spreadsheet and resets a picked one", async () => {
        render(<ImportButton importAction={vi.fn()}/>);

        const dialog = await openWithFile(new File(["x"], "notes.txt", {type: "text/plain"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred"));

        await userEvent.upload(dialog.querySelector("input[type=file]") as HTMLInputElement, xlsx(), {applyAccept: false});
        expect(await within(dialog).findByText("spexare.xlsx")).toBeInTheDocument();
        await userEvent.click(within(dialog).getByRole("button", {name: "Common.reset"}));
        expect(within(dialog).queryByText("spexare.xlsx")).not.toBeInTheDocument();

        await userEvent.click(within(dialog).getByRole("button", {name: "Common.cancel"}));
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    });
});
