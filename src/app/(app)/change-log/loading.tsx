import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Skeleton} from "@/components/ui/skeleton";

export default function ChangeLogLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-37.5"/>
            </div>
            <DataTableSkeleton
                rowCount={15}
                columnCount={4}
                columnTypes={["text", "text", "text", "text"]}
                columnClasses={[
                    "w-[100px]",
                    "w-[200px]",
                    "w-[250px]",
                    "hidden md:table-cell w-[250px]"
                ]}
            />
        </div>
    );
}
