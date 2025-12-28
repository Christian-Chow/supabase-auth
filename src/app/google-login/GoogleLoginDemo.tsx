"use client";

import { getSupabaseBrowserClient } from "../../lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GoogleLoginDemoProps = {
    user: User | null;
}

export function GoogleLoginDemo({ user }: GoogleLoginDemoProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            router.push("/welcome");
        }
    }, [user, router]);

    async function handleGoogleLogin() {
        setError("");
        setLoading(true);

        try {
            const supabase = getSupabaseBrowserClient();
            
            // Get the current origin for the redirect URL
            const redirectTo = `${window.location.origin}/auth/callback`;
            
            const { data, error: signInError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectTo,
                },
            });

            if (signInError) {
                setError(signInError.message);
                console.error('Google sign in error:', signInError);
                setLoading(false);
            } else {
                // The redirect will happen automatically
                // User will be redirected to Google, then back to /auth/callback
                console.log('Redirecting to Google...', data);
            }
        } catch (err: any) {
            const errorMessage = err?.message || "An unexpected error occurred. Please check your environment variables.";
            setError(errorMessage);
            console.error('Unexpected error:', err);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-md w-full p-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Sign in with Google
                        </h1>
                        <p className="text-sm text-gray-500">
                            Use your Google account to sign in or create an account
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? "Connecting..." : "Continue with Google"}
                    </button>

                    {/* Alternative Link */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Or{" "}
                            <a 
                                href="/email-password" 
                                className="text-indigo-600 hover:text-indigo-700 font-semibold"
                            >
                                sign in with email
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
