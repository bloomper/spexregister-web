import {describe, expect, it, vi} from "vitest";
import {act, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {AuditedType, Revision, RevisionType} from "@/gql/schema";

const roles = vi.hoisted(() => ({current: [] as string[]}));
vi.mock("@/components/roles-provider.client", () => ({useRoles: () => roles.current}));
const restoreProps = vi.hoisted(() => ({current: [] as Record<string, unknown>[]}));
vi.mock("@/components/audit/restore-dialog.client", () => ({
    RestoreDialog: (props: Record<string, unknown>) => {
        restoreProps.current.push(props);
        return <div data-testid="restore-dialog"/>;
    },
}));
const capture = vi.hoisted(() => ({current: [] as Record<string, unknown>[]}));
vi.mock("@/components/audit/audit-binary-thumbnail.client", () => ({
    AuditBinaryThumbnail: (props: Record<string, unknown>) => {
        capture.current.push(props);
        return <span data-testid="binary-thumbnail"/>;
    },
}));

const revision = (overrides: Partial<Revision> = {}): Revision => ({
    revision: 2,
    type: AuditedType.Tag,
    entityId: 1,
    revisionType: RevisionType.Mod,
    modifiedAt: "2026-09-08T14:02:00Z",
    modifiedBy: "anna@spexregister.com",
    changes: [{field: "name", oldValue: "tag1", newValue: "tag2", binary: false}],
    ...overrides,
} as Revision);

describe("AuditTrail", () => {
    it("loads the revisions and renders them collapsed", async () => {
        const fetchAction = vi.fn().mockResolvedValue([revision()]);
        render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        expect(await screen.findByRole("button", {name: /Common.history/})).toBeInTheDocument();
        expect(fetchAction).toHaveBeenCalledWith("1");

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));

        expect(await screen.findByText("Common.revisionTypes.MOD")).toBeInTheDocument();
        expect(screen.getByText("anna@spexregister.com")).toBeInTheDocument();
    });

    it("shows the field diff when a revision is expanded", async () => {
        const fetchAction = vi.fn().mockResolvedValue([revision()]);
        render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await userEvent.click(await screen.findByRole("button", {name: "1"}));

        expect(screen.getByText("Name:")).toBeInTheDocument();
        expect(screen.getByText("tag1")).toBeInTheDocument();
        expect(screen.getByText("tag2")).toBeInTheDocument();
    });

    it("renders no restore action for a non-admin", async () => {
        roles.current = ["EDITOR"];
        const fetchAction = vi.fn().mockResolvedValue([revision(), revision({revision: 1, revisionType: RevisionType.Add, changes: []})]);
        render(<AuditTrail id="1" fetchAction={fetchAction}
                           restoreActions={{preview: vi.fn(), restore: vi.fn()}}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await screen.findByText("Common.revisionTypes.MOD");

        expect(screen.queryByTestId("restore-dialog")).not.toBeInTheDocument();
    });

    it("renders the restore action for an admin, but not for the current revision", async () => {
        roles.current = ["ADMIN"];
        const fetchAction = vi.fn().mockResolvedValue([
            revision(),
            revision({revision: 1, revisionType: RevisionType.Add, changes: []}),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction}
                           restoreActions={{preview: vi.fn(), restore: vi.fn()}}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));

        expect(await screen.findAllByTestId("restore-dialog")).toHaveLength(1);
    });

    it("renders no restore action when there is only the current revision", async () => {
        roles.current = ["ADMIN"];
        const fetchAction = vi.fn().mockResolvedValue([revision()]);
        render(<AuditTrail id="1" fetchAction={fetchAction}
                           restoreActions={{preview: vi.fn(), restore: vi.fn()}}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await screen.findByText("Common.revisionTypes.MOD");

        expect(screen.queryByTestId("restore-dialog")).not.toBeInTheDocument();
    });

    it("renders nothing at all when there are no revisions", async () => {
        const fetchAction = vi.fn().mockResolvedValue([]);
        const {container} = render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await waitFor(() => expect(fetchAction).toHaveBeenCalled());
        await waitFor(() => expect(container).toBeEmptyDOMElement());
        expect(screen.queryByRole("button", {name: /Common.history/})).not.toBeInTheDocument();
    });

    it("renders nothing when the revisions cannot be fetched", async () => {
        const fetchAction = vi.fn().mockRejectedValue(new Error("boom"));
        const error = vi.spyOn(console, "error").mockImplementation(() => {
        });
        const {container} = render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await waitFor(() => expect(container).toBeEmptyDOMElement());
        error.mockRestore();
    });
});

