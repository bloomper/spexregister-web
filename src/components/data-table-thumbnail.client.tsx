"use client";

import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { cn, getProxiedImageUrl } from "@/utils/utils";

interface TableThumbnailProps {
  url?: string | null;
  lastModifiedAt?: string | null;
  alt?: string;
  fallbackIcon: LucideIcon;
  className?: string;
}

/**
 * A small image of a row through the image proxy, or an icon when there is none.
 */
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
        "bg-muted relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border",
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
        <FallbackIcon className="text-muted-foreground/40 h-5 w-5 stroke-[1.5]" />
      )}
    </div>
  );
}
