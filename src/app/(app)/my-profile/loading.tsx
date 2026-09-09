import {Skeleton} from "@/components/ui/skeleton";

export default function MyProfileLoading() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-1 mb-4">
                <Skeleton className="h-8 w-50"/>
            </div>
            <div className="space-y-6">
                {Array.from({length: 3}).map((_, section) => (
                    <div key={section} className="space-y-4 rounded-xl border p-6">
                        <Skeleton className="h-6 w-37.5"/>
                        <div className="grid gap-4 md:grid-cols-2">
                            {Array.from({length: 4}).map((_, field) => (
                                <div key={field} className="space-y-2">
                                    <Skeleton className="h-4 w-25"/>
                                    <Skeleton className="h-9 w-full"/>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
