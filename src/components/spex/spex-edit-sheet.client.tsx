"use client";

import {Spex, SpexCategory} from "@/gql/schema";
import {Sheet} from "@/components/ui/sheet";
import {SpexForm} from "@/components/spex/spex-form.client";

type SpexEditSheetProps = {
    item: Spex | null;
    categories: SpexCategory[];
    onClose: () => void;
    onSuccess: () => void;
};

export function SpexEditSheet({item, categories, onClose, onSuccess}: SpexEditSheetProps) {
    return (
        <Sheet open={!!item} onOpenChange={(open) => !open && onClose()}>
            {item && (
                <SpexForm
                    item={item}
                    categories={categories}
                    onSuccess={onSuccess}
                />
            )}
        </Sheet>
    );
}
