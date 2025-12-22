"use server";

import {getNewsPaged} from "@/lib/news";
import {notFound} from "next/navigation";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {RemoteDataTable} from "@/components/data-table.client";
import {columns} from "@/components/news";
import {NewsPage} from "@/types/pagination";

export async function fetchNewsAction(args: {
    first?: number;
    last?: number;
    after?: string | null;
    before?: string | null;
    full?: boolean | string;
}): Promise<NewsPage> {
    const authz = await Policies.news.requireUpdate();

    if (!authz.ok) {
        notFound();
    }

    return getNewsPaged({
        ...args,
        full: args.full === true || args.full === "true"
    });
}

export default async function NewsManagePage() {
    const authz = await Policies.news.requireUpdate();

    if (!authz.ok) {
        notFound();
    }

    const defaultPageSize = 15;
    const initialData = await getNewsPaged({first: defaultPageSize, full: true});
    const t = await getTranslations();

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight">{t("News.title")}</h2>
            </div>
            <RemoteDataTable
                columns={columns}
                fetchAction={fetchNewsAction}
                initialData={initialData}
                initialPageSize={defaultPageSize}
                extraParams={{ full: "true" }}
            />
        </div>
    );
}