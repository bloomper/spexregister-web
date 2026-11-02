import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {act, render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {AdminTasks} from "@/components/admin";
import {getMaintenanceJobsAction, runMaintenanceJobAction} from "@/app/(app)/admin/maintenance/actions.server";
import {MaintenanceJob} from "@/gql/schema";
import type {MaintenanceJobStatus} from "@/lib/admin/admin.server";
import {toast} from "sonner";

vi.mock("@/app/(app)/admin/maintenance/actions.server", () => ({
    runMaintenanceJobAction: vi.fn(),
    getMaintenanceJobsAction: vi.fn(),
}));
vi.mock("sonner", () => ({
    toast: {success: vi.fn(), error: vi.fn(), info: vi.fn()},
}));

const idle: MaintenanceJobStatus[] = [
    {job: MaintenanceJob.SearchIndex, schedule: "0 0 */4 * * ?", running: false},
    {
        job: MaintenanceJob.UserSync,
        schedule: "0 */5 * * * ?",
        running: false,
        lastStartedAt: "2026-11-01T10:00:00Z",
        lastFinishedAt: "2026-11-01T10:01:00Z",
        lastSucceeded: true,
    },
    {
        job: MaintenanceJob.JobCleanup,
        schedule: null,
        running: false,
        lastStartedAt: "2026-11-01T03:00:00Z",
        lastFinishedAt: "2026-11-01T03:00:01Z",
        lastSucceeded: false,
    },
];

function card(title: string) {
    return screen.getByText(title).closest("[data-slot='card']") as HTMLElement;
}

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("AdminTasks", () => {
    it("shows each job with its schedule and latest run", () => {
        render(<AdminTasks jobs={idle}/>);

        expect(within(card("jobs.SEARCH_INDEX.title")).getByText("0 0 */4 * * ?")).toBeInTheDocument();
        expect(within(card("jobs.SEARCH_INDEX.title")).getByText("neverRun")).toBeInTheDocument();
        expect(within(card("jobs.USER_SYNC.title")).getByText(/^lastRunSucceeded/)).toBeInTheDocument();
        expect(within(card("jobs.JOB_CLEANUP.title")).getByText("notScheduled")).toBeInTheDocument();
        expect(within(card("jobs.JOB_CLEANUP.title")).getByText(/^lastRunFailed/)).toBeInTheDocument();
    });

    it("starts a job and marks it running", async () => {
        vi.mocked(runMaintenanceJobAction).mockResolvedValue(true);
        render(<AdminTasks jobs={idle}/>);

        await userEvent.click(within(card("jobs.USER_SYNC.title")).getByRole("button", {name: "runNow"}));

        await waitFor(() => expect(toast.success).toHaveBeenCalled());
        expect(runMaintenanceJobAction).toHaveBeenCalledWith(MaintenanceJob.UserSync);
        expect(within(card("jobs.USER_SYNC.title")).getByText("running")).toBeInTheDocument();
        expect(within(card("jobs.USER_SYNC.title")).getByRole("button", {name: "runNow"})).toBeDisabled();
    });

    it("says when a job is already running", async () => {
        vi.mocked(runMaintenanceJobAction).mockResolvedValue(false);
        render(<AdminTasks jobs={idle}/>);

        await userEvent.click(within(card("jobs.SEARCH_INDEX.title")).getByRole("button", {name: "runNow"}));

        await waitFor(() => expect(toast.info).toHaveBeenCalled());
    });

    it("reports a failure", async () => {
        vi.mocked(runMaintenanceJobAction).mockRejectedValue(new Error("Forbidden"));
        render(<AdminTasks jobs={idle}/>);

        await userEvent.click(within(card("jobs.SEARCH_INDEX.title")).getByRole("button", {name: "runNow"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("errorOccurred"));
    });

    it("refreshes while a job is running", async () => {
        vi.useFakeTimers();
        const done: MaintenanceJobStatus = {
            job: MaintenanceJob.NewsPublishing,
            running: false,
            lastStartedAt: "2026-11-01T00:00:05Z",
            lastSucceeded: null,
        };
        vi.mocked(getMaintenanceJobsAction).mockResolvedValue([done]);
        render(<AdminTasks jobs={[{job: MaintenanceJob.NewsPublishing, running: true}]}/>);

        expect(screen.getByText("running")).toBeInTheDocument();

        await act(async () => {
            await vi.advanceTimersByTimeAsync(5000);
        });

        expect(getMaintenanceJobsAction).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("running")).not.toBeInTheDocument();
        expect(screen.getByText(/^lastRunStarted/)).toBeInTheDocument();
    });

    it("does not refresh when nothing is running", async () => {
        vi.useFakeTimers();
        render(<AdminTasks jobs={idle}/>);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(15000);
        });

        expect(getMaintenanceJobsAction).not.toHaveBeenCalled();
    });
});
