'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getVoters, getLocalities, getHouseholds } from '@/lib/data';
import { useCanvassing } from '@/lib/useCanvassing';
import VoterCard from '@/components/VoterCard';
import CampaignControls from '@/components/CampaignControls';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  HeartCrack,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const ITEMS_PER_PAGE = 30;

export default function VotersPage() {
  const voters = getVoters();
  const localities = getLocalities();
  const households = getHouseholds();
  const { canvassing } = useCanvassing();
  const totalRegistered = voters.length;
  const maleCount = useMemo(() => voters.filter(v => v.gender === 'MALE').length, [voters]);
  const femaleCount = useMemo(() => voters.filter(v => v.gender === 'FEMALE').length, [voters]);

  // Map of door to voter count for default door-density sorting
  const doorDensityMap = useMemo(() => {
    const map = new Map<string, number>();
    households.forEach(h => map.set(h.house_number, h.voter_count));
    return map;
  }, [households]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('DOOR_DENSITY_DESC'); // Default: Top Voters Door-wise decreasing
  const [quickChip, setQuickChip] = useState<'ALL' | 'FAVOR' | 'UNFAVOR' | 'DOUBLE' | 'LATE'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Distinct assembly sections
  const allSections = useMemo(() => {
    const set = new Set(voters.map(v => v.section_number));
    return Array.from(set).sort((a, b) => (Number(a) || 0) - (Number(b) || 0));
  }, [voters]);

  // Filtering & Sorting logic
  const filteredVoters = useMemo(() => {
    let result = voters;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(v => 
        v.voter_name_original.toLowerCase().includes(q) ||
        v.voter_name_english.toLowerCase().includes(q) ||
        v.epic_number.toLowerCase().includes(q) ||
        v.house_number_original.toLowerCase().includes(q) ||
        v.house_number_normalized.toLowerCase().includes(q) ||
        String(v.ward_serial_number) === q ||
        v.relation_name_original.toLowerCase().includes(q) ||
        v.relation_name_english.toLowerCase().includes(q)
      );
    }

    // Locality filter
    if (selectedLocality !== 'ALL') {
      result = result.filter(v => v.locality_id === selectedLocality);
    }

    // Gender filter
    if (selectedGender !== 'ALL') {
      result = result.filter(v => v.gender === selectedGender);
    }

    // Age Group filter
    if (selectedAgeGroup !== 'ALL') {
      result = result.filter(v => {
        if (selectedAgeGroup === '18-25') return v.age >= 18 && v.age <= 25;
        if (selectedAgeGroup === '26-35') return v.age >= 26 && v.age <= 35;
        if (selectedAgeGroup === '36-50') return v.age >= 36 && v.age <= 50;
        if (selectedAgeGroup === '51-65') return v.age >= 51 && v.age <= 65;
        if (selectedAgeGroup === '65+') return v.age > 65;
        return true;
      });
    }

    // Section filter
    if (selectedSection !== 'ALL') {
      result = result.filter(v => v.section_number === selectedSection);
    }

    // Quick Filter Chips (Canvassing status)
    if (quickChip !== 'ALL') {
      result = result.filter(v => {
        const tag = canvassing[v.id];
        if (quickChip === 'FAVOR') return tag?.status === 'FAVOR' && !tag?.isLate;
        if (quickChip === 'UNFAVOR') return tag?.status === 'UNFAVOR' && !tag?.isLate;
        if (quickChip === 'DOUBLE') return tag?.isDouble;
        if (quickChip === 'LATE') return tag?.isLate;
        return true;
      });
    }

    // Sort order
    const sorted = [...result];
    sorted.sort((a, b) => {
      if (selectedSort === 'DOOR_DENSITY_DESC') {
        const dA = doorDensityMap.get(a.house_number_normalized) || 0;
        const dB = doorDensityMap.get(b.house_number_normalized) || 0;
        if (dB !== dA) return dB - dA;
        return a.ward_serial_number - b.ward_serial_number;
      }
      if (selectedSort === 'SERIAL_ASC') return a.ward_serial_number - b.ward_serial_number;
      if (selectedSort === 'SERIAL_DESC') return b.ward_serial_number - a.ward_serial_number;
      if (selectedSort === 'AGE_ASC') return a.age - b.age;
      if (selectedSort === 'AGE_DESC') return b.age - a.age;
      if (selectedSort === 'NAME_ASC') return a.voter_name_english.localeCompare(b.voter_name_english);
      return 0;
    });

    return sorted;
  }, [
    voters,
    searchTerm,
    selectedLocality,
    selectedGender,
    selectedAgeGroup,
    selectedSection,
    selectedSort,
    quickChip,
    canvassing,
    doorDensityMap
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredVoters.length / ITEMS_PER_PAGE) || 1;
  const paginatedVoters = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVoters.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVoters, currentPage]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedLocality('ALL');
    setSelectedGender('ALL');
    setSelectedAgeGroup('ALL');
    setSelectedSection('ALL');
    setSelectedSort('DOOR_DENSITY_DESC');
    setQuickChip('ALL');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Electoral Roll Directory (ఓటర్ల జాబితా)
          </h1>
          <p className="text-xs text-slate-500 font-telugu mt-0.5">
            కదిరి పురపాలక సంఘం • 8వ వార్డు • మొత్తం 2,013 అధికారిక ఓటర్లు
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Dual view switcher */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View (VoterCards)"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Export CSV adapting to active filter */}
          <a
            href={`/api/export?type=FULL_DIRECTORY&locality=${selectedLocality}&gender=${selectedGender}&section=${selectedSection}&search=${encodeURIComponent(searchTerm)}`}
            download="Ward08_Filtered_Voters.csv"
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            <span>Export ({filteredVoters.length})</span>
          </a>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by Telugu name (e.g. శ్రీరాములు), English name, EPIC (e.g. RRV1832922), Door No, Serial..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-1 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" /> Filter:
        </span>

        <button
          type="button"
          onClick={() => { setQuickChip('ALL'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
            quickChip === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({totalRegistered})
        </button>

        <button
          type="button"
          onClick={() => { setQuickChip('FAVOR'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
            quickChip === 'FAVOR'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          <span>Favor Votes</span>
        </button>

        <button
          type="button"
          onClick={() => { setQuickChip('UNFAVOR'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
            quickChip === 'UNFAVOR'
              ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
              : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
          }`}
        >
          <ThumbsDown className="w-3 h-3" />
          <span>Unfavor Votes</span>
        </button>

        <button
          type="button"
          onClick={() => { setQuickChip('DOUBLE'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
            quickChip === 'DOUBLE'
              ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <ShieldAlert className="w-3 h-3" />
          <span>Double Voters</span>
        </button>

        <button
          type="button"
          onClick={() => { setQuickChip('LATE'); setCurrentPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
            quickChip === 'LATE'
              ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <HeartCrack className="w-3 h-3" />
          <span>Late (Deceased)</span>
        </button>

        {(searchTerm || selectedLocality !== 'ALL' || selectedGender !== 'ALL' || selectedAgeGroup !== 'ALL' || selectedSection !== 'ALL' || quickChip !== 'ALL' || selectedSort !== 'DOOR_DENSITY_DESC') && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Advanced Filter Dropdowns */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Sort Order
          </label>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="DOOR_DENSITY_DESC">Top Door-wise (Decreasing)</option>
            <option value="SERIAL_ASC">Ward Serial (1 &rarr; 2013)</option>
            <option value="SERIAL_DESC">Ward Serial (2013 &rarr; 1)</option>
            <option value="AGE_ASC">Age: Youngest First</option>
            <option value="AGE_DESC">Age: Eldest First</option>
            <option value="NAME_ASC">Name (A &rarr; Z)</option>
          </select>
        </div>

        {/* Locality */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Canonical Area
          </label>
          <select
            value={selectedLocality}
            onChange={(e) => {
              setSelectedLocality(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Localities ({totalRegistered})</option>
            {localities.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name_en} ({loc.total_voters})
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Gender
          </label>
          <select
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Genders</option>
            <option value="MALE">Male ({maleCount})</option>
            <option value="FEMALE">Female ({femaleCount})</option>
          </select>
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Age Group
          </label>
          <select
            value={selectedAgeGroup}
            onChange={(e) => {
              setSelectedAgeGroup(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Age Groups</option>
            <option value="18-25">18 - 25 Yrs (Youth)</option>
            <option value="26-35">26 - 35 Yrs</option>
            <option value="36-50">36 - 50 Yrs</option>
            <option value="51-65">51 - 65 Yrs</option>
            <option value="65+">65+ Yrs (Senior Citizens)</option>
          </select>
        </div>

        {/* Assembly Section */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Assembly Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Sections (23 sections)</option>
            {allSections.map((sec) => (
              <option key={sec} value={sec}>
                Section {sec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          Showing <span className="font-bold text-slate-800">{filteredVoters.length}</span> voters
          {filteredVoters.length !== totalRegistered && (
            <span> (filtered from {totalRegistered})</span>
          )}
        </div>
        <div>
          Page <span className="font-bold text-slate-800">{currentPage}</span> of {totalPages}
        </div>
      </div>

      {/* Main Results View */}
      {filteredVoters.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No voters matched your active filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search query, locality, or quick filter chip selection.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-4 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW (Rich VoterCards) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedVoters.map((voter) => (
            <VoterCard key={voter.id} voter={voter} />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">S.No</th>
                <th className="py-3 px-3">EPIC</th>
                <th className="py-3 px-4">Elector Name</th>
                <th className="py-3 px-4">Guardian / Relation</th>
                <th className="py-3 px-2">Age</th>
                <th className="py-3 px-2">Sex</th>
                <th className="py-3 px-3">Door No</th>
                <th className="py-3 px-3">Canonical Locality</th>
                <th className="py-3 px-2 text-center">Sec</th>
                <th className="py-3 px-4 text-center">Canvassing Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedVoters.map((voter) => {
                const tag = canvassing[voter.id];
                return (
                  <tr
                    key={voter.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      tag?.isLate ? 'bg-slate-100/70 text-slate-400' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-slate-700">
                      #{voter.ward_serial_number}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      <Link href={`/voters/${voter.id}`} className="hover:text-emerald-600 hover:underline">
                        {voter.epic_number}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/voters/${voter.id}`} className="group block">
                        <span
                          className={`font-telugu font-bold text-slate-900 group-hover:text-emerald-700 text-sm block ${
                            tag?.isLate ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {voter.voter_name_original}
                        </span>
                        <span className="text-[11px] text-slate-500 uppercase">{voter.voter_name_english}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-telugu text-slate-800 block">{voter.relation_name_original}</span>
                      <span className="text-[11px] text-slate-500 uppercase">
                        {voter.relation_type}: {voter.relation_name_english}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-700">{voter.age}</td>
                    <td className="py-3 px-2 font-semibold">
                      {voter.gender === 'MALE' ? (
                        <span className="text-blue-600">M (పు)</span>
                      ) : (
                        <span className="text-pink-600">F (స్త్రీ)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      <Link
                        href={`/houses/${voter.house_number_normalized.replace(/[^A-Z0-9]/g, '_')}`}
                        className="hover:text-emerald-700 hover:underline"
                      >
                        {voter.house_number_original}
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-telugu text-slate-700">
                      {voter.locality_source_name}
                    </td>
                    <td className="py-3 px-2 text-center text-slate-600">{voter.section_number}</td>
                    <td className="py-3 px-4 text-center">
                      <CampaignControls voterId={voter.id} compact={true} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-1">
            {/* Show page range */}
            <span className="text-xs text-slate-600 font-medium">
              Page <span className="font-bold text-slate-900">{currentPage}</span> of {totalPages}
            </span>
          </div>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
