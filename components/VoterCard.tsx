'use client';

import React from 'react';
import Link from 'next/link';
import { Voter } from '@/lib/types';
import { useCanvassing } from '@/lib/useCanvassing';
import CampaignControls from './CampaignControls';
import { 
  FileText, 
  Home, 
  MapPin, 
  User, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  HeartCrack
} from 'lucide-react';

interface VoterCardProps {
  voter: Voter;
}

export default function VoterCard({ voter }: VoterCardProps) {
  const { getVoterTag } = useCanvassing();
  const tag = getVoterTag(voter.id);

  const getCardBorder = () => {
    if (tag.isLate) return 'border-slate-300 bg-slate-50/70 opacity-75';
    if (tag.status === 'FAVOR') return 'border-emerald-400 bg-emerald-50/20 shadow-emerald-100 shadow-sm';
    if (tag.status === 'UNFAVOR') return 'border-rose-400 bg-rose-50/20 shadow-rose-100 shadow-sm';
    if (tag.isDouble) return 'border-amber-400 bg-amber-50/20';
    return 'border-slate-200 bg-white hover:border-slate-300 shadow-sm';
  };

  const getRelationTeluguLabel = (rtype: string) => {
    switch (rtype) {
      case 'FATHER': return 'తండ్రి';
      case 'HUSBAND': return 'భర్త';
      case 'MOTHER': return 'తల్లి';
      default: return 'సంరక్షకుడు';
    }
  };

  return (
    <div className={`rounded-xl border transition-all p-4 relative ${getCardBorder()}`}>
      {/* Top Bar: Serial, EPIC, Status Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            #{voter.ward_serial_number}
          </span>
          <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
            {voter.epic_number}
          </span>
          {tag.isLate && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-white">
              <HeartCrack className="w-3 h-3 mr-1" /> Deceased (చనిపోయారు)
            </span>
          )}
          {tag.isDouble && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              <AlertTriangle className="w-3 h-3 mr-1" /> Double Voter
            </span>
          )}
          {tag.status === 'FAVOR' && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              👍 Favor (అనుకూలం)
            </span>
          )}
          {tag.status === 'UNFAVOR' && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
              👎 Unfavor (ప్రతికూలం)
            </span>
          )}
        </div>

        <Link
          href={`/voters/${voter.id}`}
          className="text-slate-400 hover:text-emerald-600 transition-colors"
          title="View detailed voter dossier"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Voter Name & Campaign Controls directly beside */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
        <div>
          <Link href={`/voters/${voter.id}`} className="group">
            <h3
              className={`text-base font-bold font-telugu text-slate-900 group-hover:text-emerald-700 transition-colors ${
                tag.isLate ? 'line-through text-slate-500' : ''
              }`}
            >
              {voter.voter_name_original}
            </h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {voter.voter_name_english}
            </p>
          </Link>
        </div>

        {/* 3 Campaign Controls directly beside voter name */}
        <div className="shrink-0 pt-0.5">
          <CampaignControls voterId={voter.id} compact={true} />
        </div>
      </div>

      {/* Voter Details Grid */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-xs text-slate-600">
        {/* Guardian */}
        <div className="col-span-2 flex items-start space-x-1.5">
          <User className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 font-telugu mr-1">{getRelationTeluguLabel(voter.relation_type)}:</span>
            <span className="font-semibold text-slate-800 font-telugu mr-1">{voter.relation_name_original}</span>
            <span className="text-slate-500 text-[11px]">({voter.relation_name_english})</span>
          </div>
        </div>

        {/* Door Number */}
        <div className="flex items-center space-x-1.5">
          <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            <span className="text-slate-400">Door: </span>
            <Link
              href={`/houses/${voter.house_number_normalized.replace(/[^A-Z0-9]/g, '_')}`}
              className="font-bold text-slate-800 hover:text-emerald-700 hover:underline"
            >
              {voter.house_number_original}
            </Link>
          </span>
        </div>

        {/* Age & Gender */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400">Profile: </span>
          <span className="font-semibold text-slate-800">
            {voter.age} Yrs • {voter.gender === 'MALE' ? 'Male (పు)' : 'Female (స్త్రీ)'}
          </span>
        </div>

        {/* Locality */}
        <div className="col-span-2 flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <Link
            href={`/areas/${voter.locality_id}`}
            className="text-slate-700 hover:text-emerald-700 truncate font-medium hover:underline"
          >
            {voter.locality_name}
          </Link>
        </div>

        {/* Section & PDF Page */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-400">Section: </span>
          <span className="font-medium text-slate-700">{voter.section_number}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400">Page: </span>
          <span className="font-semibold text-slate-700">{voter.source_pdf_page} / 78</span>
        </div>
      </div>
    </div>
  );
}
