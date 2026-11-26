"use client";

import {useState, useTransition} from "react";
import {AuditedType, Membership, MembershipKind, Type, TypeType} from "@/gql/schema";
import {Button} from "@/components/ui/button";
import {ExternalLink, IdCard, Plus, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import {AggregateAuditTrail} from "@/components/audit/aggregate-audit-trail.client";
import {MembershipForm} from "./membership-form.client";
import {DataEmpty} from "@/components/data-empty";
import {createMembershipAction, deleteMembershipAction} from "@/app/(app)/spexare/actions.server";
import {toast} from "sonner";
import {MembershipFormOutput} from "@/lib/spexare/membership/schema";
import {useRefresh} from "@/hooks/use-refresh.client";
import {Badge} from "@/components/ui/badge";
import {useMedlemskap} from "@/components/medlemskap-provider.client";

export function MembershipManager({
                                      spexareId,
                                      initialMemberships = [],
                                      types = []
                                  }: {
    spexareId: string;
    initialMemberships: Membership[];
    types: Type[]
}) {
    const t = useTranslations();
    const refresh = useRefresh();
    const [isPending, startTransition] = useTransition();
    const [isAdding, setIsAdding] = useState(false);

    const medlemskap = useMedlemskap();
    const membershipTypes = types.filter(t => t.type === TypeType.Membership);
    // Internal types (FGV) are Medlemskap's: shown here, changed there
    const internalTypeIds = new Set(membershipTypes.filter(t => t.membershipKind === MembershipKind.Internal).map(t => t.id));
    const allMembershipTypes = membershipTypes.filter(t => !internalTypeIds.has(t.id));
    const isInternal = (membership: Membership) => internalTypeIds.has(membership.type.id);
    const simplifiedMemberships = initialMemberships.map(m => ({
        typeId: m.type.id,
        year: m.year,
        id: m.id
    }));

    const handleCreate = (data: MembershipFormOutput) => {
        startTransition(async () => {
            try {
                await createMembershipAction(spexareId, data.typeId, data);
                toast.success(t("Common.updateSuccess"));
                setIsAdding(false);
                refresh();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleDelete = (id: string, typeId: string) => {
        startTransition(async () => {
            try {
                await deleteMembershipAction(spexareId, typeId, id);
                toast.success(t("Common.deleteSuccess"));
                refresh();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                {!isAdding && allMembershipTypes.length > 0 && (
                    <Button size="sm" onClick={() => setIsAdding(true)} disabled={isPending}>
                        <Plus className="h-4 w-4 mr-2"/>
                        {t("Common.add")}
                    </Button>
                )}
            </div>

            {isAdding && (
                <MembershipForm
                    types={allMembershipTypes}
                    existingMemberships={simplifiedMemberships}
                    onSubmit={handleCreate}
                    onCancel={() => setIsAdding(false)}
                    isPending={isPending}
                />
            )}

            {internalTypeIds.size > 0 && (
                <p className="text-sm text-muted-foreground">{t("Medlemskap.kept")}</p>
            )}

            <div className="grid gap-3">
                {initialMemberships.length > 0 ? (
                    initialMemberships.sort((a, b) => Number(b.year) - Number(a.year)).map((membership) => (
                        <div key={membership.id}
                             className="group p-3 rounded-lg border bg-muted/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <IdCard className="h-4 w-4 text-muted-foreground"/>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-sm font-medium leading-none mb-1">{membership.type.label}</span>
                                        <Badge variant="outline" className="w-fit text-xs sm:text-[10px] py-0 h-4">
                                            {membership.lifetime ? t("Medlemskap.lifetimeFrom", {year: membership.year}) : membership.year}
                                        </Badge>
                                    </div>
                                </div>
                                {isInternal(membership) ? (
                                    medlemskap?.canManage && (
                                        <Button size="sm" variant="ghost" nativeButton={false}
                                                render={<a href={`${medlemskap.url}/members/${spexareId}`} target="_blank"
                                                           rel="noopener noreferrer"/>}>
                                            <ExternalLink className="h-4 w-4 mr-2"/>
                                            {t("Medlemskap.edit")}
                                        </Button>
                                    )
                                ) : (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                                                onClick={() => handleDelete(membership.id, membership.type.id)}
                                                disabled={isPending}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : !isAdding && (
                    <div className="py-6">
                        <DataEmpty icon={IdCard}/>
                    </div>
                )}
            </div>
            <AggregateAuditTrail spexareId={spexareId} relatedType={AuditedType.Membership}/>
        </div>
    );
}
