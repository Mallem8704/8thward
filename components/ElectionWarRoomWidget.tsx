'use client';

import React from 'react';
import Link from 'next/link';
import { Voter, Locality } from '@/lib/types';
import { useCanvassing } from '@/lib/useCanvassing';
import { calculateElectionMetrics, calculateAreaBreakdown } from '@/lib/voterElectionMath';
import { 
  Trophy, 
  Target, 
  UserCheck, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  RotateCcw,
  MapPin,
  HeartCrack,
  CheckCircle2
} from 'lucide-react';

interface ElectionWarRoomWidgetProps {
  voters: Voter[];
  localities: Locality[];
}

export default function ElectionWarRoomWidget({ voters, localities }: ElectionWarRoomWidgetProps) {
  const { canvassing, loadSampleSurvey, resetSurvey } = useCanvassing();

  const metrics = calculateElectionMetrics(voters, canvassing);
  const areaBreakdown = calculateAreaBreakdown(localities, voters, canvassing);

  // Percentages for the Tri-color bar
  const favoredPct = metrics.finalLivingVoters > 0
    ? Number(((metrics.favored / metrics.finalLivingVoters) * 100).toFixed(1))
    : 0;
  const unfavoredPct = metrics.finalLivingVoters > 0
    ? Number(((metrics.unfavored / metrics.finalLivingVoters) * 100).toFixed(1))
    : 0;
  const undecidedPct = Math.max(0, Number((100 - favoredPct - unfavoredPct).toFixed(1)));

  const isWinning = metrics.winningPercentage >= 50.0;
  const hasLead = metrics.leadMargin >= 0;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
              LIVE WAR ROOM
            </span>
            <span className="text-xs font-semibold text-slate-400">Kadiri Ward 8 Election Strategy</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1 text-white">
            Campaign Win Probability & Electorate Engine
          </h2>
          <p className="text-xs text-slate-400 font-telugu mt-0.5">
            నిజసమయ ప్రచార సమాచారం • గెలుపు మార్జిన్ మరియు క్షేత్రస్థాయి విశ్లేషణ
          </p>
        </div>

        {/* Action Buttons: Sample survey & Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadSampleSurvey(voters)}
            className="inline-flex items-center px-3 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
            title="Load realistic field canvassing survey data for demonstration"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-emerald-200" />
            <span>Load Sample Survey</span>
          </button>
          <button
            type="button"
            onClick={resetSurvey}
            className="inline-flex items-center px-3 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Clear all canvassing tags and reset to 0"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        {/* Win Probability Gauge Box */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>WIN PROBABILITY</span>
            <Trophy className={`w-4 h-4 ${isWinning ? 'text-amber-400' : 'text-slate-500'}`} />
          </div>
          <div className="my-2">
            <div className="flex items-baseline space-x-2">
              <span className={`text-4xl font-black ${isWinning ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.winningPercentage}%
              </span>
              <span className="text-xs font-medium text-slate-400">
                ({metrics.favored} / {metrics.decidedVoters} decided)
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            {metrics.decidedVoters === 0 ? (
              <span>Baseline 50.0% (Zero decided)</span>
            ) : isWinning ? (
              <span className="text-emerald-400 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-1 inline" /> Trending Ahead of Threshold
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center">
                <TrendingDown className="w-3 h-3 mr-1 inline" /> Trailing Required 50%
              </span>
            )}
          </div>
        </div>

        {/* Target to Win Box */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>TARGET TO WIN (50% + 1)</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-white">
                {metrics.targetToWin.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">votes</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Needed from {metrics.finalLivingVoters.toLocaleString()} active electors
          </div>
        </div>

        {/* Lead Margin Box */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>LEAD MARGIN</span>
            {hasLead ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className="my-2">
            <span
              className={`text-4xl font-black ${
                metrics.leadMargin > 0
                  ? 'text-emerald-400'
                  : metrics.leadMargin < 0
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {metrics.leadMargin > 0 ? `+${metrics.leadMargin}` : metrics.leadMargin}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Favored: {metrics.favored} vs Unfavored: {metrics.unfavored}
          </div>
        </div>

        {/* Living Electorate Strength */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>ACTIVE LIVING VOTERS</span>
            <UserCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-black text-teal-300">
                {metrics.finalLivingVoters.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">/ {metrics.totalRegistered}</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center">
            <HeartCrack className="w-3 h-3 text-slate-500 mr-1" />
            {metrics.lateEliminated} deceased electors eliminated
          </div>
        </div>
      </div>

      {/* Tri-color Canvassing Progress Bar */}
      <div className="my-6 bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
          <span>CANVASSING BREAKDOWN ({metrics.finalLivingVoters} Living Electors)</span>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 mr-1.5" />
              Favored: {metrics.favored} ({favoredPct}%)
            </span>
            <span className="flex items-center text-amber-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 mr-1.5" />
              Undecided: {metrics.undecidedVoters} ({undecidedPct}%)
            </span>
            <span className="flex items-center text-rose-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 mr-1.5" />
              Unfavored: {metrics.unfavored} ({unfavoredPct}%)
            </span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden flex border border-slate-700">
          <div
            style={{ width: `${favoredPct}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`Favored: ${metrics.favored} (${favoredPct}%)`}
          />
          <div
            style={{ width: `${undecidedPct}%` }}
            className="bg-amber-400 h-full transition-all duration-500"
            title={`Undecided: ${metrics.undecidedVoters} (${undecidedPct}%)`}
          />
          <div
            style={{ width: `${unfavoredPct}%` }}
            className="bg-rose-500 h-full transition-all duration-500"
            title={`Unfavored: ${metrics.unfavored} (${unfavoredPct}%)`}
          />
        </div>
      </div>

      {/* 4-Area Locality Breakdown Table */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
            Official 4 Canonical Localities Performance
          </h3>
          <Link
            href="/areas"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
          >
            Explore all areas &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/90 text-slate-300 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Canonical Locality</th>
                <th className="py-3 px-3 text-right">Official Roll</th>
                <th className="py-3 px-3 text-right">Living</th>
                <th className="py-3 px-3 text-right text-emerald-400">Favor</th>
                <th className="py-3 px-3 text-right text-rose-400">Unfavor</th>
                <th className="py-3 px-3 text-right text-amber-300">Undecided</th>
                <th className="py-3 px-3 text-right">Target (50%+1)</th>
                <th className="py-3 px-3 text-right">Lead</th>
                <th className="py-3 px-4 text-right">Win %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {areaBreakdown.map((area) => (
                <tr key={area.localityId} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">
                    <Link
                      href={`/areas/${area.localityId}`}
                      className="hover:text-emerald-400 flex items-center gap-1.5 font-telugu"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{area.localityName}</span>
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-300 font-mono">{area.totalVoters}</td>
                  <td className="py-3 px-3 text-right text-teal-300 font-mono">{area.livingVoters}</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold font-mono">
                    {area.favored}
                  </td>
                  <td className="py-3 px-3 text-right text-rose-400 font-bold font-mono">
                    {area.unfavored}
                  </td>
                  <td className="py-3 px-3 text-right text-amber-300 font-mono">{area.undecided}</td>
                  <td className="py-3 px-3 text-right text-slate-300 font-mono">{area.targetToWin}</td>
                  <td
                    className={`py-3 px-3 text-right font-mono font-bold ${
                      area.leadMargin > 0
                        ? 'text-emerald-400'
                        : area.leadMargin < 0
                        ? 'text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {area.leadMargin > 0 ? `+${area.leadMargin}` : area.leadMargin}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                        area.winningPercentage >= 50
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {area.winningPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
