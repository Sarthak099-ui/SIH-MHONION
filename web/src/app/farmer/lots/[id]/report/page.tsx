'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Award, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Store, 
  Share2, 
  Download, 
  ArrowLeft,
  Info,
  Calendar,
  Eye,
  Sliders,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { GradeLabel, DefectClass } from '@/types/database';

export default function LotQualityReportPage() {
  const params = useParams();
  const router = useRouter();
  const lotId = (params?.id as string) || 'sample-lot';

  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [quantityKg, setQuantityKg] = useState('500');
  const [pricePerKg, setPricePerKg] = useState('28.50');
  const [listedSuccess, setListedSuccess] = useState(false);
  const [userRole, setUserRole] = useState<string>('farmer');

  // Load preview or state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [locationText, setLocationText] = useState<string>('Nashik APMC Hub, Maharashtra');

  // Simulated / backend returned metrics
  const [gradeLabel, setGradeLabel] = useState<GradeLabel>('A');
  const [defectMetrics, setDefectMetrics] = useState({
    pct_healthy: 92.5,
    pct_damaged: 3.5,
    pct_rotten: 1.0,
    pct_sprouted: 1.5,
    pct_undersized: 1.5,
    total_count: 14
  });

  const [detections, setDetections] = useState<any[]>([
    { class: 'healthy', confidence: 0.96, bbox: { x: 0.15, y: 0.18, width: 0.18, height: 0.18 } },
    { class: 'healthy', confidence: 0.94, bbox: { x: 0.42, y: 0.16, width: 0.17, height: 0.17 } },
    { class: 'healthy', confidence: 0.95, bbox: { x: 0.68, y: 0.20, width: 0.19, height: 0.19 } },
    { class: 'healthy', confidence: 0.93, bbox: { x: 0.18, y: 0.48, width: 0.17, height: 0.17 } },
    { class: 'damaged', confidence: 0.89, bbox: { x: 0.44, y: 0.46, width: 0.18, height: 0.18 } },
    { class: 'healthy', confidence: 0.97, bbox: { x: 0.69, y: 0.49, width: 0.16, height: 0.16 } },
    { class: 'sprouted', confidence: 0.88, bbox: { x: 0.32, y: 0.72, width: 0.16, height: 0.16 } },
    { class: 'healthy', confidence: 0.92, bbox: { x: 0.56, y: 0.73, width: 0.17, height: 0.17 } },
  ]);

  useEffect(() => {
    // Read local demo role
    const match = document.cookie.match(new RegExp('(^| )sih_demo_role=([^;]+)'));
    if (match) setUserRole(match[2]);

    const storedImg = sessionStorage.getItem(`lot_preview_${lotId}`);
    if (storedImg) setPreviewImage(storedImg);

    const storedLoc = sessionStorage.getItem(`lot_location_${lotId}`);
    if (storedLoc) setLocationText(storedLoc);

    // If ID contains specific tags, calibrate for realistic visual demo
    if (lotId.includes('gradeB') || lotId.includes('bbbb')) {
      setGradeLabel('B');
      setDefectMetrics({
        pct_healthy: 84.0,
        pct_damaged: 6.0,
        pct_rotten: 3.0,
        pct_sprouted: 4.0,
        pct_undersized: 3.0,
        total_count: 15
      });
    } else if (lotId.includes('urs') || lotId.includes('cccc')) {
      setGradeLabel('URS');
      setDefectMetrics({
        pct_healthy: 68.0,
        pct_damaged: 12.0,
        pct_rotten: 8.0,
        pct_sprouted: 6.0,
        pct_undersized: 6.0,
        total_count: 16
      });
    }
  }, [lotId]);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setListedSuccess(true);
    
    // Save to local listings registry for seamless marketplace display
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
    }, 1200);
  };

  const getClassBadgeColor = (cls: string) => {
    switch (cls) {
      case 'healthy': return 'bg-emerald-500/90 text-white border-emerald-400';
      case 'damaged': return 'bg-amber-500/90 text-white border-amber-400';
      case 'rotten': return 'bg-rose-600/90 text-white border-rose-400';
      case 'sprouted': return 'bg-purple-600/90 text-white border-purple-400';
      case 'undersized': return 'bg-blue-500/90 text-white border-blue-400';
      default: return 'bg-slate-700/90 text-white border-slate-500';
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
              ID: {lotId.substring(0, 8)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {locationText} • Inspected via AI Computer Vision
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
              <span>Certified Standard: AGMARK / FSSAI Rule Engine v1.0</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Official Quality Classification Report
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Automated multi-defect assessment performed using fine-tuned Ultralytics YOLO26/11 vision model. Cryptographically logged to tamper-evident audit ledger.
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

        {/* Defect Metrics Bar Breakdown */}
        <div className="p-6 sm:p-8 bg-slate-50/50 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Defect Distribution & Compliance Limits</span>
            <span className="text-xs font-normal text-slate-500">Sample Count: {defectMetrics.total_count} onions</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Healthy */}
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
                <span>Healthy</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-600">{defectMetrics.pct_healthy}%</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Prime bulb quality</div>
            </div>

            {/* Rotten */}
            <div className={`p-3.5 rounded-2xl border shadow-xs ${defectMetrics.pct_rotten > 2.0 ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Rotten</span>
                <span className="text-[10px] text-slate-500">Limit: ≤2%</span>
              </div>
              <div className={`text-2xl font-extrabold ${defectMetrics.pct_rotten > 2.0 ? 'text-rose-600' : 'text-slate-800'}`}>
                {defectMetrics.pct_rotten}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Fungal / rot decay</div>
            </div>

            {/* Sprouted */}
            <div className={`p-3.5 rounded-2xl border shadow-xs ${defectMetrics.pct_sprouted > 3.0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Sprouted</span>
                <span className="text-[10px] text-slate-500">Limit: ≤3%</span>
              </div>
              <div className={`text-2xl font-extrabold ${defectMetrics.pct_sprouted > 3.0 ? 'text-amber-600' : 'text-slate-800'}`}>
                {defectMetrics.pct_sprouted}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Neck / top shoots</div>
            </div>

            {/* Damaged */}
            <div className={`p-3.5 rounded-2xl border shadow-xs ${defectMetrics.pct_damaged > 5.0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Damaged</span>
                <span className="text-[10px] text-slate-500">Limit: ≤5%</span>
              </div>
              <div className={`text-2xl font-extrabold ${defectMetrics.pct_damaged > 5.0 ? 'text-amber-600' : 'text-slate-800'}`}>
                {defectMetrics.pct_damaged}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Bruises / cuts</div>
            </div>

            {/* Undersized */}
            <div className={`p-3.5 rounded-2xl border shadow-xs ${defectMetrics.pct_undersized > 10.0 ? 'bg-amber-50 border-amber-300' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                <span>Undersized</span>
                <span className="text-[10px] text-slate-500">Limit: ≤10%</span>
              </div>
              <div className={`text-2xl font-extrabold ${defectMetrics.pct_undersized > 10.0 ? 'text-blue-600' : 'text-slate-800'}`}>
                {defectMetrics.pct_undersized}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">&lt;35mm diameter</div>
            </div>
          </div>

          {/* Reason explanation card */}
          <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Grading Determination Reason: </strong>
              {gradeLabel === 'A' && (
                <span>All critical defect parameters satisfy AGMARK Grade A tolerances. Rotten rate is {defectMetrics.pct_rotten}% (≤2.0% max) and Sprouted rate is {defectMetrics.pct_sprouted}% (≤3.0% max). Suitable for international export and tier-1 retail procurement.</span>
              )}
              {gradeLabel === 'B' && (
                <span>Classified as Grade B. Moderate defects observed within AGMARK domestic distribution limits. Rotten rate {defectMetrics.pct_rotten}% (≤5.0% max) and Damaged rate {defectMetrics.pct_damaged}% (≤10.0% max).</span>
              )}
              {gradeLabel === 'URS' && (
                <span>Designated Under-Grade / Reject (URS) because defect thresholds exceeded Grade B limits. High rot/decay detected ({defectMetrics.pct_rotten}% vs 5.0% maximum). Recommended for industrial processing or sorting.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Bounding Box Analysis View */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              AI Visual Defect Localization (YOLO26/11)
            </h3>
            <p className="text-xs text-slate-500">
              Interactive bounding boxes identify each onion bulb and classify specific defect anomalies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${showBoundingBoxes ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {showBoundingBoxes ? 'Hide Bounding Boxes' : 'Show Bounding Boxes'}
            </button>
          </div>
        </div>

        {/* Visual Canvas Container */}
        <div className="relative w-full aspect-4/3 max-h-[520px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
          {previewImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={previewImage} 
              alt="Analyzed Onion Lot" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center text-slate-400 space-y-2 p-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-emerald-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-sm font-semibold text-slate-200">AI Analyzed Onion Batch</div>
              <div className="text-xs text-slate-400 max-w-sm">
                8-16 individual bulbs processed with YOLO defect masks and normalized coordinate mapping.
              </div>
            </div>
          )}

          {/* Render Interactive Bounding Boxes */}
          {showBoundingBoxes && detections.map((det, idx) => (
            <div
              key={idx}
              className={`absolute border-2 rounded-lg transition-all duration-300 pointer-events-auto group cursor-pointer ${
                det.class === 'healthy' 
                  ? 'border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/25' 
                  : det.class === 'damaged'
                  ? 'border-amber-400 bg-amber-500/15 hover:bg-amber-500/30'
                  : det.class === 'rotten'
                  ? 'border-rose-500 bg-rose-500/20 hover:bg-rose-500/35'
                  : 'border-purple-400 bg-purple-500/15 hover:bg-purple-500/30'
              }`}
              style={{
                left: `${det.bbox.x * 100}%`,
                top: `${det.bbox.y * 100}%`,
                width: `${det.bbox.width * 100}%`,
                height: `${det.bbox.height * 100}%`,
              }}
            >
              <div className={`absolute -top-6 left-0 text-[10px] font-bold px-1.5 py-0.5 rounded border shadow-sm uppercase whitespace-nowrap ${getClassBadgeColor(det.class)}`}>
                {det.class} ({Math.round(det.confidence * 100)}%)
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-bold text-slate-500">Legend:</span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Healthy
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Damaged
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Rotten
          </span>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Sprouted
          </span>
        </div>
      </div>

      {/* Listing Modal for Direct Sale to Traders */}
      {listingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg">
                <Store className="w-6 h-6" />
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
              Sell your certified Grade {gradeLabel} onion batch directly to registered traders on the e-Mandi marketplace directly from your home.
            </p>

            {listedSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Listing Created Successfully!</div>
                <p className="text-xs text-emerald-700">Redirecting to e-Mandi marketplace...</p>
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
                    Verified Digital Certificate will be attached to your listing.
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
                    Publish to Mandi
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
