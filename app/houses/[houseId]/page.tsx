import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHouseholds, getHouseholdById } from '@/lib/data';
import CampaignControls from '@/components/CampaignControls';
import { 
  ArrowLeft, 
  Home, 
  Users, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  Vote,
  UserX,
  FileEdit
} from 'lucide-react';

export function generateStaticParams() {
  const households = getHouseholds();
  return households.map((h) => ({
    houseId: h.house_id,
  }));
}

interface PageProps {
  params: {
    houseId: string;
  };
}

export default function HouseholdDetailPage({ params }: PageProps) {
  const household = getHouseholdById(params.houseId);

  if (!household) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        href="/households"
        className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span>Back to Households Explorer</span>
      </Link>

      {/* Household Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                VERIFIED HOUSEHOLD
              </span>
              <span className="text-xs font-semibold text-slate-500">Kadiri Ward 08</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 font-mono">
                  {household.house_number}
                </h1>
                <Link
                  href={`/areas/${household.locality_id}`}
                  className="text-xs text-emerald-700 font-telugu font-semibold hover:underline block"
                >
                  {household.locality_name}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              <Vote className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>ECI Portal Actions</span>
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Registered Voters
            </span>
            <span className="text-3xl font-black text-slate-900">{household.voter_count}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Male Electors
            </span>
            <span className="text-3xl font-black text-blue-600">{household.male_count}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Female Electors
            </span>
            <span className="text-3xl font-black text-pink-600">{household.female_count}</span>
          </div>
        </div>
      </div>

      {/* Household Electors Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <span>Enrolled Family Members ({household.voters.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {household.voters.map((member) => (
            <div
              key={member.id}
              className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    #{member.ward_serial_number}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {member.epic_number}
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-base text-slate-900 font-telugu">
                      {member.voter_name_original}
                    </h4>
                    <p className="text-xs text-slate-500 uppercase">{member.voter_name_english}</p>
                  </div>
                  <CampaignControls voterId={member.id} compact={true} />
                </div>

                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div>
                    Guardian: <span className="font-telugu font-semibold">{member.relation_name_original}</span>{' '}
                    <span className="text-slate-500">({member.relation_type}: {member.relation_name_english})</span>
                  </div>
                  <div>Age: {member.age} Yrs • Gender: {member.gender === 'MALE' ? 'Male (పు)' : 'Female (స్త్రీ)'}</div>
                  <div>Section: {member.section_number} • PDF Page: {member.source_pdf_page}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-right">
                <Link
                  href={`/voters/${member.id}`}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center"
                >
                  <span>Individual Elector Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
