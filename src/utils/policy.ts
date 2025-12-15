import 'server-only';

import {type Role, requireAnyRole} from '@/utils/auth';

type PolicyResult =
    | {ok: true; roles: Role[]}
    | {ok: false; status: 401 | 403; message: string};

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
            return requireAnyRole(['ADMIN']);
        },
    },
} as const;