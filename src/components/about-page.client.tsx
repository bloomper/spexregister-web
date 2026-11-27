"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@bloomper/fgv-web-ui/ui/avatar";
import { Card, CardContent } from "@bloomper/fgv-web-ui/ui/card";
import { Drama, Mail, User } from "lucide-react";
import { useMemo } from "react";
import { useIsClient } from "@bloomper/fgv-web-ui/hooks/use-is-client";

function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

const contributorData = [
  {
    name: "Anders Jacobsson",
    nickName: "Colgate",
    image: "https://gravatar.com/avatar/5e07c325b41e9551493953c3b6eb37b71d93141c3bad22556487cd9a3989510b?s=200",
  },
  {
    name: "Fredrik Bonde",
    nickName: "Faxe",
    image: "https://fgv.nu/wp-content/uploads/2019/09/Faxe.jpg",
  },
  {
    name: "Alexander Nilsson",
    nickName: "Minnet",
    image:
      "https://lh3.googleusercontent.com/a-/ALV-UjValcmsFsvTq4pj9PtCJ2xgSmmo0Cg58_47JeygCwq84CzEiGg=s480-p-k-rw-no",
  },
  {
    name: "Emil Reinfeldt",
    nickName: "Ministern",
    image: "https://gravatar.com/avatar/ea11d8104bc579a900cdd80be8457a8c47c3fd4e87de9eb02bf0a35666c6ddf3?s=200",
  },
];

export function AboutPage({ feedbackEmail }: { feedbackEmail: string }) {
  const t = useTranslations("About");

  const isClient = useIsClient();
  const contributors = useMemo(() => [...contributorData].sort((a, b) => fnv1a32(a.name) - fnv1a32(b.name)), []);

  return (
    <div className="flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-16 text-center">
        <section className="space-y-4">
          <div className="bg-primary/10 text-link mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
            <Drama className="size-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{t("heading")}</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">{t("description")}</p>
        </section>

        <section className="space-y-8">
          <h2 className="text-link/70 text-2xl font-bold tracking-widest uppercase">{t("behindTheScenes")}</h2>
          <div className="grid min-h-25 grid-cols-1 gap-6 text-left sm:grid-cols-2">
            {isClient &&
              contributors.map((person) => (
                <Card
                  key={person.name}
                  className="bg-sidebar/50 hover:bg-sidebar group overflow-hidden border-none backdrop-blur-sm transition-all"
                >
                  <CardContent className="flex items-center gap-5 p-6">
                    <Avatar className="border-primary/20 size-16 border-2 transition-transform group-hover:scale-110">
                      <AvatarImage
                        src={person.image}
                        alt={person.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="from-primary/20 to-primary/5 text-link bg-linear-to-br">
                        <User className="size-8 opacity-40" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex flex-col">
                        {person.nickName && (
                          <span className="text-link text-xs font-black tracking-widest uppercase opacity-70 transition-opacity group-hover:opacity-100">
                            {person.nickName}
                          </span>
                        )}
                        <span className="text-lg leading-tight font-semibold">{person.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-8 py-10 shadow-xl">
          <div className="relative z-10 space-y-4">
            <div className="bg-primary-foreground/20 mx-auto flex size-12 items-center justify-center rounded-full">
              <Mail className="size-6" />
            </div>
            <h2 className="text-2xl font-bold">{t("feedback")}</h2>
            <p
              className="mx-auto max-w-md opacity-90"
              suppressHydrationWarning
            >
              {t("feedbackDescription", { email: feedbackEmail })}
            </p>
            {isClient ? (
              <a
                href={`mailto:${feedbackEmail}`}
                className="bg-primary-foreground text-link hover:bg-primary-foreground/90 inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors"
              >
                {t("feedbackAction")}
              </a>
            ) : (
              <div className="bg-primary-foreground/20 mx-auto h-10 w-32 animate-pulse rounded-full" />
            )}
          </div>
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-black/10 blur-3xl" />
        </section>
      </div>
    </div>
  );
}
