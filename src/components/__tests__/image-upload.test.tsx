import {beforeEach, describe, expect, it, vi} from "vitest";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {ImageUpload} from "@/components/image-upload.client";
import {toast} from "sonner";

const ready = vi.hoisted(() => Object.assign(Promise.resolve(), {status: "fulfilled", value: undefined}));

vi.mock("next/cache", () => ({io: () => ready}));
vi.mock("sonner", () => ({toast: {success: vi.fn(), error: vi.fn()}}));

const png = () => new File(["png"], "logo.png", {type: "image/png"});

async function pick(file: File) {
    const input = document.querySelector("input[type=file]") as HTMLInputElement;

    await userEvent.upload(input, file, {applyAccept: false});
}

beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = vi.fn(() => "blob:preview");
    URL.revokeObjectURL = vi.fn();
});

describe("ImageUpload", () => {
    it("hands a picked file to the form and removes it again", async () => {
        const onFileSelect = vi.fn();
        const onFileDelete = vi.fn();
        render(<ImageUpload onFileSelect={onFileSelect} onFileDelete={onFileDelete}/>);
        await screen.findByText("Common.clickToUpload", {exact: false});

        const file = png();

        await pick(file);
        await waitFor(() => expect(onFileSelect).toHaveBeenCalledWith(file));
        expect(await screen.findByAltText("Preview")).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button"));
        expect(onFileSelect).toHaveBeenLastCalledWith(null);
        expect(onFileDelete).toHaveBeenCalled();
        expect(screen.queryByAltText("Preview")).not.toBeInTheDocument();
    });

    it("uploads at once and deletes the existing image", async () => {
        const onUpload = vi.fn().mockResolvedValue(undefined);
        const onDelete = vi.fn().mockResolvedValue(undefined);
        render(<ImageUpload initialImageUrl="/api/spex/1/poster" onUpload={onUpload} onDelete={onDelete}/>);

        expect(await screen.findByAltText("Preview")).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button"));
        await waitFor(() => expect(onDelete).toHaveBeenCalled());
        expect(toast.success).toHaveBeenCalledWith("Common.deleteSuccess");

        await pick(png());
        await waitFor(() => expect(onUpload).toHaveBeenCalledWith(expect.any(FormData)));
        expect(toast.success).toHaveBeenCalledWith("Common.uploadSuccess");
    });

    it("reports a failed upload and delete", async () => {
        const onUpload = vi.fn().mockRejectedValue(new Error("boom"));
        const onDelete = vi.fn().mockRejectedValue(new Error("boom"));
        render(<ImageUpload initialImageUrl="/api/spex/1/poster" onUpload={onUpload} onDelete={onDelete}/>);

        await userEvent.click(await screen.findByRole("button"));
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred"));

        await pick(png());
        await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(2));
    });

    it("refuses a file of the wrong type", async () => {
        render(<ImageUpload onFileSelect={vi.fn()}/>);
        await screen.findByText("Common.clickToUpload", {exact: false});

        await pick(new File(["x"], "notes.txt", {type: "text/plain"}));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Common.errorOccurred"));
    });
});
