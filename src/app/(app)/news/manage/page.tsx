import {getNewsPaged} from "@/lib/news";
import {Policies} from "@/utils/policy.server";
import {getTranslations} from "next-intl/server";
import {NewsTable} from "@/components/news";
import {withPolicyPage} from "@/utils/route.server";

export default async function NewsManagePage() {
    return withPolicyPage(Policies.news.requireUpdate, async () => {
        const defaultPageSize = 15;
        const initialData = await getNewsPaged({
            first: defaultPageSize,
            filter: "(published:TRUE OR published:FALSE)",
            full: true
        });
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{t("News.title")}</h2>
                </div>
                <NewsTable
                    initialData={initialData}
                    defaultPublishedStates={["true", "false"]}
                />
            </div>
        );
    });
}
