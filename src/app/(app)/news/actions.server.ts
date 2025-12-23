"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {createNews, deleteNews, getNewsPaged, newsFormSchema, updateNews} from "@/lib/news";
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

export async function createNewsAction(data: unknown) {
    return withPolicyAction(Policies.news.requireCreate, async () => {
        const validated = newsFormSchema.parse(data);
        const result = await createNews(validated);
        revalidatePaths();
        return result;
    });
}

export async function updateNewsAction(id: string, data: unknown) {
    return withPolicyAction(Policies.news.requireUpdate, async () => {
        const validated = newsFormSchema.parse(data);
        const result = await updateNews(id, validated);
        revalidatePaths();
        return result;
    });
}

export async function deleteNewsAction(id: string) {
    return withPolicyAction(Policies.news.requireDelete, async () => {
        const result = await deleteNews(id);
        revalidatePaths();
        return result;
    });
}

function revalidatePaths() {
    revalidatePath('/news/manage');
    revalidatePath('/news');
    revalidatePath('/');
}
