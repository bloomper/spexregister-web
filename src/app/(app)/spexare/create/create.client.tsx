"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@/components/ui/sheet";
import {SpexareForm} from "@/components/spexare";
import {Tag, Type} from "@/gql/graphql";

export function SpexareCreateForm({
                                      types,
                                      tags
                                  }: {
    types: Type[],
    tags: Tag[]
}) {
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
                onSuccess={handleSuccess}
            />
        </Sheet>
    );
}