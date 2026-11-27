import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { get, getMine } from "@/lib/spexare";
import { getCountries } from "@/lib/settings";
import { withPolicyPage } from "@/utils/route.server";
import { Policies } from "@/utils/policy.server";
import { isAdminOrEditor } from "@/utils/auth";
import { SpexareLinkedView } from "@/components/spexare/spexare-linked-view.client";

/**
 * One spexare, as the other applications link to it (Spexipedia's credits among them): the spexare's details over the
 * spexare list, which closing goes back to. The ids are the same in every application.
 */
export default async function SpexareByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return withPolicyPage(Policies.spexare.requireRead, async (authz) => {
    const locale = await getLocale();
    const [spexare, countries, mine] = await Promise.all([
      get(id).catch(() => undefined),
      getCountries(locale),
      getMine(),
    ]);

    if (!spexare) {
      notFound();
    }

    return (
      <SpexareLinkedView
        spexare={spexare}
        countries={countries}
        isMe={mine?.id === spexare.id}
        showAudit={isAdminOrEditor(authz.roles)}
      />
    );
  });
}
