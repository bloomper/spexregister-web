import {DataTableSkeleton} from "@/components/data-table-skeleton";

export default function NewsManageLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex flex-col gap-2">
                <div className="h-8 w-[200px] animate-pulse rounded-md bg-muted"/>
            </div>
            <DataTableSkeleton
                rowCount={15}
                columnCount={7}
                columnClasses={[
                    "",                          // Subject
                    "hidden md:table-cell",      // Published
                    "hidden lg:table-cell",      // Visible From
                    "hidden xl:table-cell",      // Visible To
                    "hidden xl:table-cell",      // Created At
                    "hidden xl:table-cell",      // Last Modified At
                    ""                           // Actions
                ]}
            />
        </div>
    );
}