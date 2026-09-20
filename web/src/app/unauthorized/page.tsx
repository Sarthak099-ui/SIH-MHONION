'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-rose-100 text-rose-600">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Restricted</h1>
        <p className="text-sm text-slate-600">
          Your current account role does not have permission to view this section. Use the top bar to switch roles or return to your designated portal.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/farmer/dashboard"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
