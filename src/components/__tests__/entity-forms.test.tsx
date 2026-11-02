import type {ReactNode} from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TaskForm} from "@/components/task/task-form.client";
import {TaskCategoryForm} from "@/components/task/category/task-category-form.client";
import {SpexCategoryForm} from "@/components/spex/category/spex-category-form.client";
import {NewsForm} from "@/components/news/news-form.client";
import {Sheet} from "@/components/ui/sheet";
import type {News, SpexCategory, Task, TaskCategory} from "@/gql/schema";

const taskActions = vi.hoisted(() => ({
    createAction: vi.fn(), updateAction: vi.fn(), addCategoryAction: vi.fn(), removeCategoryAction: vi.fn(),
}));
const taskCategoryActions = vi.hoisted(() => ({createAction: vi.fn(), updateAction: vi.fn()}));
const spexCategoryActions = vi.hoisted(() => ({
    createAction: vi.fn(), updateAction: vi.fn(), uploadLogoAction: vi.fn(), deleteLogoAction: vi.fn(),
}));
const newsActions = vi.hoisted(() => ({createAction: vi.fn(), updateAction: vi.fn()}));
const toast = vi.hoisted(() => ({success: vi.fn(), error: vi.fn()}));
const track = vi.hoisted(() => vi.fn());
const ready = vi.hoisted(() => Object.assign(Promise.resolve(), {status: "fulfilled", value: undefined}));

