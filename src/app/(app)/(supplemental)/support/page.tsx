import {connection} from "next/server";
import {SupportPage} from "@/components/support-page.client";

export default async function Page() {
    await connection();

    return <SupportPage supportEmail={process.env.SUPPORT_EMAIL ?? ""}/>;
}
