"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {deleteNews, getNewsPaged} from "@/lib/news";
import {revalidatePath} from "next/cache";

export async function fetchNewsPageAction(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    full?: boolean | string;
}) {
    return withPolicyAction(Policies.news.requireRead, async () => {
        return getNewsPaged({
            ...args,
            full: args.full === true || args.full === "true"
        });
    });
}

export async function deleteNewsAction(id: string) {
    return withPolicyAction(Policies.news.requireDelete, async () => {
        const result = await deleteNews(id);
        revalidatePath('/news/manage');
        revalidatePath('/news');
        revalidatePath('/');
        return result;
    });
}
