import {NewsGrid} from "@/components/news";
import {Separator} from "@/components/ui/separator";
import {getTranslations} from "next-intl/server";
import {getPaged} from "@/lib/news";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {DataEmpty} from "@/components/data-empty";
import {Newspaper} from "lucide-react";
import * as Analytics from "@/lib/analytics";
import {AnalyticsHighlights, AnalyticsTotals} from "@/components/analytics";
import {requireUser} from "@/utils/auth.server";

export default async function HomePage() {
    const {session} = await requireUser();
    if (!session) {
        return null;
    }

    const [page, analytics, t] = await Promise.all([
        getPaged({first: 6}),
        Analytics.getSummary(),
        getTranslations()
    ]);
    const initialItems = page.edges.map(e => e.node);
    const hasNews = initialItems.length > 0;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            {analytics?.totals && <AnalyticsTotals data={analytics.totals}/>}
            {analytics && (
                <>
                    <Separator className="my-4"/>
                    <AnalyticsHighlights data={analytics}/>
                </>
            )}
            <div className="space-y-1 mt-4">
                <Separator className="my-4"/>
                <h2 className="text-2xl text-center font-semibold tracking-tight">
                    {t("Home.latestNews")}
                </h2>
            </div>
            {hasNews && (
                <>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <NewsGrid
                            initialItems={initialItems}
                            maxItems={6}
                        />
                    </div>
                    <div className="flex justify-center mt-4">
                        <Link
                            href="/news"
                            className={buttonVariants({variant: "outline", size: "sm"})}
                        >
                            {t("Home.showAllNews")}
                        </Link>
                    </div>
                </>
            )}
            {!hasNews && (
                <div className="mt-8">
                    <DataEmpty icon={Newspaper}/>
                </div>
            )}
        </div>
    );
}
