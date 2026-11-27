import {Skeleton} from "@bloomper/fgv-web-ui/ui/skeleton";
import {Page} from "@bloomper/fgv-web-ui/shell/page-header";

export default function MapLoading() {
    return (
        <Page>
            <Skeleton className="h-8 w-48"/>
            <Skeleton className="h-4 w-full max-w-lg"/>
            <Skeleton className="h-[70vh] w-full"/>
        </Page>
    );
}
