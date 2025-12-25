import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Skeleton} from "@/components/ui/skeleton";

export default function SpexManageLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-[150px]" />
            </div>
            <DataTableSkeleton
                rowCount={10}
                columnCount={7}
                columnTypes={["checkbox", "text", "text", "text", "image", "text", "text"]}
                columnClasses={[
                    "w-[40px]",                               // Select
                    "w-[80px]",                               // Year
                    "w-[250px]",                              // Title
                    "hidden lg:table-cell w-[150px]",         // Category
                    "w-[60px]",                               // Poster (Image)
                    "hidden xl:table-cell w-[150px]",         // Created At
                    "w-[50px]"                                // Actions
                ]}
            />
        </div>
    );
}