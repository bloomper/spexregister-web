"use client";

import Image from "next/image";
import {useTranslations} from "next-intl";
import {Sparkles, User} from "lucide-react";
import {Activity, Country, Spexare} from "@/gql/schema";
import {getProxiedImageUrl} from "@/utils/utils";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {ActivityTimeline} from "@/components/spexare/activity/activity-timeline.client";
import {DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
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
}

export function SpexareView({spexare, countries, showAudit, isMe}: SpexareViewProps) {
    const t = useTranslations();

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
                                {isMe && (
                                    <Badge
                                        className="ml-2 bg-linear-to-r from-pink-500 to-violet-500 text-white border-none text-[10px] uppercase px-2 py-0.5 h-5 font-bold">
                                        <Sparkles className="mr-1 h-3 w-3"/>
                                        {t("Common.me")}
                                    </Badge>
                                )}
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
                    <DialogDescription className="sr-only">
                        {t("Common.details")}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="general" className="mt-6">
                    <TabsList className="grid w-full !h-auto min-h-9 p-1 bg-muted/50 grid-cols-2 sm:grid-cols-3">
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
                        <GeneralSection spexare={spexare} showAudit={showAudit}/>
                    </TabsContent>

                    <TabsContent value="activities" className="pt-2">
                        <ActivityTimeline
                            activities={(spexare.activities ?? []).filter((activity): activity is Activity => !!activity)}
                        />
                    </TabsContent>

                    <TabsContent value="partner" className="pt-4 space-y-4">
                        <PartnerSection partner={spexare.partner}/>
                    </TabsContent>

                    <TabsContent value="addresses" className="pt-4 space-y-4">
                        <AddressesSection addresses={spexare.addresses} countries={countries}/>
                    </TabsContent>

                    <TabsContent value="consents" className="pt-4 space-y-4">
                        <ConsentsSection consents={spexare.consents}/>
                    </TabsContent>

                    <TabsContent value="memberships" className="pt-4 space-y-4">
                        <MembershipsSection memberships={spexare.memberships}/>
                    </TabsContent>

                    <TabsContent value="taggings" className="pt-4 space-y-4">
                        <TaggingsSection taggings={spexare.taggings}/>
                    </TabsContent>

                    <TabsContent value="toggles" className="pt-4 space-y-4">
                        <TogglesSection toggles={spexare.toggles}/>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
