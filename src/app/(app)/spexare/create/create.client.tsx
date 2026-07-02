"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@/components/ui/sheet";
import {SpexareForm} from "@/components/spexare";
import {Country, Spex, SpexCategory, Tag, Task, TaskCategory, Type} from "@/gql/schema";

interface SpexareCreateFormProps {
    types: Type[],
    countries: Country[];
    tags: Tag[],
    tasks: Task[];
    taskCategories: TaskCategory[];
    spex: Spex[];
    spexCategories: SpexCategory[];
}

export function SpexareCreateForm({
                                      types,
                                      countries,
                                      tags,
                                      tasks,
                                      taskCategories,
                                      spex,
                                      spexCategories,
                                  }: SpexareCreateFormProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleSuccess = () => {
        setIsOpen(false);
        setTimeout(() => {
            router.push("/spexare/manage");
            router.refresh();
        }, 150);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            router.back();
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SpexareForm
                types={types}
                countries={countries}
                tags={tags}
                tasks={tasks}
                taskCategories={taskCategories}
                spex={spex}
                spexCategories={spexCategories}
                onSuccess={handleSuccess}
            />
        </Sheet>
    );
}