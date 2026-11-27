import { DataGridSkeleton } from "@/components/data-grid-skeleton";
import { Page } from "@bloomper/fgv-web-ui/shell/page-header";

export default function SpexareSearchLoading() {
  return (
    <Page>
      <DataGridSkeleton />
    </Page>
  );
}
