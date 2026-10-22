'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserX, 
  Search, 
  MapPin, 
  Home, 
  Download, 
  Vote,
  ShieldCheck,
  Menu,
  X,
  FileCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', shortLabel: 'Dashboard', telugu: 'డాష్‌బోర్డ్', icon: LayoutDashboard },
  { href: '/voters', label: 'Voters (2,013)', shortLabel: 'Voters', telugu: 'ఓటర్లు', icon: Users },
  { href: '/double-voters', label: 'Audit & Duplicates', shortLabel: 'Audit', telugu: 'డబుల్ ఓటర్లు', icon: UserX },
  { href: '/search', label: 'Search', shortLabel: 'Search', telugu: 'శోధన', icon: Search },
  { href: '/areas', label: 'Areas (4)', shortLabel: 'Areas', telugu: 'ప్రాంతాలు', icon: MapPin },
  { href: '/households', label: 'Households (1,021)', shortLabel: 'Doors', telugu: 'గృహాలు', icon: Home },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Top Brand Header Row */}
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Logo & Title */}
            <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3 min-w-0 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0 group-hover:scale-105 transition-transform">
                <Vote className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base lg:text-lg whitespace-nowrap">
                    KADIRI WARD 08
                  </span>
                  <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
                    APSEC 2026
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 font-telugu truncate">
                  కదిరి పురపాలక సంఘం • 8వ వార్డు
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
              <a
                href="/api/export?type=FULL_DIRECTORY"
                download="Kadiri_Ward08_Full_Electoral_Roll.csv"
                className="inline-flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-colors"
                title="Export Full Electoral Roll CSV"
              >
                <Download className="w-3.5 h-3.5 sm:mr-1.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden text-[11px]">CSV</span>
              </a>

              {/* Mobile Drawer Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Pill Scroll Bar */}
          <div className="md:hidden border-t border-slate-100 py-2">
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-0.5 -mx-1 px-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.shortLabel}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-lg px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Kadiri Ward 08 Menu
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                2,013 Electors
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-telugu truncate">{item.telugu}</div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions in Mobile Drawer */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <a
                href="/api/export?type=FULL_DIRECTORY"
                download="Kadiri_Ward08_Full_Electoral_Roll.csv"
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Full Ward CSV (2,013 Voters)</span>
              </a>

              <a
                href="https://voters.eci.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>National Voters Service (ECI Portal)</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
