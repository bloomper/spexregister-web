import {DataGridSkeleton} from "@/components/data-grid-skeleton";

export default function SpexareSearchLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <DataGridSkeleton/>
        </div>
    );
}
