import "server-only";

import { requireAnyRole } from "@/utils/auth.server";
import { AuthzResult } from "@/types/auth";

/**
 * Page and action guards by role, mirroring what the server allows. They only decide what to show; the server enforces
 * every rule, and what a user may do with a spexare, spex or news item comes from its `permissions`.
 */
export const Policies = {
  admin: {
    async requireAdmin(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
  },
  analytics: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
  },
  audit: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
    async requireRestore(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
  },
  impex: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireDelete(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
  },
  news: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
    async requireCreate(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireUpdate(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireDelete(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireExport(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireImport(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
  },
  savedSearch: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
    async requireCreate(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
    async requireUpdate(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
    async requireDelete(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
  },
  // Read only: Spexipedia keeps spex; Spexregister holds a synced copy
  spex: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
  },
  // Read only: Spexipedia keeps spex categories; Spexregister holds a synced copy
  spexCategory: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
  },
  spexare: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
    async requireCreate(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireUpdate(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
    async requireDelete(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
    async requireExport(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireImport(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireSelfService(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
  },
  tag: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
    async requireCreate(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireUpdate(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireDelete(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireExport(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
    async requireImport(): Promise<AuthzResult> {
      return requireAnyRole(["EDITOR", "ADMIN"]);
    },
  },
  // Read only: Spexipedia keeps tasks; Spexregister holds a synced copy
  task: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
  },
  // Read only: Spexipedia keeps task categories; Spexregister holds a synced copy
  taskCategory: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
    },
  },
  user: {
    async requireRead(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
    async requireCreate(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
    async requireUpdate(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
    async requireDelete(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
    async requireExport(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
    async requireImport(): Promise<AuthzResult> {
      return requireAnyRole(["ADMIN"]);
    },
  },
} as const;
