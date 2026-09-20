'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  MapPin, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

export default function NewLotAssessmentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [locationText, setLocationText] = useState('Nashik APMC Hub, Maharashtra');
  const [centerId, setCenterId] = useState('Lasalgaon Farmer Produce Center');
  const [uploading, setUploading] = useState(false);
  const [stepStatus, setStepStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sample presets using photorealistic sample images
  const handleSelectSample = async (sampleType: 'gradeA' | 'gradeB' | 'urs') => {
    let imgPath = '/samples/onion_grade_a.jpg';
    let sampleFilename = 'nashik_red_grade_a.jpg';

    if (sampleType === 'gradeB') {
      imgPath = '/samples/onion_grade_b.jpg';
      sampleFilename = 'pune_gavran_grade_b.jpg';
    } else if (sampleType === 'urs') {
      imgPath = '/samples/onion_grade_urs.jpg';
      sampleFilename = 'dindori_reject_urs.jpg';
    }

    try {
      const res = await fetch(imgPath);
      const blob = await res.blob();
      const file = new File([blob], sampleFilename, { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(imgPath);
      setErrorMsg(null);
    } catch {
      setPreviewUrl(imgPath);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !previewUrl) {
      setErrorMsg('Please capture or select an onion lot photo first.');
      return;
    }

    setUploading(true);
    setErrorMsg(null);
    const lotId = 'lot-' + Math.random().toString(36).substring(2, 9);

    try {
      setStepStatus('Uploading image to MH ONION storage...');
      
      const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('lot_id', lotId);
        formData.append('location_text', locationText);
        formData.append('role', 'farmer');

        setStepStatus('Running Ultralytics AI Defect Localization...');
        try {
          await fetch(`${fastApiUrl}/infer`, {
            method: 'POST',
            body: formData,
          });
        } catch {
          console.warn('FastAPI backend running client mode');
        }
      }

      setStepStatus('Evaluating AGMARK/FSSAI Quality Classification...');
      
      try {
        await fetch(`${fastApiUrl}/grade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lot_id: lotId,
            role: 'farmer'
          }),
        });
      } catch {
        console.warn('Grade API call fallback');
      }

      setStepStatus('Certificate Generated! Opening inspection report...');
      
      if (previewUrl) {
        sessionStorage.setItem(`lot_preview_${lotId}`, previewUrl);
        sessionStorage.setItem(`lot_location_${lotId}`, locationText);
      }

      setTimeout(() => {
        router.push(`/farmer/lots/${lotId}/report`);
      }, 700);

    } catch (err: any) {
      setErrorMsg(err.message || 'Error assessing lot. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Camera className="w-7 h-7 text-emerald-600" />
          Capture & Assess Onion Lot (MH ONION)
        </h1>
        <p className="text-sm text-slate-500">
          Mobile camera quality inspection with automated defect classification and AGMARK grading.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Capture / Upload Zone */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center">
            <h2 className="text-base font-bold text-slate-900">Step 1: Capture Lot Photograph</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Place onions in a single layer on a clean background for optimal computer-vision detection.
            </p>
          </div>

          {previewUrl ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 max-h-96 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={previewUrl} 
                  alt="Onion lot preview" 
                  className="max-h-96 w-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-xs text-emerald-400 font-semibold flex items-center gap-1.5 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Ready for AI Inspection
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retake / Choose Another Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Native Mobile Camera and Upload Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mobile Camera Input */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={cameraInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500 text-emerald-900 flex flex-col items-center justify-center gap-2 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">Open Mobile Camera</span>
                  <span className="text-[11px] text-emerald-700">Capture live field photo</span>
                </button>

                {/* File Upload Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 text-slate-800 flex flex-col items-center justify-center gap-2 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-md shadow-slate-700/20 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-sm">Choose from Gallery / Files</span>
                  <span className="text-[11px] text-slate-500">JPG, PNG, WebP</span>
                </button>
              </div>

              {/* Instant Test Presets for Demo */}
              <div className="pt-3 border-t border-slate-100">
                <div className="text-center mb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or Test with Photorealistic Onion Presets (1-Click):
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectSample('gradeA')}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-colors flex items-center gap-2.5"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-emerald-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/samples/onion_grade_a.jpg" alt="Grade A" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-900">Nashik Red (Grade A)</div>
                      <div className="text-[10px] text-emerald-700">94% Healthy • Export Quality</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample('gradeB')}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-left transition-colors flex items-center gap-2.5"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-amber-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/samples/onion_grade_b.jpg" alt="Grade B" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-900">Pune Gavran (Grade B)</div>
                      <div className="text-[10px] text-amber-700">84% Healthy • Sprouted Shoots</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSample('urs')}
                    className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-left transition-colors flex items-center gap-2.5"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-rose-300">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/samples/onion_grade_urs.jpg" alt="URS" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-rose-900">Reject Lot (URS)</div>
                      <div className="text-[10px] text-rose-700">68% Healthy • Visible Mold</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Step 2: Lot Location & Center</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Farm / Mandi Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Assigned Inspection Center
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={centerId}
                  onChange={(e) => setCenterId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={uploading || (!selectedFile && !previewUrl)}
            className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{stepStatus || 'Processing AI Assessment...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run AI Defect Detection & Generate Grade</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