describe("AuditTrail binary changes", () => {
    const binary = (overrides: Partial<Revision> = {}): Revision => revision({
        changes: [{field: "poster", oldValue: null, newValue: "image/png", binary: true}],
        ...overrides,
    } as Partial<Revision>);

    it("addresses the thumbnail at the timeline's entity, which is what grants access", async () => {
        roles.current = [];
        const captured: Record<string, unknown>[] = [];
        capture.current = captured;
        const fetchAction = vi.fn().mockResolvedValue([
            revision({
                type: AuditedType.Spex,
                entityId: 7,
                changes: [{
                    field: "poster",
                    oldValue: null,
                    newValue: "image/png",
                    binary: true,
                    type: AuditedType.SpexDetails,
                    entityId: 42,
                }],
            } as Partial<Revision>),
        ]);
        render(<AuditTrail id="7" fetchAction={fetchAction}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await userEvent.click(await screen.findByRole("button", {name: "1"}));

        expect(captured).toContainEqual(
            expect.objectContaining({type: AuditedType.Spex, entityId: "7", field: "poster"}),
        );
    });

    it("shows a thumbnail for the value a binary field became", async () => {
        roles.current = [];
        const fetchAction = vi.fn().mockResolvedValue([binary()]);
        render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await userEvent.click(await screen.findByRole("button", {name: "1"}));

        expect(screen.getAllByTestId("binary-thumbnail")).toHaveLength(1);
    });

    it("shows both sides once the field has an earlier revision", async () => {
        roles.current = [];
        const fetchAction = vi.fn().mockResolvedValue([
            binary({
                revision: 5,
                changes: [{field: "poster", oldValue: "image/png", newValue: "image/jpeg", binary: true}]
            } as Partial<Revision>),
            binary({revision: 2}),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await userEvent.click((await screen.findAllByRole("button", {name: "1"}))[0]);

        expect(screen.getAllByTestId("binary-thumbnail")).toHaveLength(2);
    });
});

describe("AuditTrail restore availability", () => {
    it("offers restore for the initial revision once there is something newer", async () => {
        roles.current = ["ADMIN"];
        const fetchAction = vi.fn().mockResolvedValue([
            revision({revision: 3}),
            revision({revision: 1, revisionType: RevisionType.Add, changes: []}),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction}
                           restoreActions={{preview: vi.fn(), restore: vi.fn()}}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));

        expect(await screen.findAllByTestId("restore-dialog")).toHaveLength(1);
    });

    it("offers no restore for an entity whose latest revision is a deletion", async () => {
        roles.current = ["ADMIN"];
        const fetchAction = vi.fn().mockResolvedValue([
            revision({revision: 9, revisionType: RevisionType.Del, changes: []}),
            revision({revision: 5}),
            revision({revision: 1, revisionType: RevisionType.Add, changes: []}),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction}
                           restoreActions={{preview: vi.fn(), restore: vi.fn()}}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await screen.findByText("Common.revisionTypes.DEL");

        expect(screen.queryByTestId("restore-dialog")).not.toBeInTheDocument();
    });

    it("still offers restore for a live entity listed beside a removed one", async () => {
        roles.current = ["ADMIN"];
        const fetchAction = vi.fn().mockResolvedValue([
            revision({revision: 9, entityId: 2, revisionType: RevisionType.Del, changes: []}),
            revision({revision: 5, entityId: 1}),
            revision({revision: 1, entityId: 1, revisionType: RevisionType.Add, changes: []}),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction}
                           restoreActions={{preview: vi.fn(), restore: vi.fn()}}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));

        expect(await screen.findAllByTestId("restore-dialog")).toHaveLength(1);
    });
});

describe("AuditTrail across several entities", () => {
    const sharedRevision = () => [
        revision({
            revision: 1,
            entityId: 1,
            changes: [{field: "city", oldValue: null, newValue: "Göteborg", binary: false, type: AuditedType.Address, entityId: 1}],
        } as Partial<Revision>),
        revision({
            revision: 1,
            entityId: 2,
            changes: [{field: "city", oldValue: null, newValue: "Stockholm", binary: false, type: AuditedType.Address, entityId: 2}],
        } as Partial<Revision>),
    ];

    it("renders entities that share a revision as separate entries", async () => {
        roles.current = [];
        const fetchAction = vi.fn().mockResolvedValue(sharedRevision());
        render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));

        expect(screen.getAllByText("Common.revisionTypes.MOD")).toHaveLength(2);
    });

    it("expands only the entry that was clicked", async () => {
        roles.current = [];
        const fetchAction = vi.fn().mockResolvedValue(sharedRevision());
        render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await userEvent.click((await screen.findAllByRole("button", {name: "1"}))[0]);

        expect(screen.getByText("Göteborg")).toBeInTheDocument();
        expect(screen.queryByText("Stockholm")).not.toBeInTheDocument();
    });
});

