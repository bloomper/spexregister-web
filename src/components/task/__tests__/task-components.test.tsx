import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TaskViewDialog} from "@/components/task/task-view-dialog.client";

import type {Task} from "@/gql/schema";

vi.mock("@/components/data-audit-trail.client", () => ({AuditTrail: () => <div data-testid="audit-trail"/>}));
vi.mock("@/app/(app)/tasks/actions.server", () => ({
    getRevisionsAction: vi.fn(),
    getRestorePreviewAction: vi.fn(),
    restoreRevisionAction: vi.fn()
}));
vi.mock("@/components/task/task-form.client", () => ({TaskForm: () => <div data-testid="task-form"/>}));

const task = {id: "t1", name: "Lighting", category: {id: "c1", name: "Technical"}} as unknown as Task;

describe("TaskViewDialog", () => {
    it("renders the task detail and closes", async () => {
        const onClose = vi.fn();
        render(<TaskViewDialog selected={task} onClose={onClose}/>);
        expect(screen.getByText("Lighting")).toBeInTheDocument();
        expect(screen.getByTestId("audit-trail")).toBeInTheDocument();
        // The footer's button; the corner's X, after it, has the same name
        await userEvent.click(screen.getAllByRole("button", {name: /Common.close/})[0]);
        expect(onClose).toHaveBeenCalled();
    });

    it("renders nothing when there is no selection", () => {
        render(<TaskViewDialog selected={null} onClose={vi.fn()}/>);
        expect(screen.queryByTestId("audit-trail")).not.toBeInTheDocument();
    });
});

