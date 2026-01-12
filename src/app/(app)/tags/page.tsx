import {TagGrid} from "@/components/tag";
import {getPaged} from "@/lib/tag";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {Tag} from "lucide-react";

export default async function TagPage() {
    return withPolicyPage(Policies.tag.requireRead, async () => {
        const [page, canUpdate] = await Promise.all([
            getPaged({first: 24, after: null}),
            Policies.tag.requireUpdate(),
        ]);
        const initialItems = page.items;

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <TagGrid
                            initialItems={initialItems}
                            initialPageInfo={page.pageInfo}
                            canUpdate={canUpdate.ok}
                        />
                    ) : (
                        <DataEmpty icon={Tag}/>
                    )}
                </div>
            </div>
        );
    });
}
