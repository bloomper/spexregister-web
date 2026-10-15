import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {AdminTasks} from "@/components/admin";
import {indexSpexareAction} from "@/app/(app)/admin/actions.server";
import {toast} from "sonner";

vi.mock("@/app/(app)/admin/actions.server", () => ({
    indexSpexareAction: vi.fn(),
}));
vi.mock("sonner", () => ({
    toast: {success: vi.fn(), error: vi.fn()},
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("AdminTasks", () => {
    it("starts indexing of spexare", async () => {
        vi.mocked(indexSpexareAction).mockResolvedValue(undefined);
        render(<AdminTasks/>);

        await userEvent.click(screen.getByRole("button", {name: "Admin.indexSpexare"}));

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Admin.indexSpexareStarted"));
        expect(indexSpexareAction).toHaveBeenCalledTimes(1);
    });

    it("reports a failure", async () => {
        vi.mocked(indexSpexareAction).mockRejectedValue(new Error("Forbidden"));
        render(<AdminTasks/>);

        await userEvent.click(screen.getByRole("button", {name: "Admin.indexSpexare"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred"));
    });
});
