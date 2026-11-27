"use client";

import Image from "next/image";
import { format, parse } from "date-fns";
import { useTranslations } from "next-intl";
import { Fingerprint, Heart, IdCard, Mail, MapPin, Phone, ShieldCheck, Tag, ToggleLeft, User } from "lucide-react";
import { AuditedType, Country, Spexare } from "@/gql/schema";
import { getProxiedImageUrl } from "@/utils/utils";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { AuditInfo } from "@/components/data-table-audit-info.client";
import { AuditTrail } from "@/components/data-audit-trail.client";
import { AggregateAuditTrail } from "@/components/audit/aggregate-audit-trail.client";
import { PartnerAuditTrail } from "@/components/audit/partner-audit-trail.client";
import { TagsAuditTrail } from "@/components/audit/tags-audit-trail.client";
import { getRestorePreviewAction, getRevisionsAction, restoreRevisionAction } from "@/app/(app)/spexare/actions.server";

const restoreActions = {
  preview: getRestorePreviewAction,
  restore: restoreRevisionAction,
};

export function GeneralSection({
  spexare,
  showAudit,
  onRestored,
}: {
  spexare: Spexare;
  showAudit?: boolean;
  onRestored?: () => void;
}) {
  const t = useTranslations();
  return (
    <>
      <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
        {spexare.socialSecurityNumber && (
          <div className="space-y-1">
            <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {spexare.socialSecurityNumber.includes("-") ? t("Spexare.socialSecurityNumber") : t("Spexare.birthDate")}
            </div>
            <div className="text-foreground text-sm font-medium">
              {spexare.socialSecurityNumber.includes("-")
                ? spexare.socialSecurityNumber
                : format(parse(spexare.socialSecurityNumber, "yyyyMMdd", new Date(0)), "yyyy-MM-dd")}
            </div>
          </div>
        )}
        {spexare.graduation && (
          <div className="space-y-1">
            <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {t("Spexare.graduation")}
            </div>
            <div className="text-foreground text-sm font-medium">{spexare.graduation}</div>
          </div>
        )}
        {spexare.comment && (
          <div className="space-y-1 sm:col-span-2">
            <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {t("Spexare.comment")}
            </div>
            <div className="text-foreground bg-muted/30 border-muted rounded-md border p-3 text-sm leading-relaxed whitespace-pre-wrap">
              {spexare.comment}
            </div>
          </div>
        )}
      </div>
      <div className="border-muted/50 space-y-4 border-t pt-4">
        {showAudit && <AuditInfo item={spexare} />}
        <AuditTrail
          id={spexare.id}
          fetchAction={getRevisionsAction}
          restoreActions={restoreActions}
          onRestored={onRestored}
        />
      </div>
    </>
  );
}

export function PartnerSection({
  partner,
  spexareId,
  onRestored,
}: {
  partner: Spexare["partner"];
  spexareId: string;
  onRestored?: () => void;
}) {
  const t = useTranslations();
  if (!partner) {
    return (
      <div className="space-y-4">
        <div className="py-6">
          <DataEmpty icon={Heart} />
        </div>
        <PartnerAuditTrail
          spexareId={spexareId}
          onRestored={onRestored}
        />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="bg-muted/30 relative overflow-hidden rounded-lg border p-4">
        <div
          className={`flex items-center gap-4 ${!partner.published ? "pointer-events-none opacity-50 blur-sm select-none" : ""}`}
        >
          <div className="bg-background relative h-16 w-16 shrink-0 overflow-hidden rounded-full border">
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
                <User className="text-muted-foreground/20 h-8 w-8" />
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-lg font-bold">
              {partner.firstName} {partner.lastName}
            </span>
            {partner.nickName && <span className="text-muted-foreground text-sm italic">{partner.nickName}</span>}
            <div className="mt-1 flex gap-2">
              {partner.deceased && (
                <Badge
                  variant="outline"
                  className="text-xs uppercase sm:text-[10px]"
                >
                  {t("Spexare.deceasedBadges.true")}
                </Badge>
              )}
            </div>
          </div>
        </div>
        {!partner.published && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Badge
              variant="secondary"
              className="shadow-sm"
            >
              <ShieldCheck className="mr-1 h-3 w-3" />
              {t("Spexare.publishedBadges.false")}
            </Badge>
          </div>
        )}
      </div>
      <PartnerAuditTrail
        spexareId={spexareId}
        onRestored={onRestored}
      />
    </div>
  );
}

