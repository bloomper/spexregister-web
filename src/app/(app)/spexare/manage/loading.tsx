import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Skeleton} from "@/components/ui/skeleton";

export default function SpexareManageLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-[180px]"/>
            </div>
            <DataTableSkeleton
                rowCount={15}
                columnCount={10}
                columnTypes={["checkbox", "text", "text", "text", "image", "text", "text", "text", "text", "text"]}
                columnClasses={[
                    "w-[40px]",                       // Select
                    "w-[150px]",                      // First Name
                    "w-[150px]",                      // Last Name
                    "hidden md:table-cell w-[150px]", // Nickname
                    "w-[60px]",                       // Image
                    "hidden md:table-cell w-[100px]", // Published
                    "hidden md:table-cell w-[100px]", // Deceased
                    "hidden xl:table-cell w-[150px]", // Created At
                    "hidden xl:table-cell w-[150px]", // Last Modified At
                    "w-[50px]"                        // Actions
                ]}
            />
        </div>
    );
}