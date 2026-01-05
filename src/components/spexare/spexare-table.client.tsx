"use client";

import {ColumnDef} from "@tanstack/react-table";
import {
    CheckCircle2,
    Circle,
    Fingerprint,
    IdCard,
    Mail,
    MapPin,
    Phone,
    Plus,
    ShieldCheck,
    Tag,
    ToggleLeft,
    User,
    X
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Spexare} from "@/gql/graphql";
import {getProxiedImageUrl} from "@/utils/utils";
import {useTranslations} from "next-intl";
import {DataTable} from "@/components/data-table.client";
import {SpexareForm} from "@/components/spexare";
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {bulkDeleteAction, deleteAction, getPageAction} from "@/app/(app)/spexare/actions.server";
import {Sheet} from "@/components/ui/sheet";
import {CursorPage} from "@/types/pagination";
import {useRouter} from "next/navigation";
import {DataTableSkeleton} from "@/components/data-table-skeleton";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useDataTableActions} from "@/hooks/use-data-table-actions";
import {DataFilter} from "@/components/data-filter";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {format, parse} from "date-fns";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";
import {AuditInfo} from "@/components/data-table-audit-info.client";
import {columnHelper} from "@/components/data-table-columns.client";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DataEmpty} from "@/components/data-empty";


export const columns: ColumnDef<Spexare>[] = [
    columnHelper.select(),
    columnHelper.text("firstName", "Spexare.firstName"),
    columnHelper.text("lastName", "Spexare.lastName"),
    columnHelper.text("nickName", "Spexare.nickName", "nickName", "hidden md:table-cell"),
    columnHelper.image("image", "Spexare.imageUrl", "imageUrl", User),
    columnHelper.boolean("published", "Spexare.published", "hidden md:table-cell"),
    columnHelper.boolean("deceased", "Spexare.deceased", "hidden md:table-cell"),
    ...columnHelper.audit<Spexare>(),
    columnHelper.actions<Spexare>(),
];

