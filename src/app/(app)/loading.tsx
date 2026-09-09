import {DataGridSkeleton} from "@/components/data-grid-skeleton";
import {Separator} from "@/components/ui/separator";
import {Skeleton} from "@/components/ui/skeleton";

export default function HomeLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({length: 4}).map((_, i) => (
                    <Skeleton key={i} className="h-45 w-full rounded-xl"/>
                ))}
            </div>
            <div className="space-y-1 mt-4">
                <Separator className="my-4"/>
                <div className="flex justify-center">
                    <Skeleton className="h-8 w-50"/>
                </div>
            </div>
            <DataGridSkeleton count={6}/>
        </div>
    );
}
