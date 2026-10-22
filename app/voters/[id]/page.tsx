import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVoters, getVoterById } from '@/lib/data';
import CampaignControls from '@/components/CampaignControls';
import { 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Home, 
  MapPin, 
  FileText, 
  AlertTriangle,
  ExternalLink,
  Users,
  Vote,
  FileEdit,
  UserX
} from 'lucide-react';

export function generateStaticParams() {
  const voters = getVoters();
  return voters.map((v) => ({
    id: v.id,
  }));
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function VoterDetailPage({ params }: PageProps) {
  const voter = getVoterById(params.id);

  if (!voter) {
    notFound();
  }

  // Get family members at the same door
  const allVoters = getVoters();
  const familyMembers = allVoters.filter(
    (v) => v.house_number_normalized === voter.house_number_normalized && v.id !== voter.id
  );

  const getRelationTeluguLabel = (rtype: string) => {
    switch (rtype) {
      case 'FATHER': return 'తండ్రి';
      case 'HUSBAND': return 'భర్త';
      case 'MOTHER': return 'తల్లి';
      default: return 'సంరక్షకుడు';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        href="/voters"
        className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        <span>Back to Voter Directory</span>
      </Link>

      {/* Main Elector Dossier Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        {/* Header with Verification Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                VERIFIED ELECTOR
              </span>
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded">
                Ward S.No: #{voter.ward_serial_number}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl font-black text-slate-900 font-telugu">
                {voter.voter_name_original}
              </h1>
              <span className="text-lg font-bold text-slate-500 uppercase tracking-wide">
                ({voter.voter_name_english})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Kadiri Municipality Ward 08 • Sri Sathya Sai District
            </p>
          </div>

          {/* 3 Campaign Action Controls */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
            <span className="block text-[11px] font-bold text-slate-500 uppercase mb-2">
              Canvassing Controls
            </span>
            <CampaignControls voterId={voter.id} compact={false} />
          </div>
        </div>

        {/* Elector Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* EPIC Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              EPIC Number
            </span>
            <span className="text-xl font-mono font-black text-slate-900 tracking-wider">
              {voter.epic_number}
            </span>
            <span className="block text-[11px] text-emerald-700 mt-1 font-semibold">
              Election Photo Identity Card
            </span>
          </div>

          {/* Guardian Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Guardian / Relationship
            </span>
            <div className="text-base font-bold text-slate-900 font-telugu">
              {voter.relation_name_original}
            </div>
            <div className="text-xs text-slate-500 uppercase mt-0.5">
              {getRelationTeluguLabel(voter.relation_type)}: {voter.relation_name_english}
            </div>
          </div>

          {/* Age & Gender */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Age & Gender
            </span>
            <div className="text-lg font-black text-slate-900">
              {voter.age} Years Old
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              {voter.gender === 'MALE' ? 'Male (పురుషుడు)' : 'Female (స్త్రీ)'}
            </div>
          </div>

          {/* Door Number */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              House / Door Number
            </span>
            <Link
              href={`/houses/${voter.house_number_normalized.replace(/[^A-Z0-9]/g, '_')}`}
              className="text-lg font-mono font-bold text-emerald-700 hover:underline block"
            >
              {voter.house_number_original}
            </Link>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              {familyMembers.length + 1} electors at this door
            </span>
          </div>

          {/* Locality */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Canonical Area
            </span>
            <Link
              href={`/areas/${voter.locality_id}`}
              className="text-sm font-bold text-emerald-700 hover:underline block font-telugu"
            >
              {voter.locality_name}
            </Link>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Official SEC Boundary
            </span>
          </div>

          {/* Assembly Section & PDF Page */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Source PDF Page & Section
            </span>
            <div className="text-base font-bold text-slate-900">
              Page {voter.source_pdf_page} / 78
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Assembly Section {voter.section_number}
            </div>
          </div>
        </div>

        {/* Form 7 & Form 8 Election Action Links */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-extrabold flex items-center gap-1.5">
              <Vote className="w-4 h-4 text-emerald-400" />
              <span>Election Commission Official Action Links</span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Submit formal revisions to APSEC / ECI for this elector.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
            >
              <UserX className="w-3.5 h-3.5 mr-1" />
              <span>Form 7 (Objection / Deletion)</span>
            </a>
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              <FileEdit className="w-3.5 h-3.5 mr-1" />
              <span>Form 8 (Correction / Shift)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Family Members at the Same Door */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Household Members at Door: {voter.house_number_original}
            </h3>
          </div>
          <Link
            href={`/houses/${voter.house_number_normalized.replace(/[^A-Z0-9]/g, '_')}`}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Explore Household &rarr;
          </Link>
        </div>

        {familyMembers.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">
            No other electors are enrolled under this door address.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 hover:bg-white hover:border-emerald-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold">#{member.ward_serial_number}</span>
                    <span className="font-mono">{member.epic_number}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 font-telugu">
                    {member.voter_name_original}
                  </h4>
                  <p className="text-[11px] text-slate-500 uppercase">{member.voter_name_english}</p>
                  <p className="text-xs text-slate-600 mt-2">
                    {member.age} Yrs • {member.gender === 'MALE' ? 'Male' : 'Female'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <CampaignControls voterId={member.id} compact={true} />
                  <Link
                    href={`/voters/${member.id}`}
                    className="text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
