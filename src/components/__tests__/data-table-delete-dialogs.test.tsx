import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {DataTableDeleteDialogs} from "@/components/data-table-delete-dialogs.client";

const baseProps = {
    deleteItem: {id: "1"},
    setDeleteItem: vi.fn(),
    isBulkDeleting: false,
    setIsBulkDeleting: vi.fn(),
    isPending: false,
    handleDelete: vi.fn(),
    handleBulkDelete: vi.fn(),
};

describe("DataTableDeleteDialogs", () => {
    it("does not offer purge unless asked to", () => {
        render(<DataTableDeleteDialogs {...baseProps}/>);

        expect(screen.getByText("Common.deleteConfirmation")).toBeInTheDocument();
        expect(screen.queryByText("Common.deletePurge")).not.toBeInTheDocument();
    });

    it("offers purge and reports changes", async () => {
        const onCheckedChange = vi.fn();
        render(<DataTableDeleteDialogs {...baseProps} purge={{checked: false, onCheckedChange}}/>);

        await userEvent.click(screen.getByRole("checkbox"));

        expect(onCheckedChange).toHaveBeenCalledWith(true);
    });
});
