"use client";

import {useTranslations} from "next-intl";
import {useCallback, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {ImagePlus, Loader2, X} from "lucide-react";
import {toast} from "sonner";
import {type FileRejection, useDropzone} from "react-dropzone";
import {getProxiedImageUrl} from "@/utils/utils";
import Image from "next/image";

interface ImageUploadProps {
    initialImageUrl?: string | null;
    onUpload?: (formData: FormData) => Promise<unknown>;
    onDelete?: () => Promise<unknown>;
    onFileSelect?: (file: File | null) => void;
    onFileDelete?: () => void;
}

export function ImageUpload({initialImageUrl, onUpload, onDelete, onFileSelect, onFileDelete}: ImageUploadProps) {
    const t = useTranslations();
    const [isPending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(() => {
        return getProxiedImageUrl(initialImageUrl, Date.now().toString());
    });

    const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            const rejection = fileRejections[0];
            if (rejection.errors[0]?.code === "file-too-large") {
                toast.error(t("Common.fileTooLarge"));
            } else {
                toast.error(t("Common.errorOccurred"));
            }
            return;
        }

        const file = acceptedFiles[0];
        if (!file) {
            return;
        }

        setPreview(URL.createObjectURL(file));

        if (onUpload) {
            const formData = new FormData();
            formData.append("file", file);

            startTransition(async () => {
                try {
                    await onUpload(formData);
                    toast.success(t("Common.uploadSuccess"));
                } catch (error) {
                    void error;
                    toast.error(t("Common.errorOccurred"));
                }
            });
        } else {
            onFileSelect?.(file);
        }
    }, [onUpload, onFileSelect, t]);

    const removeImage = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            startTransition(async () => {
                try {
                    await onDelete();
                    setPreview(null);
                    toast.success(t("Common.deleteSuccess"));
                } catch (error) {
                    void error;
                    toast.error(t("Common.errorOccurred"));
                }
            });
        } else {
            setPreview(null);
            onFileSelect?.(null);
            onFileDelete?.();
        }
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/gif': ['.gif']
        },
        maxSize: 15 * 1024 * 1024,
        multiple: false,
        disabled: isPending
    });

    return (
        <div className="space-y-2">
            <div
                {...getRootProps()}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors min-h-[150px] ${
                    isDragActive ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
                <input {...getInputProps()} />
                {preview ? (
                    <div
                        className="relative w-full aspect-video flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image src={preview} alt="Preview" fill unoptimized className="object-contain rounded"/>
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={removeImage}
                            disabled={isPending}
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <div className="bg-primary/10 p-3 rounded-full">
                            {isPending ? <Loader2 className="h-6 w-6 animate-spin"/> :
                                <ImagePlus className="h-6 w-6 text-primary"/>}
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold text-primary">{t("Common.clickToUpload")}</span>
                            <p className="text-muted-foreground">{t("Common.dragAndDrop")}</p>
                        </div>
                        <p className="text-xs text-muted-foreground/70">
                            {t("Common.imageUploadHint")}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
