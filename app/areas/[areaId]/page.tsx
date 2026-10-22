import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocalities, getLocalityById, getVoters, getHouseholds } from '@/lib/data';
import VoterCard from '@/components/VoterCard';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Home, 
  Download, 
  Layers, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export function generateStaticParams() {
  const localities = getLocalities();
  return localities.map((loc) => ({
    areaId: loc.id,
  }));
}

interface PageProps {
  params: {
    areaId: string;
  };
}

export default function AreaDetailPage({ params }: PageProps) {
  const locality = getLocalityById(params.areaId);

  if (!locality) {
    notFound();
  }

  const allVoters = getVoters();
  const areaVoters = allVoters.filter((v) => v.locality_id === locality.id);
  const areaHouseholds = getHouseholds().filter((h) => h.locality_id === locality.id);

  // Age group breakdown
  const age18_25 = areaVoters.filter((v) => v.age >= 18 && v.age <= 25).length;
  const age26_35 = areaVoters.filter((v) => v.age >= 26 && v.age <= 35).length;
  const age36_50 = areaVoters.filter((v) => v.age >= 36 && v.age <= 50).length;
  const age51_65 = areaVoters.filter((v) => v.age >= 51 && v.age <= 65).length;
  const age65Plus = areaVoters.filter((v) => v.age > 65).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        href="/areas"
        className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span>Back to All Localities</span>
      </Link>

      {/* Area Dossier Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                CANONICAL LOCALITY
              </span>
              <span className="text-xs font-semibold text-slate-500">Kadiri Ward 08</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 font-telugu">
              {locality.name_te}
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
              {locality.name_en}
            </p>
          </div>

          <a
            href={`/api/export?type=AREA_WISE&locality=${locality.id}`}
            download={`${locality.id}_voters.csv`}
            className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all shrink-0"
          >
            <Download className="w-4 h-4 mr-1.5 text-emerald-400" />
            <span>Export Area CSV ({locality.total_voters})</span>
          </a>
        </div>

        {/* Demographics & Invariants Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Voters</span>
            <span className="text-2xl font-black text-slate-900">{locality.total_voters}</span>
            <span className="block text-[11px] text-slate-500 mt-1 font-telugu">మొత్తం ఓటర్లు</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Male Electors</span>
            <span className="text-2xl font-black text-blue-600">{locality.male_voters}</span>
            <span className="block text-[11px] text-slate-500 mt-1 font-mono">
              {((locality.male_voters / locality.total_voters) * 100).toFixed(1)}% Male
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Female Electors</span>
            <span className="text-2xl font-black text-pink-600">{locality.female_voters}</span>
            <span className="block text-[11px] text-slate-500 mt-1 font-mono">
              {((locality.female_voters / locality.total_voters) * 100).toFixed(1)}% Female
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Households</span>
            <span className="text-2xl font-black text-emerald-700">{locality.households_count}</span>
            <span className="block text-[11px] text-slate-500 mt-1 font-telugu">ఇంటి సంఖ్యలు</span>
          </div>
        </div>

        {/* Age Demographics Bar */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 block uppercase">
            Age Group Distribution
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">18-25 Yrs (Youth)</span>
              <span className="font-extrabold text-slate-800">{age18_25}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">26-35 Yrs</span>
              <span className="font-extrabold text-slate-800">{age26_35}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">36-50 Yrs</span>
              <span className="font-extrabold text-slate-800">{age36_50}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">51-65 Yrs</span>
              <span className="font-extrabold text-slate-800">{age51_65}</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-200">
              <span className="text-slate-400 text-[10px] block">65+ Yrs (Seniors)</span>
              <span className="font-extrabold text-slate-800">{age65Plus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Door Roster in this Locality */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            Door Roster in {locality.name_en} ({areaHouseholds.length} Doors)
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Sorted by voter density</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {areaHouseholds.map((h) => (
            <Link
              key={h.house_number}
              href={`/houses/${h.house_id}`}
              className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-center hover:bg-emerald-50 hover:border-emerald-300 transition-colors group"
            >
              <span className="font-mono font-bold text-xs text-slate-800 group-hover:text-emerald-700 block truncate">
                {h.house_number}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {h.voter_count} voters
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Voter List in this Locality */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Enrolled Electors in {locality.name_en} ({areaVoters.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {areaVoters.map((voter) => (
            <VoterCard key={voter.id} voter={voter} />
          ))}
        </div>
      </div>
    </div>
  );
}
