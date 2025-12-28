import { createServerClient } from "../../../lib/supabase/server-client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const supabase = await createServerClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to welcome page after successful authentication
    return NextResponse.redirect(new URL("/welcome", requestUrl.origin));
}

