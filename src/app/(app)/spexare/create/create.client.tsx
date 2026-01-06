"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@/components/ui/sheet";
import {SpexareForm} from "@/components/spexare";
import {Spex, SpexCategory, Tag, Task, TaskCategory, Type} from "@/gql/graphql";

interface SpexareCreateFormProps {
    types: Type[],
    tags: Tag[],
    tasks: Task[];
    taskCategories: TaskCategory[];
    spex: Spex[];
    spexCategories: SpexCategory[];
}

export function SpexareCreateForm({
                                      types,
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