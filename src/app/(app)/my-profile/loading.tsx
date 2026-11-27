import { Skeleton } from "@bloomper/fgv-web-ui/ui/skeleton";
import { Page } from "@bloomper/fgv-web-ui/shell/page-header";

export default function MyProfileLoading() {
  return (
    <Page className="mx-auto w-full max-w-6xl">
      <div className="mb-4 flex flex-col gap-1">
        <Skeleton className="h-8 w-50" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, section) => (
          <div
            key={section}
            className="space-y-4 rounded-xl border p-6"
          >
            <Skeleton className="h-6 w-37.5" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, field) => (
                <div
                  key={field}
                  className="space-y-2"
                >
                  <Skeleton className="h-4 w-25" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
