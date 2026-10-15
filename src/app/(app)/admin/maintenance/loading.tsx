import {Skeleton} from "@/components/ui/skeleton";

export default function AdminLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-8 w-37.5"/>
            </div>
            <Skeleton className="h-4 w-80"/>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-40 w-full"/>
            </div>
        </div>
    );
}
