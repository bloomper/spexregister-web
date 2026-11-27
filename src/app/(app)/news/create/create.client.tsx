"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@bloomper/fgv-web-ui/ui/sheet";
import {NewsForm} from "@/components/news";

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