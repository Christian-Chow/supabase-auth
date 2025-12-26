import {createServerClient as createSupabaseServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';

function getEnvironmentVariable() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing environment variables');
    }

    return {
        supabaseUrl,
        supabaseAnonKey,
    }
}

export async function createServerClient() {
    const {supabaseUrl, supabaseAnonKey} = getEnvironmentVariable();
    const cookieStore = await cookies();

    return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                }
                catch(error) {
                    console.log(error);
                }
            }
        }
    });
}