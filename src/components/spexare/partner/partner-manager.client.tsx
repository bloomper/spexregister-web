"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Heart, Loader2, Search, User, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Spexare, SpexarePartner } from "@/gql/schema";
import { addPartnerAction, getPageAction, removePartnerAction } from "@/app/(app)/spexare/actions.server";
import { Button } from "@bloomper/fgv-web-ui/ui/button";
import { DataEmpty } from "@bloomper/fgv-web-ui/shell/data-empty";
import { Input } from "@bloomper/fgv-web-ui/ui/input";
import { Badge } from "@bloomper/fgv-web-ui/ui/badge";
import { getProxiedImageUrl } from "@/utils/utils";
import { textFilter } from "@/utils/filter";

type PartnerLike = Spexare | SpexarePartner;

interface PartnerManagerProps {
  spexareId: string;
  initialPartner?: PartnerLike | null;
}

/**
 * Shows a spexare's partner and lets the user search for another spexare to link, or unlink the partner.
 */
export function PartnerManager({ spexareId, initialPartner }: PartnerManagerProps) {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [partner, setPartner] = useState<PartnerLike | null>(initialPartner || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Spexare[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async () => {
    const fieldFilter = textFilter(["firstName", "lastName", "nickName"], searchQuery);
    if (!fieldFilter) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const filter = `${fieldFilter} AND (published:TRUE OR published:FALSE)`;

      const results = await getPageAction({
        filter: filter,
        first: 10,
        full: false,
      });

      setSearchResults(results.items.filter((s) => s.id !== spexareId));
    } catch (error) {
      void error;
      toast.error(t("Common.errorOccurred"));
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, spexareId, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        void handleSearch();
      } else if (searchQuery.trim().length === 0) {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [handleSearch, searchQuery]);

  const handleAddPartner = (id: string) => {
    startTransition(async () => {
      try {
        await addPartnerAction(spexareId, id);
        toast.success(t("Common.updateSuccess"));
        const selected = searchResults.find((s) => s.id === id);
        if (selected) {
          setPartner(selected);
        }
        setSearchQuery("");
        setSearchResults([]);
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
      }
    });
  };

  const handleRemovePartner = () => {
    startTransition(async () => {
      try {
        await removePartnerAction(spexareId);
        setPartner(null);
        toast.success(t("Common.updateSuccess"));
      } catch (error) {
        void error;
        toast.error(t("Common.errorOccurred"));
      }
    });
  };

  return (
    <div className="space-y-6">
      {partner ? (
        <div className="bg-muted/30 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-background relative h-12 w-12 shrink-0 overflow-hidden rounded-full border">
                {partner.imageUrl ? (
                  <Image
                    src={getProxiedImageUrl(partner.imageUrl, partner.lastModifiedAt)}
                    alt={`${partner.firstName} ${partner.lastName}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <User className="text-muted-foreground/20 h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold">
                  {partner.firstName} {partner.lastName}
                </span>
                <div className="flex gap-2">
                  {!partner.published && (
                    <Badge
                      variant="outline"
                      className="text-xs uppercase sm:text-[10px]"
                    >
                      {t("Spexare.publishedBadges.false")}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemovePartner}
              disabled={isPending}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder={t("Common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </div>
          </div>

          {searchResults.length > 0 ? (
            <div className="max-h-[300px] divide-y overflow-auto rounded-md border">
              {searchResults.map((s) => (
                <div
                  key={s.id}
                  className="hover:bg-muted/50 flex items-center justify-between p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border">
                      {s.imageUrl ? (
                        <Image
                          src={getProxiedImageUrl(s.imageUrl)}
                          alt=""
                          width={32}
                          height={32}
                          unoptimized
                        />
                      ) : (
                        <User className="text-muted-foreground h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {s.firstName} {s.lastName}
                      </span>
                      <div className="flex gap-2">
                        {!s.published && (
                          <span className="text-muted-foreground text-xs uppercase sm:text-[10px]">
                            {t("Spexare.publishedBadges.false")}
                          </span>
                        )}
                        {s.partner && (
                          <span className="text-destructive text-xs font-semibold uppercase sm:text-[10px]">
                            {t("Spexare.partner")} ({s.partner.firstName} {s.partner.lastName})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAddPartner(s.id)}
                    disabled={isPending || !!s.partner}
                  >
                    {t("Common.add")}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            searchQuery.length >= 2 &&
            !isSearching && (
              <div className="py-6">
                <DataEmpty icon={Heart} />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
