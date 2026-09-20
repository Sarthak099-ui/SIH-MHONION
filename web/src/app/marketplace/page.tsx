'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Store, 
  Award, 
  MapPin, 
  Filter, 
  Search, 
  ShieldCheck, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { GradeLabel } from '@/types/database';

interface MarketplaceListing {
  id: string;
  lot_id: string;
  farmer_name: string;
  location: string;
  quantity_kg: number;
  base_price_per_kg: number;
  grade_label: GradeLabel;
  pct_healthy?: number;
  created_at: string;
}

export default function MarketplacePage() {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeModalListing, setTradeModalListing] = useState<MarketplaceListing | null>(null);
  const [tradeSuccess, setTradeSuccess] = useState(false);

  // Default seeded listings + local farmer creations
  const [listings, setListings] = useState<MarketplaceListing[]>([
    {
      id: 'lst-01',
      lot_id: 'lot-nashik-01',
      farmer_name: 'Ramesh Patil (Nashik)',
      location: 'Nashik APMC, Maharashtra',
      quantity_kg: 500,
      base_price_per_kg: 28.50,
      grade_label: 'A',
      pct_healthy: 94.0,
      created_at: '2 hours ago'
    },
    {
      id: 'lst-02',
      lot_id: 'lot-pune-02',
      farmer_name: 'Suresh Deshmukh (Lasalgaon)',
      location: 'Lasalgaon Mandi, Nashik',
      quantity_kg: 1200,
      base_price_per_kg: 21.00,
      grade_label: 'B',
      pct_healthy: 84.0,
      created_at: 'Yesterday'
    },
    {
      id: 'lst-03',
      lot_id: 'lot-solapur-03',
      farmer_name: 'Balasaheb Shinde (Solapur)',
      location: 'Mohol Farm Hub, Solapur',
      quantity_kg: 2500,
      base_price_per_kg: 27.00,
      grade_label: 'A',
      pct_healthy: 93.2,
      created_at: '1 day ago'
    }
  ]);

  useEffect(() => {
    // Check if user created custom listings in browser
    const stored = localStorage.getItem('sih_custom_listings');
    if (stored) {
      try {
        const custom = JSON.parse(stored);
        setListings((prev) => [...custom, ...prev]);
      } catch {}
    }
  }, []);

  const filteredListings = listings.filter((item) => {
    const matchesGrade = selectedGrade === 'all' || item.grade_label === selectedGrade;
    const matchesSearch = item.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeSuccess(true);
    setTimeout(() => {
      setTradeSuccess(false);
      setTradeModalListing(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Marketplace Header */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/50 text-amber-200 text-xs font-semibold">
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span>Direct Farm-to-Trader e-Mandi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Certified Onion Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-xl">
            Trade directly from the farmer&apos;s home. Every lot comes with an AI-verified AGMARK digital quality certificate and transparent pricing.
          </p>
        </div>

        <Link
          href="/farmer/new-lot"
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Farmers: List Graded Lot</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by farmer name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
        </div>

        {/* Grade Filter Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Grade:
          </span>
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${selectedGrade === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All Grades
          </button>
          <button
            onClick={() => setSelectedGrade('A')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${selectedGrade === 'A' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
          >
            Grade A (Export)
          </button>
          <button
            onClick={() => setSelectedGrade('B')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${selectedGrade === 'B' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'}`}
          >
            Grade B (Domestic)
          </button>
        </div>
      </div>

      {/* Marketplace Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <span 
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase flex items-center gap-1.5 ${
                    item.grade_label === 'A' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  Grade {item.grade_label} Certified
                </span>

                <span className="text-[11px] text-slate-400 font-medium">{item.created_at}</span>
              </div>

              {/* Title & Farmer */}
              <div>
                <h3 className="font-bold text-base text-slate-900">{item.farmer_name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {item.location}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Available Lot:</span>
                  <div className="font-extrabold text-slate-900 text-sm mt-0.5">{item.quantity_kg.toLocaleString()} kg</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Price per kg:</span>
                  <div className="font-extrabold text-emerald-700 text-sm mt-0.5">₹{item.base_price_per_kg.toFixed(2)}/kg</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified AGMARK Certificate Attached</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <Link
                href={`/farmer/lots/${item.lot_id}/report`}
                className="w-1/2 py-2.5 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Certificate</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
              <button
                onClick={() => setTradeModalListing(item)}
                className="w-1/2 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Trade Directly</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Direct Trade Modal */}
      {tradeModalListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <ShoppingBag className="w-6 h-6 text-amber-600" />
                <span>Direct Home Trade Procurement</span>
              </div>
              <button
                onClick={() => setTradeModalListing(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {tradeSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="font-bold text-sm">Purchase Request Sent Directly to Farmer!</div>
                <p className="text-xs text-emerald-700">The farmer will be notified to confirm dispatch from farm yard.</p>
              </div>
            ) : (
              <form onSubmit={handleTradeSubmit} className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Seller / Farmer:</span>
                    <span className="font-bold text-slate-900">{tradeModalListing.farmer_name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Certified Grade:</span>
                    <span className="font-bold text-emerald-700">Grade {tradeModalListing.grade_label}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total Lot Volume:</span>
                    <span className="font-bold text-slate-900">{tradeModalListing.quantity_kg} kg</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
                    <span className="font-semibold text-slate-700">Total Valuation:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      ₹{(tradeModalListing.quantity_kg * tradeModalListing.base_price_per_kg).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Your Trader / Buyer Organization
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="MahaAgro Wholesale Exports Pvt Ltd"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Contact Phone Number (for Farmer direct dispatch)
                  </label>
                  <input
                    type="tel"
                    required
                    defaultValue="+91 98234 56789"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTradeModalListing(null)}
                    className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-colors"
                  >
                    Confirm Direct Trade
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
