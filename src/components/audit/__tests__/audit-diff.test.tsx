import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {AuditDiff} from "@/components/audit/audit-diff.client";
import {AuditedType, FieldChange} from "@/gql/schema";

const capture = vi.hoisted(() => ({current: [] as Record<string, unknown>[]}));
vi.mock("@/components/audit/audit-binary-thumbnail.client", () => ({
    AuditBinaryThumbnail: (props: Record<string, unknown>) => {
        capture.current.push(props);
        return <span data-testid="binary-thumbnail"/>;
    },
}));

const change = (overrides: Partial<FieldChange> = {}): FieldChange => ({
    field: "name",
    oldValue: "tag1",
    newValue: "tag2",
    binary: false,
    ...overrides,
} as FieldChange);

describe("AuditDiff", () => {
    it("puts before and after in their own labelled columns", () => {
        render(<AuditDiff changes={[change()]} type={AuditedType.Tag} entityId="1" revision={2}/>);

        expect(screen.getByText("Audit.before")).toBeInTheDocument();
        expect(screen.getByText("Audit.after")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("tag1")).toBeInTheDocument();
        expect(screen.getByText("tag2")).toBeInTheDocument();
    });

    it("marks an absent value rather than leaving the cell blank", () => {
        render(<AuditDiff changes={[change({oldValue: null})]} type={AuditedType.Tag} entityId="1" revision={2}/>);

        expect(screen.getByText("Audit.empty")).toBeInTheDocument();
    });

    it("renders nothing when a revision changed no fields", () => {
        const {container} = render(<AuditDiff changes={[]} type={AuditedType.Tag} entityId="1" revision={2}/>);

        expect(container).toBeEmptyDOMElement();
    });

    it("labels a field by its owner when the change names one", () => {
        render(<AuditDiff
            changes={[change({field: "streetAddress", type: AuditedType.Address, entityId: 12})]}
            type={AuditedType.Spexare} entityId="88" revision={2}/>);

        // `has()` is false under the test intl mock, so the humanized fallback is what shows.
        expect(screen.getByText("Street address")).toBeInTheDocument();
    });

    it("addresses a binary at the timeline's entity, which is what grants access", () => {
        capture.current = [];
        render(<AuditDiff
            changes={[change({field: "poster", binary: true, type: AuditedType.SpexDetails, entityId: 3})]}
            type={AuditedType.Spex} entityId="7" revision={2}
            previousRevisionOf={() => 1}/>);

        expect(capture.current).toContainEqual(
            expect.objectContaining({type: AuditedType.Spex, entityId: "7", revision: 2, field: "poster"}),
        );
        expect(capture.current).toContainEqual(
            expect.objectContaining({type: AuditedType.Spex, entityId: "7", revision: 1, field: "poster"}),
        );
    });

    it("names an old image it cannot address instead of claiming there was none", () => {
        capture.current = [];
        render(<AuditDiff
            changes={[change({field: "logo", oldValue: "image/png", newValue: "image/jpeg", binary: true})]}
            type={AuditedType.SpexCategory} entityId="4" revision={9}/>);

        expect(screen.getByText("image/png")).toBeInTheDocument();
        expect(screen.queryByText("Audit.empty")).not.toBeInTheDocument();
        expect(capture.current).toHaveLength(1);
        expect(capture.current[0]).toMatchObject({revision: 9});
    });
});
