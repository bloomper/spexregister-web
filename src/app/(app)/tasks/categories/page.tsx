import {TaskCategoryGrid} from "@/components/task/category";
import {getPaged} from "@/lib/task/category";
import {DataEmpty} from "@/components/data-empty";
import {withPolicyPage} from "@/utils/route.server";
import {Policies} from "@/utils/policy.server";
import {Shapes} from "lucide-react";

export default async function TaskCategoryPage() {
    return withPolicyPage(Policies.taskCategory.requireRead, async () => {
        const [page, canUpdate] = await Promise.all([
            getPaged({first: 24, after: null}),
            Policies.taskCategory.requireUpdate(),
        ]);
        const initialItems = page.items;

        return (
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {initialItems.length > 0 ? (
                        <TaskCategoryGrid
                            initialItems={initialItems}
                            initialPageInfo={page.pageInfo}
                            canUpdate={canUpdate.ok}
                        />
                    ) : (
                        <DataEmpty icon={Shapes}/>
                    )}
                </div>
            </div>
        );
    });
}
