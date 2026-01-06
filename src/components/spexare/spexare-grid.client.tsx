"use client";

import * as React from 'react';
import {useEffect, useState} from 'react';
import {useInfiniteCursor} from '@/hooks/use-infinite-scrolling';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTranslations} from "next-intl";
import {Spexare} from "@/gql/graphql";
import {CursorPageInfo} from "@/types/pagination";
import {InfiniteScrollFooter} from "@/components/infinite-scroll-footer.client";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getPageAction} from "@/app/(app)/spexare/actions.server";
import {DataEmpty} from "@/components/data-empty";
import {
    CheckCircle2,
    Circle,
    Fingerprint,
    IdCard,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Tag,
    ToggleLeft,
    User,
    UserRound,
    X
} from "lucide-react";
import {DataFilter} from "@/components/data-filter";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {cn, getProxiedImageUrl} from "@/utils/utils";
import {Badge} from "@/components/ui/badge";
import {format, parse} from "date-fns";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export function SpexareGrid({
                                initialItems = [],
                                initialPageInfo,
                                maxItems,
                            }: {
    initialItems?: Spexare[];
    initialPageInfo?: CursorPageInfo;
    maxItems?: number;
}) {
    const t = useTranslations();
    const [searchValue, setSearchValue] = useState("");
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedDeceasedValues, setSelectedDeceasedValues] = useState<Set<string>>(new Set(["true", "false"]));

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilterQuery(searchValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const fetchPageWithFilters = React.useCallback((args: { after: string | null; pageSize: number }) => {
        const parts: string[] = [];

        if (filterQuery.trim()) {
            const query = filterQuery.trim();
            parts.push(`(firstName:*${query}* OR lastName:*${query}* OR nickName:*${query}*)`);
        }

        if (selectedDeceasedValues.size < 2) {
            if (selectedDeceasedValues.size === 0) {
                parts.push(`id:NULL`);
            } else {
                const val = selectedDeceasedValues.has("true") ? "TRUE" : "FALSE";
                parts.push(`deceased:${val}`);
            }
        }

        return getPageAction({
            after: args.after,
            first: args.pageSize,
            filter: parts.join(" AND ")
        });
    }, [filterQuery, selectedDeceasedValues]);

    const {
        items: allItems,
        loading,
        error,
        hasNextPage,
        sentinelRef,
        loadMore,
        reset
    } = useInfiniteCursor<Spexare>({
        fetchPageAction: fetchPageWithFilters,
        pageSize: 24,
        rootMargin: '600px',
        getKeyAction: (n) => n.id,
        initialItems,
        initialPageInfo,
    });

    useEffect(() => {
        reset();
    }, [filterQuery, selectedDeceasedValues, reset]);

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const [selected, setSelected] = useState<Spexare | null>(null);
    const items = maxItems ? allItems.slice(0, maxItems) : allItems;
    const isInfiniteMode = !maxItems;
    const noResults = !loading && items.length === 0;
    const isFiltered = filterQuery.trim() !== "" || selectedDeceasedValues.size < 2;

    return (
        <>
            {isInfiniteMode && (
                <div className="col-span-full mb-6 flex flex-col gap-4 border-b pb-6">
                    <div>
                        <h3 className="text-lg font-bold tracking-tight">{t("Spexare.heading")}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-[300px]">
                            <Input
                                placeholder={t("Spexare.filterPlaceholder")}
                                value={searchValue}
                                onChange={handleQueryChange}
                                className="h-8 text-xs pr-8"
                            />
                            {searchValue && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-8 w-8 hover:bg-transparent"
                                    onClick={() => {
                                        setSearchValue("");
                                    }}
                                >
                                    <X className="h-3 w-3"/>
                                </Button>
                            )}
                        </div>

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

                        {isFiltered && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setSearchValue("");
                                    setSelectedDeceasedValues(new Set(["true", "false"]));
                                }}
                                className="h-8 px-2 lg:px-3 text-xs"
                            >
                                {t("Common.reset")}
                                <X className="ml-2 h-4 w-4"/>
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {noResults ? (
                <div className="col-span-full py-12">
                    <DataEmpty
                        title={isFiltered ? t("Common.noFilterMatchHeading") : t("Common.noDataHeading")}
                        description={isFiltered ? t("Common.noFilterMatchDescription") : t("Common.noDataDescription")}
                        icon={UserRound}
                    />
                </div>
            ) : (
                items.map((n) => (
                    <Card
                        key={n.id}
                        className="group h-full transition-colors hover:bg-muted/50 cursor-pointer overflow-hidden flex flex-col p-0"
                        onClick={() => setSelected(n)}
                    >
                        {n.imageUrl ? (
                            <div className="relative aspect-video w-full bg-muted border-b overflow-hidden">
                                <Image
                                    src={getProxiedImageUrl(n.imageUrl, n.lastModifiedAt)}
                                    alt={`${n.firstName} ${n.lastName}`}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        ) : (
                            <div className="aspect-video w-full bg-muted flex items-center justify-center border-b">
                                <User className="h-12 w-12 text-muted-foreground/20 stroke-[1.5]"/>
                            </div>
                        )}
                        <CardHeader className="space-y-2 p-3">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                    <CardTitle className="line-clamp-1 text-sm font-bold leading-tight">
                                        {n.firstName} {n.lastName}
                                    </CardTitle>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {!n.published && (
                                            <Badge variant="outline"
                                                   className="text-[9px] uppercase px-1 py-0 h-3.5 leading-none font-normal">
                                                {t("Spexare.publishedBadges.false")}
                                            </Badge>
                                        )}
                                        {n.deceased && (
                                            <Badge variant="outline"
                                                   className="text-[9px] uppercase px-1 py-0 h-3.5 leading-none shrink-0 font-normal">
                                                {t("Spexare.deceasedBadges.true")}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                {n.nickName && (
                                    <p className="text-[11px] text-muted-foreground italic truncate leading-tight">
                                        {n.nickName}
                                    </p>
                                )}
                            </div>
                        </CardHeader>
                    </Card>
                ))
            )}

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                    <div className="relative aspect-video w-full bg-muted border-b">
                        {selected?.imageUrl ? (
                            <Image
                                src={getProxiedImageUrl(selected.imageUrl, selected.lastModifiedAt)}
                                alt={`${selected.firstName} ${selected.lastName}`}
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
                                        {selected?.firstName} {selected?.lastName}
                                    </DialogTitle>
                                    {selected?.nickName && (
                                        <div className="text-muted-foreground italic text-lg leading-none text-left">
                                            {selected.nickName}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-end gap-2 mt-1 shrink-0">
                                    {selected?.deceased &&
                                        <Badge variant="outline"
                                               className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                            {t("Spexare.deceasedBadges.true")}
                                        </Badge>
                                    }
                                    {!selected?.published &&
                                        <Badge variant="outline"
                                               className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                            {t("Spexare.publishedBadges.false")}
                                        </Badge>
                                    }
                                </div>
                            </div>
                        </DialogHeader>

                        <Tabs defaultValue="general" className="mt-6">
                            <TabsList className={cn(
                                "grid w-full h-auto p-1 bg-muted/50",
                                selected ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"
                            )}>
                                <TabsTrigger value="general">{t("Common.general")}</TabsTrigger>
                                <TabsTrigger value="addresses">{t("Spexare.addresses")}</TabsTrigger>
                                <TabsTrigger value="consents">{t("Spexare.consents")}</TabsTrigger>
                                <TabsTrigger value="memberships">{t("Spexare.memberships")}</TabsTrigger>
                                <TabsTrigger value="taggings">{t("Spexare.taggings")}</TabsTrigger>
                                <TabsTrigger value="toggles">{t("Spexare.toggles")}</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6 pt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                    {selected?.socialSecurityNumber && (
                                        <div className="space-y-1">
                                            <div
                                                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                                {selected.socialSecurityNumber.includes("-") ? t("Spexare.socialSecurityNumber") : t("Spexare.birthDate")}
                                            </div>
                                            <div className="text-sm font-medium text-foreground">
                                                {selected.socialSecurityNumber.includes("-")
                                                    ? selected.socialSecurityNumber
                                                    : format(parse(selected.socialSecurityNumber, "yyyyMMdd", new Date()), "yyyy-MM-dd")
                                                }
                                            </div>
                                        </div>
                                    )}
                                    {selected?.graduation && (
                                        <div className="space-y-1">
                                            <div
                                                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                                {t("Spexare.graduation")}
                                            </div>
                                            <div
                                                className="text-sm font-medium text-foreground">{selected.graduation}</div>
                                        </div>
                                    )}
                                    {selected?.comment && (
                                        <div className="sm:col-span-2 space-y-1">
                                            <div
                                                className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                                {t("Spexare.comment")}
                                            </div>
                                            <div
                                                className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-3 rounded-md border border-muted">
                                                {selected.comment}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="addresses" className="pt-4 space-y-4">
                                {selected?.addresses && selected.addresses.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {selected.addresses.map((address) => (
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
                                {selected?.consents && selected.consents.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selected.consents.map((consent) => (
                                            <div key={consent?.id}
                                                 className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                                                <span className="text-sm font-medium">{consent?.type.label}</span>
                                                {consent?.value ? (
                                                    <Badge
                                                        className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 uppercase text-[10px]">
                                                        {t("Spexare.Consent.granted")}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline"
                                                           className="uppercase text-[10px] text-muted-foreground">
                                                        {t("Spexare.Consent.withdrawn")}
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
                                {selected?.memberships && selected.memberships.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Object.entries(
                                            selected.memberships.reduce((accumulated, membership) => {
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
                                {selected?.taggings && selected.taggings.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selected.taggings.map((tagging) => (
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
                                {selected?.toggles && selected.toggles.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selected.toggles.map((toggle) => (
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
                        <Button variant="outline" onClick={() => setSelected(null)}>
                            {t("Common.close")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isInfiniteMode && (
                <InfiniteScrollFooter
                    sentinelRef={sentinelRef}
                    loading={loading}
                    error={error}
                    hasNextPage={hasNextPage}
                    itemsCount={items.length}
                    onRetry={() => loadMore(true)}
                />
            )}
        </>
    );
}