'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Sprout, 
  Award, 
  MapPin, 
  Plus, 
  ChevronRight
} from 'lucide-react';
import { LotStatus, GradeLabel } from '@/types/database';

interface SampleLot {
  id: string;
  name: string;
  location: string;
  quantity_kg: number;
  status: LotStatus;
  grade_label?: GradeLabel;
  pct_healthy?: number;
  asking_price?: number;
  created_at: string;
}

export default function FarmerDashboard() {
  const [lots] = useState<SampleLot[]>([
    {
      id: 'lot-nashik-01',
      name: 'Nashik Red Onion (Winter Crop)',
      location: 'Nashik APMC Hub, Maharashtra',
      quantity_kg: 500,
      status: 'listed',
      grade_label: 'A',
      pct_healthy: 94.0,
      asking_price: 28.50,
      created_at: '2 hours ago'
    },
    {
      id: 'lot-pune-02',
      name: 'Pune Gavran Onion Lot',
      location: 'Lasalgaon Yard, Nashik',
      quantity_kg: 1200,
      status: 'listed',
      grade_label: 'B',
      pct_healthy: 84.0,
      asking_price: 21.00,
      created_at: 'Yesterday'
    },
    {
      id: 'lot-urs-03',
      name: 'Dindori Reject / High Defect Sample',
      location: 'Dindori Farm Hub',
      quantity_kg: 300,
      status: 'graded',
      grade_label: 'URS',
      pct_healthy: 68.0,
      created_at: '3 days ago'
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5" />
            <span>Farmer Direct Quality Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, Ramesh Patil
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Assess onion quality with your smartphone camera, obtain verified AGMARK digital certificates, and sell directly to wholesale buyers without mandi middlemen.
          </p>
        </div>

        <Link
          href="/farmer/new-lot"
          className="px-5 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-400/20 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <Camera className="w-5 h-5" />
          <span>New AI Quality Assessment</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Graded Lots</div>
          <div className="text-2xl font-black text-slate-900 mt-1">3 Lots</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">100% Inspected via AI</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Grade A Certified</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">500 kg</div>
          <div className="text-[11px] text-slate-500 mt-1">Export Quality Standard</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Active Direct Listings</div>
          <div className="text-2xl font-black text-amber-600 mt-1">1,700 kg</div>
          <div className="text-[11px] text-slate-500 mt-1">Visible to 24+ Wholesale Traders</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Est. Value (Direct Home Sale)</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹39,450</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+18% vs Traditional Middlemen</div>
        </div>
      </div>

      {/* Lots Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Onion Batches & Quality Reports</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any lot to inspect bounding boxes and defect certificates.</p>
          </div>
          <Link
            href="/farmer/new-lot"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Lot
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {lots.map((lot) => (
            <Link
              key={lot.id}
              href={`/farmer/lots/${lot.id}/report`}
              className="p-5 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div 
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold ${
                    lot.grade_label === 'A' 
                      ? 'grade-badge-a' 
                      : lot.grade_label === 'B' 
                      ? 'grade-badge-b' 
                      : 'grade-badge-urs'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span className="text-xs leading-none mt-0.5">{lot.grade_label}</span>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                    {lot.name}
                  </div>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lot.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{lot.quantity_kg} kg</span>
                    <span>•</span>
                    <span className="text-slate-400">{lot.created_at}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <div className="text-right">
                  {lot.asking_price ? (
                    <>
                      <div className="text-sm font-extrabold text-emerald-700">₹{lot.asking_price}/kg</div>
                      <div className="text-[10px] text-slate-500">Listed on e-Mandi</div>
                    </>
                  ) : (
                    <div className="text-xs font-semibold text-slate-500">Graded (Unlisted)</div>
                  )}
                </div>

                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-emerald-100 group-hover:text-emerald-800 text-slate-400 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
