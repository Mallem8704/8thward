import React from 'react';
import Link from 'next/link';
import { getLocalities, getVoters } from '@/lib/data';
import { MapPin, Users, Home, Layers, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Canonical Areas & Localities | Kadiri Ward 08',
  description: 'The 4 canonical localities of Ward 8, Kadiri Municipality: Adapala Street, Water Tank Road, RS Road, and Rajiv Gandhi Nagar.',
};

export default function AreasPage() {
  const localities = getLocalities();
  const voters = getVoters();
  const totalWardVoters = voters.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Canonical Electoral Localities (అనుసూచిక ప్రాంతములు)
        </h1>
        <p className="text-xs text-slate-500 font-telugu mt-0.5">
          కదిరి పురపాలక సంఘం 8వ వార్డు పరిధిలోని 4 అధికారిక పోలింగ్ ప్రాంతాల వివరాలు
        </p>
      </div>

      {/* Grid of 4 Localities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localities.map((loc) => {
          const pct = ((loc.total_voters / totalWardVoters) * 100).toFixed(1);
          const malePct = ((loc.male_voters / loc.total_voters) * 100).toFixed(1);
          const femalePct = ((loc.female_voters / loc.total_voters) * 100).toFixed(1);

          return (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 font-telugu">
                        {loc.name_te}
                      </h2>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {loc.name_en}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                    {pct}% of Ward
                  </span>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-3 my-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Voters</span>
                    <span className="text-xl font-black text-slate-900">{loc.total_voters}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Male (పు)</span>
                    <span className="text-xl font-black text-blue-600">{loc.male_voters}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{malePct}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Female (స్త్రీ)</span>
                    <span className="text-xl font-black text-pink-600">{loc.female_voters}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{femalePct}%</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-500">
                      <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Households / Doors:
                    </span>
                    <span className="font-bold text-slate-800">{loc.households_count} doors</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-slate-500">
                      <Layers className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Assembly Sections:
                    </span>
                    <span className="font-mono text-slate-800 font-semibold truncate max-w-[200px]">
                      {loc.sections.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`/api/export?type=AREA_WISE&locality=${loc.id}`}
                  download={`${loc.id}_voters.csv`}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Download Area CSV
                </a>

                <Link
                  href={`/areas/${loc.id}`}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  <span>Explore Area Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
