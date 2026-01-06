"use client";

import {useState, useTransition} from "react";
import {Toggle, Type, TypeType} from "@/gql/graphql";
import {Button} from "@/components/ui/button";
import {Edit2, Fingerprint, Plus, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import {ToggleForm} from "./toggle-form.client";
import {DataEmpty} from "@/components/data-empty";
import {createToggleAction, deleteToggleAction, updateToggleAction} from "@/app/(app)/spexare/actions.server";
import {toast} from "sonner";
import {ToggleFormOutput} from "@/lib/spexare/toggle/schema";
import {useRouter} from "next/navigation";
import {Badge} from "@/components/ui/badge";

export function ToggleManager({
                                  spexareId,
                                  initialToggles = [],
                                  types = []
                              }: {
    spexareId: string;
    initialToggles: Toggle[];
    types: Type[]
}) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const allToggleTypes = types.filter(t => t.type === TypeType.Toggle);
    const usedTypeIds = new Set(initialToggles.map(tg => tg.type.id));

    const handleCreate = (data: ToggleFormOutput) => {
        startTransition(async () => {
            try {
                await createToggleAction(spexareId, data.typeId, data);
                toast.success(t("Common.createSuccess"));
                setIsAdding(false);
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleUpdate = (id: string, data: ToggleFormOutput) => {
        startTransition(async () => {
            try {
                await updateToggleAction(spexareId, data.typeId, id, data);
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
                await deleteToggleAction(spexareId, typeId, id);
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
                {!isAdding && !editingId && usedTypeIds.size < allToggleTypes.length && (
                    <Button size="sm" onClick={() => setIsAdding(true)} disabled={isPending}>
                        <Plus className="h-4 w-4 mr-2"/>
                        {t("Common.add")}
                    </Button>
                )}
            </div>

            {isAdding && (
                <ToggleForm
                    types={allToggleTypes.filter(t => !usedTypeIds.has(t.id))}
                    onSubmit={handleCreate}
                    onCancel={() => setIsAdding(false)}
                    isPending={isPending}
                />
            )}

            <div className="grid gap-3">
                {initialToggles.length > 0 ? (
                    initialToggles.map((toggle) => (
                        editingId === toggle.id ? (
                            <ToggleForm
                                key={toggle.id}
                                types={allToggleTypes.filter(t => !usedTypeIds.has(t.id) || t.id === toggle.type.id)}
                                defaultValues={{typeId: toggle.type.id, value: toggle.value}}
                                onSubmit={(data) => handleUpdate(toggle.id, data)}
                                onCancel={() => setEditingId(null)}
                                isPending={isPending}
                            />
                        ) : (
                            <div key={toggle.id}
                                 className="group flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                <div className="flex items-center gap-3">
                                    <Fingerprint className="h-4 w-4 text-muted-foreground"/>
                                    <div className="flex flex-col">
                                        <span
                                            className="text-sm font-medium leading-none mb-1">{toggle.type.label}</span>
                                        {toggle.value ? (
                                            <Badge
                                                className="w-fit bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200 uppercase text-[9px] py-0 h-4">
                                                {t("Common.yes")}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline"
                                                   className="w-fit uppercase text-[9px] text-muted-foreground py-0 h-4">
                                                {t("Common.no")}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"
                                            onClick={() => setEditingId(toggle.id)} disabled={isPending}>
                                        <Edit2 className="h-4 w-4"/>
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                                            onClick={() => handleDelete(toggle.id, toggle.type.id)}
                                            disabled={isPending}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        )
                    ))
                ) : !isAdding && (
                    <div className="py-6">
                        <DataEmpty icon={Fingerprint}/>
                    </div>
                )}
            </div>
        </div>
    );
}
