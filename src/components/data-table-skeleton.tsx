import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

interface DataTableSkeletonProps {
    rowCount?: number;
    columnCount?: number;
    columnClasses?: string[];
    columnTypes?: ("text" | "image" | "checkbox")[];
}

export function DataTableSkeleton({
                                      rowCount = 15,
                                      columnCount = 5,
                                      columnClasses = [],
                                      columnTypes = []
                                  }: DataTableSkeletonProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Skeleton className="h-8 w-full sm:w-[150px] lg:w-[250px]"/>
                </div>
                <Skeleton className="h-8 w-full lg:w-[120px]"/>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
                {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                        {columnTypes.includes("image") && (
                            <Skeleton className="h-12 w-12 rounded-md shrink-0"/>
                        )}
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4"/>
                            <Skeleton className="h-3 w-1/2"/>
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden md:block rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({length: columnCount}).map((_, i) => (
                                <TableHead key={i} className={columnClasses[i]}>
                                    <Skeleton className="h-4 w-20"/>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({length: rowCount}).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({length: columnCount}).map((_, j) => {
                                    const type = columnTypes[j] || "text";
                                    return (
                                        <TableCell key={j} className={columnClasses[j]}>
                                            {type === "image" ? (
                                                <Skeleton className="h-10 w-10 rounded border"/>
                                            ) : type === "checkbox" ? (
                                                <Skeleton className="h-4 w-4 rounded"/>
                                            ) : (
                                                <Skeleton className="h-4 w-full"/>
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between py-4">
                <Skeleton className="h-8 w-[150px]"/>
                <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md"/>
                    <Skeleton className="h-8 w-8 rounded-md"/>
                    <Skeleton className="h-8 w-8 rounded-md"/>
                </div>
            </div>
        </div>
    );
}