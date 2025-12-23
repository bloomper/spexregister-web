import {getNewsPaged} from "@/lib/news";
import {notFound} from "next/navigation";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {RemoteDataTable} from "@/components/data-table.client";
import {columns} from "@/components/news";
import {fetchNewsPageAction} from "@/app/(app)/news/actions.server";

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
                fetchAction={fetchNewsPageAction}
                initialData={initialData}
                initialPageSize={defaultPageSize}
                extraParams={{ full: "true" }}
            />
        </div>
    );
}