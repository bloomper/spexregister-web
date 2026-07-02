import "server-only";

import {requireAnyRole} from "@/utils/auth.server";
import {AuthzResult} from "@/types/auth";

export const Policies = {
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
    spex: {
        async requireRead(): Promise<AuthzResult> {
            return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
        },
        async requireCreate(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
        },
        async requireUpdate(): Promise<AuthzResult> {
            return requireAnyRole(["EDITOR", "ADMIN"]);
        },
        async requireDelete(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
        },
        async requireExport(): Promise<AuthzResult> {
            return requireAnyRole(["EDITOR", "ADMIN"]);
        },
        async requireImport(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
        },
    },
    spexCategory: {
        async requireRead(): Promise<AuthzResult> {
            return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
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
            return requireAnyRole(["EDITOR", "ADMIN"]);
        },
        async requireImport(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
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
    task: {
        async requireRead(): Promise<AuthzResult> {
            return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
        },
        async requireCreate(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
        },
        async requireUpdate(): Promise<AuthzResult> {
            return requireAnyRole(["EDITOR", "ADMIN"]);
        },
        async requireDelete(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
        },
        async requireExport(): Promise<AuthzResult> {
            return requireAnyRole(["EDITOR", "ADMIN"]);
        },
        async requireImport(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
        },
    },
    taskCategory: {
        async requireRead(): Promise<AuthzResult> {
            return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
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
            return requireAnyRole(["EDITOR", "ADMIN"]);
        },
        async requireImport(): Promise<AuthzResult> {
            return requireAnyRole(["ADMIN"]);
        },
    },
    user: {
        async requireReadMe(): Promise<AuthzResult> {
            return requireAnyRole(["USER", "EDITOR", "ADMIN"]);
        },
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