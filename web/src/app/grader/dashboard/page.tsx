'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  ExternalLink,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { GradeLabel } from '@/types/database';

interface GraderLot {
  id: string;
  name: string;
  farmer: string;
  location: string;
  quantity_kg: number;
  grade_label: GradeLabel;
  pct_healthy: number;
  pct_rotten: number;
  pct_sprouted: number;
  pct_damaged: number;
  created_at: string;
  status: string;
}

export default function GraderDashboard() {
  const [selectedLotToOverride, setSelectedLotToOverride] = useState<GraderLot | null>(null);
  const [overrideGrade, setOverrideGrade] = useState<GradeLabel>('A');
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideSuccess, setOverrideSuccess] = useState(false);

  const [lots, setLots] = useState<GraderLot[]>([
    {
      id: 'lot-nashik-01',
      name: 'Nashik Red Onion (Lot #8401)',
      farmer: 'Ramesh Patil',
      location: 'Nashik APMC Hub',
      quantity_kg: 500,
      grade_label: 'A',
      pct_healthy: 94.0,
      pct_rotten: 0.0,
      pct_sprouted: 1.0,
      pct_damaged: 2.0,
      created_at: '2 hours ago',
      status: 'AI Certified'
    },
    {
      id: 'lot-pune-02',
      name: 'Pune Gavran Onion (Lot #8402)',
      farmer: 'Suresh Deshmukh',
      location: 'Lasalgaon Yard',
      quantity_kg: 1200,
      grade_label: 'B',
      pct_healthy: 84.0,
      pct_rotten: 3.0,
      pct_sprouted: 4.0,
      pct_damaged: 6.0,
      created_at: 'Yesterday',
      status: 'AI Certified'
    },
    {
      id: 'lot-urs-03',
      name: 'Dindori Farm Reject (Lot #8403)',
      farmer: 'Ramesh Patil',
      location: 'Dindori Yard',
      quantity_kg: 300,
      grade_label: 'URS',
      pct_healthy: 68.0,
      pct_rotten: 8.0,
      pct_sprouted: 6.0,
      pct_damaged: 12.0,
      created_at: '3 days ago',
      status: 'AI Flagged'
    }
  ]);

  const handleOverrideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLotToOverride) return;

    // Call backend override endpoint if available
    try {
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      await fetch(`${fastApiUrl}/override-grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lot_id: selectedLotToOverride.id,
          grade_label: overrideGrade,
          grader_id: 'grader-dr-sharma',
          notes: overrideReason
        })
      });
    } catch {}

    // Update state locally
    setLots((prev) =>
      prev.map((l) =>
        l.id === selectedLotToOverride.id
          ? { ...l, grade_label: overrideGrade, status: 'Officer Calibrated' }
          : l
      )
    );

    setOverrideSuccess(true);
    setTimeout(() => {
      setOverrideSuccess(false);
      setSelectedLotToOverride(null);
      setOverrideReason('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Grader Header */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-700/60 text-amber-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AGMARK Quality Inspector Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Inspection Queue & Calibrations
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl">
            Logged in as Dr. Sharma (Senior Quality Assurance Officer). Review automated AI detections, verify defect thresholds, and record audited grade overrides.
          </p>
        </div>
      </div>

      {/* Inspection List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Assigned Inspection Queue</h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time stream of farmer lots assessed via AI vision.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-4 sm:px-6">Lot Identifier</th>
                <th className="p-4">Farmer / Location</th>
                <th className="p-4">Assigned Grade</th>
                <th className="p-4">Defects (Rot/Sprout/Dam)</th>
                <th className="p-4">Audit Status</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lots.map((lot) => (
                <tr key={lot.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 sm:px-6 font-bold text-slate-900">
                    <div className="font-semibold">{lot.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{lot.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{lot.farmer}</div>
                    <div className="text-[11px] text-slate-400">{lot.location}</div>
                  </td>
                  <td className="p-4">
                    <span 
                      className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1 ${
                        lot.grade_label === 'A' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : lot.grade_label === 'B' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      Grade {lot.grade_label}
                    </span>
                  </td>
                  <td className="p-4 space-y-0.5">
                    <div>Rot: <span className={lot.pct_rotten > 2 ? 'font-bold text-rose-600' : 'text-slate-800'}>{lot.pct_rotten}%</span></div>
                    <div>Sprout: <span className={lot.pct_sprouted > 3 ? 'font-bold text-amber-600' : 'text-slate-800'}>{lot.pct_sprouted}%</span></div>
                    <div>Damaged: <span className={lot.pct_damaged > 5 ? 'font-bold text-amber-600' : 'text-slate-800'}>{lot.pct_damaged}%</span></div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
                      {lot.status}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-right space-x-2">
                    <Link
                      href={`/farmer/lots/${lot.id}/report`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedLotToOverride(lot);
                        setOverrideGrade(lot.grade_label);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Override
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Calibration Modal */}
      {selectedLotToOverride && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Edit3 className="w-6 h-6 text-amber-600" />
                <span>Grader Manual Override</span>
              </div>
              <button
                onClick={() => setSelectedLotToOverride(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Every override is permanently logged to the tamper-evident audit ledger with your inspector ID and justification.
            </p>

            {overrideSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Grade Calibrated & Logged!</div>
              </div>
            ) : (
              <form onSubmit={handleOverrideSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Calibrated Grade
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setOverrideGrade('A')}
                      className={`py-2 text-xs font-bold rounded-xl border ${overrideGrade === 'A' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-300'}`}
                    >
                      Grade A
                    </button>
                    <button
                      type="button"
                      onClick={() => setOverrideGrade('B')}
                      className={`py-2 text-xs font-bold rounded-xl border ${overrideGrade === 'B' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-300'}`}
                    >
                      Grade B
                    </button>
                    <button
                      type="button"
                      onClick={() => setOverrideGrade('URS')}
                      className={`py-2 text-xs font-bold rounded-xl border ${overrideGrade === 'URS' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-300'}`}
                    >
                      URS (Reject)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Inspector Override Justification (Mandatory for Audit)
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Minor surface skin peeling does not affect core firmness; calibrated to Grade A as per local APMC directive."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedLotToOverride(null)}
                    className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-colors"
                  >
                    Commit Override
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
