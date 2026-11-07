import {NewsGrid} from "@/components/news";
import {getTranslations} from "next-intl/server";
import {getPaged} from "@/lib/news";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {Newspaper} from "lucide-react";

/**
 * The news as cards, scrolling on.
 */
export default async function NewsPage() {
    return withPolicyPage(Policies.news.requireRead, async () => {
        const [page, canUpdate] = await Promise.all([
            getPaged({first: 24, after: null}),
            Policies.news.requireUpdate(),
        ]);
        const initialItems = page.items;
        const t = await getTranslations();

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="sr-only">{t("News.heading")}</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <NewsGrid
                            initialItems={initialItems}
                            initialPageInfo={page.pageInfo}
                            canUpdate={canUpdate.ok}
                        />
                    ) : (
                        <DataEmpty icon={Newspaper}/>
                    )}
                </div>
            </div>
        );
    });
}
