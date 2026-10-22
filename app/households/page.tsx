'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getHouseholds, getLocalities } from '@/lib/data';
import { 
  Home, 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

const ITEMS_PER_PAGE = 36;

export default function HouseholdsPage() {
  const households = getHouseholds();
  const localities = getLocalities();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHouseholds = useMemo(() => {
    let result = households;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(h =>
        h.house_number.toLowerCase().includes(q) ||
        h.locality_name.toLowerCase().includes(q) ||
        h.voters.some(v => 
          v.voter_name_english.toLowerCase().includes(q) || 
          v.voter_name_original.toLowerCase().includes(q)
        )
      );
    }

    if (selectedLocality !== 'ALL') {
      result = result.filter(h => h.locality_id === selectedLocality);
    }

    return result;
  }, [households, searchTerm, selectedLocality]);

  const totalPages = Math.ceil(filteredHouseholds.length / ITEMS_PER_PAGE) || 1;
  const paginatedHouseholds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHouseholds.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredHouseholds, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Family & Household Explorer (గృహాల జాబితా)
          </h1>
          <p className="text-xs text-slate-500 font-telugu mt-0.5">
            కదిరి 8వ వార్డు పరిధిలోని 1,021 కుటుంబాలు • అత్యధిక ఓటర్ల ఆధారంగా అమర్చబడినవి
          </p>
        </div>

        <div className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
          Total Households: {households.length.toLocaleString()}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search door number (e.g. 1-1124-4, 1-1102-10) or family member..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        <div>
          <select
            value={selectedLocality}
            onChange={(e) => {
              setSelectedLocality(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          >
            <option value="ALL">All Localities</option>
            {localities.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name_en} ({loc.households_count} doors)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {filteredHouseholds.length} households (ranked by voter density)</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Households Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedHouseholds.map((h, idx) => (
          <Link
            key={h.house_number}
            href={`/houses/${h.house_id}`}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {h.house_number}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {h.voter_count} Voters
                </span>
              </div>

              <div className="flex items-center text-xs text-slate-500 font-telugu mb-3">
                <MapPin className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                <span className="truncate">{h.locality_name}</span>
              </div>

              {/* Sample names in household */}
              <div className="border-t border-slate-100 pt-2 space-y-1">
                {h.voters.slice(0, 3).map((v) => (
                  <div key={v.id} className="text-xs text-slate-700 truncate font-telugu">
                    • {v.voter_name_original}{' '}
                    <span className="text-[10px] text-slate-400">({v.age}y, {v.gender === 'MALE' ? 'M' : 'F'})</span>
                  </div>
                ))}
                {h.voter_count > 3 && (
                  <div className="text-[11px] text-emerald-700 font-semibold pt-0.5">
                    +{h.voter_count - 3} more family members
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{h.male_count} M • {h.female_count} F</span>
              <span className="text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center">
                Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-600 font-medium">
            Page <span className="font-bold text-slate-900">{currentPage}</span> of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
