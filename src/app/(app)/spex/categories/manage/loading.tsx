import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Skeleton} from "@/components/ui/skeleton";

export default function SpexCategoryManageLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-[200px]"/>
            </div>
            <DataTableSkeleton
                rowCount={15}
                columnCount={7}
                columnTypes={["checkbox", "text", "text", "image", "text", "text", "text"]}
                columnClasses={[
                    "w-[40px]",                               // Select
                    "w-[250px]",                              // Name
                    "hidden lg:table-cell w-[100px]",         // First Year
                    "w-[60px]",                               // Logo
                    "hidden xl:table-cell w-[150px]",         // Created At
                    "hidden xl:table-cell w-[150px]",         // Last Modified At
                    "w-[50px]"                                // Actions
                ]}
            />
        </div>
    );
}