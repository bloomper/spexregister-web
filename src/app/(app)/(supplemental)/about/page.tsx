import {connection} from "next/server";
import {AboutPage} from "@/components/about-page.client";

/**
 * About Spexregister, with the address for feedback.
 */
export default async function Page() {
    await connection();

    return <AboutPage feedbackEmail={process.env.FEEDBACK_EMAIL ?? ""}/>;
}
