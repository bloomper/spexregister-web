"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@/components/ui/sheet";
import {TaskCategoryForm} from "@/components/task/category";

export function TaskCategoryCreateForm() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleSuccess = () => {
        setIsOpen(false);
        setTimeout(() => {
            router.push("/tasks/categories/manage");
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
            <TaskCategoryForm onSuccess={handleSuccess}/>
        </Sheet>
    );
}