vi.mock("@/app/(app)/tasks/actions.server", () => taskActions);
vi.mock("@/app/(app)/tasks/categories/actions.server", () => taskCategoryActions);
vi.mock("@/app/(app)/spex/categories/actions.server", () => spexCategoryActions);
vi.mock("@/app/(app)/news/actions.server", () => newsActions);
vi.mock("next/cache", () => ({io: () => ready}));
vi.mock("sonner", () => ({toast}));
vi.mock("@/utils/umami", () => ({track}));
vi.mock("@/components/edit-queue/edit-form-shell.client", () => ({
    EditFormShell: ({children}: { children?: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/edit-queue/edit-queue-form-state.client", () => ({useReportEditQueueFormState: vi.fn()}));
vi.mock("@/components/image-upload.client", () => ({
    ImageUpload: ({onFileSelect, onFileDelete}: { onFileSelect: (file: File) => void; onFileDelete: () => void }) => (
        <div>
            <button type="button" onClick={() => onFileSelect(new File(["x"], "logo.png", {type: "image/png"}))}>pick</button>
            <button type="button" onClick={onFileDelete}>drop</button>
        </div>
    ),
}));

function submit(container: HTMLElement, id: string) {
    fireEvent.submit(container.querySelector(`form#${id}`)!);
}

beforeEach(() => {
    vi.clearAllMocks();
    taskActions.createAction.mockResolvedValue({id: "t9"});
    taskActions.updateAction.mockResolvedValue({id: "t1"});
    taskCategoryActions.createAction.mockResolvedValue({id: "c9"});
    taskCategoryActions.updateAction.mockResolvedValue({id: "c1"});
    spexCategoryActions.createAction.mockResolvedValue({id: "s9"});
    spexCategoryActions.updateAction.mockResolvedValue({id: "s1"});
    newsActions.createAction.mockResolvedValue({id: "n9"});
    newsActions.updateAction.mockResolvedValue({id: "n1"});
});

describe("TaskForm", () => {
    const categories = [{id: "c1", name: "Teknik"}] as TaskCategory[];

    it("creates a task without a category", async () => {
        const onSuccess = vi.fn();
        const {container} = render(<TaskForm categories={categories} onSuccess={onSuccess} embedded formId="task-form"/>);

        await userEvent.type(screen.getByRole("textbox"), "Ljus");
        submit(container, "task-form");

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(undefined));
        expect(taskActions.createAction).toHaveBeenCalledWith({name: "Ljus", categoryId: "none"});
        expect(taskActions.addCategoryAction).not.toHaveBeenCalled();
        expect(track).toHaveBeenCalledWith("task-create");
    });

    it("removes the category when it is cleared", async () => {
        const onSuccess = vi.fn();
        const task = {id: "t1", name: "Ljus", category: {id: "c1", name: "Teknik"}} as Task;
        const {container} = render(<TaskForm item={task} categories={categories} onSuccess={onSuccess} embedded formId="task-form"/>);

        expect(screen.getByRole("textbox")).toHaveValue("Ljus");
        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", {name: "Common.none"}));
        submit(container, "task-form");

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(taskActions.updateAction).toHaveBeenCalledWith("t1", {name: "Ljus", categoryId: "none"});
        expect(taskActions.removeCategoryAction).toHaveBeenCalledWith("t1");
    });

    it("adds a chosen category to a new task", async () => {
        const onSuccess = vi.fn();
        const {container} = render(<TaskForm categories={categories} onSuccess={onSuccess} embedded formId="task-form"/>);

        await userEvent.type(screen.getByRole("textbox"), "Ljud");
        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", {name: "Teknik"}));
        submit(container, "task-form");

        await waitFor(() => expect(taskActions.addCategoryAction).toHaveBeenCalledWith("t9", "c1"));
    });

    it("tells when saving fails", async () => {
        taskActions.createAction.mockRejectedValue(new Error("boom"));
        const onError = vi.fn();
        const {container} = render(<TaskForm categories={[]} onSuccess={vi.fn()} onError={onError} embedded formId="task-form"/>);

        await userEvent.type(screen.getByRole("textbox"), "Ljus");
        submit(container, "task-form");

        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred");
    });

    it("shows the footer outside the edit queue", () => {
        render(<Sheet open><TaskForm categories={[]} onSuccess={vi.fn()}/></Sheet>);

        expect(screen.getByRole("button", {name: "Common.save"})).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Common.cancel"})).toBeInTheDocument();
    });
});

describe("TaskCategoryForm", () => {
    it("creates a category with an actor", async () => {
        const onSuccess = vi.fn();
        const {container} = render(<TaskCategoryForm onSuccess={onSuccess} embedded formId="tc-form"/>);

        await userEvent.type(screen.getByRole("textbox"), "Scen");
        await userEvent.click(screen.getByRole("checkbox"));
        submit(container, "tc-form");

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(undefined));
        expect(taskCategoryActions.createAction).toHaveBeenCalledWith({name: "Scen", actorPresent: true});
        expect(track).toHaveBeenCalledWith("task-category-create");
    });

    it("updates a category", async () => {
        const onSuccess = vi.fn();
        const item = {id: "c1", name: "Scen", actorPresent: true} as TaskCategory;
        const {container} = render(<TaskCategoryForm item={item} onSuccess={onSuccess} embedded formId="tc-form"/>);

        await userEvent.clear(screen.getByRole("textbox"));
        await userEvent.type(screen.getByRole("textbox"), "Teknik");
        submit(container, "tc-form");

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({id: "c1", name: "Teknik", actorPresent: true}));
        expect(track).toHaveBeenCalledWith("task-category-update");
    });

    it("needs a name and reports failures", async () => {
        const onError = vi.fn();
        const {container} = render(<TaskCategoryForm onSuccess={vi.fn()} onError={onError} embedded formId="tc-form"/>);

        submit(container, "tc-form");
        expect(await screen.findByText("Common.fieldRequired")).toBeInTheDocument();

        taskCategoryActions.createAction.mockRejectedValue(new Error("boom"));
        await userEvent.type(screen.getByRole("textbox"), "Scen");
        submit(container, "tc-form");
        await waitFor(() => expect(onError).toHaveBeenCalled());
    });
});

describe("SpexCategoryForm", () => {
    it("creates a category and uploads its logo", async () => {
        const onSuccess = vi.fn();
        const {container} = render(<SpexCategoryForm onSuccess={onSuccess} embedded formId="sc-form"/>);

        await userEvent.type(screen.getByRole("textbox"), "Vera");
        await userEvent.click(screen.getByRole("combobox"));
        await userEvent.click(await screen.findByRole("option", {name: "1990"}));
        await userEvent.click(screen.getByRole("button", {name: "pick"}));
        submit(container, "sc-form");

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(spexCategoryActions.createAction).toHaveBeenCalledWith({name: "Vera", firstYear: "1990"});
        expect(spexCategoryActions.uploadLogoAction).toHaveBeenCalledWith("s9", expect.any(FormData));
        expect(track).toHaveBeenCalledWith("spex-category-create");
    });

    it("deletes the logo of an existing category", async () => {
        const onSuccess = vi.fn();
        const item = {id: "s1", name: "Vera", firstYear: "1990", logoUrl: "/logo"} as SpexCategory;
        const {container} = render(<SpexCategoryForm item={item} onSuccess={onSuccess} embedded formId="sc-form"/>);

        await userEvent.click(screen.getByRole("button", {name: "drop"}));
        submit(container, "sc-form");

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(spexCategoryActions.updateAction).toHaveBeenCalledWith("s1", {name: "Vera", firstYear: "1990"});
        expect(spexCategoryActions.deleteLogoAction).toHaveBeenCalledWith("s1");
    });

    it("needs a first year", async () => {
        const {container} = render(<SpexCategoryForm onSuccess={vi.fn()} embedded formId="sc-form"/>);

        await userEvent.type(screen.getByRole("textbox"), "Vera");
        submit(container, "sc-form");

        expect(await screen.findByText("Common.fieldRequired")).toBeInTheDocument();
        expect(spexCategoryActions.createAction).not.toHaveBeenCalled();
    });
});

describe("NewsForm", () => {
    it("creates news", async () => {
        const onSuccess = vi.fn();
        const {container} = render(<NewsForm onSuccess={onSuccess} embedded formId="news-form"/>);

        const [subject, text] = await screen.findAllByRole("textbox");

        await userEvent.type(subject, "Årsmöte");
        await userEvent.type(text, "Välkomna");
        submit(container, "news-form");

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(undefined));
        expect(newsActions.createAction).toHaveBeenCalledWith(expect.objectContaining({subject: "Årsmöte", text: "Välkomna"}));
        expect(toast.success).toHaveBeenCalledWith("Common.createSuccess");
    });

    it("updates news and reports failures", async () => {
        const onSuccess = vi.fn();
        const onError = vi.fn();
        const item = {id: "n1", subject: "Årsmöte", text: "Text", visibleFrom: "2026-01-01", visibleTo: null} as unknown as News;
        const {container} = render(<NewsForm item={item} onSuccess={onSuccess} onError={onError} embedded formId="news-form"/>);

        expect((await screen.findAllByRole("textbox"))[0]).toHaveValue("Årsmöte");
        submit(container, "news-form");
        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(newsActions.updateAction).toHaveBeenCalledWith("n1", expect.objectContaining({subject: "Årsmöte"}));

        newsActions.updateAction.mockRejectedValue(new Error("boom"));
        submit(container, "news-form");
        await waitFor(() => expect(onError).toHaveBeenCalled());
    });
});
