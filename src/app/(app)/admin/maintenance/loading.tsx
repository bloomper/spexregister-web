import {Skeleton} from "@bloomper/fgv-web-ui/ui/skeleton";
import {Page} from "@bloomper/fgv-web-ui/shell/page-header";

export default function AdminLoading() {
    return (
        <Page>
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-37.5"/>
            </div>
            <Skeleton className="h-4 w-80"/>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-40 w-full"/>
            </div>
        </Page>
    );
}
