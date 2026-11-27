import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Skeleton} from "@bloomper/fgv-web-ui/ui/skeleton";
import {Page} from "@bloomper/fgv-web-ui/shell/page-header";

export default function NewsManageLoading() {
    return (
        <Page>
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-45"/>
            </div>
            <DataTableSkeleton
                rowCount={15}
                columnCount={6}
                columnTypes={["checkbox", "text", "text", "text", "text", "text"]}
                columnClasses={[
                    "w-[40px]",                       // Select
                    "w-[250px]",                      // Subject
                    "hidden lg:table-cell",           // Published
                    "hidden xl:table-cell w-[150px]", // Visible From
                    "hidden xl:table-cell w-[150px]", // Created At
                    "w-[50px]"                        // Actions
                ]}
            />
        </Page>
    );
}