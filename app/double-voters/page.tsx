import React from 'react';
import { getVoters, getSearchAliases } from '@/lib/data';
import DuplicateAuditTabs from '@/components/DuplicateAuditTabs';
import { ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Duplicate Audit & Clean Roll Engine | Kadiri Ward 08',
  description: 'Confirmed same-door duplicates, campaign-eliminated deceased voters, and cross-door same name clusters for Ward 8.',
};

export default function DoubleVotersPage() {
  const voters = getVoters();
  const searchAliases = getSearchAliases();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-600" />
            ELECTORAL ROLL INTEGRITY AUDIT
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Duplicate Audit & Elector Elimination War Room
        </h1>
        <p className="text-xs text-slate-500 font-telugu mt-0.5">
          కదిరి పురపాలక సంఘం 8వ వార్డు • డబుల్ ఓటర్లు మరియు చనిపోయినవారి వివరాలు
        </p>
      </div>

      {/* Main Audit Tabs Component */}
      <DuplicateAuditTabs voters={voters} searchAliases={searchAliases} />
    </div>
  );
}
