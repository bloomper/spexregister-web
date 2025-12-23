"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@/components/ui/sheet";
import {NewsForm} from "@/components/news/news-form.client";

export function NewsCreateForm() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleSuccess = () => {
        setIsOpen(false);
        setTimeout(() => {
            router.push("/news/manage");
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
            <NewsForm onSuccess={handleSuccess}/>
        </Sheet>
    );
}