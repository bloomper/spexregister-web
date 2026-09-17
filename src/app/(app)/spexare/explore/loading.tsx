import {Skeleton} from "@/components/ui/skeleton";

export default function GraphLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <Skeleton className="h-8 w-48"/>
            <Skeleton className="h-9 w-full max-w-sm"/>
            <Skeleton className="h-[60vh] w-full"/>
        </div>
    );
}
