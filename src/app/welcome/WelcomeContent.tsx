"use client";

import { getSupabaseBrowserClient } from "../../lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

type WelcomeContentProps = {
    user: User;
}

export function WelcomeContent({ user }: WelcomeContentProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSignOut() {
        setLoading(true);
        try {
            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                console.error('Sign out error:', error);
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            console.error('Unexpected error during sign out:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-md w-full p-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <svg 
                                className="w-8 h-8 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M5 13l4 4L19 7" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome Back!
                        </h1>
                        <p className="text-sm text-gray-500 mb-4">
                            You have successfully signed in
                        </p>
                        <div className="inline-block px-4 py-2 bg-indigo-50 rounded-lg">
                            <p className="text-sm font-semibold text-indigo-700">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase">
                                    User ID
                                </span>
                                <span className="text-xs text-gray-700 font-mono">
                                    {user.id.slice(0, 8)}...
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-gray-500 uppercase">
                                    Last Sign In
                                </span>
                                <span className="text-xs text-gray-700">
                                    {user.last_sign_in_at 
                                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sign Out Button */}
                    <button
                        onClick={handleSignOut}
                        disabled={loading}
                        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? "Signing out..." : "Sign Out"}
                    </button>
                </div>
            </div>
        </div>
    );
}

