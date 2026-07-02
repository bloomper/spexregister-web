"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@/components/ui/sheet";
import {TaskForm} from "@/components/task";
import {TaskCategory} from "@/gql/schema";

export function TaskCreateForm({categories}: { categories: TaskCategory[] }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleSuccess = () => {
        setIsOpen(false);
        setTimeout(() => {
            router.push("/tasks/manage");
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
            <TaskForm categories={categories} onSuccess={handleSuccess}/>
        </Sheet>
    );
}