"use server";

import {revalidateTag} from "next/cache";
import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {CACHE_TAG, createGrant, deleteGrant, getGrantsPage, updateGrant} from "@/lib/permission";
import {deleteEach} from "@/utils/utils.server";
import {
    permissionGrantFormSchema,
    permissionGrantUpdateFormSchema,
    toCreateInput,
    toUpdateInput
} from "@/lib/permission/schema";
import {search} from "@/lib/spexare";
import {search as searchUsers} from "@/lib/user";
import type {PermissionGrantCreate, PermissionGrantUpdate} from "@/gql/graphql";
import type {User} from "@/gql/schema";
import type {SortDirection} from "@/gql/schema";

export async function getGrantsPageAction(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
}) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => getGrantsPage(args));
}

export async function createGrantAction(input: unknown) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => {
        const value = permissionGrantFormSchema.parse(input);

        await createGrant(toCreateInput(value) as PermissionGrantCreate);
        revalidateTag(CACHE_TAG, "max");
    });
}

export async function updateGrantAction(id: string, input: unknown) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => {
        const value = permissionGrantUpdateFormSchema.parse(input);

        await updateGrant(toUpdateInput(id, value) as PermissionGrantUpdate);
        revalidateTag(CACHE_TAG, "max");
    });
}

export async function deleteGrantAction(id: string) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => {
        await deleteGrant(id);
        revalidateTag(CACHE_TAG, "max");
    });
}

export async function bulkDeleteGrantsAction(ids: string[]) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => {
        try {
            await deleteEach(ids, deleteGrant);
        } finally {
            revalidateTag(CACHE_TAG, "max");
        }
    });
}

export async function searchSpexareAction(q: string) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => {
        const page = await search({q, first: 20});

        return page.items.map((spexare) => ({
            id: spexare.id,
            label: [spexare.firstName, spexare.nickName ? `"${spexare.nickName}"` : null, spexare.lastName].filter(Boolean).join(" "),
        }));
    });
}

export async function searchUsersAction(q: string) {
    return withPolicyAction(Policies.admin.requireAdmin, async () => {
        const users = await searchUsers(q.trim());

        return users.map(toOption);
    });
}

function toOption(user: User) {
    return {
        id: user.id,
        label: user.spexare ? `${user.spexare.firstName} ${user.spexare.lastName} (${user.email})` : user.email,
    };
}
