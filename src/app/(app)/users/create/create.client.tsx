"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {Sheet} from "@/components/ui/sheet";
import {UserForm} from "@/components/user";
import {Authority, State} from "@/gql/graphql";

export function UserCreateForm({
                                   states,
                                   authorities
                               }: {
    states: State[],
    authorities: Authority[]
}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleSuccess = () => {
        setIsOpen(false);
        setTimeout(() => {
            router.push("/users/manage");
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
            <UserForm
                states={states}
                authorities={authorities}
                onSuccess={handleSuccess}/>
        </Sheet>
    );
}