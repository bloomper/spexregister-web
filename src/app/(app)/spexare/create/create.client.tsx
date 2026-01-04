"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@/components/ui/sheet";
import {SpexareForm} from "@/components/spexare";

export function SpexareCreateForm() {
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
            <SpexareForm onSuccess={handleSuccess}/>
        </Sheet>
    );
}