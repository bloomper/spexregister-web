import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {TaskActivityManager} from "@/components/spexare/activity/task-activity/task-activity-manager.client";
import * as actions from "@/app/(app)/spexare/actions.server";
import {type SpexCharacter, type Task, type TaskActivity, type TaskCategory, type Type, TypeType} from "@/gql/schema";
import {toast} from "sonner";

const refresh = vi.hoisted(() => vi.fn());

vi.mock("@/app/(app)/spexare/actions.server", () => ({
    createTaskActivityAction: vi.fn(), updateTaskActivityAction: vi.fn(), deleteTaskActivityAction: vi.fn(),
    createActorAction: vi.fn(), updateActorAction: vi.fn(), deleteActorAction: vi.fn(),
    getSpexCharactersAction: vi.fn(),
}));
vi.mock("@/hooks/use-refresh.client", () => ({useRefresh: () => refresh}));
vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn()}}));

const ensemble = {id: "cat-1", name: "Ensemble", actorPresent: true} as TaskCategory;
const committee = {id: "cat-2", name: "Kommitté", actorPresent: false} as TaskCategory;
const task = (id: string, name: string, category: TaskCategory) => ({id, name, category}) as Task;
const tasks = [task("t1", "Ensemblist", ensemble), task("t2", "Kör", ensemble), task("t3", "Scenmästare", committee)];
const vocals = [{id: "v1", label: "Sopran", type: TypeType.Vocal}, {id: "m1", label: "FGV", type: TypeType.Membership}] as Type[];
const character = (id: string, name: string, retired = false) => ({id, name, retired, position: 1, spexId: "sp1"}) as SpexCharacter;

const existing = [{
    id: "ta1",
    task: tasks[0],
    actors: [{id: "ac1", role: null, vocal: {id: "v1", label: "Sopran"}, character: {id: "c1", name: "Alfred Nobel"}}],
}] as unknown as TaskActivity[];

const renderManager = (initialTaskActivities: TaskActivity[] = [], spexId: string | null = "sp1") =>
    render(<TaskActivityManager spexareId="s1" activityId="a1" spexId={spexId} types={vocals} tasks={tasks}
                                taskCategories={[ensemble, committee]} initialTaskActivities={initialTaskActivities}/>);

// The triggers have no accessible name, so they are found by the value or placeholder they show.
const combobox = (text: string, index = 0) => {
    const found = screen.queryAllByRole("combobox").filter(el => el.textContent?.includes(text));
    if (!found[index]) {
        throw new Error(`No combobox showing ${text}`);
    }
    return found[index];
};
const comboboxes = (text: string) => screen.queryAllByRole("combobox").filter(el => el.textContent?.includes(text));

async function pickTask(category: string, name: string) {
    await userEvent.click(combobox("selectCategory"));
    await userEvent.click(await screen.findByRole("option", {name: category}));
    await userEvent.click(combobox("selectTask"));
    await userEvent.click(await screen.findByRole("option", {name}));
}

async function pickOption(trigger: HTMLElement, option: string) {
    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("option", {name: option}));
}

const addButton = () => screen.getAllByRole("button", {name: "Common.add"}).at(-1)!;

beforeEach(() => {
    vi.clearAllMocks();
});

