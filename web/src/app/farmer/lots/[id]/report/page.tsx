'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Award, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Store, 
  Download, 
  ArrowLeft,
  Info,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  CircleAlert,
  HelpCircle,
  Tag
} from 'lucide-react';
import { GradeLabel } from '@/types/database';

export default function LotQualityReportPage() {
  const params = useParams();
  const router = useRouter();
  const lotId = (params?.id as string) || 'lot-nashik-01';

  const [activeVisualMode, setActiveVisualMode] = useState<'pins' | 'clean' | 'table'>('pins');
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [quantityKg, setQuantityKg] = useState('500');
  const [pricePerKg, setPricePerKg] = useState('28.50');
  const [listedSuccess, setListedSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string>('farmer');

  // Realistic sample images
  const [previewImage, setPreviewImage] = useState<string>('/samples/onion_grade_a.jpg');
  const [locationText, setLocationText] = useState<string>('Nashik APMC Hub, Maharashtra');

  // Grade and Defect Metrics
  const [gradeLabel, setGradeLabel] = useState<GradeLabel>('A');
  const [defectMetrics, setDefectMetrics] = useState({
    pct_healthy: 94.0,
    pct_damaged: 2.0,
    pct_rotten: 0.0,
    pct_sprouted: 1.0,
    pct_undersized: 3.0,
    total_count: 48,
    healthy_count: 45,
    defect_count: 3
  });

  // Precise defect pinpoints mapped over real image
  const [defectPins, setDefectPins] = useState<any[]>([
    { id: 1, class: 'sprouted', label: 'Sprouted Neck', confidence: 0.94, x: 48, y: 32, note: 'Early apical shoot (5mm)' },
    { id: 2, class: 'damaged', label: 'Surface Cut', confidence: 0.89, x: 74, y: 46, note: 'Mechanical harvester mark' },
    { id: 3, class: 'undersized', label: 'Undersized (<35mm)', confidence: 0.91, x: 23, y: 66, note: 'Caliber: 31mm' },
  ]);

  useEffect(() => {
    // Read local demo role
    const match = document.cookie.match(new RegExp('(^| )sih_demo_role=([^;]+)'));
    if (match) setUserRole(match[2]);

    const storedImg = sessionStorage.getItem(`lot_preview_${lotId}`);
    if (storedImg) {
      setPreviewImage(storedImg);
    }

    const storedLoc = sessionStorage.getItem(`lot_location_${lotId}`);
    if (storedLoc) setLocationText(storedLoc);

    // Calibrate based on lot type for realistic demo
    if (lotId.includes('gradeB') || lotId.includes('bbbb') || lotId.includes('pune')) {
      setGradeLabel('B');
      if (!storedImg) setPreviewImage('/samples/onion_grade_b.jpg');
      setDefectMetrics({
        pct_healthy: 84.0,
        pct_damaged: 6.0,
        pct_rotten: 3.0,
        pct_sprouted: 4.0,
        pct_undersized: 3.0,
        total_count: 38,
        healthy_count: 32,
        defect_count: 6
      });
      setDefectPins([
        { id: 1, class: 'sprouted', label: 'Top Sprout (12mm)', confidence: 0.96, x: 47, y: 38, note: 'Emerging foliage shoot' },
        { id: 2, class: 'sprouted', label: 'Neck Sprout (10mm)', confidence: 0.93, x: 67, y: 42, note: 'Green shoot growth' },
        { id: 3, class: 'damaged', label: 'Bruised Outer Skin', confidence: 0.90, x: 33, y: 52, note: 'Skin rupture' },
        { id: 4, class: 'rotten', label: 'Neck Rot Spot', confidence: 0.88, x: 76, y: 62, note: 'Localized fungal soft spot' },
      ]);
    } else if (lotId.includes('urs') || lotId.includes('cccc') || lotId.includes('reject')) {
      setGradeLabel('URS');
      if (!storedImg) setPreviewImage('/samples/onion_grade_urs.jpg');
      setDefectMetrics({
        pct_healthy: 68.0,
        pct_damaged: 12.0,
        pct_rotten: 8.0,
        pct_sprouted: 6.0,
        pct_undersized: 6.0,
        total_count: 25,
        healthy_count: 17,
        defect_count: 8
      });
      setDefectPins([
        { id: 1, class: 'rotten', label: 'Severe Mold / Black Rot', confidence: 0.98, x: 35, y: 44, note: 'Aspergillus / soft rot decay' },
        { id: 2, class: 'rotten', label: 'Blue Mold Decay', confidence: 0.96, x: 70, y: 65, note: 'Penicillium decay' },
        { id: 3, class: 'damaged', label: 'Deep Cleave / Split', confidence: 0.92, x: 58, y: 36, note: 'Internal tissue exposed' },
        { id: 4, class: 'rotten', label: 'Rot Spot', confidence: 0.91, x: 22, y: 30, note: 'Soft decay' },
      ]);
    } else {
      setGradeLabel('A');
      if (!storedImg) setPreviewImage('/samples/onion_grade_a.jpg');
    }
  }, [lotId]);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    setListedSuccess(true);
    
    const existing = JSON.parse(localStorage.getItem('sih_custom_listings') || '[]');
    existing.unshift({
      id: 'lst-' + Math.random().toString(36).substring(2, 8),
      lot_id: lotId,
      farmer_name: 'Ramesh Patil (You)',
      location: locationText,
      quantity_kg: parseFloat(quantityKg),
      base_price_per_kg: parseFloat(pricePerKg),
      grade_label: gradeLabel,
      image_url: previewImage,
      created_at: 'Just now'
    });
    localStorage.setItem('sih_custom_listings', JSON.stringify(existing));

    setTimeout(() => {
      setListingModalOpen(false);
      router.push('/marketplace');
    }, 1000);
  };

  const getDefectBadgeColor = (cls: string) => {
    switch (cls) {
      case 'healthy': return 'bg-emerald-500 text-white border-emerald-400 ring-emerald-300';
      case 'damaged': return 'bg-amber-500 text-white border-amber-400 ring-amber-300';
      case 'rotten': return 'bg-rose-600 text-white border-rose-400 ring-rose-300';
      case 'sprouted': return 'bg-purple-600 text-white border-purple-400 ring-purple-300';
      case 'undersized': return 'bg-blue-600 text-white border-blue-400 ring-blue-300';
      default: return 'bg-slate-700 text-white border-slate-500 ring-slate-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/farmer/dashboard"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Digital Quality Certificate
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
              Lot #{lotId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {locationText} • MH ONION AI Inspection System
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Print Certificate
          </button>

          {gradeLabel !== 'URS' && (
            <button
              onClick={() => setListingModalOpen(true)}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Store className="w-4 h-4" />
              List for Sale on e-Mandi
            </button>
          )}
        </div>
      </div>

      {/* Main Certificate Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MH ONION Certified • AGMARK / FSSAI Norms</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Official Quality Classification Report
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Automated computer-vision defect analysis with deterministic rule verification. High-speed defect localization identifying healthy, damaged, rotten, sprouted, and undersized bulbs.
            </p>
          </div>

          {/* Grade Badge */}
          <div className="text-center shrink-0">
            <div className="text-xs uppercase font-bold text-slate-300 mb-1">Assigned Grade</div>
            <div 
              className={`w-28 h-28 rounded-2xl flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                gradeLabel === 'A' 
                  ? 'grade-badge-a' 
                  : gradeLabel === 'B' 
                  ? 'grade-badge-b' 
                  : 'grade-badge-urs'
              }`}
            >
              <Award className="w-8 h-8 mb-0.5" />
              <span className="text-3xl font-black tracking-tight leading-none">
                {gradeLabel === 'URS' ? 'URS' : `Grade ${gradeLabel}`}
              </span>
              <span className="text-[10px] font-bold opacity-90 mt-1">
                {gradeLabel === 'A' ? 'Premium Export' : gradeLabel === 'B' ? 'Domestic Market' : 'Under-Grade'}
              </span>
            </div>
          </div>
        </div>

        {/* Defect Metrics Cards */}
        <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Defect Distribution & Compliance Thresholds
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
              Analyzed: {defectMetrics.total_count} bulbs ({defectMetrics.healthy_count} Healthy, {defectMetrics.defect_count} Defective)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Healthy */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
                <span>Healthy</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">{defectMetrics.pct_healthy}%</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Prime bulb firmness</div>
            </div>

            {/* Rotten */}
            <div className={`p-4 rounded-2xl border shadow-xs ${defectMetrics.pct_rotten > 2.0 ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Rotten</span>
                <span className="text-[10px] text-slate-500">Max: ≤2%</span>
              </div>
              <div className={`text-2xl font-black ${defectMetrics.pct_rotten > 2.0 ? 'text-rose-600' : 'text-slate-800'}`}>
                {defectMetrics.pct_rotten}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Fungal / soft rot decay</div>
            </div>

            {/* Sprouted */}
            <div className={`p-4 rounded-2xl border shadow-xs ${defectMetrics.pct_sprouted > 3.0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Sprouted</span>
                <span className="text-[10px] text-slate-500">Max: ≤3%</span>
              </div>
              <div className={`text-2xl font-black ${defectMetrics.pct_sprouted > 3.0 ? 'text-amber-600' : 'text-slate-800'}`}>
                {defectMetrics.pct_sprouted}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Apical neck shoots</div>
            </div>

            {/* Damaged */}
            <div className={`p-4 rounded-2xl border shadow-xs ${defectMetrics.pct_damaged > 5.0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Damaged</span>
                <span className="text-[10px] text-slate-500">Max: ≤5%</span>
              </div>
              <div className={`text-2xl font-black ${defectMetrics.pct_damaged > 5.0 ? 'text-amber-600' : 'text-slate-800'}`}>
                {defectMetrics.pct_damaged}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Skin cuts & bruises</div>
            </div>

            {/* Undersized */}
            <div className={`p-4 rounded-2xl border shadow-xs ${defectMetrics.pct_undersized > 10.0 ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Undersized</span>
                <span className="text-[10px] text-slate-500">Max: ≤10%</span>
              </div>
              <div className={`text-2xl font-black ${defectMetrics.pct_undersized > 10.0 ? 'text-blue-600' : 'text-slate-800'}`}>
                {defectMetrics.pct_undersized}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">&lt;35mm diameter</div>
            </div>
          </div>

          {/* Reason explanation card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Grading Determination: </strong>
              {gradeLabel === 'A' && (
                <span>All parameters satisfy AGMARK Grade A tolerances. Rotten rate is {defectMetrics.pct_rotten}% (≤2.0% max) and Sprouted rate is {defectMetrics.pct_sprouted}% (≤3.0% max). Suitable for international export and tier-1 wholesale trade.</span>
              )}
              {gradeLabel === 'B' && (
                <span>Classified as Grade B. Moderate defects observed within AGMARK domestic distribution limits. Rotten rate {defectMetrics.pct_rotten}% (≤5.0% max) and Damaged rate {defectMetrics.pct_damaged}% (≤10.0% max).</span>
              )}
              {gradeLabel === 'URS' && (
                <span>Designated Under-Grade / Reject (URS) because defect thresholds exceeded Grade B limits. High rot/decay detected ({defectMetrics.pct_rotten}% vs 5.0% max). Recommended for sorting or industrial dehydration.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Produce Inspection Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              Visual Produce Inspection & Defect Pinpoints
            </h3>
            <p className="text-xs text-slate-500">
              Photorealistic produce scan with pinpointed defect classifications.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveVisualMode('pins')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${activeVisualMode === 'pins' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Defect Pins
            </button>
            <button
              onClick={() => setActiveVisualMode('clean')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${activeVisualMode === 'clean' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Clean Photo
            </button>
            <button
              onClick={() => setActiveVisualMode('table')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${activeVisualMode === 'table' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Defect Log
            </button>
          </div>
        </div>

        {/* Visual Canvas Display */}
        {activeVisualMode !== 'table' ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-4/3 max-h-[500px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-200 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={previewImage} 
                alt="Onion Lot Scan" 
                className="w-full h-full object-cover"
              />

              {/* Defect Pins Overlay */}
              {activeVisualMode === 'pins' && defectPins.map((pin) => (
                <div
                  key={pin.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                >
                  {/* Pulsing ring */}
                  <span className="absolute -inset-2 rounded-full bg-white/40 animate-ping"></span>
                  
                  {/* Marker Pin */}
                  <div className={`relative px-2.5 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-lg border-2 ring-2 transition-transform group-hover:scale-110 ${getDefectBadgeColor(pin.class)}`}>
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span>{pin.label}</span>
                    <span className="opacity-80 text-[10px]">({Math.round(pin.confidence * 100)}%)</span>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 rounded-xl bg-slate-900/95 text-white text-[11px] backdrop-blur shadow-xl border border-slate-700 z-30">
                    <div className="font-bold text-emerald-400 capitalize">{pin.class} Defect</div>
                    <div className="text-slate-300 mt-0.5">{pin.note}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Confidence: {(pin.confidence * 100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}

              {/* Top watermark badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded-xl text-white text-xs font-semibold flex items-center gap-2 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>MH ONION Visual Quality Scan</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-500">Identified Classes:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Healthy (Prime)
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span> Damaged
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span> Rotten
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span> Sprouted
                </span>
              </div>

              <span className="text-[11px] text-slate-400">Hover over any pin to view defect analysis notes</span>
            </div>
          </div>
        ) : (
          /* Defect Log Table */
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Defect Index</th>
                  <th className="p-3.5">Classification</th>
                  <th className="p-3.5">AI Confidence</th>
                  <th className="p-3.5">Morphological Note</th>
                  <th className="p-3.5">AGMARK Tolerance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defectPins.map((pin) => (
                  <tr key={pin.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">Bulb #{pin.id}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${getDefectBadgeColor(pin.class)}`}>
                        {pin.class}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-semibold">{(pin.confidence * 100).toFixed(1)}%</td>
                    <td className="p-3.5 text-slate-600">{pin.note}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Within Tolerance Limit
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Listing Modal for Direct Home Sale */}
      {listingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg">
                <Store className="w-6 h-6 text-emerald-600" />
                <span>List Graded Lot for Sale</span>
              </div>
              <button
                onClick={() => setListingModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Sell your certified Grade {gradeLabel} onion batch directly to wholesale traders on the MH ONION e-Mandi marketplace directly from home.
            </p>

            {listedSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Listing Created on MH ONION e-Mandi!</div>
                <p className="text-xs text-emerald-700">Redirecting to marketplace...</p>
              </div>
            ) : (
              <form onSubmit={handleCreateListing} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Available Quantity (kg)
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    step="10"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Base Asking Price (₹ per kg)
                  </label>
                  <input
                    type="number"
                    required
                    min="5"
                    step="0.50"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-200">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Estimated Total Lot Value:</span>
                    <span className="text-emerald-700 font-bold">
                      ₹{(parseFloat(quantityKg || '0') * parseFloat(pricePerKg || '0')).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Certified Grade {gradeLabel} badge attached to your listing.
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setListingModalOpen(false)}
                    className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-colors"
                  >
                    Publish to e-Mandi
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
