import { DataTableSkeleton } from "@/components/data-table-skeleton";
import { Skeleton } from "@bloomper/fgv-web-ui/ui/skeleton";
import { Page } from "@bloomper/fgv-web-ui/shell/page-header";

export default function ChangeLogLoading() {
  return (
    <Page>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-37.5" />
      </div>
      <DataTableSkeleton
        rowCount={15}
        columnCount={4}
        columnTypes={["text", "text", "text", "text"]}
        columnClasses={["w-[100px]", "w-[200px]", "w-[250px]", "hidden md:table-cell w-[250px]"]}
      />
    </Page>
  );
}
