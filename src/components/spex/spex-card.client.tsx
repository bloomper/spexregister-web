"use client";

import {useTranslations} from "next-intl";
import Image from "next/image";
import {ImageIcon, Pencil} from "lucide-react";
import {Spex} from "@/gql/schema";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {getProxiedImageUrl} from "@/utils/utils";

type SpexCardProps = {
    spex: Spex;
    index: number;
    canUpdate: boolean;
    onSelect: () => void;
    onEdit: () => void;
};

export function SpexCard({spex, index, canUpdate, onSelect, onEdit}: SpexCardProps) {
    const t = useTranslations();

    return (
        <Card
            className="group h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0 relative"
        >
            <div className="relative aspect-video w-full bg-muted border-b overflow-hidden">
                {canUpdate && (
                    <div className="absolute top-2 right-2 z-20">
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
                    </div>
                )}
                <div
                    className="relative flex flex-col h-full"
                    onClick={onSelect}
                >
                    {spex.posterUrl ? (
                        <Image
                            src={getProxiedImageUrl(spex.posterUrl, spex.lastModifiedAt)}
                            alt={spex.title}
                            fill
                            preload={index < 2}
                            unoptimized
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/20 stroke-[1.5]"/>
                        </div>
                    )}
                </div>
            </div>
            <CardHeader
                className="space-y-0.5 p-3"
                onClick={onSelect}
            >
                <div className="flex items-center justify-between gap-2">
                    <CardDescription className="text-[10px]">{spex.year}</CardDescription>
                    {spex.revivals && spex.revivals.length > 0 && (
                        <div className="flex items-center gap-1 text-primary">
                            <span className="text-[9px] font-bold uppercase tracking-tighter">
                                {t("Spex.revivals")}
                            </span>
                            <Badge variant="default"
                                   className="text-[9px] px-1 py-0 h-3.5 font-bold min-w-3.5 justify-center">
                                {spex.revivals.length}
                            </Badge>
                        </div>
                    )}
                </div>
                <CardTitle
                    className="line-clamp-1 text-sm font-bold leading-tight">{spex.title}</CardTitle>
            </CardHeader>
            {spex.category && (
                <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-xs text-muted-foreground truncate">{spex.category.name}</p>
                </CardContent>
            )}
        </Card>
    );
}
