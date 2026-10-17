"use client";

import {Country, Spex, Spexare, SpexCategory, Tag as TagType, Task, TaskCategory, Type} from "@/gql/schema";
import {Sheet} from "@/components/ui/sheet";
import {Spinner} from "@/components/ui/spinner";
import {SpexareForm} from "@/components/spexare/spexare-form.client";
import {RefreshContext} from "@/hooks/use-refresh.client";

type SpexareEditSheetProps = {
    open: boolean;
    onClose: () => void;
    full: Spexare | null;
    isLoading: boolean;
    onSuccess: () => void;
    onChange: () => void;
    types: Type[];
    countries: Country[];
    tags: TagType[];
    tasks: Task[];
    taskCategories: TaskCategory[];
    spex: Spex[];
    spexCategories: SpexCategory[];
};

export function SpexareEditSheet({
                                     open,
                                     onClose,
                                     full,
                                     isLoading,
                                     onSuccess,
                                     onChange,
                                     types,
                                     countries,
                                     tags,
                                     tasks,
                                     taskCategories,
                                     spex,
                                     spexCategories,
                                 }: SpexareEditSheetProps) {
    return (
        <Sheet
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onClose();
                }
            }}
        >
            {isLoading ? (
                <div className="p-6">
                    <div className="flex items-center justify-center py-16">
                        <Spinner className="size-8"/>
                    </div>
                </div>
            ) : full ? (
                <RefreshContext value={onChange}>
                    <SpexareForm
                        types={types}
                        countries={countries}
                        tags={tags}
                        tasks={tasks}
                        taskCategories={taskCategories}
                        spex={spex}
                        spexCategories={spexCategories}
                        item={full}
                        onSuccess={onSuccess}
                    />
                </RefreshContext>
            ) : null}
        </Sheet>
    );
}
