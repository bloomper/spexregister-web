import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {RevisionDetailPanel} from "@/components/audit/revision-detail.client";
import {AuditedType, AuditSource, RevisionDetail, RevisionEntityChange, RevisionType} from "@/gql/schema";

vi.mock("@/components/audit/audit-binary-thumbnail.client", () => ({
    AuditBinaryThumbnail: () => <span data-testid="binary-thumbnail"/>,
}));

const spexareTarget = {type: AuditedType.Spexare, id: 88, label: "Anna Andersson"};

const entity = (overrides: Partial<RevisionEntityChange> = {}): RevisionEntityChange => ({
    type: AuditedType.Spexare,
    entityId: 88,
    entityLabel: "Anna Andersson",
    revisionType: RevisionType.Mod,
    changes: [{field: "firstName", oldValue: "Anna", newValue: "Anna-Karin", binary: false}],
    target: spexareTarget,
    ...overrides,
} as RevisionEntityChange);

const detail = (overrides: Partial<RevisionDetail> = {}): RevisionDetail => ({
    revision: 4821,
    modifiedAt: "2026-09-18T14:02:00Z",
    modifiedBy: "anna@spexregister.com",
    source: AuditSource.Web,
    operation: "spexareUpdate",
    comment: null,
    entities: [entity()],
    ...overrides,
} as RevisionDetail);

describe("RevisionDetailPanel", () => {
    it("says where the change came from", () => {
        render(<RevisionDetailPanel detail={detail({
            source: AuditSource.Restore,
            comment: "Återställd från version 4711",
        })}/>);

        expect(screen.getByText("Audit.sources.RESTORE")).toBeInTheDocument();
        expect(screen.getByText("Återställd från version 4711")).toBeInTheDocument();
        expect(screen.getByText("spexareUpdate")).toBeInTheDocument();
    });

    it("admits when a revision predates origin recording rather than inventing one", () => {
        render(<RevisionDetailPanel detail={detail({source: null, operation: null, comment: null})}/>);

        expect(screen.getByText("Audit.originUnknown")).toBeInTheDocument();
    });

    it("gathers everything changed in the same transaction under the record it belongs to", () => {
        render(<RevisionDetailPanel detail={detail({
            entities: [
                entity(),
                entity({
                    type: AuditedType.Address,
                    entityId: 12,
                    entityLabel: "Storgatan 1",
                    changes: [{field: "city", oldValue: "Göteborg", newValue: "Mölndal", binary: false}],
                }),
            ],
        })}/>);

        // One statement of context for the pair, not one per entity.
        expect(screen.getAllByText(/Audit.partOfEdit/)).toHaveLength(1);
        expect(screen.getByText("Address")).toBeInTheDocument();
        expect(screen.getByText("Mölndal")).toBeInTheDocument();
    });

    it("links each changed entity to the tab of its root that shows it", () => {
        render(<RevisionDetailPanel detail={detail({
            entities: [entity({type: AuditedType.Membership, entityId: 3, entityLabel: "2024"})],
        })}/>);

        expect(screen.getByRole("link", {name: "Membership: Audit.openRecord"}))
            .toHaveAttribute("href", "/spexare?open=88&tab=memberships");
    });

    it("offers no link for a record that no longer exists", () => {
        render(<RevisionDetailPanel detail={detail({
            entities: [entity({revisionType: RevisionType.Del, changes: [], target: null})],
        })}/>);

        expect(screen.queryByRole("link")).not.toBeInTheDocument();
        expect(screen.getByText("Audit.recordRemoved")).toBeInTheDocument();
    });
});
