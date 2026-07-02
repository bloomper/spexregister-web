"use client";

import {useTranslations} from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {Pencil, Sparkles, User} from "lucide-react";
import {Spexare} from "@/gql/schema";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {cn, getProxiedImageUrl} from "@/utils/utils";

type SpexareCardProps = {
    spexare: Spexare;
    index: number;
    isMe: boolean;
    canEdit: boolean;
    onSelect: () => void;
    onEdit: () => void;
};

export function SpexareCard({spexare, index, isMe, canEdit, onSelect, onEdit}: SpexareCardProps) {
    const t = useTranslations();

    return (
        <Card
            className={cn(
                "group h-full transition-all hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0 relative",
                isMe && "ring-2 ring-primary ring-offset-2 border-primary/50 shadow-lg scale-[1.02]"
            )}
        >
            <div className="relative aspect-video w-full bg-muted border-b overflow-hidden">
                {canEdit && (
                    <div className="absolute top-2 right-2 z-20">
                        {isMe ? (
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/80 hover:bg-background"
                                asChild
                            >
                                <Link href="/my-profile">
                                    <Pencil className="h-4 w-4"/>
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm bg-background/80 hover:bg-background"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                            >
                                <Pencil className="h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                )}

                <div
                    className="relative flex flex-col h-full"
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
                            <User className="h-12 w-12 text-muted-foreground/20 stroke-[1.5]"/>
                        </div>
                    )}
                </div>
            </div>

            <CardHeader
                className="space-y-2 p-3 cursor-pointer"
                onClick={onSelect}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="line-clamp-1 text-sm font-bold leading-tight">
                            {spexare.firstName} {spexare.lastName}
                        </CardTitle>
                        <div className="flex items-center gap-1 shrink-0">
                            {isMe && (
                                <Badge
                                    className="bg-linear-to-r from-pink-500 to-violet-500 text-white border-none text-[9px] uppercase px-1 py-0 h-3.5 leading-none font-bold">
                                    <Sparkles className="mr-0.5 h-2 w-2"/>
                                    {t("Common.me")}
                                </Badge>
                            )}
                            {!spexare.published && (
                                <Badge variant="outline"
                                       className="text-[9px] uppercase px-1 py-0 h-3.5 leading-none font-normal">
                                    {t("Spexare.publishedBadges.false")}
                                </Badge>
                            )}
                            {spexare.deceased && (
                                <Badge variant="outline"
                                       className="text-[9px] uppercase px-1 py-0 h-3.5 leading-none shrink-0 font-normal">
                                    {t("Spexare.deceasedBadges.true")}
                                </Badge>
                            )}
                        </div>
                    </div>
                    {spexare.nickName && (
                        <p className="text-[11px] text-muted-foreground italic truncate leading-tight">
                            {spexare.nickName}
                        </p>
                    )}
                </div>
            </CardHeader>
        </Card>
    );
}
