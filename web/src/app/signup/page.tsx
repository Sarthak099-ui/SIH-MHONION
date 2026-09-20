'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, ShieldCheck, Store, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      // Set error message or fallback
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Upsert profile in public.profiles table
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        role: role,
      });

      document.cookie = `sih_demo_role=${role}; path=/; max-age=86400`;
      document.cookie = `sih_user_name=${encodeURIComponent(fullName)}; path=/; max-age=86400`;

      if (role === 'farmer') router.push('/farmer/dashboard');
      else if (role === 'grader') router.push('/grader/dashboard');
      else if (role === 'buyer') router.push('/buyer/dashboard');
      else router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-800 shadow-inner">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create SIH Onion Account</h1>
          <p className="text-sm text-slate-500">Select your role to start grading or direct trading</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
          <form onSubmit={handleSignup} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Select Your Role</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${role === 'farmer' ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 ring-2 ring-emerald-500/20' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold">Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('grader')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${role === 'grader' ? 'border-amber-600 bg-amber-50/80 text-amber-900 ring-2 ring-amber-500/20' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span className="text-xs font-bold">Grader</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${role === 'buyer' ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  <Store className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-bold">Buyer</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name / Org</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ramesh Patil"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : `Register as ${role.toUpperCase()}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link href="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
