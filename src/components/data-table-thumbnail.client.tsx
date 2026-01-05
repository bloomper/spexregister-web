"use client";

import Image from "next/image";
import {LucideIcon} from "lucide-react";
import {cn, getProxiedImageUrl} from "@/utils/utils";

interface TableThumbnailProps {
    url?: string | null;
    lastModifiedAt?: string | null;
    alt?: string;
    fallbackIcon: LucideIcon;
    className?: string;
}

export function TableThumbnail({
                                   url,
                                   lastModifiedAt,
                                   alt = "",
                                   fallbackIcon: FallbackIcon,
                                   className,
                               }: TableThumbnailProps) {
    return (
        <div
            className={cn(
                "h-10 w-10 overflow-hidden rounded border bg-muted flex items-center justify-center relative shrink-0",
                className
            )}
        >
            {url ? (
                <Image
                    src={getProxiedImageUrl(url, lastModifiedAt)}
                    alt={alt}
                    fill
                    unoptimized
                    className="h-full w-full object-contain"
                />
            ) : (
                <FallbackIcon className="h-5 w-5 text-muted-foreground/40 stroke-[1.5]"/>
            )}
        </div>
    );
}