"use client";

import {ColumnDef} from "@tanstack/react-table";
import {CheckCircle2, Circle, MoreHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {News} from "@/gql/graphql";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {formatDate, formatDateTime} from "@/utils/utils";
import {useTranslations} from "next-intl";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {deleteNewsAction} from "@/app/(app)/news/actions.server";
import {Sheet, SheetTrigger} from "@/components/ui/sheet";
import {NewsForm} from "@/components/news/news-form.client";


function Translated({id}: { id: string }) {
    const t = useTranslations();
    return <>{t(id)}</>;
}

export const columns: ColumnDef<News>[] = [
    {
        accessorKey: "subject",
        header: () => <Translated id="News.subject"/>,
        cell: ({row}) => {
            const subject = row.getValue("subject") as string;

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="max-w-[300px] truncate font-medium cursor-default">
                                {subject}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[400px] wrap-break-word">
                            {subject}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: "published",
        header: () => <Translated id="News.published"/>,
        cell: ({row}) => {
            const isPublished = !!row.getValue("published");
            return (
                <div className="flex items-center gap-2">
                    {isPublished ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500"/>
                    ) : (
                        <Circle className="h-4 w-4 text-muted-foreground"/>
                    )}
                </div>
            )
        },
        meta: {className: "hidden md:table-cell"}
    },
    {
        accessorKey: "visibleFrom",
        header: () => <Translated id="News.visibleFrom"/>,
        cell: ({row}) => formatDate(row.getValue("visibleFrom") as string) || "-",
        meta: {className: "hidden lg:table-cell"}
    },
    {
        accessorKey: "visibleTo",
        header: () => <Translated id="News.visibleTo"/>,
        cell: ({row}) => formatDate(row.getValue("visibleTo") as string) || "-",
        meta: {className: "hidden xl:table-cell"}
    },
    {
        accessorKey: "createdAt",
        header: () => <Translated id="Common.createdAt"/>,
        cell: ({row}) => formatDateTime(row.getValue("createdAt") as string) || "-",
        meta: {className: "hidden xl:table-cell"}
    },
    {
        accessorKey: "lastModifiedAt",
        header: () => <Translated id="Common.lastModifiedAt"/>,
        cell: ({row}) => formatDateTime(row.getValue("lastModifiedAt") as string) || "-",
        meta: {className: "hidden xl:table-cell"}
    },
    {
        id: "actions",
        cell: ({row, table}) => {
            const news = row.original;
            const t = useTranslations();
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);
            const [isEditOpen, setIsEditOpen] = useState(false);
            const [isMenuOpen, setIsMenuOpen] = useState(false);
            const [isPending, startTransition] = useTransition();

            const handleDelete = () => {
                startTransition(async () => {
                    try {
                        await deleteNewsAction(news.id);
                        setIsDeleteOpen(false);
                        toast.success(t("Common.deleteSuccess"));
                        const meta = table.options.meta as { refresh: () => void };
                        meta?.refresh();
                    } catch (error) {
                        toast.error(t("Common.errorOccurred"));
                        console.error(error);
                    }
                });
            };
            return (
                <>
                    <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t("Common.openMenu")}</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => {
                                    setIsMenuOpen(false);
                                    setIsEditOpen(true);
                                }}>
                                    {t("Common.edit")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={() => {
                                        setIsMenuOpen(false);
                                        setIsDeleteOpen(true);
                                    }}
                                >
                                    {t("Common.delete")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <NewsForm
                            news={news}
                            onSuccess={() => {
                                setIsEditOpen(false);
                                (table.options.meta as any)?.refresh();
                            }}
                        />
                    </Sheet>

                    <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t("Common.deleteTitle")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t("Common.deleteConfirmation", {subject: news.subject})}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isPending}>{t("Common.cancel")}</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete();
                                    }}
                                    disabled={isPending}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isPending ? t("Common.deleting") : t("Common.delete")}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            )
        },
    },
];

