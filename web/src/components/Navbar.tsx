'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Sprout, 
  Camera, 
  Store, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Activity
} from 'lucide-react';
import { UserRole } from '@/types/database';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string>('Guest');

  useEffect(() => {
    queueMicrotask(() => {
      // Read local demo role cookie or state
      const match = document.cookie.match(new RegExp('(^| )sih_demo_role=([^;]+)'));
      if (match) {
        setCurrentRole(match[2] as UserRole);
        const nameMatch = document.cookie.match(new RegExp('(^| )sih_user_name=([^;]+)'));
        if (nameMatch) setUserName(decodeURIComponent(nameMatch[2]));
      } else {
        // Default to farmer for instant demo if on farmer routes
        if (pathname.startsWith('/farmer')) setCurrentRole('farmer');
        else if (pathname.startsWith('/grader')) setCurrentRole('grader');
        else if (pathname.startsWith('/buyer')) setCurrentRole('buyer');
        else if (pathname.startsWith('/admin')) setCurrentRole('admin');
      }
    });
  }, [pathname]);

  const handleRoleSwitch = (role: UserRole, name: string) => {
    document.cookie = `sih_demo_role=${role}; path=/; max-age=86400`;
    document.cookie = `sih_user_name=${encodeURIComponent(name)}; path=/; max-age=86400`;
    setCurrentRole(role);
    setUserName(name);
    
    // Redirect to matching portal
    if (role === 'farmer') router.push('/farmer/dashboard');
    else if (role === 'grader') router.push('/grader/dashboard');
    else if (role === 'buyer') router.push('/buyer/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    document.cookie = 'sih_demo_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'sih_user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setCurrentRole(null);
    setUserName('Guest');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                MH ONION <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">AI Quality & Trade</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium leading-none">Maharashtra AGMARK Grading & Direct e-Mandi</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Overview
            </Link>

            {currentRole === 'farmer' && (
              <>
                <Link 
                  href="/farmer/dashboard" 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/farmer/dashboard') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  My Lots
                </Link>
                <Link 
                  href="/farmer/new-lot" 
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  New Assessment
                </Link>
              </>
            )}

            {currentRole === 'grader' && (
              <Link 
                href="/grader/dashboard" 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/grader') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Inspection Queue
              </Link>
            )}

            {currentRole === 'buyer' && (
              <Link 
                href="/buyer/dashboard" 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/buyer') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Store className="w-4 h-4 text-emerald-600" />
                Direct Farm Trade
              </Link>
            )}

            {currentRole === 'admin' && (
              <Link 
                href="/admin/dashboard" 
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith('/admin') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Activity className="w-4 h-4 text-emerald-600" />
                Audit Logs & Analytics
              </Link>
            )}

            <Link 
              href="/marketplace" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/marketplace' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              <Store className="w-4 h-4 text-amber-600" />
              e-Mandi Market
            </Link>
          </nav>

          {/* User & Role Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher for seamless SIH Demo */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase px-2">Role:</span>
              <button
                onClick={() => handleRoleSwitch('farmer', 'Ramesh Patil (Farmer)')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${currentRole === 'farmer' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleSwitch('grader', 'Dr. Sharma (Quality Officer)')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${currentRole === 'grader' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Grader
              </button>
              <button
                onClick={() => handleRoleSwitch('buyer', 'MahaAgro Traders (Buyer)')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${currentRole === 'buyer' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Buyer
              </button>
              <button
                onClick={() => handleRoleSwitch('admin', 'Central Auditor (Admin)')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${currentRole === 'admin' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Admin
              </button>
            </div>

            {currentRole ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{userName}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold uppercase">{currentRole}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {/* Quick Role Switcher Mobile */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Select Demo Role:</div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleRoleSwitch('farmer', 'Ramesh Patil (Farmer)')}
                className={`py-1.5 text-xs font-semibold rounded-lg border text-center ${currentRole === 'farmer' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                Farmer
              </button>
              <button
                onClick={() => handleRoleSwitch('grader', 'Dr. Sharma (Quality Officer)')}
                className={`py-1.5 text-xs font-semibold rounded-lg border text-center ${currentRole === 'grader' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                Grader
              </button>
              <button
                onClick={() => handleRoleSwitch('buyer', 'MahaAgro Traders (Buyer)')}
                className={`py-1.5 text-xs font-semibold rounded-lg border text-center ${currentRole === 'buyer' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                Buyer
              </button>
              <button
                onClick={() => handleRoleSwitch('admin', 'Central Auditor (Admin)')}
                className={`py-1.5 text-xs font-semibold rounded-lg border text-center ${currentRole === 'admin' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'}`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home Overview
            </Link>
            <Link
              href="/farmer/new-lot"
              onClick={() => { handleRoleSwitch('farmer', 'Ramesh Patil (Farmer)'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50"
            >
              📸 Capture Onion Lot (AI Grade)
            </Link>
            <Link
              href="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-700 bg-amber-50"
            >
              🏪 e-Mandi Market (Trade from Home)
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => { handleRoleSwitch('admin', 'Central Auditor (Admin)'); setMobileMenuOpen(false); }}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              🔒 Tamper-Evident Audit Trail
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
