import {connection} from "next/server";
import {SupportPage} from "@/components/support-page.client";

/**
 * How to get help with Spexregister, with the address for support.
 */
export default async function Page() {
    await connection();

    return <SupportPage supportEmail={process.env.SUPPORT_EMAIL ?? ""}/>;
}
