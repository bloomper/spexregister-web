import {SpexGrid} from "@/components/spex";
import {getPaged} from "@/lib/spex";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {getAll as getAllCategories} from "@/lib/spex/category";
import {Clapperboard} from "lucide-react";

export default async function SpexPage() {
    return withPolicyPage(Policies.spex.requireRead, async () => {
        const [page, categories, canUpdate] = await Promise.all([
            getPaged({first: 24, after: null}),
            getAllCategories(),
            Policies.spex.requireUpdate(),
        ]);
        const initialItems = page.items;

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <SpexGrid
                            initialItems={initialItems}
                            initialPageInfo={page.pageInfo}
                            categories={categories}
                            canUpdate={canUpdate.ok}
                        />
                    ) : (
                        <DataEmpty icon={Clapperboard}/>
                    )}
                </div>
            </div>
        );
    });
}
