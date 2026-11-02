import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {RestoreDialog, type RestoreActions} from "@/components/audit/restore-dialog.client";
import {AuditedType, type RestorePreview} from "@/gql/schema";
import {toast} from "sonner";
import {track} from "@/utils/umami";

const router = vi.hoisted(() => ({refresh: vi.fn()}));

vi.mock("next/navigation", () => ({useRouter: () => router}));
vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn()}}));
vi.mock("@/utils/umami", () => ({track: vi.fn()}));

const preview = {
    entries: [{action: "UPDATE"}, {action: "CREATE"}, {action: "DELETE"}, {action: "UPDATE"}],
    warnings: [{code: "UNIQUE"}, {code: "UNIQUE"}, {code: "MISSING"}],
} as unknown as RestorePreview;

function actionsWith(overrides: Partial<RestoreActions> = {}): RestoreActions {
    return {
        preview: vi.fn().mockResolvedValue(preview),
        restore: vi.fn().mockResolvedValue({}),
        ...overrides,
    };
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
});

describe("RestoreDialog", () => {
    it("previews and restores a revision with a reason", async () => {
        const actions = actionsWith();
        const onRestored = vi.fn();
        render(<RestoreDialog id="x1" type={AuditedType.Tag} revision={7} actions={actions} onRestored={onRestored}/>);

        await userEvent.click(screen.getByRole("button", {name: /Audit.restore/}));

        expect(await screen.findByText(`Audit.impact:${JSON.stringify({updated: 2, created: 1, deleted: 1})}`)).toBeInTheDocument();
        expect(screen.getByText("Audit.warnings.UNIQUE")).toBeInTheDocument();
        expect(screen.getByText("Audit.warnings.MISSING")).toBeInTheDocument();
        expect(screen.queryByRole("switch")).not.toBeInTheDocument();
        expect(actions.preview).toHaveBeenCalledWith(AuditedType.Tag, "x1", 7, false);

        await userEvent.click(screen.getByRole("button", {name: "Audit.confirm"}));

        await waitFor(() => expect(actions.restore).toHaveBeenCalledWith(AuditedType.Tag, "x1", 7, false,
            `Audit.restoreReason:${JSON.stringify({revision: 7})}`));
        expect(track).toHaveBeenCalledWith("restore", {type: AuditedType.Tag, cascade: false});
        expect(toast.success).toHaveBeenCalledWith("Audit.restored");
        expect(onRestored).toHaveBeenCalled();
        expect(router.refresh).toHaveBeenCalled();
    });

    it("restores a spexare with what belongs to it", async () => {
        const actions = actionsWith({preview: vi.fn().mockResolvedValue({entries: [], warnings: []})});
        render(<RestoreDialog id="x1" type={AuditedType.Spexare} revision={3} actions={actions}/>);

        await userEvent.click(screen.getByRole("button", {name: /Audit.restore/}));
        expect(await screen.findByText("Audit.noChanges")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("switch"));
        await waitFor(() => expect(actions.preview).toHaveBeenLastCalledWith(AuditedType.Spexare, "x1", 3, true));
        await userEvent.click(await screen.findByRole("button", {name: "Audit.confirm"}));

        await waitFor(() => expect(actions.restore).toHaveBeenCalledWith(AuditedType.Spexare, "x1", 3, true,
            `Audit.restoreReasonCascade:${JSON.stringify({revision: 3})}`));
    });

    it("reports a failed preview and a failed restore", async () => {
        const failingPreview = actionsWith({preview: vi.fn().mockRejectedValue(new Error("boom"))});
        const {unmount} = render(<RestoreDialog id="x1" type={AuditedType.Tag} revision={1} actions={failingPreview}/>);

        await userEvent.click(screen.getByRole("button", {name: /Audit.restore/}));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Audit.restoreFailed"));
        expect(screen.getByRole("button", {name: "Audit.confirm"})).toBeDisabled();
        unmount();

        const failingRestore = actionsWith({restore: vi.fn().mockRejectedValue(new Error("boom"))});
        render(<RestoreDialog id="x1" type={AuditedType.Tag} revision={1} actions={failingRestore}/>);

        await userEvent.click(screen.getByRole("button", {name: /Audit.restore/}));
        await userEvent.click(await screen.findByRole("button", {name: "Audit.confirm"}));
        await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(2));
    });
});