export function SpexareTable({
                                 initialData,
                             }: {
    initialData: CursorPage<Spexare>,
}) {
    const t = useTranslations();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedPublishedValues, setSelectedPublishedValues] = useState<Set<string>>(new Set(["true", "false"]));
    const [selectedDeceasedValues, setSelectedDeceasedValues] = useState<Set<string>>(new Set(["true", "false"]));
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
    } = useDataTableActions<Spexare>(
        deleteAction,
        bulkDeleteAction,
        () => {
            setFilterQuery("");
            setSelectedPublishedValues(new Set(["true", "false"]));
            setSelectedDeceasedValues(new Set(["true", "false"]));
        }
    );

    useEffect(() => {
        setMounted(true);
    }, []);


    const buildFilterString = (query: string, published: Set<string>, deceased: Set<string>) => {
        const parts: string[] = [];
        if (query) {
            parts.push(`(firstName:*${query}* OR lastName:*${query}* OR nickName:*${query}*)`);
        }
        if (published.size < 2) {
            if (published.size === 0) {
                parts.push(`published:NULL`);
            } else {
                const val = published.has("true") ? "TRUE" : "FALSE";
                parts.push(`published:${val}`);
            }
        }
        if (deceased.size < 2) {
            if (deceased.size === 0) {
                parts.push(`deceased:NULL`);
            } else {
                const val = deceased.has("true") ? "TRUE" : "FALSE";
                parts.push(`deceased:${val}`);
            }
        }
        return parts.join(" AND ");
    };

    const lastFilterQueryRef = useRef<string>(buildFilterString("", new Set(["true", "false"]), new Set(["true", "false"])));
    const isFilterActive = filterQuery !== "" || selectedPublishedValues.size < 2 || selectedDeceasedValues.size < 2;

    useEffect(() => {
        const query = buildFilterString(filterQuery, selectedPublishedValues, selectedDeceasedValues);

        const timer = setTimeout(() => {
            if (setFilterQueryRef.current && query !== lastFilterQueryRef.current) {
                lastFilterQueryRef.current = query;
                setFilterQueryRef.current(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [filterQuery, selectedPublishedValues, selectedDeceasedValues]);

    if (!mounted) {
        return <DataTableSkeleton columnCount={9} rowCount={15}/>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                initialData={initialData}
                initialSorting={[{id: "firstName", desc: true}]}
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
                            placeholder={t("Spexare.filterPlaceholder")}
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="h-8 w-full sm:w-[150px] lg:w-[250px]"
                        />

                        <div className="flex items-center gap-2">
                            <DataFilter
                                title={t("Spexare.published")}
                                selectedValues={selectedPublishedValues}
                                onSelect={setSelectedPublishedValues}
                                onClear={() => setSelectedPublishedValues(new Set(["true", "false"]))}
                                options={[
                                    {label: t("Spexare.publishedStates.true"), value: "true", icon: CheckCircle2},
                                    {label: t("Spexare.publishedStates.false"), value: "false", icon: Circle},
                                ]}
                            />

                            <DataFilter
                                title={t("Spexare.deceased")}
                                selectedValues={selectedDeceasedValues}
                                onSelect={setSelectedDeceasedValues}
                                onClear={() => setSelectedDeceasedValues(new Set(["true", "false"]))}
                                options={[
                                    {label: t("Spexare.deceasedStates.true"), value: "true", icon: CheckCircle2},
                                    {label: t("Spexare.deceasedStates.false"), value: "false", icon: Circle},
                                ]}
                            />

                            {isFilterActive && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setFilterQuery("");
                                        setSelectedPublishedValues(new Set(["true", "false"]));
                                        setSelectedDeceasedValues(new Set(["true", "false"]));
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
                        <Link href="/spexare/create">
                            <Plus className="mr-2 h-4 w-4"/>
                            {t("Spexare.createHeading")}
                        </Link>
                    </Button>
                </div>
            </DataTable>

            <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    <div className="relative aspect-video w-full bg-muted border-b">
                        {viewItem?.imageUrl ? (
                            <Image
                                src={getProxiedImageUrl(viewItem.imageUrl, viewItem.lastModifiedAt)}
                                alt={`${viewItem.firstName} ${viewItem.lastName}`}
                                fill
                                unoptimized
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <User className="h-24 w-24 text-muted-foreground/20 stroke-1"/>
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <DialogHeader className="text-left">
                            <div className="flex items-start justify-between gap-2 text-left">
                                <div className="flex flex-col gap-1">
                                    <DialogTitle className="text-2xl leading-none text-left">
                                        {viewItem?.firstName} {viewItem?.lastName}
                                    </DialogTitle>
                                    {viewItem?.nickName && (
                                        <div className="text-muted-foreground italic text-lg leading-none text-left">
                                            {viewItem.nickName}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-end gap-2 mt-1 shrink-0">
                                    {viewItem?.deceased &&
                                        <Badge variant="outline"
                                               className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                            {t("Spexare.deceasedBadges.true")}
                                        </Badge>
                                    }
                                    {!viewItem?.published &&
                                        <Badge variant="outline"
                                               className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                            {t("Spexare.publishedBadges.false")}
                                        </Badge>
                                    }
                                </div>
                            </div>
                        </DialogHeader>

                        <Tabs defaultValue="general" className="mt-6">
                            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                                <TabsTrigger value="general">{t("Common.general")}</TabsTrigger>
                                <TabsTrigger value="addresses">{t("Spexare.addresses")}</TabsTrigger>
                                <TabsTrigger value="consents">{t("Spexare.consents")}</TabsTrigger>
                                <TabsTrigger value="memberships">{t("Spexare.memberships")}</TabsTrigger>
                                <TabsTrigger value="taggings">{t("Spexare.taggings")}</TabsTrigger>
                                <TabsTrigger value="toggles">{t("Spexare.toggles")}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6 pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                    {viewItem?.socialSecurityNumber && (
                                        <div className="space-y-1">
                                            <div
                                                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                                {viewItem.socialSecurityNumber.includes("-") ? t("Spexare.socialSecurityNumber") : t("Spexare.birthDate")}
                                            </div>
                                            <div className="text-sm font-medium text-foreground">
                                                {viewItem.socialSecurityNumber.includes("-")
                                                    ? viewItem.socialSecurityNumber
                                                    : format(parse(viewItem.socialSecurityNumber, "yyyyMMdd", new Date()), "yyyy-MM-dd")
                                                }
                                            </div>
                                        </div>
                                    )}
                                    {viewItem?.graduation && (
                                        <div className="space-y-1">
                                            <div
                                                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                                {t("Spexare.graduation")}
                                            </div>
                                            <div
                                                className="text-sm font-medium text-foreground">{viewItem.graduation}</div>
                                        </div>
                                    )}
                                    {viewItem?.comment && (
                                        <div className="sm:col-span-2 space-y-1">
                                            <div
                                                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                                {t("Spexare.comment")}
                                            </div>
                                            <div
                                                className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-3 rounded-md border border-muted">
                                                {viewItem.comment}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {viewItem && (
                                    <AuditInfo item={viewItem}/>
                                )}
                            </TabsContent>

                            <TabsContent value="addresses" className="pt-4 space-y-4">
                                {viewItem?.addresses && viewItem.addresses.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {viewItem.addresses.map((address) => (
                                            <div key={address?.id} className="rounded-lg border p-4 space-y-3">
                                                <div className="flex items-center justify-between border-b pb-2">
                                                    <Badge variant="secondary" className="text-[10px] uppercase">
                                                        {address?.type.label}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                    {(address?.streetAddress || address?.postalCode || address?.city) && (
                                                        <div className="flex gap-2">
                                                            <MapPin
                                                                className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"/>
                                                            <div className="flex flex-col">
                                                                <span
                                                                    className="font-medium">{address.streetAddress}</span>
                                                                <span className="text-muted-foreground">
                                                                        {address.postalCode} {address.city}
                                                                    </span>
                                                                {address.country && <span
                                                                    className="text-muted-foreground">{address.country}</span>}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="space-y-2">
                                                        {address?.emailAddress && (
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="h-4 w-4 text-muted-foreground"/>
                                                                <a href={`mailto:${address.emailAddress}`}
                                                                   className="hover:underline">
                                                                    {address.emailAddress}
                                                                </a>
                                                            </div>
                                                        )}
                                                        {(address?.phone || address?.phoneMobile) && (
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="h-4 w-4 text-muted-foreground"/>
                                                                <div className="flex flex-col">
                                                                    {address.phone && <span>{address.phone}</span>}
                                                                    {address.phoneMobile &&
                                                                        <span>{address.phoneMobile} (mob)</span>}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6">
                                        <DataEmpty icon={MapPin}/>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="consents" className="pt-4 space-y-4">
                                {viewItem?.consents && viewItem.consents.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {viewItem.consents.map((consent) => (
                                            <div key={consent?.id}
                                                 className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                                <span className="text-sm font-medium">{consent?.type.label}</span>
                                                {consent?.value ? (
                                                    <Badge
                                                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 uppercase text-[10px]">
                                                        {t("Common.yes")}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline"
                                                           className="uppercase text-[10px] text-muted-foreground">
                                                        {t("Common.no")}
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6">
                                        <DataEmpty icon={ShieldCheck}/>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="memberships" className="pt-4 space-y-4">
                                {viewItem?.memberships && viewItem.memberships.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(
                                            viewItem.memberships.reduce((accumulated, membership) => {
                                                if (!membership) {
                                                    return accumulated;
                                                }
                                                const typeLabel = membership.type.label;
                                                if (!accumulated[typeLabel]) {
                                                    accumulated[typeLabel] = [];
                                                }
                                                accumulated[typeLabel].push(membership.year);
                                                return accumulated;
                                            }, {} as Record<string, string[]>)
                                        ).map(([type, years]) => (
                                            <div key={type}
                                                 className="flex flex-col p-3 rounded-lg border bg-muted/30 gap-2">
                                                <span className="text-sm font-bold border-b pb-1">{type}</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {years.sort((a, b) => Number(b) - Number(a)).map((year) => (
                                                        <Badge key={year} variant="outline"
                                                               className="text-[10px] font-medium bg-background">
                                                            {year}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6">
                                        <DataEmpty icon={IdCard}/>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="taggings" className="pt-4 space-y-4">
                                {viewItem?.taggings && viewItem.taggings.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {viewItem.taggings.map((tagging) => (
                                            <Badge key={tagging?.id} variant="secondary"
                                                   className="px-3 py-1 text-sm font-normal">
                                                <Tag className="mr-2 h-3 w-3"/>
                                                {tagging?.name}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6">
                                        <DataEmpty icon={Tag}/>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="toggles" className="pt-4 space-y-4">
                                {viewItem?.toggles && viewItem.toggles.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {viewItem.toggles.map((toggle) => (
                                            <div key={toggle?.id}
                                                 className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <Fingerprint className="h-4 w-4 text-muted-foreground"/>
                                                    <span className="text-sm font-medium">{toggle?.type.label}</span>
                                                </div>
                                                {toggle?.value ? (
                                                    <Badge
                                                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 uppercase text-[10px]">
                                                        {t("Common.yes")}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline"
                                                           className="uppercase text-[10px] text-muted-foreground">
                                                        {t("Common.no")}
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-6">
                                        <DataEmpty icon={ToggleLeft}/>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                    <DialogFooter className="p-6 pt-0">
                        <Button variant="outline" onClick={() => setViewItem(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Sheet open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
                {editItem && (
                    <SpexareForm
                        item={editItem}
                        onSuccess={() => {
                            setEditItem(null);
                            setFilterQuery("");
                            setSelectedPublishedValues(new Set(["true", "false"]));
                            setSelectedDeceasedValues(new Set(["true", "false"]));
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