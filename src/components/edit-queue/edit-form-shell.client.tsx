"use client";

import {ReactNode} from "react";
import {SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";

export function EditFormShell({
                                  embedded = false,
                                  title,
                                  className,
                                  children,
                              }: {
    embedded?: boolean;
    title: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    if (embedded) {
        return <div className="flex h-full flex-col gap-0">{children}</div>;
    }

    return (
        <SheetContent className={className ?? "sm:max-w-[600px] flex flex-col gap-0 p-0 h-full"}>
            <SheetHeader className="p-6 pb-4 shrink-0">
                <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
            {children}
        </SheetContent>
    );
}
