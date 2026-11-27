"use client";

import { useState, useTransition } from "react";
import { Address, AuditedType, Country, Type, TypeType } from "@/gql/schema";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Edit2, MapPin, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { AggregateAuditTrail } from "@/components/audit/aggregate-audit-trail.client";
import { AddressForm } from "./address-form.client";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { createAddressAction, deleteAddressAction, updateAddressAction } from "@/app/(app)/spexare/actions.server";
import { toast } from "sonner";
import { AddressFormOutput } from "@/lib/spexare/address/schema";
import { useRefresh } from "@/hooks/use-refresh.client";

export function AddressManager({
  spexareId,
  initialAddresses = [],
  types = [],
  countries = [],
}: {
  spexareId: string;
  initialAddresses: Address[];
  types: Type[];
  countries: Country[];
}) {
  const t = useTranslations();
  const refresh = useRefresh();
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const allAddressTypes = types.filter((t) => t.type === TypeType.Address);
  const usedTypeIds = new Set(initialAddresses.map((a) => a.type.id));

  const handleCreate = (data: AddressFormOutput) => {
    startTransition(async () => {
      try {
        await createAddressAction(spexareId, data.typeId, data);
        toast.success(t("Common.updateSuccess"));
        setIsAdding(false);
        refresh();
      } catch (error) {
        void error;
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
        await deleteAddressAction(spexareId, typeId, id);
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
      <div className="flex items-center justify-between">
        {!isAdding && !editingId && usedTypeIds.size < allAddressTypes.length && (
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isPending}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("Common.add")}
          </Button>
        )}
      </div>

      {isAdding && (
        <AddressForm
          types={allAddressTypes.filter((t) => !usedTypeIds.has(t.id))}
          countries={countries}
          onSubmit={handleCreate}
          onCancel={() => setIsAdding(false)}
          isPending={isPending}
        />
      )}

      <div className="grid gap-3">
        {initialAddresses.length > 0
          ? initialAddresses.map((address) =>
              editingId === address.id ? (
                <AddressForm
                  key={address.id}
                  types={allAddressTypes.filter((t) => !usedTypeIds.has(t.id) || t.id === address.type.id)}
                  countries={countries}
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
                <div
                  key={address.id}
                  className="group bg-muted/10 rounded-lg border p-3"
                >
                  <div className="grid grid-cols-[1fr_auto] items-start gap-3">
                    <div className="flex min-w-0 gap-3">
                      <MapPin className="text-muted-foreground mt-1 h-4 w-4 shrink-0" />
                      <div className="min-w-0 flex-1 text-sm">
                        <div className="mb-0.5 flex flex-wrap items-center gap-2">
                          <span className="truncate font-medium">{address.streetAddress}</span>
                          <span className="bg-muted text-muted-foreground shrink-0 rounded px-1.5 py-0.5 text-xs uppercase sm:text-[10px]">
                            {address.type.label}
                          </span>
                        </div>
                        <div className="text-muted-foreground truncate">
                          {address.postalCode} {address.city}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        disabled={isPending}
                        onClick={() => setEditingId(address.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive h-8 w-8"
                        disabled={isPending}
                        onClick={() => handleDelete(address.id, address.type.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            )
          : !isAdding && (
              <div className="py-6">
                <DataEmpty icon={MapPin} />
              </div>
            )}
      </div>
      <AggregateAuditTrail
        spexareId={spexareId}
        relatedType={AuditedType.Address}
      />
    </div>
  );
}
