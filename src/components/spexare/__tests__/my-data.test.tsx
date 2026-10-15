import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MyData} from "@/components/spexare/my-data.client";
import {exportMineAction, requestRemovalAction} from "@/app/(app)/my-profile/actions.server";
import {useJobTracker} from "@/hooks/use-job-tracker.client";
import {toast} from "sonner";
import {ImpexType} from "@/gql/schema";

vi.mock("@/app/(app)/my-profile/actions.server", () => ({
    exportMineAction: vi.fn(),
    getMineExportStatusAction: vi.fn(),
    requestRemovalAction: vi.fn(),
}));
vi.mock("@/hooks/use-job-tracker.client", () => ({
    useJobTracker: vi.fn(),
}));
vi.mock("sonner", () => ({
    toast: {success: vi.fn(), error: vi.fn(), info: vi.fn()},
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("MyData", () => {
    it("starts an export of the user's own data and tracks the job", async () => {
        vi.mocked(exportMineAction).mockResolvedValue({id: "job1"});
        render(<MyData/>);

        await userEvent.click(screen.getByRole("button", {name: "MyData.export"}));

        await waitFor(() => expect(toast.info).toHaveBeenCalledWith("Impex.exportStarted"));
        expect(exportMineAction).toHaveBeenCalledWith(ImpexType.Excel);
        expect(vi.mocked(useJobTracker).mock.lastCall?.[0]).toBe("job1");
    });

    it("reports a failed export", async () => {
        vi.mocked(exportMineAction).mockRejectedValue(new Error("boom"));
        render(<MyData/>);

        await userEvent.click(screen.getByRole("button", {name: "MyData.export"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Impex.exportFailed", {description: "boom"}));
        expect(screen.getByRole("button", {name: "MyData.export"})).toBeEnabled();
    });

    it("sends a removal request with the given reason", async () => {
        vi.mocked(requestRemovalAction).mockResolvedValue(undefined);
        render(<MyData/>);

        await userEvent.click(screen.getByRole("button", {name: "MyData.requestRemoval"}));
        await userEvent.type(await screen.findByLabelText("MyData.reason"), "Moving on");
        await userEvent.click(screen.getByRole("button", {name: "MyData.send"}));

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith("MyData.removalRequestSent"));
        expect(requestRemovalAction).toHaveBeenCalledWith({reason: "Moving on"});
    });

    it("reports a failed removal request", async () => {
        vi.mocked(requestRemovalAction).mockRejectedValue(new Error("boom"));
        render(<MyData/>);

        await userEvent.click(screen.getByRole("button", {name: "MyData.requestRemoval"}));
        await userEvent.click(await screen.findByRole("button", {name: "MyData.send"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("MyData.removalRequestFailed"));
    });
});
