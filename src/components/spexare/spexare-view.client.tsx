"use client";

import * as React from "react";
import Image from "next/image";
import {format, parse} from "date-fns";
import {useTranslations} from "next-intl";
import {Fingerprint, Heart, IdCard, Mail, MapPin, Phone, ShieldCheck, Tag, ToggleLeft, User,} from "lucide-react";
import {Country, Spexare} from "@/gql/graphql";
import {getProxiedImageUrl} from "@/utils/utils";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DataEmpty} from "@/components/data-empty";
import {ActivityTimeline} from "@/components/spexare/activity/activity-timeline.client";
import {DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {AuditInfo} from "@/components/data-table-audit-info.client";

interface SpexareViewProps {
    spexare: Spexare;
    countries: Country[];
    showAudit?: boolean;
}

export function SpexareView({
                                spexare,
                                countries,
                                showAudit
                            }: SpexareViewProps) {
    const t = useTranslations();
    const getCountryLabel = (isoCode: string) => {
        return countries.find(c => c.isoCode === isoCode)?.label || isoCode;
    };

    return (
        <>
            <div className="relative aspect-video w-full bg-muted border-b">
                {spexare.imageUrl ? (
                    <Image
                        src={getProxiedImageUrl(spexare.imageUrl, spexare.lastModifiedAt)}
                        alt={`${spexare.firstName} ${spexare.lastName}`}
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
                                {spexare.firstName} {spexare.lastName}
                            </DialogTitle>
                            {spexare.nickName && (
                                <div className="text-muted-foreground italic text-lg leading-none text-left">
                                    {spexare.nickName}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 mt-1 shrink-0">
                            {spexare.deceased && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                    {t("Spexare.deceasedBadges.true")}
                                </Badge>
                            )}
                            {!spexare.published && (
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider shrink-0 mt-1">
                                    {t("Spexare.publishedBadges.false")}
                                </Badge>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="general" className="mt-6">
                    <TabsList className="grid w-full h-auto p-1 bg-muted/50 grid-cols-2 sm:grid-cols-3">
                        <TabsTrigger value="general">{t("Common.general")}</TabsTrigger>
                        <TabsTrigger value="activities">{t("Spexare.activities")}</TabsTrigger>
                        <TabsTrigger value="partner">{t("Spexare.partner")}</TabsTrigger>
                        <TabsTrigger value="addresses">{t("Spexare.addresses")}</TabsTrigger>
                        <TabsTrigger value="consents">{t("Spexare.consents")}</TabsTrigger>
                        <TabsTrigger value="memberships">{t("Spexare.memberships")}</TabsTrigger>
                        <TabsTrigger value="taggings">{t("Spexare.taggings")}</TabsTrigger>
                        <TabsTrigger value="toggles">{t("Spexare.toggles")}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                            {spexare.socialSecurityNumber && (
                                <div className="space-y-1">
                                    <div
                                        className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                        {spexare.socialSecurityNumber.includes("-")
                                            ? t("Spexare.socialSecurityNumber")
                                            : t("Spexare.birthDate")}
                                    </div>
                                    <div className="text-sm font-medium text-foreground">
                                        {spexare.socialSecurityNumber.includes("-")
                                            ? spexare.socialSecurityNumber
                                            : format(parse(spexare.socialSecurityNumber, "yyyyMMdd", new Date()), "yyyy-MM-dd")}
                                    </div>
                                </div>
                            )}
                            {spexare.graduation && (
                                <div className="space-y-1">
                                    <div
                                        className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                        {t("Spexare.graduation")}
                                    </div>
                                    <div className="text-sm font-medium text-foreground">{spexare.graduation}</div>
                                </div>
                            )}
                            {spexare.comment && (
                                <div className="sm:col-span-2 space-y-1">
                                    <div
                                        className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                                        {t("Spexare.comment")}
                                    </div>
                                    <div
                                        className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-3 rounded-md border border-muted">
                                        {spexare.comment}
                                    </div>
                                </div>
                            )}
                        </div>
                        {showAudit && <AuditInfo item={spexare}/>}
                    </TabsContent>

                    <TabsContent value="activities" className="pt-2">
                        <ActivityTimeline activities={spexare.activities || []}/>
                    </TabsContent>

                    <TabsContent value="partner" className="pt-4 space-y-4">
                        {spexare.partner ? (
                            <div className="rounded-lg border p-4 bg-muted/30 relative overflow-hidden">
                                <div
                                    className={`flex items-center gap-4 ${!spexare.partner.published ? "blur-sm select-none pointer-events-none opacity-50" : ""}`}>
                                    <div
                                        className="relative h-16 w-16 overflow-hidden rounded-full border bg-background shrink-0">
                                        {spexare.partner.imageUrl ? (
                                            <Image
                                                src={getProxiedImageUrl(spexare.partner.imageUrl, spexare.partner.lastModifiedAt)}
                                                alt={`${spexare.partner.firstName} ${spexare.partner.lastName}`}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <User className="h-8 w-8 text-muted-foreground/20"/>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                                <span className="text-lg font-bold truncate">
                                                    {spexare.partner.firstName} {spexare.partner.lastName}
                                                </span>
                                        {spexare.partner.nickName && (
                                            <span className="text-sm text-muted-foreground italic">
                                                    {spexare.partner.nickName}
                                                </span>
                                        )}
                                        <div className="flex gap-2 mt-1">
                                            {spexare.partner.deceased && (
                                                <Badge variant="outline" className="text-[10px] uppercase">
                                                    {t("Spexare.deceasedBadges.true")}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {!spexare.partner.published && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Badge variant="secondary" className="shadow-sm">
                                            <ShieldCheck className="mr-1 h-3 w-3"/>
                                            {t("Spexare.publishedBadges.false")}
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-6">
                                <DataEmpty icon={Heart}/>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="addresses" className="pt-4 space-y-4">
                        {spexare.addresses && spexare.addresses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {spexare.addresses.map((address) => (
                                    <div key={address?.id} className="rounded-lg border p-4 space-y-3">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <Badge variant="secondary" className="text-[10px] uppercase">
                                                {address?.type.label}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            {(address?.streetAddress || address?.postalCode || address?.city) && (
                                                <div className="flex gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5"/>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{address.streetAddress}</span>
                                                        <span className="text-muted-foreground">
                                                            {address.postalCode} {address.city}
                                                        </span>
                                                        {address.country && (
                                                            <span className="text-muted-foreground">
                                                                {getCountryLabel(address.country)}
                                                            </span>
                                                        )}
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
                        {spexare.consents && spexare.consents.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {spexare.consents.map((consent) => (
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
                        {spexare.memberships && spexare.memberships.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {Object.entries(
                                    spexare.memberships.reduce((accumulated, membership) => {
                                        if (!membership) return accumulated;
                                        const typeLabel = membership.type.label;
                                        if (!accumulated[typeLabel]) accumulated[typeLabel] = [];
                                        accumulated[typeLabel].push(membership.year);
                                        return accumulated;
                                    }, {} as Record<string, string[]>),
                                ).map(([type, years]) => (
                                    <div key={type} className="flex flex-col p-3 rounded-lg border bg-muted/30 gap-2">
                                        <span className="text-sm font-bold border-b pb-1">{type}</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {years
                                                .sort((a, b) => Number(b) - Number(a))
                                                .map((year) => (
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
                        {spexare.taggings && spexare.taggings.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {spexare.taggings.map((tagging) => (
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
                        {spexare.toggles && spexare.toggles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {spexare.toggles.map((toggle) => (
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
        </>
    );
}
