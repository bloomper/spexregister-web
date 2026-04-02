"use client";

import {useRef, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Download, MoreHorizontal} from "lucide-react";
import {useTranslations} from "next-intl";
import {toast} from "sonner";

import {Job} from "@/gql/graphql";
import {CursorPage} from "@/types/pagination";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {DataTable} from "@/components/data-table.client";
import {columnHelper} from "@/components/data-table-columns.client";
import {ImportResultViewer} from "./import-result-viewer.client";
import {deleteAction, getJobAction, getJobsAction} from "@/app/(app)/impex/actions.server";
import {formatDateTime} from "@/utils/utils";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";

export function ImpexTable({initialData}: { initialData: CursorPage<Job> }) {
    const t = useTranslations();
    const [viewItem, setViewItem] = useState<Job | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const refreshRef = useRef<null | (() => void)>(null);

    const {deleteItem, setDeleteItem, isPending, handleDelete} = useDataTableActions<Job>(
        deleteAction,
        undefined,
        () => {
            refreshRef.current?.();

            if (viewItem && deleteItem && viewItem.id === deleteItem.id) {
                setViewItem(null);
            }
        }
    );

    const translateJobStatus = (status?: string | null) => {
        if (!status) {
            return "-";
        }

        const key = `Impex.statuses.${status}`;
        const translated = t(key);

        return translated === key ? status : translated;
    };

    const translateJobExitStatus = (status?: string | null) => {
        if (!status) {
            return "-";
        }

        const key = `Impex.exitStatuses.${status}`;
        const translated = t(key);

        return translated === key ? status : translated;
    };

    const handleRowClick = async (job: Job) => {
        setIsLoadingDetails(true);
        setViewItem(null);
        try {
            const fullJob = await getJobAction(job.id);

            if (fullJob) {
                setViewItem(fullJob);
            }
        } catch (e) {
            toast.error(t("Common.couldNotLoadData"));
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const columns: ColumnDef<Job>[] = [
        {
            ...columnHelper.text("id", "Impex.id", "id"),
            enableSorting: false,
        },
        {
            ...columnHelper.text("name", "Impex.name"),
            enableSorting: false,
        },
        {
            accessorKey: "status",
            header: () => t("Impex.status"),
            enableSorting: false,
            cell: ({row}) => {
                const status = row.original.status;
                return (
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={status === "COMPLETED" ? "default" : status === "FAILED" ? "destructive" : "secondary"}>
                            {translateJobStatus(status)}
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "exitStatus",
            header: () => t("Impex.exitStatus"),
            enableSorting: false,
            cell: ({row}) => {
                const exitStatus = row.original.exitStatus;
                return (
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={exitStatus === "COMPLETED" ? "default" : exitStatus === "FAILED" ? "destructive" : "secondary"}>
                            {translateJobExitStatus(exitStatus)}
                        </Badge>
                    </div>
                );
            },
        },
        {
            ...columnHelper.dateTime("createdAt", "Impex.createdAt", "createdAt", "hidden md:table-cell"),
            enableSorting: false,
        },
        {
            ...columnHelper.dateTime("startedAt", "Impex.startedAt", "startedAt", "hidden md:table-cell"),
            enableSorting: false,
        },
        {
            ...columnHelper.dateTime("finishedAt", "Impex.finishedAt", "finishedAt", "hidden md:table-cell"),
            enableSorting: false,
        },
        {
            id: "actions",
            meta: {className: "text-right"},
            enableSorting: false,
            cell: ({row}) => {
                const hasDownload = row.original.hasDownload === true;
                const isRunning = row.original.status === "RUNNING";

                return (
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" aria-label={t("Common.openMenu")}>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                {hasDownload && (
                                    <DropdownMenuItem asChild>
                                        <a href={`/api/impex-result-download-proxy?id=${row.original.id}`} download>
                                            <Download className="mr-0 h-4 w-4"/>
                                            {t("Impex.download")}
                                        </a>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                    className="text-destructive"
                                    disabled={isRunning}
                                    onSelect={() => setDeleteItem(row.original)}
                                >
                                    {t("Common.delete")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                showPagination={false}
                onRowClick={handleRowClick}
                onFetch={async () => {
                    const jobs = await getJobsAction();
                    return {
                        items: jobs,
                        pageInfo: {
                            hasNextPage: false,
                            hasPreviousPage: false,
                            startCursor: null,
                            endCursor: null
                        },
                    };
                }}
                meta={{
                    setRefresh: (handler) => {
                        refreshRef.current = handler;
                    }
                }}
            />

            <Dialog
                open={isLoadingDetails || !!viewItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsLoadingDetails(false);
                        setViewItem(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl pr-6">
                            {isLoadingDetails ? t("Common.loading") : (viewItem?.name ?? "-")}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            {t("Common.details")}
                        </DialogDescription>
                    </DialogHeader>

                    {isLoadingDetails ? (
                        <div className="py-8 text-sm text-muted-foreground">
                            {t("Common.loading")}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid gap-6">
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {t("Impex.id")}
                                    </p>
                                    <p className="text-sm font-mono">{viewItem?.id ?? "-"}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {t("Impex.name")}
                                    </p>
                                    <p className="text-sm">{viewItem?.name ?? "-"}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {t("Impex.status")}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                viewItem?.status === "COMPLETED"
                                                    ? "default"
                                                    : viewItem?.status === "FAILED"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                        >
                                            {translateJobStatus(viewItem?.status)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {t("Impex.exitStatus")}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={
                                                viewItem?.exitStatus === "COMPLETED"
                                                    ? "default"
                                                    : viewItem?.exitStatus === "FAILED"
                                                        ? "destructive"
                                                        : "secondary"
                                            }
                                        >
                                            {translateJobExitStatus(viewItem?.exitStatus)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {t("Impex.createdAt")}
                                        </p>
                                        <p className="text-sm">
                                            {viewItem?.createdAt ? formatDateTime(viewItem.createdAt) : "-"}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {t("Impex.startedAt")}
                                        </p>
                                        <p className="text-sm">
                                            {viewItem?.startedAt ? formatDateTime(viewItem.startedAt) : "-"}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                            {t("Impex.finishedAt")}
                                        </p>
                                        <p className="text-sm">
                                            {viewItem?.finishedAt ? formatDateTime(viewItem.finishedAt) : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {viewItem?.importResult && (
                                <div className="border-t pt-4">
                                    <ImportResultViewer result={viewItem.importResult}/>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsLoadingDetails(false);
                                setViewItem(null);
                            }}
                        >
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DataTableDeleteDialogs
                deleteItem={deleteItem}
                setDeleteItem={setDeleteItem}
                isBulkDeleting={false}
                setIsBulkDeleting={() => {
                }}
                isPending={isPending}
                handleDelete={handleDelete}
                handleBulkDelete={() => {
                }}
            />
        </>
    );
}
