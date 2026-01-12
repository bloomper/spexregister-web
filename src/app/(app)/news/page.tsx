import {NewsGrid} from "@/components/news";
import {getPaged} from "@/lib/news";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {Newspaper} from "lucide-react";

export default async function NewsPage() {
    return withPolicyPage(Policies.news.requireRead, async () => {
        const [page, canUpdate] = await Promise.all([
            getPaged({first: 24, after: null}),
            Policies.news.requireUpdate(),
        ]);
        const initialItems = page.items;

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
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
