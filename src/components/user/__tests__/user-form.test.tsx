import type {ReactNode} from "react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {UserForm} from "@/components/user/user-form.client";
import type {Authority, State, User} from "@/gql/schema";

const actions = vi.hoisted(() => ({
    addAuthoritiesAction: vi.fn(),
    addSpexareAction: vi.fn(),
    createAction: vi.fn(),
    removeAuthoritiesAction: vi.fn(),
    removeSpexareAction: vi.fn(),
    searchSpexareAction: vi.fn(),
    setStateAction: vi.fn(),
    updateAction: vi.fn(),
}));
const toast = vi.hoisted(() => ({success: vi.fn(), error: vi.fn()}));

vi.mock("@/app/(app)/users/actions.server", () => actions);
vi.mock("sonner", () => ({toast}));
vi.mock("@/components/edit-queue/edit-form-shell.client", () => ({
    EditFormShell: ({children}: { children?: ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/edit-queue/edit-queue-form-state.client", () => ({useReportEditQueueFormState: vi.fn()}));

const AUTHORITIES = [{id: "ROLE_ADMIN", label: "Administratör"}, {id: "ROLE_EDITOR", label: "Redaktör"}, {id: "ROLE_USER", label: "Användare"}] as Authority[];
const STATES = [{id: "ACTIVE", label: "Aktiv"}, {id: "INACTIVE", label: "Inaktiv"}] as State[];

const USER = {
    id: "7",
    email: "anna@example.com",
    externalId: "kc-7",
    state: {id: "ACTIVE", label: "Aktiv"},
    authorities: [{id: "ROLE_EDITOR", label: "Redaktör"}],
    spexare: {id: "s1", firstName: "Anna", lastName: "Andersson"},
} as unknown as User;

/** Embedded, as in the edit queue: the page submits the form by its id. */
const show = (item?: User, onSuccess = vi.fn(), onError = vi.fn()) => {
    const view = render(<UserForm item={item} authorities={AUTHORITIES} states={STATES} onSuccess={onSuccess}
                                  onError={onError} embedded formId="user-form"/>);

    return {...view, submit: () => fireEvent.submit(view.container.querySelector("form#user-form")!), onSuccess, onError};
};

/** The state select comes before the spexare picker in the form. */
const stateBox = () => screen.getAllByRole("combobox")[0];
const spexareBox = () => screen.getAllByRole("combobox")[1];

describe("UserForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        Object.values(actions).forEach(action => action.mockResolvedValue(undefined));
        actions.createAction.mockResolvedValue({id: "99"});
        actions.searchSpexareAction.mockResolvedValue([{id: "s2", firstName: "Bertil", lastName: "Berg", nickName: "Bebben"}]);
    });

    it("sends only what changed: the added and removed roles", async () => {
        const {submit, onSuccess} = show(USER);

        expect(screen.getByText("kc-7")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("checkbox", {name: "Administratör"}));
        await userEvent.click(screen.getByRole("checkbox", {name: "Redaktör"}));
        submit();

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(actions.addAuthoritiesAction).toHaveBeenCalledWith("7", ["ROLE_ADMIN"]);
        expect(actions.removeAuthoritiesAction).toHaveBeenCalledWith("7", ["ROLE_EDITOR"]);
        expect(actions.updateAction).not.toHaveBeenCalled();
        expect(actions.setStateAction).not.toHaveBeenCalled();
        expect(actions.addSpexareAction).not.toHaveBeenCalled();
        expect(actions.removeSpexareAction).not.toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith("Common.updateSuccess");
    });

    it("updates the e-mail and unlinks the spexare", async () => {
        const {submit, onSuccess} = show(USER);

        expect(spexareBox()).toHaveTextContent("Anna Andersson");
        await userEvent.clear(screen.getByRole("textbox"));
        await userEvent.type(screen.getByRole("textbox"), "anna.a@example.com");
        const buttons = screen.getAllByRole("button");

        await userEvent.click(buttons[buttons.length - 1]);
        expect(spexareBox()).toHaveTextContent("Common.select");
        submit();

        await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        expect(actions.updateAction).toHaveBeenCalledWith("7", expect.objectContaining({email: "anna.a@example.com", spexareId: null}));
        expect(actions.removeSpexareAction).toHaveBeenCalledWith("7");
    });

    it("creates a user and then sets its roles, state and spexare", async () => {
        const {submit, onSuccess} = show();

        await userEvent.type(screen.getByRole("textbox"), "ny@example.com");
        await userEvent.click(screen.getByRole("checkbox", {name: "Användare"}));

        await userEvent.click(spexareBox());
        await userEvent.type(await screen.findByPlaceholderText("User.spexareSearchPlaceholder"), "Be");
        await userEvent.click(await screen.findByText("Bertil Berg"));
        expect(spexareBox()).toHaveTextContent("Bertil Berg");
        expect(actions.searchSpexareAction).toHaveBeenCalledWith("Be");

        await userEvent.click(stateBox());
        await userEvent.click(await screen.findByRole("option", {name: "Aktiv"}));
        submit();

        await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(undefined));
        expect(actions.createAction).toHaveBeenCalledWith(expect.objectContaining({email: "ny@example.com"}));
        expect(actions.addAuthoritiesAction).toHaveBeenCalledWith("99", ["ROLE_USER"]);
        expect(actions.setStateAction).toHaveBeenCalledWith("99", "ACTIVE");
        expect(actions.addSpexareAction).toHaveBeenCalledWith("99", "s2");
        expect(toast.success).toHaveBeenCalledWith("Common.createSuccess");
    });

    it("does not save an invalid user", async () => {
        const {submit, onSuccess} = show();

        submit();

        expect(await screen.findAllByText("Common.fieldRequired")).not.toHaveLength(0);
        expect(actions.createAction).not.toHaveBeenCalled();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("tells when saving fails", async () => {
        actions.addAuthoritiesAction.mockRejectedValue(new Error("FORBIDDEN"));
        const {submit, onSuccess, onError} = show(USER);

        await userEvent.click(screen.getByRole("checkbox", {name: "Administratör"}));
        submit();

        await waitFor(() => expect(onError).toHaveBeenCalled());
        expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred");
        expect(onSuccess).not.toHaveBeenCalled();
    });
});
