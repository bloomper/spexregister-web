import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ImpexTable} from "@/components/impex/impex-table.client";
import * as actions from "@/app/(app)/impex/actions.server";
import type {Job} from "@/gql/schema";
import {toast} from "sonner";
import {pageOf, router} from "../../../../test/table-harness";

vi.mock("next/navigation", () => ({
    useRouter: () => router,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/impex",
}));
vi.mock("@/app/(app)/impex/actions.server", () => ({
    getJobStatusAction: vi.fn(),
    getJobAction: vi.fn(),
    getJobsAction: vi.fn(),
    deleteAction: vi.fn(),
}));
vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn()}}));
vi.mock("@/components/impex/import-result-viewer.client", () => ({ImportResultViewer: () => <div data-testid="import-result"/>}));

const jobs = [
    {id: "job-1", name: "spexareExport", status: "COMPLETED", exitStatus: "COMPLETED", hasDownload: true, createdAt: "2026-11-01T10:00:00Z"},
    {id: "job-2", name: "spexareImport", status: "FAILED", exitStatus: "FAILED", hasDownload: false, createdAt: "2026-11-01T11:00:00Z"},
    {id: "job-3", name: "tagExport", status: "RUNNING", exitStatus: null, hasDownload: false, createdAt: "2026-11-01T12:00:00Z"},
] as unknown as Job[];

beforeEach(() => {
    vi.clearAllMocks();
});

describe("ImpexTable", () => {
    it("lists the jobs with their statuses", () => {
        render(<ImpexTable initialData={pageOf(jobs)}/>);

        expect(screen.getByText("spexareExport")).toBeInTheDocument();
        expect(screen.getAllByText("COMPLETED").length).toBeGreaterThan(0);
        expect(screen.getAllByText("FAILED").length).toBeGreaterThan(0);
        expect(screen.getAllByText("-").length).toBeGreaterThan(0);
    });

    it("loads a job's details with its import result", async () => {
        vi.mocked(actions.getJobAction).mockResolvedValue({...jobs[1], importResult: {created: 1}} as unknown as Job);
        render(<ImpexTable initialData={pageOf(jobs)}/>);

        await userEvent.click(screen.getByText("spexareImport"));

        const dialog = await screen.findByRole("dialog");

        expect(await within(dialog).findByText("job-2")).toBeInTheDocument();
        expect(within(dialog).getByTestId("import-result")).toBeInTheDocument();
        expect(actions.getJobAction).toHaveBeenCalledWith("job-2");
    });

    it("says when the details cannot be loaded", async () => {
        vi.mocked(actions.getJobAction).mockRejectedValue(new Error("boom"));
        render(<ImpexTable initialData={pageOf(jobs)}/>);

        await userEvent.click(screen.getByText("spexareExport"));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.couldNotLoadData"));
    });

    it("offers downloading a finished export and deleting a job", async () => {
        vi.mocked(actions.deleteAction).mockResolvedValue(undefined as never);
        vi.mocked(actions.getJobsAction).mockResolvedValue(jobs.slice(1));
        render(<ImpexTable initialData={pageOf(jobs)}/>);

        await userEvent.click(screen.getAllByRole("button", {name: "Common.openMenu"})[0]);

        expect(await screen.findByRole("menuitem", {name: /Impex.download/})).toHaveAttribute("href", "/api/impex-result-download-proxy?id=job-1");
        await userEvent.click(screen.getByRole("menuitem", {name: /Common.delete/}));
        await userEvent.click(await screen.findByRole("button", {name: /^Common.delete$/}));

        await waitFor(() => expect(actions.deleteAction).toHaveBeenCalledWith("job-1"));
        await waitFor(() => expect(screen.queryByText("spexareExport")).not.toBeInTheDocument());
        expect(actions.getJobsAction).toHaveBeenCalled();
    });
});
