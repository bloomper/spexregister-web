import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";

export function DataEmpty() {
    const t = useTranslations("Common");

    return (
        <Empty className="col-span-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Newspaper />
                </EmptyMedia>
                <EmptyTitle>{t("noDataTitle")}</EmptyTitle>
                <EmptyDescription>
                    {t("noDataDescription")}
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}