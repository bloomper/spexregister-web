import 'server-only';

import {type PolicyResult} from '@/types/auth';
import {requireAnyRole} from "@/utils/auth.server";

export const Policies = {
    news: {
        async requireRead(): Promise<PolicyResult> {
            return requireAnyRole(['USER', 'EDITOR', 'ADMIN']);
        },
        async requireCreate(): Promise<PolicyResult> {
            return requireAnyRole(['EDITOR', 'ADMIN']);
        },
        async requireUpdate(): Promise<PolicyResult> {
            return requireAnyRole(['EDITOR', 'ADMIN']);
        },
        async requireDelete(): Promise<PolicyResult> {
            return requireAnyRole(['EDITOR', 'ADMIN']);
        },
    },
    spex: {
        async requireRead(): Promise<PolicyResult> {
            return requireAnyRole(['USER', 'EDITOR', 'ADMIN']);
        },
        async requireCreate(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
        async requireUpdate(): Promise<PolicyResult> {
            return requireAnyRole(['EDITOR', 'ADMIN']);
        },
        async requireDelete(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
    },
    spexCategory: {
        async requireRead(): Promise<PolicyResult> {
            return requireAnyRole(['USER', 'EDITOR', 'ADMIN']);
        },
        async requireCreate(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
        async requireUpdate(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
        async requireDelete(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
    },
    spexare: {
        async requireRead(): Promise<PolicyResult> {
            return requireAnyRole(['USER', 'EDITOR', 'ADMIN']);
        },
        async requireCreate(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
        async requireUpdate(): Promise<PolicyResult> {
            return requireAnyRole(['USER', 'EDITOR', 'ADMIN']);
        },
        async requireDelete(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
    },
    tag: {
        async requireRead(): Promise<PolicyResult> {
            return requireAnyRole(['USER', 'EDITOR', 'ADMIN']);
        },
        async requireCreate(): Promise<PolicyResult> {
            return requireAnyRole(['EDITOR', 'ADMIN']);
        },
        async requireUpdate(): Promise<PolicyResult> {
            return requireAnyRole(['EDITOR', 'ADMIN']);
        },
        async requireDelete(): Promise<PolicyResult> {
            return requireAnyRole(['EDITOR', 'ADMIN']);
        },
    },
    task: {
        async requireRead(): Promise<PolicyResult> {
            return requireAnyRole(['USER', 'EDITOR', 'ADMIN']);
        },
        async requireCreate(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
        async requireUpdate(): Promise<PolicyResult> {
            return requireAnyRole(['EDITOR', 'ADMIN']);
        },
        async requireDelete(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
    },
    taskCategory: {
        async requireRead(): Promise<PolicyResult> {
            return requireAnyRole(['USER', 'EDITOR', 'ADMIN']);
        },
        async requireCreate(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
        async requireUpdate(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
        async requireDelete(): Promise<PolicyResult> {
            return requireAnyRole(['ADMIN']);
        },
    },
} as const;