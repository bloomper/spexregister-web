"use client";

import {useTranslations} from "next-intl";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.client";
import {Card, CardContent} from "@/components/ui/card";
import {Drama, Mail, User} from "lucide-react";
import {useMemo} from "react";
import {useIsClient} from "@/hooks/use-is-client";

function fnv1a32(input: string): number {
    let hash = 0x811c9dc5;

    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return hash >>> 0;
}

function robohashFromSeed(seedInput: string, size = 200): string {
    const seed = fnv1a32(seedInput).toString(16);
    return `https://robohash.org/${seed}.png?size=${size}x${size}&set=set2`;
}

const contributorData = [
    {
        name: "Anders Jacobsson",
        nickName: "Colgate",
        image: "https://avatars.githubusercontent.com/u/150366?v=4",
    },
    {
        name: "Fredrik Bonde",
        nickName: "Faxe",
        image: "https://fgv.nu/wp-content/uploads/2019/09/Faxe.jpg",
    },
    {
        name: "Emil Kultje",
        nickName: "Kakel",
        image: robohashFromSeed("Emil Kultje|Kakel"),
    }
];

export default function AboutPage() {
    const t = useTranslations("About");

    const isClient = useIsClient();
    const contributors = useMemo(
        () => [...contributorData].sort((a, b) => fnv1a32(a.name) - fnv1a32(b.name)),
        []
    );
    const feedbackEmail = process.env.NEXT_PUBLIC_FEEDBACK_EMAIL!;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height))] py-12 px-4">
            <div className="w-full max-w-3xl space-y-16 text-center">

                <section className="space-y-4">
                    <div
                        className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                        <Drama className="size-10"/>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        {t("title")}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </section>

                <section className="space-y-8">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-primary/70">
                        {t("behindTheScenes")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left min-h-[100px]">
                        {isClient && contributors.map((person) => (
                            <Card key={person.name}
                                  className="overflow-hidden border-none bg-sidebar/50 backdrop-blur-sm transition-all hover:bg-sidebar group">
                                <CardContent className="p-6 flex items-center gap-5">
                                    <Avatar
                                        className="size-16 border-2 border-primary/20 transition-transform group-hover:scale-110">
                                        <AvatarImage src={person.image} alt={person.name} className="object-cover"/>
                                        <AvatarFallback
                                            className="bg-linear-to-br from-primary/20 to-primary/5 text-primary">
                                            <User className="size-8 opacity-40"/>
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <div className="flex flex-col">
                                            <span
                                                className="text-xs font-black uppercase text-primary tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
                                                {person.nickName}
                                            </span>
                                            <span className="text-lg font-semibold leading-tight">
                                                {person.name}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section
                    className="relative overflow-hidden rounded-3xl bg-primary px-8 py-10 text-primary-foreground shadow-xl">
                    <div className="relative z-10 space-y-4">
                        <div
                            className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-foreground/20">
                            <Mail className="size-6"/>
                        </div>
                        <h2 className="text-2xl font-bold">{t("feedback")}</h2>
                        <p className="max-w-md mx-auto opacity-90" suppressHydrationWarning>
                            {t("feedbackDescription", {email: feedbackEmail})}
                        </p>
                        {isClient ? (
                            <a
                                href={`mailto:${feedbackEmail}`}
                                className="inline-flex h-10 items-center justify-center rounded-full bg-primary-foreground px-6 text-sm font-medium text-primary transition-colors hover:bg-primary-foreground/90"
                            >
                                {t("feedbackAction")}
                            </a>
                        ) : (
                            <div className="h-10 w-32 mx-auto bg-primary-foreground/20 animate-pulse rounded-full"/>
                        )}
                    </div>
                    <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-3xl"/>
                    <div className="absolute -left-10 -bottom-10 size-40 rounded-full bg-black/10 blur-3xl"/>
                </section>
            </div>
        </div>
    );
}
