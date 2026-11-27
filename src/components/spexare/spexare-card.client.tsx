"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ClipboardPen, Pencil, Sparkles, User } from "lucide-react";
import { Spexare } from "@/gql/schema";
import { Card, CardHeader, CardTitle } from "@bloomper/fgv-web-ui/ui/card";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { cn, getProxiedImageUrl } from "@/utils/utils";

type SpexareCardProps = {
  spexare: Spexare;
  index: number;
  isMe: boolean;
  canEdit: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onAddToQueue?: () => void;
};

export function SpexareCard({ spexare, index, isMe, canEdit, onSelect, onEdit, onAddToQueue }: SpexareCardProps) {
  const t = useTranslations();

  return (
    <Card
      className={cn(
        "group hover:bg-muted/50 relative flex h-full cursor-pointer flex-col overflow-hidden p-0 transition-all",
        isMe && "ring-primary border-primary/50 scale-[1.02] shadow-lg ring-2 ring-offset-2"
      )}
    >
      <div className="bg-muted relative aspect-video w-full overflow-hidden border-b">
        {canEdit && (
          <div className="absolute top-2 right-2 z-20 flex gap-1">
            {isMe ? (
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 hover:bg-background h-8 w-8 rounded-full opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100"
                nativeButton={false}
                render={<Link href="/my-profile" />}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <>
                {onAddToQueue && (
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label={t("EditQueue.add")}
                    className="bg-background/80 hover:bg-background h-8 w-8 rounded-full opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToQueue();
                    }}
                  >
                    <ClipboardPen className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label={t("Common.edit")}
                  className="bg-background/80 hover:bg-background h-8 w-8 rounded-full opacity-0 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}

        <div
          className="relative flex h-full flex-col"
          onClick={onSelect}
        >
          {spexare.imageUrl ? (
            <Image
              src={getProxiedImageUrl(spexare.imageUrl, spexare.lastModifiedAt)}
              alt={`${spexare.firstName} ${spexare.lastName}`}
              fill
              preload={index < 2}
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="text-muted-foreground/20 h-12 w-12 stroke-[1.5]" />
            </div>
          )}
        </div>
      </div>

      <CardHeader
        className="cursor-pointer space-y-2 p-3"
        onClick={onSelect}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="line-clamp-1 text-sm leading-tight font-bold">
              {spexare.firstName} {spexare.lastName}
            </CardTitle>
            <div className="flex shrink-0 items-center gap-1">
              {isMe && (
                <Badge className="h-3.5 border-none bg-linear-to-r from-pink-500 to-violet-500 px-1 py-0 text-[11px] leading-none font-bold text-white uppercase sm:text-[9px]">
                  <Sparkles className="mr-0.5 h-2 w-2" />
                  {t("Common.me")}
                </Badge>
              )}
              {!spexare.published && (
                <Badge
                  variant="outline"
                  className="h-3.5 px-1 py-0 text-[11px] leading-none font-normal uppercase sm:text-[9px]"
                >
                  {t("Spexare.publishedBadges.false")}
                </Badge>
              )}
              {spexare.deceased && (
                <Badge
                  variant="outline"
                  className="h-3.5 shrink-0 px-1 py-0 text-[11px] leading-none font-normal uppercase sm:text-[9px]"
                >
                  {t("Spexare.deceasedBadges.true")}
                </Badge>
              )}
            </div>
          </div>
          {spexare.nickName && (
            <p className="text-muted-foreground truncate text-xs leading-tight italic sm:text-[11px]">
              {spexare.nickName}
            </p>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
