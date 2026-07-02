"use client";

import {
    Activity,
    Address,
    Consent,
    Country,
    Membership,
    Spex,
    Spexare,
    SpexCategory,
    Tag,
    Task,
    TaskCategory,
    Toggle,
    Type,
} from "@/gql/schema";
import {TabsContent} from "@/components/ui/tabs";
import {AddressManager} from "@/components/spexare/address/address-manager.client";
import {ConsentManager} from "@/components/spexare/consent/consent-manager.client";
import {MembershipManager} from "@/components/spexare/membership/membership-manager.client";
import {TaggingManager} from "@/components/spexare/tagging/tagging-manager.client";
import {ToggleManager} from "@/components/spexare/toggle/toggle-manager.client";
import {ActivityManager} from "@/components/spexare/activity/activity-manager.client";
import {PartnerManager} from "@/components/spexare/partner/partner-manager.client";

type SpexareRelationTabsProps = {
    item: Spexare;
    types: Type[];
    countries: Country[];
    tags: Tag[];
    tasks: Task[];
    taskCategories: TaskCategory[];
    spex: Spex[];
    spexCategories: SpexCategory[];
};

export function SpexareRelationTabs({
                                        item,
                                        types,
                                        countries,
                                        tags,
                                        tasks,
                                        taskCategories,
                                        spex,
                                        spexCategories,
                                    }: SpexareRelationTabsProps) {
    return (
        <>
            <TabsContent value="activities" className="mt-0 outline-none pb-8">
                <div className="py-4">
                    <ActivityManager
                        spexareId={item.id}
                        types={types}
                        tasks={tasks}
                        taskCategories={taskCategories}
                        spex={spex}
                        spexCategories={spexCategories}
                        initialActivities={(item.activities ?? []).filter(
                            (activity): activity is Activity => !!activity
                        )}
                    />
                </div>
            </TabsContent>
            <TabsContent value="partner" className="mt-0 outline-none pb-8">
                <div className="py-4">
                    <PartnerManager
                        spexareId={item.id}
                        initialPartner={item.partner}
                    />
                </div>
            </TabsContent>
            <TabsContent value="addresses" className="mt-0 outline-none pb-8">
                <div className="py-4">
                    <AddressManager
                        key={`address-manager-${item.id}-${JSON.stringify(item.addresses?.map(a => ({
                            id: a?.id,
                            s: a?.streetAddress,
                            c: a?.city,
                            e: a?.emailAddress
                        })))}`}
                        spexareId={item.id}
                        initialAddresses={(item.addresses || []).filter((a): a is Address => !!a)}
                        types={types}
                        countries={countries}
                    />
                </div>
            </TabsContent>
            <TabsContent value="consents" className="mt-0 outline-none pb-8">
                <div className="py-4">
                    <ConsentManager
                        key={`consent-manager-${item.id}-${JSON.stringify(item.consents?.map(c => ({
                            id: c?.id,
                            v: c?.value
                        })))}`}
                        spexareId={item.id}
                        initialConsents={(item.consents || []).filter((c): c is Consent => !!c)}
                        types={types}
                    />
                </div>
            </TabsContent>
            <TabsContent value="memberships" className="mt-0 outline-none pb-8">
                <div className="py-4">
                    <MembershipManager
                        key={`membership-manager-${item.id}-${JSON.stringify(item.memberships?.map(m => ({
                            id: m?.id,
                            v: m?.year
                        })))}`}
                        spexareId={item.id}
                        initialMemberships={(item.memberships || []).filter((m): m is Membership => !!m)}
                        types={types}
                    />
                </div>
            </TabsContent>
            <TabsContent value="taggings" className="mt-0 outline-none pb-8">
                <div className="py-4">
                    <TaggingManager
                        key={`tagging-manager-${item.id}-${item.taggings?.length}`}
                        spexareId={item.id}
                        initialTaggings={(item.taggings || []).filter((t): t is Tag => !!t)}
                        allTags={tags}
                    />
                </div>
            </TabsContent>
            <TabsContent value="toggles" className="mt-0 outline-none pb-8">
                <div className="py-4">
                    <ToggleManager
                        key={`toggle-manager-${item.id}-${JSON.stringify(item.toggles?.map(tg => ({
                            id: tg?.id,
                            v: tg?.value
                        })))}`}
                        spexareId={item.id}
                        initialToggles={(item.toggles || []).filter((tg): tg is Toggle => !!tg)}
                        types={types}
                    />
                </div>
            </TabsContent>
        </>
    );
}
