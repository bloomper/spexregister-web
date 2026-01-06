"use client";

import {useState, useTransition} from "react";
import {Membership, Type, TypeType} from "@/gql/graphql";
import {Button} from "@/components/ui/button";
import {Edit2, IdCard, Plus, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import {MembershipForm} from "./membership-form.client";
import {DataEmpty} from "@/components/data-empty";
import {
    createMembershipAction,
    deleteMembershipAction,
    updateMembershipAction
} from "@/app/(app)/spexare/actions.server";
import {toast} from "sonner";
import {MembershipFormOutput} from "@/lib/spexare/membership/schema";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";

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
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const allMembershipTypes = types.filter(t => t.type === TypeType.Membership);
    const simplifiedMemberships = initialMemberships.map(m => ({
        typeId: m.type.id,
        year: m.year,
        id: m.id
    }));

    const handleCreate = (data: MembershipFormOutput) => {
        startTransition(async () => {
            try {
                await createMembershipAction(spexareId, data.typeId, data);
                toast.success(t("Common.createSuccess"));
                setIsAdding(false);
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleUpdate = (id: string, data: MembershipFormOutput) => {
        startTransition(async () => {
            try {
                await updateMembershipAction(spexareId, data.typeId, id, data);
                toast.success(t("Common.updateSuccess"));
                setEditingId(null);
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleDelete = (id: string, typeId: string) => {
        startTransition(async () => {
            try {
                await deleteMembershipAction(spexareId, typeId, id);
                toast.success(t("Common.deleteSuccess"));
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                {!isAdding && !editingId && (
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

            <div className="grid gap-3">
                {initialMemberships.length > 0 ? (
                    initialMemberships.sort((a, b) => Number(b.year) - Number(a.year)).map((membership) => (
                        editingId === membership.id ? (
                            <MembershipForm
                                key={membership.id}
                                types={allMembershipTypes}
                                existingMemberships={simplifiedMemberships}
                                defaultValues={{typeId: membership.type.id, year: membership.year}}
                                onSubmit={(data) => handleUpdate(membership.id, data)}
                                onCancel={() => setEditingId(null)}
                                isPending={isPending}
                            />
                        ) : (
                            <div key={membership.id}
                                 className="group flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                <div className="flex items-center gap-3">
                                    <IdCard className="h-4 w-4 text-muted-foreground"/>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-sm font-medium leading-none mb-1">{membership.type.label}</span>
                                        <Badge variant="outline" className="w-fit text-[10px] py-0 h-4">
                                            {membership.year}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"
                                            onClick={() => setEditingId(membership.id)} disabled={isPending}>
                                        <Edit2 className="h-4 w-4"/>
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                                            onClick={() => handleDelete(membership.id, membership.type.id)}
                                            disabled={isPending}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        )
                    ))
                ) : !isAdding && (
                    <div className="py-6">
                        <DataEmpty icon={IdCard}/>
                    </div>
                )}
            </div>
        </div>
    );
}
