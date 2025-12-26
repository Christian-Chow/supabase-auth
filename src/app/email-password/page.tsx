import { EmailPasswordDemo } from "./EmailPasswordDemo";
import { createServerClient } from "../../lib/supabase/server-client";



export default async function EmailPasswordPage() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();


    console.log({user});
  return <EmailPasswordDemo user={null} />;
}