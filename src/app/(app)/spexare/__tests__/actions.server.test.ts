import {beforeEach, describe, expect, it, vi} from "vitest";
import * as actions from "@/app/(app)/spexare/actions.server";
import {create, del, getPaged, update} from "@/lib/spexare";
import {create as createAddress} from "@/lib/spexare/address";
import {create as createConsent} from "@/lib/spexare/consent";
import {create as createMembership} from "@/lib/spexare/membership";
import {create as createToggle} from "@/lib/spexare/toggle";
import {create as createActor, update as updateActor} from "@/lib/spexare/activity/task-activity/actor";
import {revalidateTag} from "next/cache";

vi.mock("@/utils/route.server", () => ({
    withPolicyAction: (_policy: unknown, cb: () => unknown) => cb(),
}));
vi.mock("@/utils/policy.server", () => {
    const deep = new Proxy({}, {get: () => deep});
    return {Policies: deep};
});
vi.mock("next/cache", () => ({revalidateTag: vi.fn()}));

vi.mock("@/lib/spexare", () => ({
    getPaged: vi.fn(),
    search: vi.fn(),
    create: vi.fn(),
    get: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    exp: vi.fn(),
    imp: vi.fn(),
    addPartner: vi.fn(),
    removePartner: vi.fn(),
    uploadImage: vi.fn(),
    deleteImage: vi.fn(),
    events: vi.fn(),
    spexareFormSchema: {parse: (d: unknown) => d},
}));
vi.mock("@/lib/spexare/address", () => ({
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    addressFormSchema: {parse: (d: unknown) => d}
}));
vi.mock("@/lib/spexare/consent", () => ({
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    consentFormSchema: {parse: (d: unknown) => d}
}));
vi.mock("@/lib/spexare/membership", () => ({
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    membershipFormSchema: {parse: (d: unknown) => d}
}));
vi.mock("@/lib/spexare/tagging", () => ({create: vi.fn(), del: vi.fn()}));
vi.mock("@/lib/spexare/toggle", () => ({
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    toggleFormSchema: {parse: (d: unknown) => d}
}));
vi.mock("@/lib/spexare/activity", () => ({create: vi.fn(), del: vi.fn()}));
vi.mock("@/lib/spexare/activity/spex-activity", () => ({create: vi.fn(), update: vi.fn(), del: vi.fn()}));
vi.mock("@/lib/spexare/activity/task-activity", () => ({create: vi.fn(), update: vi.fn(), del: vi.fn()}));
vi.mock("@/lib/spexare/activity/task-activity/actor", () => ({
    create: vi.fn(),
    update: vi.fn(),
    del: vi.fn(),
    actorFormSchema: {parse: (d: unknown) => d}
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("spexare getPageAction", () => {
    it.each([
        [true, true],
        ["true", true],
        [false, false],
        ["false", false],
        [undefined, false],
    ])("coerces full=%p to %p", async (input, expected) => {
        await actions.getPageAction({full: input as boolean | string | undefined});
        expect(getPaged).toHaveBeenCalledWith(expect.objectContaining({full: expected}));
    });
});

describe("spexare create/update field asymmetry (intended)", () => {
    it("create strips birthDate/birthNumber/socialSecurityNumber/graduation/comment and defaults deceased/published", async () => {
        await actions.createAction({
            firstName: "A",
            birthDate: "d", birthNumber: "n", socialSecurityNumber: "ssn", graduation: "g", comment: "c",
        });

        expect(create).toHaveBeenCalledWith({firstName: "A", deceased: false, published: false});
        expect(revalidateTag).toHaveBeenCalledWith("spexare", "max");
    });

    it("update strips only birthDate/birthNumber, keeping SSN/graduation/comment, and defaults deceased/published", async () => {
        await actions.updateAction("id1", {
            firstName: "A",
            birthDate: "d", birthNumber: "n", socialSecurityNumber: "ssn", graduation: "g", comment: "c",
        });

        expect(update).toHaveBeenCalledWith("id1", {
            firstName: "A",
            socialSecurityNumber: "ssn", graduation: "g", comment: "c",
            deceased: false, published: false,
        });
    });

    it("preserves explicit deceased/published rather than overriding them", async () => {
        await actions.createAction({firstName: "A", deceased: true, published: true});
        expect(create).toHaveBeenCalledWith({firstName: "A", deceased: true, published: true});
    });
});

describe("spexare sub-resource create strips the form typeId in favour of the positional arg", () => {
    it.each([
        ["address", () => actions.createAddressAction("s1", "t1", {typeId: "FORM", line: "x"}), createAddress],
        ["consent", () => actions.createConsentAction("s1", "t1", {typeId: "FORM", value: true}), createConsent],
        ["membership", () => actions.createMembershipAction("s1", "t1", {
            typeId: "FORM",
            year: 2000
        }), createMembership],
        ["toggle", () => actions.createToggleAction("s1", "t1", {typeId: "FORM", value: true}), createToggle],
    ])("%s", async (_name, call, spy) => {
        await call();
        const [spexareId, typeId, input] = vi.mocked(spy).mock.calls[0];
        expect(spexareId).toBe("s1");
        expect(typeId).toBe("t1");
        expect(input).not.toHaveProperty("typeId");
    });
});

describe("spexare actor vocalId asymmetry (intended)", () => {
    it("create uses the positional vocalId and drops the form vocalId", async () => {
        await actions.createActorAction("s1", "a1", "ta1", "POS", {vocalId: "FORM", role: "lead"});

        expect(createActor).toHaveBeenCalledWith("s1", "a1", "ta1", "POS", {role: "lead"});
    });

    it("update uses the form vocalId and ignores the positional arg", async () => {
        await actions.updateActorAction("s1", "a1", "ta1", "POS", "id1", {vocalId: "FORM", role: "lead"});

        expect(updateActor).toHaveBeenCalledWith("s1", "a1", "ta1", "FORM", "id1", {role: "lead"});
    });
});

describe("spexare bulkDeleteAction", () => {
    it("deletes every id and revalidates once", async () => {
        await actions.bulkDeleteAction(["a", "b", "c"]);

        expect(del).toHaveBeenCalledTimes(3);
        expect(revalidateTag).toHaveBeenCalledTimes(1);
    });
});
