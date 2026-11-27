"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@bloomper/fgv-web-ui/ui/sheet";
import {TagForm} from "@/components/tag";

export function TagCreateForm() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleSuccess = () => {
        setIsOpen(false);
        setTimeout(() => {
            router.push("/tags/manage");
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
            <TagForm onSuccess={handleSuccess}/>
        </Sheet>
    );
}