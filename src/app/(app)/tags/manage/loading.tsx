import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { Skeleton } from "@bloomper/fgv-web-ui/ui/skeleton";
import { Page } from "@bloomper/fgv-web-ui/shell/page-header";

export default function TagManageLoading() {
  return (
    <Page>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-45" />
      </div>
      <DataTableSkeleton
        rowCount={15}
        columnCount={5}
        columnTypes={["checkbox", "text", "text", "text", "text"]}
        columnClasses={[
          "w-[40px]", // Select
          "w-[250px]", // Name
          "hidden xl:table-cell w-[150px]", // Created At
          "hidden xl:table-cell w-[150px]", // Last Modified At
          "w-[50px]", // Actions
        ]}
      />
    </Page>
  );
}