describe("AuditTrail entity labelling and filtering", () => {
    it("names the entity when the timeline covers more than one", async () => {
        roles.current = [];
        const fetchAction = vi.fn().mockResolvedValue([
            revision({revision: 1, entityId: 1, entityLabel: "1962"} as Partial<Revision>),
            revision({revision: 1, entityId: 2, entityLabel: "1989"} as Partial<Revision>),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));

        expect(screen.getByText("1962")).toBeInTheDocument();
        expect(screen.getByText("1989")).toBeInTheDocument();
    });

    it("leaves the label out when the timeline is about a single entity", async () => {
        roles.current = [];
        const fetchAction = vi.fn().mockResolvedValue([
            revision({revision: 3, entityId: 1, entityLabel: "1962"} as Partial<Revision>),
            revision({revision: 1, entityId: 1, entityLabel: "1962"} as Partial<Revision>),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));

        expect(screen.queryByText("1962")).not.toBeInTheDocument();
    });

    it("narrows the timeline to the requested fields", async () => {
        roles.current = [];
        const fetchAction = vi.fn().mockResolvedValue([
            revision({
                revision: 3,
                changes: [
                    {field: "partner", oldValue: null, newValue: "Ada", binary: false},
                    {field: "firstName", oldValue: "A", newValue: "B", binary: false},
                ],
            } as Partial<Revision>),
            revision({
                revision: 1,
                changes: [{field: "firstName", oldValue: null, newValue: "A", binary: false}],
            } as Partial<Revision>),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction} fields={["partner"]}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));

        expect(screen.getAllByText("Common.revisionTypes.MOD")).toHaveLength(1);

        await userEvent.click(screen.getByRole("button", {name: "1"}));

        expect(screen.getByText("Ada")).toBeInTheDocument();
        expect(screen.queryByText("B")).not.toBeInTheDocument();
    });
});

describe("AuditTrail after a restore", () => {
    it("reloads the timeline and tells the surrounding dialog it is out of date", async () => {
        roles.current = ["ADMIN"];
        restoreProps.current = [];
        const onRestored = vi.fn();
        const fetchAction = vi.fn().mockResolvedValue([
            revision({revision: 3}),
            revision({revision: 1, revisionType: RevisionType.Add, changes: []}),
        ]);
        render(<AuditTrail id="1" fetchAction={fetchAction}
                           restoreActions={{preview: vi.fn(), restore: vi.fn()}}
                           onRestored={onRestored}/>);

        await userEvent.click(await screen.findByRole("button", {name: /Common.history/}));
        await screen.findAllByTestId("restore-dialog");

        expect(fetchAction).toHaveBeenCalledTimes(1);

        await act(async () => {
            (restoreProps.current[0].onRestored as () => void)();
        });

        expect(onRestored).toHaveBeenCalled();
        expect(fetchAction).toHaveBeenCalledTimes(2);
    });
});
