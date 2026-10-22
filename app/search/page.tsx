'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getVoters, getHouseholds, getLocalities, getSearchAliases } from '@/lib/data';
import VoterCard from '@/components/VoterCard';
import { 
  Search, 
  Users, 
  Home, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Filter
} from 'lucide-react';

export default function SearchEnginePage() {
  const voters = getVoters();
  const households = getHouseholds();
  const localities = getLocalities();
  const aliases = getSearchAliases();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'voters' | 'households' | 'localities'>('voters');

  // Transliteration suggestions
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const list: { text: string; label: string }[] = [];

    // Check common terms
    if (q.includes('shaik') || q.includes('sheik')) list.push({ text: 'షేక్', label: 'Telugu for Shaik' });
    if (q.includes('reddy') || q.includes('reddi')) list.push({ text: 'రెడ్డి', label: 'Telugu for Reddy' });
    if (q.includes('pathan') || q.includes('patan')) list.push({ text: 'పఠాన్', label: 'Telugu for Pathan' });
    if (q.includes('basha') || q.includes('baasha')) list.push({ text: 'బాషా', label: 'Telugu for Basha' });
    if (q.includes('adapala')) list.push({ text: 'అడపాల స్ట్రీట్', label: 'Adapala Street' });
    if (q.includes('water') || q.includes('tank')) list.push({ text: 'వాటర్ ట్యాంక్ రోడ్డు', label: 'Water Tank Road' });
    if (q.includes('rs') || q.includes('road')) list.push({ text: 'ఆర్ ఎస్ రోడ్డు', label: 'RS Road' });
    if (q.includes('rajiv') || q.includes('nagar')) list.push({ text: 'రాజీవ్ గాంధీ నగర్', label: 'Rajiv Gandhi Nagar' });

    return list;
  }, [query]);

  // Search Results
  const matchedVoters = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return voters.filter(v =>
      v.voter_name_original.toLowerCase().includes(q) ||
      v.voter_name_english.toLowerCase().includes(q) ||
      v.epic_number.toLowerCase().includes(q) ||
      v.house_number_original.toLowerCase().includes(q) ||
      v.house_number_normalized.toLowerCase().includes(q) ||
      String(v.ward_serial_number) === q ||
      v.relation_name_original.toLowerCase().includes(q) ||
      v.relation_name_english.toLowerCase().includes(q)
    );
  }, [voters, query]);

  const matchedHouseholds = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return households.filter(h =>
      h.house_number.toLowerCase().includes(q) ||
      h.locality_name.toLowerCase().includes(q) ||
      h.voters.some(v => 
        v.voter_name_english.toLowerCase().includes(q) || 
        v.voter_name_original.toLowerCase().includes(q)
      )
    );
  }, [households, query]);

  const matchedLocalities = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return localities.filter(l =>
      l.name_en.toLowerCase().includes(q) ||
      l.name_te.toLowerCase().includes(q) ||
      l.display_name.toLowerCase().includes(q)
    );
  }, [localities, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Unified Search & Transliteration Engine
        </h1>
        <p className="text-xs text-slate-500 font-telugu mt-0.5">
          కదిరి 8వ వార్డు సమగ్ర శోధన • ఓటర్లు, కుటుంబాలు మరియు ప్రాంతముల తక్షణ శోధన
        </p>
      </div>

      {/* Search Input Box with Suggestions */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Telugu name, English name, EPIC number, Door, or Serial..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:border-emerald-500 shadow-sm"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-4 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Query Transliteration Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-bold flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
              Telugu Transliteration:
            </span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuery(s.text)}
                className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-telugu font-semibold hover:bg-emerald-100 transition-colors"
              >
                {s.text} <span className="text-[10px] text-emerald-600">({s.label})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      {query.trim() && (
        <div className="border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('voters')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center space-x-1.5 border-b-2 transition-all ${
                activeTab === 'voters'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Voters ({matchedVoters.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('households')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center space-x-1.5 border-b-2 transition-all ${
                activeTab === 'households'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Households ({matchedHouseholds.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('localities')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center space-x-1.5 border-b-2 transition-all ${
                activeTab === 'localities'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Areas ({matchedLocalities.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {!query.trim() ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Start typing to search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Search 2,013 electors by Telugu or English name, EPIC number, door number, or ward serial number.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 max-w-md mx-auto">
            {['శ్రీరాములు', 'Shaik', '1-1124-4', 'RRV1832922', 'పుల్లప్ప', 'Pathan'].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
              >
                &ldquo;{example}&rdquo;
              </button>
            ))}
          </div>
        </div>
      ) : activeTab === 'voters' ? (
        <div>
          {matchedVoters.length === 0 ? (
            <p className="text-center py-12 text-xs text-slate-500">No voters found matching &ldquo;{query}&rdquo;.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchedVoters.slice(0, 60).map((voter) => (
                <VoterCard key={voter.id} voter={voter} />
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'households' ? (
        <div>
          {matchedHouseholds.length === 0 ? (
            <p className="text-center py-12 text-xs text-slate-500">No households found matching &ldquo;{query}&rdquo;.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {matchedHouseholds.map((h) => (
                <Link
                  key={h.house_number}
                  href={`/houses/${h.house_id}`}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-base font-bold text-slate-900 group-hover:text-emerald-700">
                      {h.house_number}
                    </span>
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      {h.voter_count} Voters
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-telugu truncate">{h.locality_name}</p>
                  <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
                    <span>{h.male_count} M • {h.female_count} F</span>
                    <span className="text-emerald-600 font-bold">Inspect &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {matchedLocalities.length === 0 ? (
            <p className="text-center py-12 text-xs text-slate-500">No canonical areas matched &ldquo;{query}&rdquo;.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedLocalities.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/areas/${loc.id}`}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all"
                >
                  <h4 className="text-lg font-bold text-slate-900 font-telugu">{loc.name_te}</h4>
                  <p className="text-xs text-slate-500 uppercase">{loc.name_en}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-700 font-semibold border-t border-slate-100 pt-3">
                    <span>{loc.total_voters} Total Electors</span>
                    <span>{loc.male_voters} Male • {loc.female_voters} Female</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
