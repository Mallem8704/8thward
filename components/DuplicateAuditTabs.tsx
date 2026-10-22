'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Voter, SearchAliasesData } from '@/lib/types';
import { useCanvassing } from '@/lib/useCanvassing';
import CampaignControls from './CampaignControls';
import { 
  AlertTriangle, 
  HeartCrack, 
  Users, 
  Download, 
  Home, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface DuplicateAuditTabsProps {
  voters: Voter[];
  searchAliases: SearchAliasesData;
}

export default function DuplicateAuditTabs({ voters, searchAliases }: DuplicateAuditTabsProps) {
  const [activeTab, setActiveTab] = useState<'same-door' | 'eliminated' | 'cross-door'>('same-door');
  const { canvassing } = useCanvassing();

  // Eliminated (Late) voters from canvassing state
  const lateVoterIds = Object.keys(canvassing).filter((id) => canvassing[id]?.isLate);
  const eliminatedVoters = voters.filter((v) => lateVoterIds.includes(v.id));

  // Same-door duplicates from static audit
  const sameDoorDuplicates = searchAliases.same_door_duplicates || [];

  // Cross-door clusters from static audit
  const crossDoorClusters = searchAliases.cross_door_clusters || [];

  const handleExportAuditCSV = () => {
    let exportType = 'DOUBLE_VOTERS';
    if (activeTab === 'eliminated') exportType = 'LATE_VOTERS';
    window.location.href = `/api/export?type=${exportType}`;
  };

  return (
    <div>
      {/* Tab Navigation & Export Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('same-door')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'same-door'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Same-Door Duplicates</span>
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-mono">
              {sameDoorDuplicates.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('eliminated')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'eliminated'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartCrack className="w-4 h-4 text-slate-700" />
            <span>Deceased / Late</span>
            <span className="bg-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded-full font-mono">
              {eliminatedVoters.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cross-door')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'cross-door'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Same Name Clusters</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-mono">
              {crossDoorClusters.length}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleExportAuditCSV}
          className="inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
        >
          <Download className="w-4 h-4 mr-1.5 text-emerald-400" />
          <span>Export Audit Callset CSV</span>
        </button>
      </div>

      {/* TAB 1: SAME-DOOR DUPLICATES */}
      {activeTab === 'same-door' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Confirmed Same-Door Double Enrolment Audit:</span> Below are voter pairs registered under the identical door number with matching names or matching guardian and similar age. Canvassers can use the Form 7 objection link on their profile.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sameDoorDuplicates.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:border-amber-300 transition-all"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      Case #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      {item.reason}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-600 font-semibold">
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Door: {item.house_number}</span>
                  </div>
                </div>

                {/* Side-by-Side Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1 */}
                  <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Record A • #{item.voter1.ward_serial_number}
                      </span>
                      <span className="font-mono text-xs text-slate-700 font-bold">
                        {item.voter1.epic_number}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 font-telugu">
                          {item.voter1.voter_name_original}
                        </h4>
                        <p className="text-xs text-slate-500 uppercase">{item.voter1.voter_name_english}</p>
                      </div>
                      <CampaignControls voterId={item.voter1.id} compact={true} />
                    </div>
                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div>Guardian: <span className="font-telugu font-semibold">{item.voter1.relation_name_original}</span> ({item.voter1.relation_name_english})</div>
                      <div>Age: {item.voter1.age} Yrs • Gender: {item.voter1.gender} • Section: {item.voter1.section_number}</div>
                    </div>
                    <div className="mt-3 text-right">
                      <Link
                        href={`/voters/${item.voter1.id}`}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center"
                      >
                        <span>Full Dossier</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        Record B • #{item.voter2.ward_serial_number}
                      </span>
                      <span className="font-mono text-xs text-slate-700 font-bold">
                        {item.voter2.epic_number}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 font-telugu">
                          {item.voter2.voter_name_original}
                        </h4>
                        <p className="text-xs text-slate-500 uppercase">{item.voter2.voter_name_english}</p>
                      </div>
                      <CampaignControls voterId={item.voter2.id} compact={true} />
                    </div>
                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div>Guardian: <span className="font-telugu font-semibold">{item.voter2.relation_name_original}</span> ({item.voter2.relation_name_english})</div>
                      <div>Age: {item.voter2.age} Yrs • Gender: {item.voter2.gender} • Section: {item.voter2.section_number}</div>
                    </div>
                    <div className="mt-3 text-right">
                      <Link
                        href={`/voters/${item.voter2.id}`}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center"
                      >
                        <span>Full Dossier</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CAMPAIGN ELIMINATED VOTERS (LATE/DECEASED) */}
      {activeTab === 'eliminated' && (
        <div className="space-y-6">
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 text-xs text-slate-800 flex items-start space-x-3">
            <HeartCrack className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Campaign-Eliminated Electors (చనిపోయినవారు / Late):</span> Electors marked deceased by field workers during door-to-door canvassing. These voters are automatically deducted from the living electorate strength in the election war room.
            </div>
          </div>

          {eliminatedVoters.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <span className="text-4xl block mb-2">🕊️</span>
              <h4 className="text-base font-bold text-slate-800">No electors currently marked as Late</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                You can mark voters as Late (చనిపోయినవారు) directly from any VoterCard, or click &ldquo;Load Sample Survey&rdquo; on the Dashboard.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eliminatedVoters.map((voter) => (
                <div
                  key={voter.id}
                  className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm opacity-85 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      #{voter.ward_serial_number}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      {voter.epic_number}
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="line-through font-bold text-base text-slate-600 font-telugu">
                        {voter.voter_name_original}
                      </h4>
                      <p className="text-xs text-slate-400 uppercase">{voter.voter_name_english}</p>
                    </div>
                    <CampaignControls voterId={voter.id} compact={true} />
                  </div>
                  <div className="mt-3 text-xs text-slate-500 space-y-1">
                    <div>Door: <span className="font-semibold text-slate-700">{voter.house_number_original}</span></div>
                    <div>Area: <span className="font-semibold text-slate-700">{voter.locality_name}</span></div>
                    <div>Age: {voter.age} Yrs • Gender: {voter.gender}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAME NAME ACROSS WARD */}
      {activeTab === 'cross-door' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start space-x-3">
            <Users className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Cross-Door Same Name Clusters ({crossDoorClusters.length} clusters):</span> Electors across Ward 8 with matching names residing at different door addresses. Canvassers can cross-verify whether these are different individuals or cross-booth duplicate enrollments.
            </div>
          </div>

          <div className="space-y-4">
            {crossDoorClusters.map((cluster, cidx) => (
              <div
                key={cidx}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-bold text-slate-900 font-telugu">
                        {cluster.name_original}
                      </h4>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        ({cluster.name_english})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cluster.voter_count} voters found across {cluster.doors.length} different doors
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                    {cluster.voter_count} Records
                  </span>
                </div>

                {/* Electors in cluster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cluster.voters.map((cv) => (
                    <div
                      key={cv.id}
                      className="border border-slate-100 rounded-lg p-3 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-800">
                          #{cv.ward_serial_number}
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-600">
                          {cv.epic_number}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-700 space-y-0.5">
                          <div>Door: <span className="font-bold">{cv.house_number}</span></div>
                          <div>Age: {cv.age} • Gender: {cv.gender}</div>
                          <div>Guardian: {cv.relation_name}</div>
                        </div>
                        <CampaignControls voterId={cv.id} compact={true} />
                      </div>
                      <div className="mt-2 text-right">
                        <Link
                          href={`/voters/${cv.id}`}
                          className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                        >
                          View Dossier &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
