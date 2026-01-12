import {SpexCategoryGrid} from "@/components/spex/category";
import {getPaged} from "@/lib/spex/category";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";

export default async function SpexCategoryPage() {
    return withPolicyPage(Policies.spexCategory.requireRead, async () => {
        const [page, canUpdate] = await Promise.all([
            getPaged({first: 24}),
            Policies.spexCategory.requireUpdate(),
        ]);
        const initialItems = page.items;

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <SpexCategoryGrid
                        initialItems={initialItems}
                        initialPageInfo={page.pageInfo}
                        canUpdate={canUpdate.ok}
                    />
                </div>
            </div>
        );
    });
}
