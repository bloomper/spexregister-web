"use client";

import { useRouter } from "next/navigation";
import { Country, Spexare } from "@/gql/schema";
import { SpexareViewDialog } from "@/components/spexare/spexare-view-dialog.client";

/**
 * A spexare opened from a link: the details dialog, open, going to the spexare list when closed.
 */
export function SpexareLinkedView({
  spexare,
  countries,
  isMe,
  showAudit,
}: {
  spexare: Spexare;
  countries: Country[];
  isMe: boolean;
  showAudit: boolean;
}) {
  const router = useRouter();

  return (
    <SpexareViewDialog
      open
      onClose={() => router.push("/spexare")}
      full={spexare}
      isLoading={false}
      countries={countries}
      isMe={isMe}
      showAudit={showAudit}
    />
  );
}
