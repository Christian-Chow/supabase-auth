import { GoogleLoginDemo } from "./GoogleLoginDemo";
import { createServerClient } from "../../lib/supabase/server-client";
import { redirect } from "next/navigation";

export default async function GoogleLoginPage() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If user is already logged in, redirect to welcome page
    if (user) {
        redirect("/welcome");
    }

    return <GoogleLoginDemo user={user} />;
}
