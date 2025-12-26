'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-lg w-full space-y-6 p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Choose Authentication Method
          </h1>
          <p className="text-sm text-gray-500">
            Select how you would like to sign in
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email/Password Auth */}
          <Link
            href="/email-password"
            className="group relative block p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-indigo-400 hover:-translate-y-0.5"
          >
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Email & Password
              </h3>
              <p className="text-xs text-gray-500">
                Sign in with email
              </p>
            </div>
          </Link>

          {/* Other Auth Method */}
          <Link
            href="/oauth"
            className="group relative block p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-indigo-400 hover:-translate-y-0.5"
          >
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                OAuth / Social
              </h3>
              <p className="text-xs text-gray-500">
                Sign in with social
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
