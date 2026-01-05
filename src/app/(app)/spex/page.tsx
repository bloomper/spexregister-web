import {SpexGrid} from "@/components/spex";
import {getPaged} from "@/lib/spex";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {getAll as getAllCategories} from "@/lib/spex/category";
import {Clapperboard} from "lucide-react";

export default async function SpexPage() {
    return withPolicyPage(Policies.spex.requireRead, async () => {
        const first = 24;
        const [page, categories] = await Promise.all([
            getPaged({first, after: null}),
            getAllCategories()
        ]);

        const initialItems = page.edges.map((e) => e.node);

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <SpexGrid
                            initialItems={initialItems}
                            initialPageInfo={page.pageInfo}
                            categories={categories}
                        />
                    ) : (
                        <DataEmpty icon={Clapperboard}/>
                    )}
                </div>
            </div>
        );
    });
}
