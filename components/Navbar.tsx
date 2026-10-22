'use client';

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
  ShieldCheck
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', telugu: 'డాష్‌బోర్డ్', icon: LayoutDashboard },
  { href: '/voters', label: 'Voters', telugu: 'ఓటర్లు', icon: Users },
  { href: '/double-voters', label: 'Audit & Duplicates', telugu: 'డబుల్ ఓటర్లు', icon: UserX },
  { href: '/search', label: 'Search', telugu: 'శోధన', icon: Search },
  { href: '/areas', label: 'Areas', telugu: 'ప్రాంతాలు', icon: MapPin },
  { href: '/households', label: 'Households', telugu: 'ఇంటి నెంబర్లు', icon: Home },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Ward Badge */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">KADIRI WARD 08</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                  APSEC 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-telugu">కదిరి పురపాలక సంఘం • 8వ వార్డు</p>
            </div>
          </Link>

          {/* Navigation Links */}
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
                      : 'text-slate-650 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Export Action */}
          <div className="flex items-center space-x-2">
            <a
              href="/api/export?type=FULL_DIRECTORY"
              download="Kadiri_Ward08_Full_Electoral_Roll.csv"
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span>Export CSV</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-2 py-1 text-xs font-medium ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