describe("TaskActivityManager", () => {
    it("adds a function with roles together with a character and vocal", async () => {
        vi.mocked(actions.getSpexCharactersAction).mockResolvedValue([character("c1", "Alfred Nobel"), character("c2", "Struken", true)]);
        renderManager();

        await pickTask("Ensemble", "Kör");
        const role = await waitFor(() => combobox("noCharacter"));
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

        await userEvent.click(role);
        expect(screen.queryByRole("option", {name: "Struken"})).not.toBeInTheDocument();
        await userEvent.click(await screen.findByRole("option", {name: "Alfred Nobel"}));

        // A role needs a vocal.
        await userEvent.click(addButton());
        expect(await screen.findByText("Common.fieldRequired")).toBeInTheDocument();
        expect(actions.createTaskActivityAction).not.toHaveBeenCalled();

        await pickOption(combobox("Common.select"), "Sopran");
        expect(screen.queryByRole("option", {name: "FGV"})).not.toBeInTheDocument();
        await userEvent.click(addButton());

        await waitFor(() => expect(actions.createTaskActivityAction).toHaveBeenCalledWith(
            "s1", "a1", "t2", expect.objectContaining({vocalId: "v1", characterId: "c1"})));
        expect(refresh).toHaveBeenCalled();
    });

    it("takes a typed role when the spex has no characters", async () => {
        vi.mocked(actions.getSpexCharactersAction).mockResolvedValue([]);
        renderManager();

        await pickTask("Ensemble", "Kör");
        await userEvent.type(await screen.findByRole("textbox"), "Greve");
        expect(comboboxes("noCharacter")).toHaveLength(0);
        await pickOption(combobox("Common.select"), "Sopran");
        await userEvent.click(addButton());

        await waitFor(() => expect(actions.createTaskActivityAction).toHaveBeenCalledWith(
            "s1", "a1", "t2", expect.objectContaining({vocalId: "v1", role: "Greve"})));
    });

    it("takes a typed role when the characters cannot be loaded", async () => {
        vi.mocked(actions.getSpexCharactersAction).mockRejectedValue(new Error("boom"));
        renderManager();

        await pickTask("Ensemble", "Kör");

        expect(await screen.findByRole("textbox")).toBeInTheDocument();
    });

    it("adds a function with roles without its actor", async () => {
        vi.mocked(actions.getSpexCharactersAction).mockResolvedValue([]);
        renderManager();

        await pickTask("Ensemble", "Kör");
        await userEvent.click(addButton());
        await waitFor(() => expect(actions.createTaskActivityAction).toHaveBeenCalledWith("s1", "a1", "t2", undefined));
    });

    it("adds a function without roles without asking for an actor", async () => {
        vi.mocked(actions.getSpexCharactersAction).mockResolvedValue([]);
        renderManager();

        await pickTask("Kommitté", "Scenmästare");
        expect(comboboxes("Common.select")).toHaveLength(0);
        await userEvent.click(addButton());
        await waitFor(() => expect(actions.createTaskActivityAction).toHaveBeenCalledWith("s1", "a1", "t3", undefined));
    });

    it("doesn't load characters without a spex", async () => {
        renderManager([], null);

        await pickTask("Ensemble", "Kör");

        expect(await screen.findByRole("textbox")).toBeInTheDocument();
        expect(actions.getSpexCharactersAction).not.toHaveBeenCalled();
    });

    it("shows an existing actor and changes its character", async () => {
        vi.mocked(actions.getSpexCharactersAction).mockResolvedValue([character("c1", "Alfred Nobel"), character("c2", "Bertha")]);
        renderManager(existing);

        expect(screen.getByText("Alfred Nobel")).toBeInTheDocument();
        const actor = screen.getByText("Alfred Nobel").closest("div") as HTMLElement;
        await userEvent.click(actor.querySelector("button") as HTMLElement);

        await pickOption(await waitFor(() => combobox("Alfred Nobel")), "Bertha");
        await userEvent.click(screen.getByRole("button", {name: "Common.save"}));

        await waitFor(() => expect(actions.updateActorAction).toHaveBeenCalledWith(
            "s1", "a1", "ta1", "v1", "ac1", expect.objectContaining({vocalId: "v1", characterId: "c2"})));
    });

    it("adds another actor to an existing function and reports a failure", async () => {
        vi.mocked(actions.getSpexCharactersAction).mockResolvedValue([]);
        vi.mocked(actions.createActorAction).mockRejectedValue(new Error("boom"));
        renderManager(existing);

        await userEvent.type(await screen.findByRole("textbox"), "Greve");
        await pickOption(combobox("Common.select"), "Sopran");
        await userEvent.click(screen.getAllByRole("button", {name: "Common.add"})[0]);

        await waitFor(() => expect(actions.createActorAction).toHaveBeenCalledWith(
            "s1", "a1", "ta1", "v1", expect.objectContaining({role: "Greve", vocalId: "v1"})));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred"));
    });
});
