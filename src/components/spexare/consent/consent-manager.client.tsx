"use client";

import {useState, useTransition} from "react";
import {Consent, Type, TypeType} from "@/gql/graphql";
import {Button} from "@/components/ui/button";
import {Edit2, Plus, ShieldCheck, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import {ConsentForm} from "./consent-form.client";
import {DataEmpty} from "@/components/data-empty";
import {createConsentAction, deleteConsentAction, updateConsentAction} from "@/app/(app)/spexare/actions.server";
import {toast} from "sonner";
import {ConsentFormOutput} from "@/lib/spexare/consent/schema";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";

export function ConsentManager({
                                   spexareId,
                                   initialConsents = [],
                                   types = []
                               }: {
    spexareId: string;
    initialConsents: Consent[];
    types: Type[]
}) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const allConsentTypes = types.filter(t => t.type === TypeType.Consent);
    const usedTypeIds = new Set(initialConsents.map(c => c.type.id));

    const handleCreate = (data: ConsentFormOutput) => {
        startTransition(async () => {
            try {
                await createConsentAction(spexareId, data.typeId, data);
                toast.success(t("Common.updateSuccess"));
                setIsAdding(false);
                router.refresh();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleUpdate = (id: string, data: ConsentFormOutput) => {
        startTransition(async () => {
            try {
                await updateConsentAction(spexareId, data.typeId, id, data);
                toast.success(t("Common.updateSuccess"));
                setEditingId(null);
                router.refresh();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleDelete = (id: string, typeId: string) => {
        startTransition(async () => {
            try {
                await deleteConsentAction(spexareId, typeId, id);
                toast.success(t("Common.deleteSuccess"));
                router.refresh();
            } catch (error) {
                void error;
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                {!isAdding && !editingId && usedTypeIds.size < allConsentTypes.length && (
                    <Button size="sm" onClick={() => setIsAdding(true)} disabled={isPending}>
                        <Plus className="h-4 w-4 mr-2"/>
                        {t("Common.add")}
                    </Button>
                )}
            </div>

            {isAdding && (
                <ConsentForm
                    types={allConsentTypes.filter(t => !usedTypeIds.has(t.id))}
                    onSubmit={handleCreate}
                    onCancel={() => setIsAdding(false)}
                    isPending={isPending}
                />
            )}

            <div className="grid gap-3">
                {initialConsents.length > 0 ? (
                    initialConsents.map((consent) => (
                        editingId === consent.id ? (
                            <ConsentForm
                                key={consent.id}
                                types={allConsentTypes.filter(t => !usedTypeIds.has(t.id) || t.id === consent.type.id)}
                                defaultValues={{typeId: consent.type.id, value: consent.value}}
                                onSubmit={(data) => handleUpdate(consent.id, data)}
                                onCancel={() => setEditingId(null)}
                                isPending={isPending}
                            />
                        ) : (
                            <div key={consent.id}
                                 className="group flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground"/>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-sm font-medium leading-none mb-1">{consent.type.label}</span>
                                        {consent.value ? (
                                            <Badge
                                                className="w-fit bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 uppercase text-[9px] py-0 h-4">
                                                {t("Spexare.Consent.granted")}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline"
                                                   className="w-fit uppercase text-[9px] text-muted-foreground py-0 h-4">
                                                {t("Spexare.Consent.withdrawn")}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"
                                            onClick={() => setEditingId(consent.id)} disabled={isPending}>
                                        <Edit2 className="h-4 w-4"/>
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                                            onClick={() => handleDelete(consent.id, consent.type.id)}
                                            disabled={isPending}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        )
                    ))
                ) : !isAdding && (
                    <div className="py-6">
                        <DataEmpty icon={ShieldCheck}/>
                    </div>
                )}
            </div>
        </div>
    );
}
