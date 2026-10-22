'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown, AlertTriangle, Skull } from 'lucide-react';
import { useCanvassing } from '@/lib/useCanvassing';

interface CampaignControlsProps {
  voterId: string;
  compact?: boolean;
}

export default function CampaignControls({ voterId, compact = false }: CampaignControlsProps) {
  const { getVoterTag, setVoterSentiment, toggleLate, toggleDouble } = useCanvassing();
  const tag = getVoterTag(voterId);

  return (
    <div className={`inline-flex items-center gap-1.5 ${compact ? 'scale-90 origin-left' : ''}`}>
      {/* 1. LATE / DECEASED TOGGLE */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleLate(voterId);
        }}
        title={tag.isLate ? 'Marked as Deceased (చనిపోయారు) - Click to restore' : 'Mark as Deceased (చనిపోయినవారు)'}
        className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all border ${
          tag.isLate
            ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-200/80 hover:text-slate-800'
        }`}
      >
        <span className="text-sm">🕊️</span>
        {!compact && <span className="hidden sm:inline">Late</span>}
      </button>

      {/* 2. DOUBLE VOTER TOGGLE */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleDouble(voterId);
        }}
        title={tag.isDouble ? 'Marked as Double Voter (డబుల్ ఓటరు) - Click to unmark' : 'Flag as Double Voter (డబుల్ ఓటరు)'}
        className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all border ${
          tag.isDouble
            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800'
        }`}
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        {!compact && <span className="hidden sm:inline">Double</span>}
      </button>

      {/* 3. FAVOR TOGGLE */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setVoterSentiment(voterId, 'FAVOR');
        }}
        title={tag.status === 'FAVOR' ? 'Favored (అనుకూలం) - Click to reset' : 'Mark as Favor (అనుకూలం)'}
        className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all border ${
          tag.status === 'FAVOR'
            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800'
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
        {!compact && <span className="hidden sm:inline">Favor</span>}
      </button>

      {/* 4. UNFAVOR TOGGLE */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setVoterSentiment(voterId, 'UNFAVOR');
        }}
        title={tag.status === 'UNFAVOR' ? 'Unfavored (ప్రతికూలం) - Click to reset' : 'Mark as Unfavor (ప్రతికూలం)'}
        className={`px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all border ${
          tag.status === 'UNFAVOR'
            ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 hover:text-rose-800'
        }`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
        {!compact && <span className="hidden sm:inline">Unfavor</span>}
      </button>
    </div>
  );
}
