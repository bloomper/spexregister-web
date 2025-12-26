import {NewsList} from "@/components/news";
import {getPaged} from "@/lib/news";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";

export default async function NewsPage() {
    return withPolicyPage(Policies.news.requireRead, async () => {
        const first = 24;
        const page = await getPaged({first, after: null});
        const initialItems = page.edges.map((e) => e.node);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <NewsList initialItems={initialItems} initialPageInfo={page.pageInfo}/>
                    ) : (
                        <DataEmpty/>
                    )}
                </div>
            </div>
        );
    });
}
