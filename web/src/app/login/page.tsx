'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Store, Shield } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserRole } from '@/types/database';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const performLoginRedirect = (role: UserRole, name: string) => {
    document.cookie = `sih_demo_role=${role}; path=/; max-age=86400`;
    document.cookie = `sih_user_name=${encodeURIComponent(name)}; path=/; max-age=86400`;

    if (role === 'farmer') router.push('/farmer/dashboard');
    else if (role === 'grader') router.push('/grader/dashboard');
    else if (role === 'buyer') router.push('/buyer/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
    else router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try real Supabase auth if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', data.user.id)
            .single();

          const role = (profile?.role as UserRole) || 'farmer';
          const name = profile?.full_name || cleanEmail.split('@')[0];
          performLoginRedirect(role, name);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local authentication engine
      }
    }

    // 2. Intelligent Local / Demo Authentication Fallback
    try {
      // Check if user previously registered in this browser
      let resolvedRole: UserRole = 'farmer';
      let resolvedName = cleanEmail.split('@')[0];

      const storedUsersRaw = localStorage.getItem('sih_registered_users');
      if (storedUsersRaw) {
        const storedUsers = JSON.parse(storedUsersRaw);
        if (storedUsers[cleanEmail]) {
          resolvedRole = storedUsers[cleanEmail].role;
          resolvedName = storedUsers[cleanEmail].fullName || resolvedName;
        }
      }

      // If no stored role, detect from email keywords
      if (!storedUsersRaw || !JSON.parse(storedUsersRaw)[cleanEmail]) {
        if (cleanEmail.includes('grader') || cleanEmail.includes('quality') || cleanEmail.includes('officer')) {
          resolvedRole = 'grader';
          resolvedName = 'Dr. Sharma (Quality Officer)';
        } else if (cleanEmail.includes('buyer') || cleanEmail.includes('trader') || cleanEmail.includes('mandi')) {
          resolvedRole = 'buyer';
          resolvedName = 'MahaAgro Traders (Buyer)';
        } else if (cleanEmail.includes('admin') || cleanEmail.includes('audit')) {
          resolvedRole = 'admin';
          resolvedName = 'Central APMC Auditor';
        } else {
          resolvedRole = 'farmer';
          resolvedName = cleanEmail.includes('farmer') ? 'Ramesh Patil (Farmer)' : resolvedName;
        }
      }

      performLoginRedirect(resolvedRole, resolvedName);
    } catch {
      performLoginRedirect('farmer', cleanEmail || 'Farmer User');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: UserRole, name: string, sampleEmail: string) => {
    setEmail(sampleEmail);
    setPassword('password123');
    performLoginRedirect(role, name);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 shadow-inner">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to MH ONION</h1>
          <p className="text-sm text-slate-500">AI Quality Inspection & Direct Farm-to-Trader Marketplace</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="farmer@sih.agri"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Instant Access */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-center mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Instant Demo Access (1-Click)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer', 'Ramesh Patil (Farmer)', 'farmer@sih.agri')}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-colors text-left"
              >
                <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div>Farmer Portal</div>
                  <div className="text-[10px] text-emerald-600 font-normal">farmer@sih.agri</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('grader', 'Dr. Sharma (Quality Officer)', 'grader@sih.agri')}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors text-left"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div>Grader Portal</div>
                  <div className="text-[10px] text-amber-600 font-normal">grader@sih.agri</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer', 'MahaAgro Traders (Buyer)', 'buyer@sih.agri')}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-900 text-xs font-semibold transition-colors text-left"
              >
                <Store className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div>Buyer / Trader</div>
                  <div className="text-[10px] text-blue-600 font-normal">buyer@sih.agri</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin', 'Central Auditor (Admin)', 'admin@sih.agri')}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-purple-900 text-xs font-semibold transition-colors text-left"
              >
                <Shield className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <div>Admin / Audit</div>
                  <div className="text-[10px] text-purple-600 font-normal">admin@sih.agri</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Create an account with role
          </Link>
        </p>
      </div>
    </div>
  );
}
