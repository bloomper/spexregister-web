import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

interface DataTableSkeletonProps {
    rowCount?: number;
    columnCount?: number;
    columnClasses?: string[];
}

export function DataTableSkeleton({
                                      rowCount = 15,
                                      columnCount = 5,
                                      columnClasses = []
                                  }: DataTableSkeletonProps) {
    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {Array.from({length: columnCount}).map((_, i) => (
                                <TableHead key={i} className={columnClasses[i]}>
                                    <Skeleton className="h-4 w-[100px]"/>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({length: rowCount}).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({length: columnCount}).map((_, j) => (
                                    <TableCell key={j} className={columnClasses[j]}>
                                        <Skeleton className="h-4 w-full"/>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between py-4">
                <Skeleton className="h-8 w-[150px]"/>
                <div className="flex space-x-2">
                    <Skeleton className="hidden h-8 w-8 rounded-md lg:block" />
                    <Skeleton className="h-8 w-8 rounded-md"/>
                    <Skeleton className="h-8 w-8 rounded-md"/>
                    <Skeleton className="hidden h-8 w-8 rounded-md lg:block" />
                </div>
            </div>
        </div>
    );
}