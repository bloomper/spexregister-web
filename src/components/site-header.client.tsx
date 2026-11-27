"use client";

import { SiteHeader as FgvSiteHeader } from "@bloomper/fgv-web-ui/shell/site-header";
import type { Application } from "@bloomper/fgv-web-ui/shell/applications";
import { LanguageToggle, ModeToggle } from "@bloomper/fgv-web-ui/shell/toggles";
import { SpexareSearchForm } from "@/components/spexare/spexare-search-form.client";
import { EditQueueButton } from "@/components/edit-queue";
import { CommandPalette } from "@/components/command-palette.client";

/**
 * The FGV header with Spexregister's own controls: the spexare search, the command palette and the edit queue.
 */
export function SiteHeader({ applications }: { applications: Application[] }) {
  return (
    <FgvSiteHeader
      applications={applications}
      actions={
        <>
          <SpexareSearchForm className="w-48 md:w-64" />
          <CommandPalette />
          <EditQueueButton />
          <LanguageToggle />
          <ModeToggle />
        </>
      }
    />
  );
}
