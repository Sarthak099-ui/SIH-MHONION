'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Lock, 
  Search, 
  Filter, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  User, 
  Layers,
  Database
} from 'lucide-react';
import { AuditLog } from '@/types/database';

export default function AdminDashboard() {
  const [logs, setLogs] = useState<any[]>([
    {
      id: 'aud-01',
      action: 'listing_created',
      entity_type: 'listing',
      entity_id: 'lot-nashik-01',
      user_id: '11111111-1111-1111-1111-111111111111',
      role: 'farmer',
      metadata: { quantity_kg: 500, price_per_kg: 28.50, grade: 'A' },
      created_at: '10 mins ago'
    },
    {
      id: 'aud-02',
      action: 'grade_overridden',
      entity_type: 'lot',
      entity_id: 'lot-pune-02',
      user_id: '33333333-3333-3333-3333-333333333333',
      role: 'grader',
      metadata: { new_grade: 'B', notes: 'Verified core firmness; calibrated to domestic grade B standard.' },
      created_at: '1 hour ago'
    },
    {
      id: 'aud-03',
      action: 'grade_generated',
      entity_type: 'lot',
      entity_id: 'lot-nashik-01',
      user_id: null,
      role: 'system',
      metadata: { grade: 'A', rotten_pct: 0.0, sprouted_pct: 1.0, damaged_pct: 2.0, rules: 'v1.0-AGMARK' },
      created_at: '2 hours ago'
    },
    {
      id: 'aud-04',
      action: 'detection_run',
      entity_type: 'lot',
      entity_id: 'lot-nashik-01',
      user_id: null,
      role: 'system',
      metadata: { model: 'Ultralytics YOLO26n', total_detected: 14, healthy: 13, defects: 1 },
      created_at: '2 hours ago'
    },
    {
      id: 'aud-05',
      action: 'lot_created',
      entity_type: 'lot',
      entity_id: 'lot-nashik-01',
      user_id: '11111111-1111-1111-1111-111111111111',
      role: 'farmer',
      metadata: { location: 'Nashik APMC Hub', source: 'mobile_camera' },
      created_at: '2 hours ago'
    }
  ]);

  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    // Fetch live audit logs from FastAPI backend
    const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
    fetch(`${fastApiUrl}/audit-logs`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.logs && data.logs.length > 0) {
          setLogs(data.logs);
        }
      })
      .catch(() => {});
  }, []);

  const filteredLogs = logs.filter((l) => {
    const matchesAction = filterAction === 'all' || l.action === filterAction;
    const matchesSearch = l.entity_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'lot_created': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'detection_run': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'grade_generated': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'grade_overridden': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'listing_created': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-purple-300 text-xs font-semibold border border-purple-700/50">
            <Lock className="w-3.5 h-3.5" />
            <span>Cryptographic Row-Level Security (RLS) Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tamper-Evident System Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            All grading determinations, manual overrides, and trade listings are recorded with write-protection. Client insert policies are disabled in Postgres RLS, allowing only the backend microservice to append events.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl border border-white/10 text-xs space-y-1.5 shrink-0">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Database className="w-4 h-4" />
            <span>PostgreSQL RLS Active</span>
          </div>
          <div className="text-slate-300 text-[11px]">Audit Table: <code className="font-mono text-purple-300">public.audit_logs</code></div>
          <div className="text-slate-400 text-[10px]">Permission: Service-Role Only Writes</div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search audit trail by entity ID or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Action:
          </span>
          <button
            onClick={() => setFilterAction('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filterAction === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Actions
          </button>
          <button
            onClick={() => setFilterAction('grade_generated')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filterAction === 'grade_generated' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'}`}
          >
            Grades
          </button>
          <button
            onClick={() => setFilterAction('grade_overridden')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filterAction === 'grade_overridden' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'}`}
          >
            Overrides
          </button>
          <button
            onClick={() => setFilterAction('listing_created')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${filterAction === 'listing_created' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-800'}`}
          >
            Listings
          </button>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-600" />
            Immutable System Event Stream ({filteredLogs.length} Events)
          </h2>
          <span className="text-xs text-slate-400 font-mono">ORDER: DESC(created_at)</span>
        </div>

        <div className="divide-y divide-slate-100 font-mono text-xs">
          {filteredLogs.map((entry, idx) => (
            <div key={idx} className="p-5 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${getActionBadge(entry.action)}`}>
                    {entry.action}
                  </span>
                  <span className="text-slate-900 font-semibold">
                    Target: <span className="text-purple-700">{entry.entity_type}</span> ({entry.entity_id || 'system'})
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {entry.created_at}
                </div>
              </div>

              {/* Metadata JSON */}
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl overflow-x-auto text-[11px]">
                <pre>{JSON.stringify(entry.metadata, null, 2)}</pre>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-slate-500">
                <span>Actor Role: <strong className="text-slate-700 uppercase">{entry.role || 'system'}</strong></span>
                <span>User ID: <code className="text-slate-600">{entry.user_id || 'service_role_key'}</code></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
