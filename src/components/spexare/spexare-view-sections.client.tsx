"use client";

import Image from "next/image";
import {format, parse} from "date-fns";
import {useTranslations} from "next-intl";
import {Fingerprint, Heart, IdCard, Mail, MapPin, Phone, ShieldCheck, Tag, ToggleLeft, User} from "lucide-react";
import {Country, Spexare} from "@/gql/schema";
import {getProxiedImageUrl} from "@/utils/utils";
import {Badge} from "@/components/ui/badge";
import {DataEmpty} from "@/components/data-empty";
import {AuditInfo} from "@/components/data-table-audit-info.client";
import {AuditTrail} from "@/components/data-audit-trail.client";
import {getEventsAction} from "@/app/(app)/spexare/actions.server";

export function GeneralSection({spexare, showAudit}: { spexare: Spexare; showAudit?: boolean }) {
    const t = useTranslations();
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                {spexare.socialSecurityNumber && (
                    <div className="space-y-1">
                        <div className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
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
                        <div className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                            {t("Spexare.graduation")}
                        </div>
                        <div className="text-sm font-medium text-foreground">{spexare.graduation}</div>
                    </div>
                )}
                {spexare.comment && (
                    <div className="sm:col-span-2 space-y-1">
                        <div className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">
                            {t("Spexare.comment")}
                        </div>
                        <div
                            className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/30 p-3 rounded-md border border-muted">
                            {spexare.comment}
                        </div>
                    </div>
                )}
            </div>
            <div className="space-y-4 pt-4 border-t border-muted/50">
                {showAudit && <AuditInfo item={spexare}/>}
                <AuditTrail id={spexare.id} fetchAction={getEventsAction}/>
            </div>
        </>
    );
}

export function PartnerSection({partner}: { partner: Spexare["partner"] }) {
    const t = useTranslations();
    if (!partner) {
        return (
            <div className="py-6">
                <DataEmpty icon={Heart}/>
            </div>
        );
    }
    return (
        <div className="rounded-lg border p-4 bg-muted/30 relative overflow-hidden">
            <div
                className={`flex items-center gap-4 ${!partner.published ? "blur-sm select-none pointer-events-none opacity-50" : ""}`}>
                <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-background shrink-0">
                    {partner.imageUrl ? (
                        <Image
                            src={getProxiedImageUrl(partner.imageUrl, partner.lastModifiedAt)}
                            alt={`${partner.firstName} ${partner.lastName}`}
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
                        {partner.firstName} {partner.lastName}
                    </span>
                    {partner.nickName && (
                        <span className="text-sm text-muted-foreground italic">
                            {partner.nickName}
                        </span>
                    )}
                    <div className="flex gap-2 mt-1">
                        {partner.deceased && (
                            <Badge variant="outline" className="text-[10px] uppercase">
                                {t("Spexare.deceasedBadges.true")}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
            {!partner.published && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Badge variant="secondary" className="shadow-sm">
                        <ShieldCheck className="mr-1 h-3 w-3"/>
                        {t("Spexare.publishedBadges.false")}
                    </Badge>
                </div>
            )}
        </div>
    );
}

export function AddressesSection({addresses, countries}: { addresses: Spexare["addresses"]; countries: Country[] }) {
    const getCountryLabel = (isoCode: string) => countries.find(c => c.isoCode === isoCode)?.label || isoCode;
    if (!addresses || addresses.length === 0) {
        return (
            <div className="py-6">
                <DataEmpty icon={MapPin}/>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 gap-4">
            {addresses.map((address) => (
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
                                    <a href={`mailto:${address.emailAddress}`} className="hover:underline">
                                        {address.emailAddress}
                                    </a>
                                </div>
                            )}
                            {(address?.phone || address?.phoneMobile) && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground"/>
                                    <div className="flex flex-col">
                                        {address.phone && <span>{address.phone}</span>}
                                        {address.phoneMobile && <span>{address.phoneMobile} (mob)</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ConsentsSection({consents}: { consents: Spexare["consents"] }) {
    const t = useTranslations();
    if (!consents || consents.length === 0) {
        return (
            <div className="py-6">
                <DataEmpty icon={ShieldCheck}/>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {consents.map((consent) => (
                <div key={consent?.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <span className="text-sm font-medium">{consent?.type.label}</span>
                    {consent?.value ? (
                        <Badge
                            className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 uppercase text-[10px]">
                            {t("Spexare.Consent.granted")}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="uppercase text-[10px] text-muted-foreground">
                            {t("Spexare.Consent.withdrawn")}
                        </Badge>
                    )}
                </div>
            ))}
        </div>
    );
}

export function MembershipsSection({memberships}: { memberships: Spexare["memberships"] }) {
    if (!memberships || memberships.length === 0) {
        return (
            <div className="py-6">
                <DataEmpty icon={IdCard}/>
            </div>
        );
    }
    const grouped = Object.entries(
        memberships.reduce((accumulated, membership) => {
            if (!membership) {
                return accumulated;
            }
            const typeLabel = membership.type.label;
            if (!accumulated[typeLabel]) {
                accumulated[typeLabel] = [];
            }
            accumulated[typeLabel].push(membership.year);
            return accumulated;
        }, {} as Record<string, string[]>),
    );
    return (
        <div className="grid grid-cols-1 gap-3">
            {grouped.map(([type, years]) => (
                <div key={type} className="flex flex-col p-3 rounded-lg border bg-muted/30 gap-2">
                    <span className="text-sm font-bold border-b pb-1">{type}</span>
                    <div className="flex flex-wrap gap-1.5">
                        {years
                            .sort((a, b) => Number(a) - Number(b))
                            .map((year) => (
                                <Badge key={year} variant="outline" className="text-[10px] font-medium bg-background">
                                    {year}
                                </Badge>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function TaggingsSection({taggings}: { taggings: Spexare["taggings"] }) {
    if (!taggings || taggings.length === 0) {
        return (
            <div className="py-6">
                <DataEmpty icon={Tag}/>
            </div>
        );
    }
    return (
        <div className="flex flex-wrap gap-2">
            {taggings.map((tagging) => (
                <Badge key={tagging?.id} variant="secondary" className="px-3 py-1 text-sm font-normal">
                    <Tag className="mr-2 h-3 w-3"/>
                    {tagging?.name}
                </Badge>
            ))}
        </div>
    );
}

export function TogglesSection({toggles}: { toggles: Spexare["toggles"] }) {
    const t = useTranslations();
    if (!toggles || toggles.length === 0) {
        return (
            <div className="py-6">
                <DataEmpty icon={ToggleLeft}/>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {toggles.map((toggle) => (
                <div key={toggle?.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
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
                        <Badge variant="outline" className="uppercase text-[10px] text-muted-foreground">
                            {t("Common.no")}
                        </Badge>
                    )}
                </div>
            ))}
        </div>
    );
}
