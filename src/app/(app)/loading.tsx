import {DataGridSkeleton} from "@/components/data-grid-skeleton";
import {Separator} from "@bloomper/fgv-web-ui/ui/separator";
import {Skeleton} from "@bloomper/fgv-web-ui/ui/skeleton";
import {Page} from "@bloomper/fgv-web-ui/shell/page-header";

export default function HomeLoading() {
    return (
        <Page>
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
        </Page>
    );
}
