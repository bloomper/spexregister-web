"use client";

import { useTranslations } from "next-intl";
import { Mail, Wrench } from "lucide-react";
import { useIsClient } from "@bloomper/fgv-web-ui/hooks/use-is-client";

export function SupportPage({ supportEmail }: { supportEmail: string }) {
  const t = useTranslations("Support");
  const isClient = useIsClient();

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-16 text-center">
        <section className="space-y-4">
          <div className="bg-primary/10 text-link mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
            <Wrench className="size-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t("heading")}</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">{t("description")}</p>
        </section>

        <section className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-8 py-10 shadow-xl">
          <div className="relative z-10 space-y-4">
            <div className="bg-primary-foreground/20 mx-auto flex size-12 items-center justify-center rounded-full">
              <Mail className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">{t("contact")}</h2>
            <p
              className="mx-auto max-w-md opacity-90"
              suppressHydrationWarning
            >
              {t("contactDescription", { email: supportEmail })}
            </p>
            {isClient ? (
              <a
                href={`mailto:${supportEmail}`}
                className="bg-primary-foreground text-link hover:bg-primary-foreground/90 inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors"
              >
                {t("contactAction")}
              </a>
            ) : (
              <div className="bg-primary-foreground/20 mx-auto h-10 w-48 animate-pulse rounded-full" />
            )}
          </div>
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-black/10 blur-3xl" />
        </section>
      </div>
    </div>
  );
}
