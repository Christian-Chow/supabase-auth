import { createServerClient } from "../../lib/supabase/server-client";
import { redirect } from "next/navigation";
import { WelcomeContent } from "./WelcomeContent";

export default async function WelcomePage() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/email-password");
    }

    return <WelcomeContent user={user} />;
}

