"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Check, CheckCircle2, Circle, Copy, Plus, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Authority, State, User} from "@/gql/graphql";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {UserForm} from "@/components/user";
import {useEffect, useRef, useState} from "react";
import {bulkDeleteAction, deleteAction, getEventsAction, getPageAction} from "@/app/(app)/users/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {AuditInfo} from "@/components/data-table-audit-info.client";
import {columnHelper} from "@/components/data-table-columns.client";
import {Translated} from "@/components/translated.client";
import {Badge} from "@/components/ui/badge";
import {AuditTrail} from "@/components/data-audit-trail.client";


export const columns: ColumnDef<User>[] = [
    columnHelper.select(),
    columnHelper.text("externalId", "User.externalId", "externalId", "max-w-[150px]"),
    {
        id: "email",
        accessorKey: "email",
        header: () => <Translated id="User.email"/>,
        cell: ({row}) => (
            <div className="max-w-[300px] truncate font-medium cursor-default">
                {row.original.email}
            </div>
        ),
    },
    {
        id: "state",
        accessorKey: "state.label",
        header: () => <Translated id="User.state"/>,
        cell: ({row}) => row.original.state?.label && (
            <Badge variant="outline">{row.original.state.label}</Badge>
        ),
        meta: {className: "hidden md:table-cell"}
    },
    {
        id: "authorities",
        accessorKey: "authorities",
        header: () => <Translated id="User.authorities"/>,
        cell: ({row}) => (
            <div className="flex flex-wrap gap-1">
                {row.original.authorities?.map((auth) => (
                    <Badge key={auth?.id} variant="secondary" className="text-[10px]">
                        {auth?.label}
                    </Badge>
                ))}
            </div>
        ),
        meta: {className: "hidden md:table-cell"}
    },
    {
        id: "spexare",
        accessorKey: "spexare",
        header: () => <Translated id="User.spexare"/>,
        cell: ({row}) => (
            <div className="flex items-center justify-center">
                {row.original.spexare ?
                    <CheckCircle2 className="h-4 w-4 text-green-500"/> :
                    <Circle className="h-4 w-4 text-muted-foreground/30"/>
                }
            </div>
        ),
        meta: {className: "hidden md:table-cell"}
    },
    ...columnHelper.audit<User>(),
    columnHelper.actions<User>(),
];

export function UserTable({
                              initialData,
                              authorities = [],
                              states = [],
                          }: {
    authorities: Authority[],
    states: State[],
    initialData: CursorPage<User>,
}) {
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const setFilterQueryRef = useRef<((filter: string) => void) | null>(null);

    const {
        viewItem, setViewItem,
        editItem, setEditItem,
        deleteItem, setDeleteItem,
        selectedRows, setSelectedRows,
        isBulkDeleting, setIsBulkDeleting,
        isPending,
        handleDelete,
        handleBulkDelete
    } = useDataTableActions<User>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
        }
    );

    useEffect(() => {
        setMounted(true);
    }, []);


    const buildFilterString = (query: string) => {
        const parts: string[] = [];
        if (query) {
            parts.push(`externalId:*${query}*`);
        }
        return parts.join("");
    };

    const lastFilterQueryRef = useRef<string>(buildFilterString(""));
    const isFilterActive = filterQuery !== "";

    useEffect(() => {
        const query = buildFilterString(filterQuery);

        const timer = setTimeout(() => {
            if (setFilterQueryRef.current && query !== lastFilterQueryRef.current) {
                lastFilterQueryRef.current = query;
                setFilterQueryRef.current(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filterQuery]);

    const handleCopyExternalId = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) {
        return <DataTableSkeleton columnCount={4} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "externalId", desc: true}]}
                onRowClick={setViewItem}
                onSelectionChange={setSelectedRows}
                onFetch={(args) => getPageAction({...args, full: true})}
                meta={{
                    setEditItem,
                    setDeleteItem,
                    setFilter: (fn: any) => {
                        setFilterQueryRef.current = typeof fn === 'function' && fn.length === 0 ? fn() : fn;
                    },
                }}
            >
                <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
                            placeholder={t("User.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                        />

                        <div className="flex items-center gap-2">
                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFilterQuery("");
                                    }}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    {t("Common.reset")}
                                    <X className="ml-2 h-4 w-4"/>
                                </Button>
                            )}

                            {selectedRows.length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => setIsBulkDeleting(true)}
                                >
                                    {t("Common.delete")} ({selectedRows.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    <Button asChild size="sm" className="h-8 w-full lg:w-auto">
                        <Link href="/users/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("User.createHeading")}
                        </Link>
                    </Button>
                </div>
            </DataTable>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <div className="flex items-center justify-between gap-4 pr-6">
                            <DialogTitle className="text-xl truncate">
                                {viewItem?.email}
                            </DialogTitle>
                            {viewItem && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5 shrink-0">
                                    {viewItem.state?.label}
                                </Badge>
                            )}
                        </div>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {t("User.externalId")}
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-mono break-all text-foreground">
                                        {viewItem?.externalId}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0"
                                        onClick={() => viewItem?.externalId && handleCopyExternalId(viewItem.externalId)}
                                    >
                                        {copied ? (
                                            <Check className="h-3 w-3 text-green-600"/>
                                        ) : (
                                            <Copy className="h-3 w-3 text-muted-foreground/60"/>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {t("User.authorities")}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {viewItem?.authorities?.map((auth) => (
                                        <Badge key={auth?.id} variant="secondary" className="text-xs">
                                            {auth?.label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {viewItem?.spexare && (
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {t("Spexare.heading")}
                                    </p>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">
                                            {viewItem.spexare.firstName} {viewItem.spexare.lastName}
                                        </p>
                                        {viewItem.spexare.nickName && (
                                            <p className="text-sm text-muted-foreground italic">
                                                {viewItem.spexare.nickName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {viewItem && (
                            <div className="space-y-4">
                                <AuditInfo item={viewItem}/>
                                <AuditTrail id={viewItem.id} fetchAction={getEventsAction}/>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewItem(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <UserForm
                        item={editItem}
                        authorities={authorities}
                        states={states}
                        onSuccess={() => {
                            setEditItem(null);
                            setFilterQuery("");
                            router.refresh();
                        }}
                    />
                )}
            </Sheet>

            <DataTableDeleteDialogs
                deleteItem={deleteItem}
                setDeleteItem={setDeleteItem}
                isBulkDeleting={isBulkDeleting}
                setIsBulkDeleting={setIsBulkDeleting}
                isPending={isPending}
                handleDelete={handleDelete}
                handleBulkDelete={handleBulkDelete}
            />
        </>
    );
}