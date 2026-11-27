"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Sparkles, User } from "lucide-react";
import { Activity, AuditedType, Country, Spexare } from "@/gql/schema";
import { getProxiedImageUrl } from "@/utils/utils";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@bloomper/fgv-web-ui/ui/tabs";
import { ActivityTimeline } from "@/components/spexare/activity/activity-timeline.client";
import { SpexareCareer } from "@/components/spexare/spexare-career.client";
import { AggregateAuditTrail } from "@/components/audit/aggregate-audit-trail.client";
import { DialogDescription, DialogHeader, DialogTitle } from "@bloomper/fgv-web-ui/ui/dialog";
import {
  AddressesSection,
  ConsentsSection,
  GeneralSection,
  MembershipsSection,
  PartnerSection,
  TaggingsSection,
  TogglesSection,
} from "@/components/spexare/spexare-view-sections.client";

interface SpexareViewProps {
  spexare: Spexare;
  countries: Country[];
  showAudit?: boolean;
  isMe?: boolean;
  onRestored?: () => void;
  initialTab?: string | null;
}

export function SpexareView({ spexare, countries, showAudit, isMe, onRestored, initialTab }: SpexareViewProps) {
  const t = useTranslations();

  return (
    <>
      <div className="bg-muted relative aspect-video max-h-48 w-full border-b sm:max-h-none">
        {spexare.imageUrl ? (
          <Image
            src={getProxiedImageUrl(spexare.imageUrl, spexare.lastModifiedAt)}
            alt={`${spexare.firstName} ${spexare.lastName}`}
            fill
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User className="text-muted-foreground/20 h-24 w-24 stroke-1" />
          </div>
        )}
      </div>
      <div className="min-w-0 p-6">
        <DialogHeader className="text-left">
          <div className="flex items-start justify-between gap-2 text-left">
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-left text-2xl leading-none">
                {spexare.firstName} {spexare.lastName}
                {isMe && (
                  <Badge className="ml-2 h-5 border-none bg-linear-to-r from-pink-500 to-violet-500 px-2 py-0.5 text-xs font-bold text-white uppercase sm:text-[10px]">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {t("Common.me")}
                  </Badge>
                )}
              </DialogTitle>
              {spexare.nickName && (
                <div className="text-muted-foreground text-left text-lg leading-none italic">{spexare.nickName}</div>
              )}
            </div>
            <div className="mt-1 flex shrink-0 flex-wrap justify-end gap-2">
              {spexare.deceased && (
                <Badge
                  variant="outline"
                  className="mt-1 shrink-0 text-xs tracking-wider uppercase sm:text-[10px]"
                >
                  {t("Spexare.deceasedBadges.true")}
                </Badge>
              )}
              {!spexare.published && (
                <Badge
                  variant="outline"
                  className="mt-1 shrink-0 text-xs tracking-wider uppercase sm:text-[10px]"
                >
                  {t("Spexare.publishedBadges.false")}
                </Badge>
              )}
            </div>
          </div>
          <DialogDescription className="sr-only">{t("Common.details")}</DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={initialTab || "overview"}
          className="mt-6"
        >
          <TabsList className="bg-muted/50 grid !h-auto min-h-9 w-full grid-cols-2 p-1 sm:grid-cols-3">
            <TabsTrigger value="overview">{t("Spexare.Career.tab")}</TabsTrigger>
            <TabsTrigger value="general">{t("Common.general")}</TabsTrigger>
            <TabsTrigger value="activities">{t("Spexare.activities")}</TabsTrigger>
            <TabsTrigger value="partner">{t("Spexare.partner")}</TabsTrigger>
            <TabsTrigger value="addresses">{t("Spexare.addresses")}</TabsTrigger>
            <TabsTrigger value="consents">{t("Spexare.consents")}</TabsTrigger>
            <TabsTrigger value="memberships">{t("Spexare.memberships")}</TabsTrigger>
            <TabsTrigger value="taggings">{t("Spexare.taggings")}</TabsTrigger>
            <TabsTrigger value="toggles">{t("Spexare.toggles")}</TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="pt-6"
          >
            <SpexareCareer
              activities={(spexare.activities ?? []).filter((activity): activity is Activity => !!activity)}
            />
          </TabsContent>

          <TabsContent
            value="general"
            className="space-y-6 pt-4"
          >
            <GeneralSection
              spexare={spexare}
              showAudit={showAudit}
              onRestored={onRestored}
            />
          </TabsContent>

          <TabsContent
            value="activities"
            className="space-y-4 pt-2"
          >
            <ActivityTimeline
              activities={(spexare.activities ?? []).filter((activity): activity is Activity => !!activity)}
            />
            <AggregateAuditTrail
              spexareId={spexare.id}
              relatedType={AuditedType.Activity}
              onRestored={onRestored}
            />
          </TabsContent>

          <TabsContent
            value="partner"
            className="space-y-4 pt-4"
          >
            <PartnerSection
              partner={spexare.partner}
              spexareId={spexare.id}
              onRestored={onRestored}
            />
          </TabsContent>

          <TabsContent
            value="addresses"
            className="space-y-4 pt-4"
          >
            <AddressesSection
              addresses={spexare.addresses}
              countries={countries}
              spexareId={spexare.id}
              onRestored={onRestored}
            />
          </TabsContent>

          <TabsContent
            value="consents"
            className="space-y-4 pt-4"
          >
            <ConsentsSection
              consents={spexare.consents}
              spexareId={spexare.id}
              onRestored={onRestored}
            />
          </TabsContent>

          <TabsContent
            value="memberships"
            className="space-y-4 pt-4"
          >
            <MembershipsSection
              memberships={spexare.memberships}
              spexareId={spexare.id}
              onRestored={onRestored}
            />
          </TabsContent>

          <TabsContent
            value="taggings"
            className="space-y-4 pt-4"
          >
            <TaggingsSection
              taggings={spexare.taggings}
              spexareId={spexare.id}
              onRestored={onRestored}
            />
          </TabsContent>

          <TabsContent
            value="toggles"
            className="space-y-4 pt-4"
          >
            <TogglesSection
              toggles={spexare.toggles}
              spexareId={spexare.id}
              onRestored={onRestored}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
