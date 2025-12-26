import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Skeleton} from "@/components/ui/skeleton";

export default function NewsManageLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-[180px]"/>
            </div>
            <DataTableSkeleton
                rowCount={10}
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
        </div>
    );
}