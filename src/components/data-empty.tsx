import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty";
import {Newspaper} from "lucide-react";
import {useTranslations} from "next-intl";

export function DataEmpty({title, description}: { title?: string, description?: string }) {
    const t = useTranslations();

    return (
        <Empty className="col-span-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Newspaper/>
                </EmptyMedia>
                <EmptyTitle>{title ?? t("Common.noDataHeading")}</EmptyTitle>
                <EmptyDescription>
                    {description ?? t("Common.noDataDescription")}
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}