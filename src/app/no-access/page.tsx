import { redirect } from "next/navigation";
import { NoAccessPage as FgvNoAccessPage } from "@bloomper/fgv-web-ui/shell/status-pages";
import { LogoutButton } from "@/components/logout-button.client";
import { requireUser } from "@/utils/auth.server";

/**
 * For a signed-in user without any Spexregister role yet, such as one waiting for approval. Everyone else is sent to
 * the start page.
 */
export default async function NoAccessPage() {
  const { session, roles } = await requireUser();

  if (!session || roles.length > 0) {
    redirect("/");
  }

  return (
    <FgvNoAccessPage
      email={session.user.email}
      application="spexregister"
      actions={<LogoutButton />}
    />
  );
}
