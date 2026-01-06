"use client";

import {useState, useTransition} from "react";
import {Address, Type, TypeType} from "@/gql/graphql";
import {Button} from "@/components/ui/button";
import {Edit2, MapPin, Plus, Trash2} from "lucide-react";
import {useTranslations} from "next-intl";
import {AddressForm} from "./address-form.client";
import {DataEmpty} from "@/components/data-empty";
import {createAddressAction, deleteAddressAction, updateAddressAction} from "@/app/(app)/spexare/actions.server";
import {toast} from "sonner";
import {AddressFormOutput} from "@/lib/spexare/address/schema";
import {useRouter} from "next/navigation";

export function AddressManager({
                                   spexareId,
                                   initialAddresses = [],
                                   types = []
                               }: {
    spexareId: string;
    initialAddresses: Address[];
    types: Type[]
}) {
    const t = useTranslations();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const allAddressTypes = types.filter(t => t.type === TypeType.Address);
    const usedTypeIds = new Set(initialAddresses.map(a => a.type.id));

    const handleCreate = (data: AddressFormOutput) => {
        startTransition(async () => {
            try {
                await createAddressAction(spexareId, data.typeId, data);
                toast.success(t("Common.createSuccess"));
                setIsAdding(false);
                router.refresh();
            } catch (error) {
                toast.error(t("Common.errorOccurred"));
            }
        });
    };

    const handleUpdate = (id: string, data: AddressFormOutput) => {
        startTransition(async () => {
            try {
                await updateAddressAction(spexareId, data.typeId, id, data);
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
                await deleteAddressAction(spexareId, typeId, id);
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
                {!isAdding && !editingId && usedTypeIds.size < allAddressTypes.length && (
                    <Button size="sm" onClick={() => setIsAdding(true)} disabled={isPending}>
                        <Plus className="h-4 w-4 mr-2"/>
                        {t("Common.add")}
                    </Button>
                )}
            </div>

            {isAdding && (
                <AddressForm
                    types={allAddressTypes.filter(t => !usedTypeIds.has(t.id))}
                    onSubmit={handleCreate}
                    onCancel={() => setIsAdding(false)}
                    isPending={isPending}
                />
            )}

            <div className="grid gap-3">
                {initialAddresses.length > 0 ? (
                    initialAddresses.map((address) => (
                        editingId === address.id ? (
                            <AddressForm
                                key={address.id}
                                types={allAddressTypes.filter(t => !usedTypeIds.has(t.id) || t.id === address.type.id)}
                                defaultValues={{
                                    typeId: address.type.id,
                                    streetAddress: address.streetAddress ?? "",
                                    postalCode: address.postalCode ?? "",
                                    city: address.city ?? "",
                                    country: address.country ?? "",
                                    phone: address.phone ?? "",
                                    phoneMobile: address.phoneMobile ?? "",
                                    emailAddress: address.emailAddress ?? "",
                                }}
                                onSubmit={(data) => handleUpdate(address.id, data)}
                                onCancel={() => setEditingId(null)}
                                isPending={isPending}
                            />
                        ) : (
                            <div key={address.id}
                                 className="group flex items-center justify-between p-3 rounded-lg border bg-muted/10">
                                <div className="flex gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-1"/>
                                    <div className="text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{address.streetAddress}</span>
                                            <span
                                                className="text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                {address.type.label}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            {address.postalCode} {address.city}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-8 w-8"
                                            disabled={isPending}
                                            onClick={() => setEditingId(address.id)}>
                                        <Edit2 className="h-4 w-4"/>
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"
                                            disabled={isPending}
                                            onClick={() => handleDelete(address.id, address.type.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        )
                    ))
                ) : !isAdding && (
                    <div className="py-6">
                        <DataEmpty icon={MapPin}/>
                    </div>
                )}
            </div>
        </div>
    );
}