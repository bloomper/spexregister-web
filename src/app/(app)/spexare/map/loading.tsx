import {Skeleton} from "@/components/ui/skeleton";

export default function MapLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <Skeleton className="h-8 w-48"/>
            <Skeleton className="h-4 w-full max-w-lg"/>
            <Skeleton className="h-[70vh] w-full"/>
        </div>
    );
}
