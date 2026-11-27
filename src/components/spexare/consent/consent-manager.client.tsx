"use client";

import { useState, useTransition } from "react";
import { AuditedType, Consent, Type, TypeType } from "@/gql/schema";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { Edit2, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { AggregateAuditTrail } from "@/components/audit/aggregate-audit-trail.client";
import { ConsentForm } from "./consent-form.client";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { createConsentAction, deleteConsentAction, updateConsentAction } from "@/app/(app)/spexare/actions.server";
import { toast } from "sonner";
import { ConsentFormOutput } from "@/lib/spexare/consent/schema";
import { useRefresh } from "@/hooks/use-refresh.client";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";

export function ConsentManager({
  spexareId,
  initialConsents = [],
  types = [],
}: {
  spexareId: string;
  initialConsents: Consent[];
  types: Type[];
}) {
  const t = useTranslations();
  const refresh = useRefresh();
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const allConsentTypes = types.filter((t) => t.type === TypeType.Consent);
  const usedTypeIds = new Set(initialConsents.map((c) => c.type.id));

  const handleCreate = (data: ConsentFormOutput) => {
    startTransition(async () => {
      try {
        await createConsentAction(spexareId, data.typeId, data);
        toast.success(t("Common.updateSuccess"));
        setIsAdding(false);
        refresh();
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
        await deleteConsentAction(spexareId, typeId, id);
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
        {!isAdding && !editingId && usedTypeIds.size < allConsentTypes.length && (
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
        <ConsentForm
          types={allConsentTypes.filter((t) => !usedTypeIds.has(t.id))}
          onSubmit={handleCreate}
          onCancel={() => setIsAdding(false)}
          isPending={isPending}
        />
      )}

      <div className="grid gap-3">
        {initialConsents.length > 0
          ? initialConsents.map((consent) =>
              editingId === consent.id ? (
                <ConsentForm
                  key={consent.id}
                  types={allConsentTypes.filter((t) => !usedTypeIds.has(t.id) || t.id === consent.type.id)}
                  defaultValues={{ typeId: consent.type.id, value: consent.value }}
                  onSubmit={(data) => handleUpdate(consent.id, data)}
                  onCancel={() => setEditingId(null)}
                  isPending={isPending}
                />
              ) : (
                <div
                  key={consent.id}
                  className="group bg-muted/10 flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-muted-foreground h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="mb-1 text-sm leading-none font-medium">{consent.type.label}</span>
                      {consent.value ? (
                        <Badge className="h-4 w-fit border-green-200 bg-green-500/10 py-0 text-[11px] text-green-600 uppercase hover:bg-green-500/20 sm:text-[9px]">
                          {t("Spexare.Consent.granted")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground h-4 w-fit py-0 text-[11px] uppercase sm:text-[9px]"
                        >
                          {t("Spexare.Consent.withdrawn")}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => setEditingId(consent.id)}
                      disabled={isPending}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive h-8 w-8"
                      onClick={() => handleDelete(consent.id, consent.type.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            )
          : !isAdding && (
              <div className="py-6">
                <DataEmpty icon={ShieldCheck} />
              </div>
            )}
      </div>
      <AggregateAuditTrail
        spexareId={spexareId}
        relatedType={AuditedType.Consent}
      />
    </div>
  );
}
