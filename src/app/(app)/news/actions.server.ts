"use server";

import {Policies} from "@/utils/policy.server";
import {withPolicyAction} from "@/utils/route.server";
import {createNews, deleteNews, getNewsPaged, newsFormSchema, updateNews} from "@/lib/news";
import {revalidateTag} from "next/cache";
import {SortDirection} from "@/gql/graphql";

export async function fetchNewsPageAction(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    sort?: string[];
    direction?: SortDirection;
    filter?: string;
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
        revalidateNews();
        return result;
    });
}

export async function updateNewsAction(id: string, data: unknown) {
    return withPolicyAction(Policies.news.requireUpdate, async () => {
        const validated = newsFormSchema.parse(data);
        const result = await updateNews(id, validated);
        revalidateNews();
        return result;
    });
}

export async function deleteNewsAction(id: string) {
    return withPolicyAction(Policies.news.requireDelete, async () => {
        const result = await deleteNews(id);
        revalidateNews();
        return result;
    });
}

function revalidateNews() {
    revalidateTag('news', 'max');
}
