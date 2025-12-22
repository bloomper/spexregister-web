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
} as const;