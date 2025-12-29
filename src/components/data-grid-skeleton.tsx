export function DataGridSkeleton({count = 24}: { count?: number }) {
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {Array.from({length: count}).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 rounded-xl border p-4">
                    <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted"/>
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted"/>
                    <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"/>
                    <div className="mt-2 h-4 w-1/4 animate-pulse rounded-md bg-muted"/>
                </div>
            ))}
        </div>
    );
}
