"use client";

import { getSupabaseBrowserClient } from "../../lib/supabase/browser-client"
import { User } from "@supabase/supabase-js"
import {useState} from "react";
import { useRouter } from "next/navigation";

type EmailPasswordDemoProps = {
  user: User | null;
}

type Mode = "signup" | "signin"


export function EmailPasswordDemo({ user }: EmailPasswordDemoProps) {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setStatus("");
        setLoading(true);
        
        try {
            const supabase = getSupabaseBrowserClient();
            
            if (mode === "signup") {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                
                if (signUpError) {
                    setError(signUpError.message);
                    console.error('Sign up error:', signUpError);
                } else {
                    setStatus("Sign up successful! Please check your email to verify your account.");
                    console.log('Sign up successful:', data);
                }
            } else {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                
                if (signInError) {
                    setError(signInError.message);
                    console.error('Sign in error:', signInError);
                } else {
                    setStatus("Sign in successful!");
                    console.log('Sign in successful:', data);
                    // Navigate to welcome page after successful sign-in
                    router.push("/welcome");
                    router.refresh();
                }
            }
        } catch (err: any) {
            const errorMessage = err?.message || "An unexpected error occurred. Please check your environment variables.";
            setError(errorMessage);
            console.error('Unexpected error:', err);
        } finally {
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
                            Welcome Back
                        </h1>
                        <p className="text-sm text-gray-500">
                            {mode === "signin" ? "Sign in to your account" : "Create a new account"}
                        </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex gap-2 mb-8 bg-gray-50 p-1.5 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setMode("signin")}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                mode === "signin"
                                    ? "bg-white text-indigo-600 shadow-md"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("signup")}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                mode === "signup"
                                    ? "bg-white text-indigo-600 shadow-md"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {status && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">{status}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                                required
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}