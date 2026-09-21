'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Camera, 
  ShieldCheck, 
  Store, 
  Activity, 
  ArrowRight, 
  Sparkles,
  Lock
} from 'lucide-react';

export default function HomePage() {
  const setRoleCookie = (role: string, name: string) => {
    document.cookie = `sih_demo_role=${role}; path=/; max-age=86400`;
    document.cookie = `sih_user_name=${encodeURIComponent(name)}; path=/; max-age=86400`;
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MH ONION • AI Computer Vision • AGMARK/FSSAI Aligned • Direct Farm Trade</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-tight">
            MH ONION: Transparent Quality Grading & Direct Farm-to-Trader Marketplace
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/80 leading-relaxed">
            Eliminate human bias and middleman exploitation across Maharashtra. Capture onion photos on your mobile device to receive an instant, tamper-evident digital quality certificate and sell directly to traders from home.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/farmer/new-lot"
              onClick={() => setRoleCookie('farmer', 'Ramesh Patil (Farmer)')}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Camera className="w-5 h-5" />
              Assess Onion Lot (AI Camera)
            </Link>

            <Link
              href="/marketplace"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur flex items-center gap-2 transition-all"
            >
              <Store className="w-5 h-5 text-amber-400" />
              Browse e-Mandi Market
            </Link>
          </div>
        </div>
      </section>

      {/* Role-Based Portals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Integrated Four-Role Ecosystem
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Built with strict Row-Level Security (RLS) and cryptographic audit logs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Farmer Portal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Farmer Portal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take photo of onion lots with mobile camera, generate instant AGMARK Grade certificates, and list directly for sale at transparent prices from home.
              </p>
            </div>
            <div className="pt-5 border-t border-slate-100 mt-4">
              <Link
                href="/farmer/dashboard"
                onClick={() => setRoleCookie('farmer', 'Ramesh Patil (Farmer)')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>Enter Farmer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Grader Portal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Grader / Inspector</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review automated AI detection bounding boxes, verify defect percentages (Rotten, Sprouted, Damaged), and apply official calibrations with audit records.
              </p>
            </div>
            <div className="pt-5 border-t border-slate-100 mt-4">
              <Link
                href="/grader/dashboard"
                onClick={() => setRoleCookie('grader', 'Dr. Sharma (Quality Officer)')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>Enter Grader Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Buyer / Trader Portal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Trader / Buyer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct procurement from farmers with 100% verified quality reports. Filter Grade A/B lots by region, quantity, and transparent price per kg.
              </p>
            </div>
            <div className="pt-5 border-t border-slate-100 mt-4">
              <Link
                href="/buyer/dashboard"
                onClick={() => setRoleCookie('buyer', 'MahaAgro Traders (Buyer)')}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>Enter Buyer Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Admin & Audit Portal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Central Auditor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tamper-evident audit trail backed by backend service-role exclusive writes. Inspect immutable history of lot creation, detection runs, and overrides.
              </p>
            </div>
            <div className="pt-5 border-t border-slate-100 mt-4">
              <Link
                href="/admin/dashboard"
                onClick={() => setRoleCookie('admin', 'Central Auditor (Admin)')}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>View System Audit Logs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technical Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Defect Detection & Rule Engine
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                AGMARK-Compliant Defect Evaluation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlike opaque black-box classifiers, our system uses fine-tuned Ultralytics YOLO to pinpoint each defect (Rotten, Sprouted, Damaged, Undersized, Healthy) and executes deterministic threshold checking to guarantee reproducible, explainable grade certification.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-emerald-400 font-bold text-lg">≤ 2%</div>
                  <div className="text-[11px] text-slate-400">Rotten (Grade A)</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-emerald-400 font-bold text-lg">≤ 3%</div>
                  <div className="text-[11px] text-slate-400">Sprouted (Grade A)</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-emerald-400 font-bold text-lg">≤ 5%</div>
                  <div className="text-[11px] text-slate-400">Damaged (Grade A)</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-emerald-400 font-bold text-lg">≤ 10%</div>
                  <div className="text-[11px] text-slate-400">Undersize (Grade A)</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Lock className="w-4 h-4" />
                <span>Tamper-Evident Audit Guarantee</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                PostgreSQL Row-Level Security (RLS) strictly blocks client writes to detections and audit logs. All detection metrics and logs are committed exclusively by authenticated backend microservices.
              </p>
              <div className="pt-2">
                <Link
                  href="/farmer/new-lot"
                  onClick={() => setRoleCookie('farmer', 'Ramesh Patil (Farmer)')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Test Live Camera Grading
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