export function AddressesSection({
  addresses,
  countries,
  spexareId,
  onRestored,
}: {
  addresses: Spexare["addresses"];
  countries: Country[];
  spexareId: string;
  onRestored?: () => void;
}) {
  const getCountryLabel = (isoCode: string) => countries.find((c) => c.isoCode === isoCode)?.label || isoCode;
  if (!addresses || addresses.length === 0) {
    return (
      <div className="space-y-4">
        <div className="py-6">
          <DataEmpty icon={MapPin} />
        </div>
        <AggregateAuditTrail
          onRestored={onRestored}
          spexareId={spexareId}
          relatedType={AuditedType.Address}
        />
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {addresses.map((address) => (
          <div
            key={address?.id}
            className="space-y-3 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <Badge
                variant="secondary"
                className="text-xs uppercase sm:text-[10px]"
              >
                {address?.type.label}
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              {(address?.streetAddress || address?.postalCode || address?.city) && (
                <div className="flex gap-2">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-medium">{address.streetAddress}</span>
                    <span className="text-muted-foreground">
                      {address.postalCode} {address.city}
                    </span>
                    {address.country && (
                      <span className="text-muted-foreground">{getCountryLabel(address.country)}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {address?.emailAddress && (
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <a
                      href={`mailto:${address.emailAddress}`}
                      className="hover:text-link"
                    >
                      {address.emailAddress}
                    </a>
                  </div>
                )}
                {(address?.phone || address?.phoneMobile) && (
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4" />
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
      <AggregateAuditTrail
        onRestored={onRestored}
        spexareId={spexareId}
        relatedType={AuditedType.Address}
      />
    </>
  );
}

export function ConsentsSection({
  consents,
  spexareId,
  onRestored,
}: {
  consents: Spexare["consents"];
  spexareId: string;
  onRestored?: () => void;
}) {
  const t = useTranslations();
  if (!consents || consents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="py-6">
          <DataEmpty icon={ShieldCheck} />
        </div>
        <AggregateAuditTrail
          onRestored={onRestored}
          spexareId={spexareId}
          relatedType={AuditedType.Consent}
        />
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {consents.map((consent) => (
          <div
            key={consent?.id}
            className="bg-muted/30 flex items-center justify-between rounded-lg border p-3"
          >
            <span className="text-sm font-medium">{consent?.type.label}</span>
            {consent?.value ? (
              <Badge className="border-green-200 bg-green-500/10 text-xs text-green-600 uppercase hover:bg-green-500/20 sm:text-[10px]">
                {t("Spexare.Consent.granted")}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground text-xs uppercase sm:text-[10px]"
              >
                {t("Spexare.Consent.withdrawn")}
              </Badge>
            )}
          </div>
        ))}
      </div>
      <AggregateAuditTrail
        onRestored={onRestored}
        spexareId={spexareId}
        relatedType={AuditedType.Consent}
      />
    </>
  );
}

export function MembershipsSection({
  memberships,
  spexareId,
  onRestored,
}: {
  memberships: Spexare["memberships"];
  spexareId: string;
  onRestored?: () => void;
}) {
  if (!memberships || memberships.length === 0) {
    return (
      <div className="space-y-4">
        <div className="py-6">
          <DataEmpty icon={IdCard} />
        </div>
        <AggregateAuditTrail
          onRestored={onRestored}
          spexareId={spexareId}
          relatedType={AuditedType.Membership}
        />
      </div>
    );
  }
  const grouped = Object.entries(
    memberships.reduce(
      (accumulated, membership) => {
        if (!membership) {
          return accumulated;
        }
        const typeLabel = membership.type.label;
        if (!accumulated[typeLabel]) {
          accumulated[typeLabel] = [];
        }
        accumulated[typeLabel].push(membership.year);
        return accumulated;
      },
      {} as Record<string, string[]>
    )
  );
  return (
    <>
      <div className="grid grid-cols-1 gap-3">
        {grouped.map(([type, years]) => (
          <div
            key={type}
            className="bg-muted/30 flex flex-col gap-2 rounded-lg border p-3"
          >
            <span className="border-b pb-1 text-sm font-bold">{type}</span>
            <div className="flex flex-wrap gap-1.5">
              {years
                .sort((a, b) => Number(a) - Number(b))
                .map((year) => (
                  <Badge
                    key={year}
                    variant="outline"
                    className="bg-background text-xs font-medium sm:text-[10px]"
                  >
                    {year}
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </div>
      <AggregateAuditTrail
        onRestored={onRestored}
        spexareId={spexareId}
        relatedType={AuditedType.Membership}
      />
    </>
  );
}

export function TaggingsSection({
  taggings,
  spexareId,
  onRestored,
}: {
  taggings: Spexare["taggings"];
  spexareId: string;
  onRestored?: () => void;
}) {
  if (!taggings || taggings.length === 0) {
    return (
      <div className="space-y-4">
        <div className="py-6">
          <DataEmpty icon={Tag} />
        </div>
        <TagsAuditTrail
          spexareId={spexareId}
          onRestored={onRestored}
        />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {taggings.map((tagging) => (
          <Badge
            key={tagging?.id}
            variant="secondary"
            className="px-3 py-1 text-sm font-normal"
          >
            <Tag className="mr-2 h-3 w-3" />
            {tagging?.name}
          </Badge>
        ))}
      </div>
      <TagsAuditTrail
        spexareId={spexareId}
        onRestored={onRestored}
      />
    </div>
  );
}

export function TogglesSection({
  toggles,
  spexareId,
  onRestored,
}: {
  toggles: Spexare["toggles"];
  spexareId: string;
  onRestored?: () => void;
}) {
  const t = useTranslations();
  if (!toggles || toggles.length === 0) {
    return (
      <div className="space-y-4">
        <div className="py-6">
          <DataEmpty icon={ToggleLeft} />
        </div>
        <AggregateAuditTrail
          onRestored={onRestored}
          spexareId={spexareId}
          relatedType={AuditedType.Toggle}
        />
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {toggles.map((toggle) => (
          <div
            key={toggle?.id}
            className="bg-muted/30 flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <Fingerprint className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">{toggle?.type.label}</span>
            </div>
            {toggle?.value ? (
              <Badge className="border-green-200 bg-green-500/10 text-xs text-green-600 uppercase hover:bg-green-500/20 sm:text-[10px]">
                {t("Common.yes")}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground text-xs uppercase sm:text-[10px]"
              >
                {t("Common.no")}
              </Badge>
            )}
          </div>
        ))}
      </div>
      <AggregateAuditTrail
        onRestored={onRestored}
        spexareId={spexareId}
        relatedType={AuditedType.Toggle}
      />
    </>
  );
}
