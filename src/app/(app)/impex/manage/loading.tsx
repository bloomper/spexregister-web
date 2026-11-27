import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { Skeleton } from "@bloomper/fgv-web-ui/ui/skeleton";
import { Page } from "@bloomper/fgv-web-ui/shell/page-header";

export default function ImpexManageLoading() {
  return (
    <Page>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-45" />
      </div>

      <DataTableSkeleton
        rowCount={10}
        columnCount={7}
        columnTypes={["text", "text", "text", "text", "text", "text", "text"]}
        columnClasses={[
          "w-[120px]", // ID
          "w-[300px]", // Name
          "w-[120px]", // Status
          "hidden md:table-cell", // Created At
          "hidden md:table-cell", // Started At
          "hidden md:table-cell", // Finished At
          "w-[100px] text-right", // Actions
        ]}
      />
    </Page>
  );
}
