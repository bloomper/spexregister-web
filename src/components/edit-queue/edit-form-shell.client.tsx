"use client";

import { ReactNode } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@bloomper/fgv-web-ui/ui/sheet";

/**
 * The frame of a form inside the edit queue.
 */
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
    <SheetContent className={className ?? "flex h-full w-full flex-col gap-0 p-0 sm:max-w-[600px]"}>
      <SheetHeader className="shrink-0 p-6 pb-4">
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
      {children}
    </SheetContent>
  );
}
