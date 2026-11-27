import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Role } from "@/types/auth";
import { Policies } from "@/utils/policy.server";

const requireAnyRole = vi.fn(async (roles: Role[]) => ({ ok: true as const, roles }));
vi.mock("@/utils/auth.server", () => ({ requireAnyRole: (roles: Role[]) => requireAnyRole(roles) }));

beforeEach(() => {
  requireAnyRole.mockClear();
});

async function rolesFor(policy: () => Promise<unknown>): Promise<Role[]> {
  await policy();
  expect(requireAnyRole).toHaveBeenCalledTimes(1);
  return requireAnyRole.mock.calls[0][0];
}

describe("Policies role matrix", () => {
  it("base data copied from Spexipedia: read for every role, and nothing else", async () => {
    for (const policy of [Policies.spex, Policies.spexCategory, Policies.task, Policies.taskCategory]) {
      requireAnyRole.mockClear();
      expect(await rolesFor(policy.requireRead)).toEqual(["USER", "EDITOR", "ADMIN"]);
      expect(Object.keys(policy)).toEqual(["requireRead"]);
    }
  });

  it("user: admin controls everything", async () => {
    expect(await rolesFor(Policies.user.requireRead)).toEqual(["ADMIN"]);
    requireAnyRole.mockClear();
    expect(await rolesFor(Policies.user.requireDelete)).toEqual(["ADMIN"]);
  });

  it("news: read for all, mutations for editor/admin", async () => {
    expect(await rolesFor(Policies.news.requireRead)).toEqual(["USER", "EDITOR", "ADMIN"]);
    requireAnyRole.mockClear();
    expect(await rolesFor(Policies.news.requireCreate)).toEqual(["EDITOR", "ADMIN"]);
  });

  it("spexare: update allows plain users, delete is admin-only", async () => {
    expect(await rolesFor(Policies.spexare.requireUpdate)).toEqual(["USER", "EDITOR", "ADMIN"]);
    requireAnyRole.mockClear();
    expect(await rolesFor(Policies.spexare.requireDelete)).toEqual(["ADMIN"]);
  });

  it("impex: read and delete require editor/admin", async () => {
    expect(await rolesFor(Policies.impex.requireRead)).toEqual(["EDITOR", "ADMIN"]);
    requireAnyRole.mockClear();
    expect(await rolesFor(Policies.impex.requireDelete)).toEqual(["EDITOR", "ADMIN"]);
  });

  it("forwards the AuthzResult from requireAnyRole unchanged", async () => {
    const result = await Policies.tag.requireExport();
    expect(result).toEqual({ ok: true, roles: ["EDITOR", "ADMIN"] });
  });

  // Exhaustively exercise every entry in the authorization matrix: each policy
  // must delegate to requireAnyRole with a non-empty, valid role set.
  const validRoles: Role[] = ["USER", "EDITOR", "ADMIN"];
  const entries = Object.entries(Policies).flatMap(([resource, methods]) =>
    Object.keys(methods).map((method) => [resource, method] as const)
  );

  it.each(entries)("%s.%s delegates to requireAnyRole with valid roles", async (resource, method) => {
    const policy = (Policies as Record<string, Record<string, () => Promise<unknown>>>)[resource][method];

    const result = await policy();

    expect(requireAnyRole).toHaveBeenCalledTimes(1);
    const roles = requireAnyRole.mock.calls[0][0];
    expect(roles.length).toBeGreaterThan(0);
    expect(roles.every((r) => validRoles.includes(r))).toBe(true);
    expect(result).toEqual({ ok: true, roles });
  });
});
