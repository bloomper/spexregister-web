import {Skeleton} from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
            <Skeleton className="h-8 w-48"/>
            <Skeleton className="h-9 w-90 max-w-full"/>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-60 w-full rounded-xl md:col-span-2"/>
                {Array.from({length: 4}).map((_, i) => (
                    <Skeleton key={i} className="h-70 w-full rounded-xl"/>
                ))}
            </div>
        </div>
    );
}
